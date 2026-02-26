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

def get_session():
    global ai_session
    if ai_session is None:
        print("Loading Birefnet General Lite model (Newer, highly accurate, lightweight, doesn't cut foreground)...")
        ai_session = new_session("birefnet-general-lite")
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
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        print(f"Received file: {file.filename}, content-type: {file.content_type}, enhance: {enhance}")
        # Read image
        contents = await file.read()
        print(f"Read {len(contents)} bytes from upload")
        
        input_image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Remove background explicitly requesting RGBA
        import time
        start = time.time()
        print("Starting rembg processing with enhanced quality settings...")
        
        # Using alpha_matting for better edge detection (e.g., hair, fur)
        # Using post_process_mask to clean up leftover noise
        output_image = remove(
            input_image, 
            session=get_session(), 
            post_process_mask=True
        ).convert("RGBA")
        
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
