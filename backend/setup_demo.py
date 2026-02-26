import urllib.request
from rembg import remove
from PIL import Image
import io

print("Downloading demo original...")
urllib.request.urlretrieve(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    "../frontend/public/demo-before.jpg"
)

print("Removing background for demo...")
with open("../frontend/public/demo-before.jpg", "rb") as i:
    input_data = i.read()
    output_data = remove(input_data)
    with open("../frontend/public/demo-after.png", "wb") as o:
        o.write(output_data)

print("Demo images created successfully.")
