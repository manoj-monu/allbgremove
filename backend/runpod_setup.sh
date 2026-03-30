#!/bin/bash

# ==========================================================
# ⚡ ALLBgremove Studio Elite - RunPod Optimization Script
# ==========================================================
echo "🚀 Initializing Ultra-Fast 4K Neural Node..."

# 1. System Dependencies
apt-get update && apt-get install -y libgl1-mesa-glx python3-pip git

# 2. Python Dependencies
pip install --upgrade pip
pip install fastapi uvicorn rembg[cpu] pillow opencv-python-headless numpy realesrgan torch torchvision basicsr httpx

# 3. Model Pre-loading (Real-ESRGAN 4K)
echo "📥 Loading 4K Neural Network Weights..."
mkdir -p ~/.u2net/
wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesr-general-x4v3.pth -O ~/.u2net/realesr-general-x4v3.pth

# 4. Neural Hub (Background Removal)
wget https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx -O ~/.u2net/isnet-general-use.onnx

# 5. Start the Elite Node
echo "🔥 Node Active: Super-Charging 4K Workflow..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
