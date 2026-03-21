import requests
import time
import os

# New Modal API URL (Pointed directly to the web app)
API_URL = "https://manoj-watkar61--allbgremove-process.modal.run"
img_to_use = r"c:\Users\ADMIN\allbgremove\test_input.jpg"

def test_modal_new():
    if not os.path.exists(img_to_use):
        print(f"Test image not found at {img_to_use}")
        return

    print(f"Testing Modal Backend at: {API_URL}")
    try:
        with open(img_to_use, "rb") as f:
            start_time = time.time()
            # Form-data post
            data = {"task": "remove-bg"}
            files = {"file": f}
            
            print("Sending request to Modal (this might take 2-3 mins while GPU starts and model loads)...")
            r = requests.post(API_URL, data=data, files=files, timeout=600)
            
            if r.status_code == 200:
                print(f"✅ Success! Background removed in {time.time()-start_time:.1f}s")
                with open("test_result_modal.png", "wb") as out:
                    out.write(r.content)
                print("Result saved to test_result_modal.png")
            else:
                print(f"❌ Failed: {r.status_code}")
                print(r.text)
                
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_modal_new()
