import sys
import torchvision.transforms.functional as TF
sys.modules['torchvision.transforms.functional_tensor'] = TF

import runpod
import base64
import io
import cv2
import numpy as np
import torch
from PIL import Image
from transformers import AutoModelForImageSegmentation
from torchvision import transforms

# ─────────────────────────────────────────
# Models ko ek baar load karo (cold start)
# ─────────────────────────────────────────
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[STARTUP] Device: {device}")

print("[STARTUP] BiRefNet load ho raha hai...")
birefnet = AutoModelForImageSegmentation.from_pretrained(
    "ZhengPeng7/BiRefNet_lite",
    trust_remote_code=True
)
birefnet.to(device)
birefnet.eval()
print("[STARTUP] BiRefNet ready!")

# GFPGAN optional hai — sirf enhance=true pe load hoga
gfpgan_model = None

def load_gfpgan():
    global gfpgan_model
    if gfpgan_model is None:
        print("[INFO] GFPGAN load ho raha hai...")
        from gfpgan import GFPGANer
        gfpgan_model = GFPGANer(
            model_path='https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth',
            upscale=2,
            arch='clean',
            channel_multiplier=2,
            bg_upsampler=None
        )
        print("[INFO] GFPGAN ready!")
    return gfpgan_model


# ─────────────────────────────────────────
# Background Remove Function
# ─────────────────────────────────────────
def remove_background(image: Image.Image) -> Image.Image:
    input_size = (1024, 1024)
    original_size = image.size

    transform = transforms.Compose([
        transforms.Resize(input_size),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    input_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        preds = birefnet(input_tensor)[-1].sigmoid().cpu()

    pred = preds[0].squeeze()
    mask = transforms.ToPILImage()(pred)
    mask = mask.resize(original_size, Image.LANCZOS)

    result = image.convert("RGBA")
    result.putalpha(mask)
    return result


# ─────────────────────────────────────────
# Main RunPod Handler
# ─────────────────────────────────────────
def handler(job):
    """
    Input format (job["input"]):
    {
        "image": "<base64 encoded image>",
        "enhance": false   (optional, default false)
    }

    Output format:
    {
        "image": "<base64 encoded PNG with transparent background>"
    }
    """
    try:
        job_input = job["input"]

        # ── Image decode karo ──
        image_b64 = job_input.get("image")
        if not image_b64:
            return {"error": "image field missing hai! Base64 encoded image bhejo."}

        image_data = base64.b64decode(image_b64)
        img_pil = Image.open(io.BytesIO(image_data)).convert("RGB")
        print(f"[INFO] Image size: {img_pil.size}")

        # ── Face Enhancement (optional) ──
        enhance = job_input.get("enhance", False)
        if enhance:
            print("[INFO] Face enhancement chal raha hai...")
            gfpgan = load_gfpgan()
            img_cv = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
            _, _, enhanced = gfpgan.enhance(
                img_cv,
                has_aligned=False,
                only_center_face=False,
                paste_back=True
            )
            if enhanced is not None:
                img_pil = Image.fromarray(cv2.cvtColor(enhanced, cv2.COLOR_BGR2RGB))
            print("[INFO] Enhancement complete!")

        # ── Background Remove ──
        print("[INFO] Background remove ho raha hai...")
        result = remove_background(img_pil)
        print("[INFO] Background removed!")

        # ── Output encode karo ──
        buf = io.BytesIO()
        result.save(buf, format="PNG")
        output_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        return {"image": output_b64}

    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        print(f"[ERROR] {error_msg}")
        return {"error": str(e), "traceback": error_msg}


# ─────────────────────────────────────────
# RunPod Start
# ─────────────────────────────────────────
if __name__ == "__main__":
    print("[STARTUP] RunPod Serverless Handler shuru ho raha hai...")
    runpod.serverless.start({"handler": handler})
