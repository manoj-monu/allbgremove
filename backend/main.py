import io
import logging
import traceback
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
from rembg import new_session, remove

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

SESSION = None
def get_session():
    global SESSION
    if SESSION is None:
        SESSION = new_session('birefnet-portrait')
    return SESSION

@app.get('/')
def home():
    return {'status': 'ok', 'engine': 'BiRefNet-Portrait-V2'}

@app.post('/api/remove-bg')
async def remove_bg(file: UploadFile = File(...)):
    try:
        input_data = await file.read()
        img = Image.open(io.BytesIO(input_data)).convert('RGBA')
        
        # Optimized parameters for preserving ears and fine edges
        output = remove(
            img, 
            session=get_session(),
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=3 # Reduced from 10 to 3 to preserve ears
        )
        
        buf = io.BytesIO()
        output.save(buf, format='PNG')
        buf.seek(0)
        return StreamingResponse(buf, media_type='image/png')

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {'error': str(e)}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=7860)