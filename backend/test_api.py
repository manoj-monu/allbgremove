import requests

def test_api():
    url = 'http://localhost:8000/api/remove-bg'
    files = {'file': ('car.jpg', open('car.jpg', 'rb'), 'image/jpeg')}
    print("Sending request...")
    response = requests.post(url, files=files)
    print("Status Code:", response.status_code)
    
    with open('car_api_out.png', 'wb') as f:
        f.write(response.content)
    print("Saved response to car_api_out.png")

if __name__ == "__main__":
    test_api()
