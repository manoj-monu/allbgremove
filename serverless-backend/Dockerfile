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

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app_runpod.py .
COPY runpod_handler.py .

EXPOSE 8000

# FastAPI via Uvicorn — Load Balancer Serverless
CMD ["python3", "-m", "uvicorn", "app_runpod:app", "--host", "0.0.0.0", "--port", "8000"]
