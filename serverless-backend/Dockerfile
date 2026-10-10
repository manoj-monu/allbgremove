FROM pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    wget \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-cache models into Docker image
RUN python -c "from transformers import AutoModelForImageSegmentation; AutoModelForImageSegmentation.from_pretrained('ZhengPeng7/BiRefNet_lite', trust_remote_code=True)" \
    && python -c "from gfpgan import GFPGANer; GFPGANer(model_path='https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth', upscale=2, arch='clean', channel_multiplier=2, bg_upsampler=None)"

COPY app_runpod.py .
COPY runpod_handler.py .

EXPOSE 8000

# FastAPI via Uvicorn — Load Balancer Serverless
CMD ["uvicorn", "app_runpod:app", "--host", "0.0.0.0", "--port", "8000"]
