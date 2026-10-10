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

# 2. Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Patch basicsr degradations.py if present
RUN python -c "import site, os; p = os.path.join(site.getsitepackages()[0], 'basicsr/data/degradations.py'); os.path.exists(p) and open(p, 'w').write(open(p).read().replace('functional_tensor', 'functional'))" || true

# 4. Pre-download GFPGAN weights into image
RUN wget -q https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth -O /app/GFPGANv1.4.pth

# 5. Pre-cache BiRefNet_lite model into container cache
RUN python -c "from transformers import AutoModelForImageSegmentation; AutoModelForImageSegmentation.from_pretrained('ZhengPeng7/BiRefNet_lite', trust_remote_code=True)"

# 6. Pre-cache facexlib weights for GFPGAN
RUN python -c "import torchvision.transforms.functional as TF; import sys; sys.modules['torchvision.transforms.functional_tensor'] = TF; from gfpgan import GFPGANer; g = GFPGANer(model_path='/app/GFPGANv1.4.pth', upscale=2, arch='clean', channel_multiplier=2, bg_upsampler=None, device='cpu')" || true

COPY app_runpod.py .
COPY runpod_handler.py .

# 7. Smoke test import during docker build
RUN python -c "import app_runpod; print('app_runpod verified successfully!')"

EXPOSE 8000

# FastAPI via Uvicorn with conda python
CMD ["python", "-m", "uvicorn", "app_runpod:app", "--host", "0.0.0.0", "--port", "8000"]
