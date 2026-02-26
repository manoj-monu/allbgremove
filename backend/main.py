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

import uuid
from fastapi.responses import FileResponse
from fastapi import BackgroundTasks

tasks = {}
task_queue = asyncio.Queue()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(worker_loop())

async def worker_loop():
    while True:
        task_id, input_image, enhance = await task_queue.get()
        tasks[task_id]["status"] = "processing"
        
        try:
            # DOWN-SCALE TO SPEED UP AND PREVENT 60-SEC LOAD BALANCER TIMEOUTS
            max_size = 1024
            if input_image.size[0] > max_size or input_image.size[1] > max_size:
                print(f"Downscaling huge image {input_image.size} to {max_size}px max...")
                input_image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
            import time
            from fastapi.concurrency import run_in_threadpool
            start = time.time()
            print(f"Task {task_id}: Starting rembg processing...")
            
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
            print(f"Task {task_id}: Finished rembg in {time.time()-start:.2f}s. Alpha extrema: {min_alpha} to {max_alpha}")

            # Lightweight Remini-style enhancement
            if enhance:
                print(f"Task {task_id}: Applying photo enhancement...")
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
            os.makedirs("results", exist_ok=True)
            result_path = f"results/{task_id}.png"
            output_image.save(result_path, format='PNG')
            
            tasks[task_id]["status"] = "completed"
            tasks[task_id]["result_path"] = result_path
            
        except Exception as e:
            print(f"Task {task_id} failed: {e}")
            tasks[task_id]["status"] = "failed"
            tasks[task_id]["error"] = str(e)
            
        finally:
            task_queue.task_done()

@app.post("/api/remove-bg-async")
async def queue_remove_background(file: UploadFile = File(...), enhance: bool = False):
    try:
        # Validate file type safely
        if file.content_type and not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        task_id = str(uuid.uuid4())
        tasks[task_id] = {"status": "pending"}
        
        await task_queue.put((task_id, input_image, enhance))
        
        return {"task_id": task_id, "position": task_queue.qsize()}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status/{task_id}")
async def get_status(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Calculate approximate queue position
    status = tasks[task_id]["status"]
    return {
        "status": status, 
        "queue_length": task_queue.qsize() if status == "pending" else 0,
        "error": tasks[task_id].get("error")
    }

@app.get("/api/result/{task_id}")
async def get_result(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks[task_id]
    if task["status"] != "completed":
        raise HTTPException(status_code=400, detail="Result not ready yet")
        
    return FileResponse(
        task["result_path"], 
        media_type="image/png", 
        headers={"Content-Disposition": f"attachment; filename=removed_bg_{task_id}.png"}
    )

@app.post("/api/remove-bg")
async def remove_background_legacy(file: UploadFile = File(...), enhance: bool = False):
    try:
        # Validate file type safely
        if file.content_type and not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # DOWN-SCALE TO SPEED UP AND PREVENT TIMEOUTS
        max_size = 1024
        if input_image.size[0] > max_size or input_image.size[1] > max_size:
            input_image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        
        import time
        from fastapi.concurrency import run_in_threadpool
        start = time.time()
        
        def blocking_bg_removal():
            return remove(
                input_image, 
                session=get_session()
            ).convert("RGBA")
            
        async with processing_lock:
            output_image = await run_in_threadpool(blocking_bg_removal)
        
        if enhance:
            r, g, b, a = output_image.split()
            rgb_image = Image.merge('RGB', (r, g, b))
            
            color_enhancer = ImageEnhance.Color(rgb_image)
            rgb_image = color_enhancer.enhance(1.2)
            
            contrast_enhancer = ImageEnhance.Contrast(rgb_image)
            rgb_image = contrast_enhancer.enhance(1.1)
            
            rgb_image = rgb_image.filter(ImageFilter.SHARPEN)
            rgb_image = rgb_image.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
            
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

# To run: uvicorn main:app --reload
