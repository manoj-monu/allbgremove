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
app = api # Expose for Uvicorn/Hugging Face

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
        # Using BiRefNet (User's original favorite premium model) 
        # for flawless quality without the u2net diamond glitches.
        ai_session = new_session("birefnet-general")
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
        # Read with IMREAD_UNCHANGED to keep the transparent background
        img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
        
        if len(img.shape) == 3 and img.shape[2] == 4:
            bgr = img[:, :, :3]
            alpha = img[:, :, 3:]
        else:
            bgr = img
            alpha = None
            
        # Just perform a clean, high-quality HD Upscale without ANY harsh filters.
        # This guarantees the face remains 100% natural and identical to the original, just higher resolution.
        height, width = bgr.shape[:2]
        bgr = cv2.resize(bgr, (width * 2, height * 2), interpolation=cv2.INTER_LANCZOS4)
        
        # Re-attach the transparent background cleanly
        if alpha is not None:
            alpha = cv2.resize(alpha, (width * 2, height * 2), interpolation=cv2.INTER_LANCZOS4)
            if len(alpha.shape) == 2:
                alpha = np.expand_dims(alpha, axis=2)
            output = np.concatenate((bgr, alpha), axis=2)
        else:
            output = bgr
        
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
