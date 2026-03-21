from fastapi import FastAPI, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
import modal
import io
import os

# Create a robust image for Premium GPU tasks
image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("libgl1-mesa-glx", "libglib2.0-0", "wget") 
    .pip_install(
        "torch", "torchvision", "pillow", "numpy", 
        "fastapi", "python-multipart", "realesrgan", "basicsr", 
        "opencv-python-headless", "transformers", "timm", "einops", "scipy", "kornia"
    )
    .run_commands(
        "mkdir -p /root/.cache/realesrgan",
        "wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth -P /root/.cache/realesrgan/",
        # Pre-cache BiRefNet for premium quality removals
        "python -c 'from transformers import AutoModelForImageSegmentation; AutoModelForImageSegmentation.from_pretrained(\"ZhengPeng7/BiRefNet\", trust_remote_code=True)'"
    )
)

app = modal.App("allbgremove-premium", image=image)
web_app = FastAPI()

web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Premium Background Removal (High Fidelity) ---
@app.cls(gpu="T4", scaledown_window=60, timeout=600)
class PremiumRemover:
    @modal.enter()
    def initialize(self):
        from transformers import AutoModelForImageSegmentation
        from torchvision import transforms
        import torch
        self.model = AutoModelForImageSegmentation.from_pretrained("ZhengPeng7/BiRefNet", trust_remote_code=True)
        self.model.to("cuda")
        self.model.eval()
        self.transform = transforms.Compose([
            transforms.Resize((1024, 1024)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ])

    @modal.method()
    def process(self, image_bytes: bytes) -> bytes:
        import torch
        import numpy as np
        from PIL import Image
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        orig_size = img.size
        input_tensor = self.transform(img).unsqueeze(0).to("cuda")
        with torch.no_grad():
            preds = self.model(input_tensor)[-1].sigmoid().cpu()
        mask = Image.fromarray((preds.squeeze().numpy() * 255).astype(np.uint8)).resize(orig_size, Image.LANCZOS)
        img.putalpha(mask)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()

# --- Premium 4K Upscaler ---
@app.cls(gpu="T4", scaledown_window=60, timeout=600)
class PremiumUpscaler:
    @modal.enter()
    def initialize(self):
        from realesrgan import RealESRGANer
        from basicsr.archs.rrdbnet_arch import RRDBNet
        model_path = "/root/.cache/realesrgan/RealESRGAN_x4plus.pth"
        model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
        self.upscaler = RealESRGANer(scale=4, model_path=model_path, model=model, tile=400, tile_pad=10, half=True, device="cuda")

    @modal.method()
    def process(self, image_bytes: bytes) -> bytes:
        import cv2
        import numpy as np
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        output, _ = self.upscaler.enhance(img, outscale=4)
        _, buffer = cv2.imencode('.png', output)
        return buffer.tobytes()

@web_app.get("/")
def health():
    return {"status": "premium_online"}

@web_app.post("/")
async def handle_premium_request(task: str = Form(...), file: UploadFile = File(...)):
    image_bytes = await file.read()
    if task == "upscale":
        return Response(content=PremiumUpscaler().process.remote(image_bytes), media_type="image/png")
    elif task == "remove-bg-premium":
        return Response(content=PremiumRemover().process.remote(image_bytes), media_type="image/png")
    return {"error": "Invalid task"}

@app.function(timeout=600)
@modal.asgi_app()
def process():
    return web_app
