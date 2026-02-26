from rembg import remove
from PIL import Image
import io

def test_person():
    with open("person.jpg", "rb") as f:
        img_bytes = f.read()

    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    out = remove(img, post_process_mask=True).convert("RGBA")
    
    alpha = out.split()[3]
    min_alloc, max_alloc = alpha.getextrema()
    
    print(f"Alpha extrema: {min_alloc} to {max_alloc}")
    out.save("person_out.png")

if __name__ == "__main__":
    test_person()
