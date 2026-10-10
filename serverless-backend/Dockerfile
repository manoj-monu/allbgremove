FROM pytorch/pytorch:2.5.1-cuda12.4-cudnn9-runtime

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    wget \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Install torchvision 0.20.1 matching PyTorch 2.5.1 CUDA 12.4
RUN pip install --no-cache-dir torchvision==0.20.1 --index-url https://download.pytorch.org/whl/cu124

# 2. Install requirements with basicsr-fixed
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Pre-download GFPGAN weights into image
RUN wget -q https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth -O /app/GFPGANv1.4.pth

COPY app_runpod.py .
COPY runpod_handler.py .

# 4. Pre-cache BiRefNet_lite model into container cache using app_runpod polyfill
RUN python -c "import app_runpod; from transformers import AutoModelForImageSegmentation; AutoModelForImageSegmentation.from_pretrained('ZhengPeng7/BiRefNet_lite', trust_remote_code=True)"

# 5. Pre-cache facexlib & verify GFPGAN
RUN python -c "import app_runpod; from gfpgan import GFPGANer; g = GFPGANer(model_path='/app/GFPGANv1.4.pth', upscale=2, arch='clean', channel_multiplier=2, bg_upsampler=None, device='cpu'); print('GFPGAN verified successfully!')"

# 6. Smoke test full app import and warmup
RUN python -c "import app_runpod; app_runpod.warm_up(); print('ALL MODELS PRE-WARMED AND VERIFIED!')"

EXPOSE 8000

# FastAPI via Uvicorn with conda python
CMD ["python", "-m", "uvicorn", "app_runpod:app", "--host", "0.0.0.0", "--port", "8000"]
