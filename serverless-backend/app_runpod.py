import sys
try:
    import torchvision.transforms.functional as TF
    sys.modules['torchvision.transforms.functional_tensor'] = TF
except Exception as e:
    print("Notice: torchvision setup:", e)

import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Header, HTTPException
from fastapi.responses import Response
from PIL import Image
import io
import torch
from transformers import AutoModelForImageSegmentation
from torchvision import transforms
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"
model = None
gfpgan = None

def get_model():
    global model
    if model is None:
        print(f"Loading BiRefNet on {device}...")
        model = AutoModelForImageSegmentation.from_pretrained(
            "ZhengPeng7/BiRefNet_lite", 
            trust_remote_code=True
        ).to(device)
        model.eval()
    return model

def get_gfpgan():
    global gfpgan
    if gfpgan is None:
        print("Loading GFPGAN...")
        try:
            import torchvision.transforms.functional as TF
            sys.modules['torchvision.transforms.functional_tensor'] = TF
        except Exception:
            pass
        from gfpgan import GFPGANer
        import os
        model_path = '/app/GFPGANv1.4.pth' if os.path.exists('/app/GFPGANv1.4.pth') else 'https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth'
        gfpgan = GFPGANer(
            model_path=model_path,
            upscale=2,
            arch='clean',
            channel_multiplier=2,
            bg_upsampler=None,
            device=device
        )
    return gfpgan

def warm_up():
    print(f"Pre-warming BiRefNet and GFPGAN on {device}...")
    try:
        get_model()
        print("BiRefNet ready in VRAM!")
        get_gfpgan()
        print("GFPGAN ready in VRAM!")
    except Exception as e:
        print("Warmup notice:", e)

@app.on_event("startup")
async def startup_event():
    import threading
    threading.Thread(target=warm_up, daemon=True).start()

def process_bg(image):
    m = get_model()
    input_size = (1024, 1024)
    original_size = image.size
    
    transform = transforms.Compose([
        transforms.Resize(input_size),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        preds = m(input_tensor)[-1].sigmoid().cpu()
    
    pred = preds[0].squeeze()
    mask = transforms.ToPILImage()(pred)
    mask = mask.resize(original_size, Image.LANCZOS)
    
    result = image.convert("RGBA")
    result.putalpha(mask)
    return result

@app.post("/api/process-all")
async def process_all(file: UploadFile = File(...), enhance: str = "false", x_api_key: str = Header(None)):
    if x_api_key != "SUPER_SECRET_KEY_998877":
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        data = await file.read()
        img_pil = Image.open(io.BytesIO(data)).convert("RGB")
        
        is_enhance = enhance.lower() in ("true", "1", "yes")
        
        # Optionally Enhance Face
        if is_enhance:
            enhancer = get_gfpgan()
            img_cv = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
            _, _, enhanced_img = enhancer.enhance(img_cv, has_aligned=False, only_center_face=False, paste_back=True)
            if enhanced_img is not None:
                img_pil = Image.fromarray(cv2.cvtColor(enhanced_img, cv2.COLOR_BGR2RGB))
            
        result = process_bg(img_pil)
        
        buf = io.BytesIO()
        result.save(buf, format="PNG")
        return Response(content=buf.getvalue(), media_type="image/png")
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(content=str(e), status_code=500)

@app.get("/")
@app.get("/ping")
@app.post("/ping")
def root():
    return {"status": "Active"}
