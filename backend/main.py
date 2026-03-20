from fastapi import FastAPI, UploadFile, File, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from rembg import remove, new_session
from PIL import Image
import io
import time

app = FastAPI(title="AI Background Remover API")

# Initialize robust AI model session (isnet-general-use is more accurate for general images)
# Making it lazily loaded to prevent Render startup healthcheck timeouts
ai_session = None
upscaler = None

def get_upscaler():
    global upscaler
    if upscaler is None:
        try:
            print("Importing RealESRGAN parameters...")
            from realesrgan import RealESRGANer
            from realesrgan.archs.srvgg_arch import SRVGGNetCompact
            import urllib.request
            import os
            import torch
            
            # Use SRVGGNetCompact for speed and minimal memory footprint
            model_name = 'realesr-general-x4v3'
            model_path = os.path.join(os.path.expanduser("~"), '.u2net', f'{model_name}.pth')
            
            if not os.path.exists(model_path):
                print("Downloading Real-ESRGAN Model (one-time fast download)...")
                url = f"https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/{model_name}.pth"
                os.makedirs(os.path.dirname(model_path), exist_ok=True)
                urllib.request.urlretrieve(url, model_path)
            
            device = 'cuda' if torch.cuda.is_available() else 'cpu'
            half = True if device == 'cuda' else False
            
            model = SRVGGNetCompact(num_in_ch=3, num_out_ch=3, num_feat=64, num_conv=32, upscale=4, act_type='prelu')
            upscaler = RealESRGANer(
                scale=4, model_path=model_path, dni_weight=None, model=model,
                tile=400, tile_pad=10, pre_pad=0, half=half, device=device
            )
            print("Real-ESRGAN Successfully Ready!")
        except Exception as e:
            print(f"Failed to load ESRGAN: {e}")
            upscaler = False
    return upscaler

import os
import urllib.request
import asyncio
import onnxruntime as ort
import rembg.sessions.base

# Hugely memory-optimized ONNX runtime initialization to stop Render 2GB RAM from crashing
original_init = rembg.sessions.base.BaseSession.__init__
def custom_init(self, model_name, sess_opts, *args, **kwargs):
    # GPU PREMIER GRADE OPTIMIZATION
    providers = ['CUDAExecutionProvider', 'CPUExecutionProvider']
    try:
        if 'CUDAExecutionProvider' in ort.get_available_providers():
            print("🚀 GPU (CUDA) detected! Initialized for Premium Adobe-Grade processing.")
        else:
            print("⚠️ CUDA not found, falling back to Multi-Core CPU.")
    except Exception:
        pass
    
    sess_opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    sess_opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
    sess_opts.enable_cpu_mem_arena = True
    
    # We return the original init but with detected providers
    return original_init(self, model_name, sess_opts, providers=providers, *args, **kwargs)

rembg.sessions.base.BaseSession.__init__ = custom_init

processing_lock = asyncio.Lock()

def ensure_model_downloaded():
    u2net_home = os.path.expanduser("~/.u2net")
    os.makedirs(u2net_home, exist_ok=True)
    # Using isnet-general-use - Extreme speed on Free CPU (5-10s instead of 38s)
    model_name = "isnet-general-use.onnx"
    model_path = os.path.join(u2net_home, model_name)
    url = f"https://github.com/danielgatis/rembg/releases/download/v0.0.0/{model_name}"
    
    if not (os.path.exists(model_path)):
        print(f"Pre-downloading {model_name} (High-Speed Model)...")
        import urllib.request
        import socket
        socket.setdefaulttimeout(600)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(model_path, "wb") as f:
            while True:
                chunk = response.read(65536)
                if not chunk:
                    break
                f.write(chunk)
        print("High-quality Lite model download complete!")

def get_session():
    global ai_session
    if ai_session is None:
        # Switching back to isnet-general-use for High-Speed Free Tier operation
        print("Loading ISNet-General-Use (Fast CPU Model)...")
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

import uuid
from fastapi.responses import FileResponse
from fastapi import BackgroundTasks

tasks = {}
task_queue = asyncio.Queue()

@app.on_event("startup")
async def startup_event():
    # Pre-download and pre-load model to disk/memory
    # This prevents the first user from waiting 30+ seconds for model download/init
    try:
        ensure_model_downloaded()
        import threading
        # Load session in background thread so startup is fast but model is ready ASAP
        threading.Thread(target=get_session, daemon=True).start()
        # Also preload upscaler so premium users don't wait for its first init
        threading.Thread(target=get_upscaler, daemon=True).start()
    except Exception as e:
        print(f"Startup pre-load warning: {e}")
    
    asyncio.create_task(worker_loop())

async def worker_loop():
    while True:
        task = await task_queue.get()
        # IMPORTANT: Run tasks SEQUENTIALLY on CPU-limited servers (like HuggingFace/Render)
        # to prevent CPU thrashing and OOM (Out Of Memory) crashes.
        # This makes the FIRST image finish fast instead of starting 5 and taking 5x longer for all.
        try:
            await process_task(task)
        except Exception as e:
            print(f"Worker process error: {e}")
        finally:
            task_queue.task_done()

async def process_task(task):
    is_upscale = False
    if len(task) == 3 and task[2] == "upscale_only":
        task_id, input_image, action = task
        is_upscale = True
    elif len(task) == 4:
        task_id, input_image, enhance, intensity = task
    else:
        task_id, input_image, enhance = task
        intensity = 1.0
        
    tasks[task_id]["status"] = "processing"
    
    try:
        if is_upscale:
            print(f"Task {task_id}: Running Real-ESRGAN Premium Upscale")
            current_upscaler = get_upscaler()
            if not current_upscaler:
                raise Exception("Upscaler model failed to initialize on backend.")
            from fastapi.concurrency import run_in_threadpool
            
            def blocking_upscale():
                import numpy as np
                import cv2
                # input_image is RGBA
                img_np = np.array(input_image)
                if img_np.shape[2] == 4:
                    img_bgra = cv2.cvtColor(img_np, cv2.COLOR_RGBA2BGRA)
                    output_bgra, _ = current_upscaler.enhance(img_bgra, outscale=4)
                    output_rgba = cv2.cvtColor(output_bgra, cv2.COLOR_BGRA2RGBA)
                else:
                    img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
                    output_bgr, _ = current_upscaler.enhance(img_bgr, outscale=4)
                    output_rgba = cv2.cvtColor(output_bgr, cv2.COLOR_BGR2RGBA)
                return Image.fromarray(output_rgba)

            output_image = await run_in_threadpool(blocking_upscale)
        else:
            # 1. 2K Resolution (High Fidelity)
            # Reduced from 1536 to 1024 to massively improve CPU speed (brings 30s processing down to ~5-10s)
            max_size = 1024 
            if input_image.size[0] > max_size or input_image.size[1] > max_size:
                input_image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
            from fastapi.concurrency import run_in_threadpool
            start = time.time()
            
            def blocking_bg_removal():
                return remove(
                    input_image, 
                    session=get_session(),
                    post_process_mask=False,
                    alpha_matting=False,
                ).convert("RGBA")
                
            output_image = await run_in_threadpool(blocking_bg_removal)
            print(f"Task {task_id}: Ultra-Fast Result in {time.time()-start:.2f}s")
    
            # 2. Faster Enhancement (Only if requested)
            if enhance:
                r, g, b, a = output_image.split()
                rgb_image = Image.merge('RGB', (r, g, b))
                
                try:
                    import cv2
                    import numpy as np
                    img_np = np.array(rgb_image)
                    img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
                    
                    # Faster 3x filter
                    d_val = max(3, int(9 * intensity))
                    smoothed = cv2.bilateralFilter(img_bgr, d=d_val, sigmaColor=30, sigmaSpace=30)
                    result_rgb = cv2.cvtColor(smoothed, cv2.COLOR_BGR2RGB)
                    rgb_image = Image.fromarray(result_rgb)
                except: pass
                
                r_ret, g_ret, b_ret = rgb_image.split()
                output_image = Image.merge('RGBA', (r_ret, g_ret, b_ret, a))

        # 3. Clean and Save
        output_image.info.pop('icc_profile', None)
        output_image.info.pop('exif', None)
        
        os.makedirs("results", exist_ok=True)
        result_path = f"results/{task_id}.png"
        output_image.save(result_path, format='PNG', optimize=False) # Faster save
        
        tasks[task_id]["status"] = "completed"
        tasks[task_id]["result_path"] = result_path
        
    except Exception as e:
        print(f"Task {task_id} error: {e}")
        tasks[task_id]["status"] = "failed"
        tasks[task_id]["error"] = str(e)

@app.post("/api/remove-bg-async")
async def queue_remove_background(file: UploadFile = File(...), enhance: bool = False, intensity: float = 1.0):
    try:
        # Validate file type safely
        if file.content_type and not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        task_id = str(uuid.uuid4())
        tasks[task_id] = {"status": "pending"}
        
        await task_queue.put((task_id, input_image, enhance, intensity))
        
        return {"task_id": task_id, "position": task_queue.qsize()}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upscale-async")
async def queue_upscale(file: UploadFile = File(...)):
    try:
        if file.content_type and not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        # Front-end will send transparent canvas blob
        input_image = Image.open(io.BytesIO(contents)).convert("RGBA")
        
        task_id = str(uuid.uuid4())
        tasks[task_id] = {"status": "pending"}
        # "upscale_only" tag tells worker thread to route it to ESRGAN provider
        await task_queue.put((task_id, input_image, "upscale_only"))
        
        return {"task_id": task_id, "position": task_queue.qsize()}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status/{task_id}")
async def get_status(task_id: str):
    # If this specific worker has the task, return its exact status
    if task_id in tasks:
        status = tasks[task_id]["status"]
        return {
            "status": status, 
            "queue_length": task_queue.qsize() if status == "pending" else 0,
            "error": tasks[task_id].get("error")
        }
    
    # If we are in a multi-worker environment (Render Pro), another worker might have it.
    # Check the shared disk to see if it's already done.
    if os.path.exists(f"results/{task_id}.png"):
        return {
            "status": "completed",
            "queue_length": 0,
        }
        
    # Otherwise, assume it's still being processed by another worker
    return {
        "status": "processing",
        "queue_length": 1,
    }

@app.get("/api/result/{task_id}")
async def get_result(task_id: str, download_name: str | None = None):
    # Bypass the dictionary and serve strictly from the shared filesystem
    # so any worker can answer the download request
    result_path = f"results/{task_id}.png"
    
    if not os.path.exists(result_path):
        raise HTTPException(status_code=400, detail="Result not ready yet or task expired")
        
    fn = download_name if download_name else f"removed_bg_{task_id}.png"
    return FileResponse(
        result_path, 
        media_type="image/png", 
        headers={"Content-Disposition": f'attachment; filename="{fn}"'}
    )

@app.post("/api/stash")
async def stash_blob(file: UploadFile = File(...)):
    # Save the explicitly encoded PNG from the frontend Canvas to the shared disk
    # This circumvents Chrome's Javascript Memory Blob corruption bugs via native HTTP downloads
    stash_id = str(uuid.uuid4())
    contents = await file.read()
    
    os.makedirs("results", exist_ok=True)
    stash_path = f"results/stash_{stash_id}.png"
    
    with open(stash_path, "wb") as f:
        f.write(contents)
        
    return {"stash_id": stash_id, "filename": file.filename or "canvas_export.png"}

@app.get("/api/download-stashed/{stash_id}")
async def download_stashed(stash_id: str, download_name: str = "canvas_export.png"):
    # Read from shared disk so any worker can answer
    stash_path = f"results/stash_{stash_id}.png"
    
    if not os.path.exists(stash_path):
        raise HTTPException(status_code=404, detail="Stash expired or not found")
        
    return FileResponse(
        stash_path, 
        media_type="image/png", 
        headers={"Content-Disposition": f'attachment; filename="{download_name}"'}
    )

@app.post("/api/remove-bg")
async def remove_background_legacy(file: UploadFile = File(...), enhance: bool = False, intensity: float = 1.0):
    try:
        # Validate file type safely
        if file.content_type and not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # SPEED FIX: Lower resolution limit to 1024px to bypass 30 second GPU processing times on free CPUs
        max_size = 1024
        if input_image.size[0] > max_size or input_image.size[1] > max_size:
            input_image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        
        import time
        from fastapi.concurrency import run_in_threadpool
        start = time.time()
        
        def blocking_bg_removal():
            return remove(
                input_image, 
                session=get_session(),
                post_process_mask=False,
                alpha_matting=False,
            ).convert("RGBA")
            
        output_image = await run_in_threadpool(blocking_bg_removal)
        
        if enhance:
            r, g, b, a = output_image.split()
            rgb_image = Image.merge('RGB', (r, g, b))
            
            try:
                import cv2
                import numpy as np
                
                img_np = np.array(rgb_image)
                img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
                
                d_val = max(3, int(11 * intensity))
                sigma_val = 75 * intensity
                smoothed = cv2.bilateralFilter(img_bgr, d=d_val, sigmaColor=sigma_val, sigmaSpace=sigma_val)
                
                detail = cv2.detailEnhance(smoothed, sigma_s=10, sigma_r=0.15)
                blend_weight = 0.6 * intensity
                blended = cv2.addWeighted(smoothed, 1.0 - blend_weight, detail, blend_weight, 0)
                
                hsv = cv2.cvtColor(blended, cv2.COLOR_BGR2HSV)
                hsv = np.array(hsv, dtype=np.float32)
                hsv[:,:,1] = hsv[:,:,1] * (1.0 + 0.35 * intensity)
                hsv[:,:,1] = np.clip(hsv[:,:,1], 0, 255)
                hsv = np.array(hsv, dtype=np.uint8)
                vibrant = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
                
                alpha_val = 1.0 + (0.1 * intensity)
                beta_val = 15 * intensity
                adjusted = cv2.convertScaleAbs(vibrant, alpha=alpha_val, beta=beta_val)
                
                result_rgb = cv2.cvtColor(adjusted, cv2.COLOR_BGR2RGB)
                rgb_image = Image.fromarray(result_rgb)
            except Exception as e:
                print(f"OpenCV enhance failed: {e}")
                rgb_image = ImageEnhance.Brightness(rgb_image).enhance(1.0 + 0.2*intensity)
                rgb_image = ImageEnhance.Color(rgb_image).enhance(1.0 + 0.4*intensity)
                rgb_image = rgb_image.filter(ImageFilter.DETAIL)
            
            r_ret, g_ret, b_ret = rgb_image.split()
            output_image = Image.merge('RGBA', (r_ret, g_ret, b_ret, a))

        # Wipe out potentially corrupting ICC profiles and EXIF metadata that crashes Windows Photo Viewers
        output_image.info.pop('icc_profile', None)
        output_image.info.pop('exif', None)
        
        # Save to PNG purely and simply
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG', optimize=True)
        img_byte_arr.seek(0)
        
        return StreamingResponse(
            img_byte_arr, 
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename=removed_bg_{file.filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# To run: uvicorn main:app --reload

# To run: uvicorn main:app --reload
