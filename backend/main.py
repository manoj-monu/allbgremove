import os
import io
import uuid
from fastapi import FastAPI, UploadFile, File, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image

try:
    import modal
except ImportError:
    modal = None

# 🚀 FastAPI Instance
api = FastAPI()

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------------
# 🎨 Modal Deployment (v15 - HYPER LIGHT CPU ENGINE)
# ----------------------------------------------------------
if modal:
    app = modal.App("allbgremove-ultra-lite")
    
    # Minimalist image for instant boot
    studio_image = modal.Image.debian_slim() \
        .apt_install("libgl1", "libglib2.0-0") \
        .pip_install("rembg", "pillow", "numpy")

    @app.function(
        image=studio_image,
        cpu=2.0, # Using strong CPUs instead of unstable GPUs
        memory=4096,
        timeout=60
    )
    @modal.asgi_app()
    def studio_app():
        return api

# ----------------------------------------------------------
# 🛠️ AI Node Logic
# ----------------------------------------------------------
ai_session = None

def get_session():
    global ai_session
    if ai_session is None:
        from rembg import new_session
        ai_session = new_session("u2netp")
    return ai_session

@api.post("/api/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    try:
        from rembg import remove
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents)).convert("RGB")
        # u2netp is so fast that CPU handles it in 1-2 seconds
        output_image = remove(input_image, session=get_session()).convert("RGBA")
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format="PNG")
        img_byte_arr.seek(0)
        return StreamingResponse(img_byte_arr, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------------------------------------
# ✨ AI Enhancer (Fast CPU-Optimized Logic)
# ----------------------------------------------------------
@api.post("/api/enhance-photo")
async def enhance_photo(file: UploadFile = File(...)):
    try:
        import numpy as np
        import cv2
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # CPU-friendly fast enhancement: Detail Enhance + subtle upscale
        # 1. Enhance Details
        enhanced = cv2.detailEnhance(img, sigma_s=10, sigma_r=0.15)
        
        # 2. 2x Upscale using Lanczos4 (sharp interpolation)
        height, width = enhanced.shape[:2]
        output = cv2.resize(enhanced, (width * 2, height * 2), interpolation=cv2.INTER_LANCZOS4)
        
        # Convert back to PNG
        _, buffer = cv2.imencode('.png', output)
        return Response(content=buffer.tobytes(), media_type="image/png")
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@api.get("/")
async def root():
    return {"engine": "ALLBgremove Ultra Lite (Instant CPU) ACTIVE"}
