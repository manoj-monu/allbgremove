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

def get_session():
    global ai_session
    if ai_session is None:
        print("Loading U2Net AI model into memory...")
        ai_session = new_session("u2net")
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

@app.post("/api/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        print(f"Received file: {file.filename}, content-type: {file.content_type}")
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
            post_process_mask=True,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
        ).convert("RGBA")
        
        # Verify alpha channel in logs
        alpha = output_image.split()[3]
        min_alpha, max_alpha = alpha.getextrema()
        print(f"Finished rembg in {time.time()-start:.2f}s. Alpha extrema: {min_alpha} to {max_alpha}")

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
