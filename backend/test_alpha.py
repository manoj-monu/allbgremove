from rembg import remove
from PIL import Image
import io

def test_rembg_on_bytes():
    # Read the car image
    with open("car.jpg", "rb") as f:
        data = f.read()

    # Remove background
    out_data = remove(data)
    
    # Check what we got
    out_img = Image.open(io.BytesIO(out_data))
    print(f"Output mode: {out_img.mode}")
    if out_img.mode == 'RGBA':
        alpha = out_img.split()[3]
        min_alpha, max_alpha = alpha.getextrema()
        print(f"Alpha channel: min={min_alpha}, max={max_alpha}")
        
    out_img.save("car_test_out.png")

if __name__ == "__main__":
    test_rembg_on_bytes()
