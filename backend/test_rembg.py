import io
import requests

from PIL import Image
from rembg import remove

def test_rembg():
    # Create a dummy image with some colors
    img = Image.new('RGB', (100, 100), color = 'red')
    
    # Try to remove bg
    out = remove(img)
    out.save('test_out.png')
    print("Done")

if __name__ == "__main__":
    test_rembg()
