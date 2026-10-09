import sys
import torchvision.transforms.functional as TF
sys.modules['torchvision.transforms.functional_tensor'] = TF

import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Header, HTTPException
from fastapi.responses import Response
from PIL import Image
import io
import torch
from transformers import AutoModelForImageSegmentation
from torchvision import transforms
from gfpgan import GFPGANer
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Loading BiRefNet on {device}...")
model = AutoModelForImageSegmentation.from_pretrained(
    "ZhengPeng7/BiRefNet_lite", 
    trust_remote_code=True
)
model.to(device)
model.eval()

print("Loading GFPGAN...")
gfpgan = GFPGANer(
    model_path='https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth',
    upscale=2,
    arch='clean',
    channel_multiplier=2,
    bg_upsampler=None
)

def process_bg(image):
    input_size = (1024, 1024)
    original_size = image.size
    
    transform = transforms.Compose([
        transforms.Resize(input_size),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        preds = model(input_tensor)[-1].sigmoid().cpu()
    
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
            img_cv = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
            _, _, enhanced_img = gfpgan.enhance(img_cv, has_aligned=False, only_center_face=False, paste_back=True)
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
def root():
    return {"status": "Active"}
