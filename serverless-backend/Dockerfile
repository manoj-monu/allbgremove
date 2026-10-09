FROM runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04

# System dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    wget \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Requirements install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-cache BiRefNet lite model into Docker image for instant cold-starts
RUN python -c "from transformers import AutoModelForImageSegmentation; AutoModelForImageSegmentation.from_pretrained('ZhengPeng7/BiRefNet_lite', trust_remote_code=True)"

# Pre-cache GFPGAN model
RUN mkdir -p /root/.cache/gfpgan && \
    wget -q https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth -P /root/.cache/gfpgan/ || true

# Copy code
COPY app_runpod.py .
COPY runpod_handler.py .

# Expose standard port for RunPod Load Balancer / HTTP
EXPOSE 8000

# Default command: FastAPI via Uvicorn for HTTP Load Balancer
CMD ["uvicorn", "app_runpod:app", "--host", "0.0.0.0", "--port", "8000"]
