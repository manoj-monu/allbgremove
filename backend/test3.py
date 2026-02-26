from rembg import remove
from PIL import Image

def test():
    img = Image.open("car.jpg")
    out = remove(img)
    out.save("car_out.png")
    
    # Check alpha channel
    if out.mode == 'RGBA':
        alpha = out.split()[3]
        min_alpha, max_alpha = alpha.getextrema()
        print(f"Alpha channel: min={min_alpha}, max={max_alpha}")
        if min_alpha == 255:
            print("WARNING: Background is NOT transparent! Alpha is uniformly 255.")
        else:
            print("SUCCESS: Background has transparency.")
    else:
        print(f"FAILED: Mode is {out.mode}, not RGBA")

if __name__ == "__main__":
    test()
