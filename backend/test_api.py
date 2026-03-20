import requests
import time
import os

API_URL = "http://localhost:8000"
image_path = r"c:\Users\ADMIN\allbgremove\backend\person.jpg"

def test_api():
    if not os.path.exists(image_path):
        print(f"Test image not found at {image_path}")
        return

    with open(image_path, "rb") as f:
        print("Uploading test image...")
        start_time = time.time()
        files = {"file": f}
        r = requests.post(f"{API_URL}/api/remove-bg-async?enhance=false", files=files)
        if r.status_code != 200:
            print(f"Failed to queue task: {r.status_code} {r.text}")
            return
        
        data = r.json()
        task_id = data["task_id"]
        print(f"Task queued. ID: {task_id}")

        while True:
            time.sleep(1)
            r = requests.get(f"{API_URL}/api/status/{task_id}")
            status_data = r.json()
            status = status_data["status"]
            print(f"Status: {status} (T + {time.time()-start_time:.1f}s)")
            
            if status == "completed":
                print("Task finished successfully!")
                break
            if status == "failed":
                print(f"Task failed: {status_data.get('error')}")
                break
            if time.time() - start_time > 60:
                print("Timeout waiting for task")
                break

if __name__ == "__main__":
    test_api()
