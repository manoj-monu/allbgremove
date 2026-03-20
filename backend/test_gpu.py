import requests
import time
import os

# New Colab GPU URL
API_URL = "https://ameer-unsaid-karolyn.ngrok-free.dev"
image_path = r"c:\Users\ADMIN\allbgremove\backend\person.jpg"

def test_gpu_api():
    if not os.path.exists(image_path):
        print(f"Test image not found at {image_path}")
        return

    print(f"Testing GPU Backend at: {API_URL}")
    try:
        with open(image_path, "rb") as f:
            start_time = time.time()
            files = {"file": f}
            # The Colab API uses /api/remove-bg-async
            r = requests.post(f"{API_URL}/api/remove-bg-async", files=files, timeout=120)
            
            if r.status_code != 200:
                print(f"❌ Failed to queue task: {r.status_code}")
                print(r.text)
                return
            
            data = r.json()
            task_id = data["task_id"]
            print(f"✅ Task queued successfully! ID: {task_id}")

            # Poll for results
            max_attempts = 30
            for i in range(max_attempts):
                time.sleep(1)
                status_r = requests.get(f"{API_URL}/api/status/{task_id}")
                status_data = status_r.json()
                status = status_data["status"]
                print(f"Status: {status} (T + {time.time()-start_time:.1f}s)")
                
                if status == "completed":
                    print(f"🔥 AMAZING! GPU processed 4K/High-Res in just {time.time()-start_time:.1f}s")
                    print(f"Result URL: {API_URL}/api/result/{task_id}")
                    return
                if status == "failed":
                    print(f"❌ Task failed: {status_data.get('error')}")
                    return
            
            print("⏳ Timeout: GPU processing taking longer than expected.")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_gpu_api()
