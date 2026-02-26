from fastapi import FastAPI, UploadFile, File, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from rembg import remove, new_session
from PIL import Image
import io

app = FastAPI(title="AI Background Remover API")

# Initialize robust AI model session (isnet-general-use is more accurate for general images)
# Making it lazily loaded to prevent Render startup healthcheck timeouts
ai_session = None

import os
import urllib.request
import asyncio
import onnxruntime as ort
import rembg.sessions.base

# Hugely memory-optimized ONNX runtime initialization to stop Render 2GB RAM from crashing
original_init = rembg.sessions.base.BaseSession.__init__
def custom_init(self, model_name, sess_opts, *args, **kwargs):
    sess_opts.inter_op_num_threads = 1
    sess_opts.intra_op_num_threads = 1
    sess_opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
    sess_opts.enable_cpu_mem_arena = False # This prevents memory spiking during processing
    return original_init(self, model_name, sess_opts, *args, **kwargs)

rembg.sessions.base.BaseSession.__init__ = custom_init

processing_lock = asyncio.Lock()

def ensure_isnet_downloaded():
    u2net_home = os.path.expanduser("~/.u2net")
    os.makedirs(u2net_home, exist_ok=True)
    model_path = os.path.join(u2net_home, "isnet-general-use.onnx")
    url = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx"
    
    if not (os.path.exists(model_path) and os.path.getsize(model_path) > 50000000):
        print("Pre-downloading ISNet model with robust timeout protection...")
        import urllib.request
        import socket
        socket.setdefaulttimeout(120)  # Stop strict connection timeouts
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(model_path, "wb") as f:
            while True:
                chunk = response.read(65536)
                if not chunk:
                    break
                f.write(chunk)
        print("Robust download complete!")

def get_session():
    global ai_session
    if ai_session is None:
        try:
            ensure_isnet_downloaded()
        except Exception as e:
            print(f"Robust download failed: {e}")
        print("Loading ISNet General Use model...")
        ai_session = new_session("isnet-general-use")
    return ai_session

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Background Removal API is running!"}

from PIL import Image, ImageEnhance, ImageFilter

@app.post("/api/remove-bg")
async def remove_background(file: UploadFile = File(...), enhance: bool = False):
    try:
        # Validate file type safely
        if file.content_type and not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        print(f"Received file: {file.filename}, content-type: {file.content_type}, enhance: {enhance}")
        # Read image
        contents = await file.read()
        print(f"Read {len(contents)} bytes from upload")
        
        input_image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # DOWN-SCALE TO SPEED UP AND PREVENT 60-SEC LOAD BALANCER TIMEOUTS
        max_size = 1024
        if input_image.size[0] > max_size or input_image.size[1] > max_size:
            print(f"Downscaling huge image {input_image.size} to {max_size}px max...")
            input_image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        
        # Remove background explicitly requesting RGBA
        import time
        from fastapi.concurrency import run_in_threadpool
        start = time.time()
        print("Starting rembg processing with enhanced quality settings...")
        
        def blocking_bg_removal():
            return remove(
                input_image, 
                session=get_session()
            ).convert("RGBA")
            
        async with processing_lock:
            output_image = await run_in_threadpool(blocking_bg_removal)
        
        # Verify alpha channel in logs
        alpha = output_image.split()[3]
        min_alpha, max_alpha = alpha.getextrema()
        print(f"Finished rembg in {time.time()-start:.2f}s. Alpha extrema: {min_alpha} to {max_alpha}")

        # Lightweight Remini-style enhancement
        if enhance:
            print("Applying Remini-style photo enhancement...")
            # Split to preserve the transparent alpha channel accurately
            r, g, b, a = output_image.split()
            rgb_image = Image.merge('RGB', (r, g, b))
            
            # 1. Boost Color Saturation
            color_enhancer = ImageEnhance.Color(rgb_image)
            rgb_image = color_enhancer.enhance(1.2)
            
            # 2. Boost Contrast
            contrast_enhancer = ImageEnhance.Contrast(rgb_image)
            rgb_image = contrast_enhancer.enhance(1.1)
            
            # 3. Sharpening for clearer edges/faces
            rgb_image = rgb_image.filter(ImageFilter.SHARPEN)
            
            # 4. Optional subtle unsharp mask for deeper clarity
            rgb_image = rgb_image.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
            
            # Re-attach transparent background
            r, g, b = rgb_image.split()
            output_image = Image.merge('RGBA', (r, g, b, a))

        # Save to PNG
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return StreamingResponse(
            img_byte_arr, 
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename=removed_bg_{file.filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run: uvicorn main:app --reload
