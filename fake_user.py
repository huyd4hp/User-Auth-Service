import requests
import json
from time import sleep
import threading
def adduser():
    for i in range(0, 100):
        response = requests.get("https://randomuser.me/api/")
        content = response.content.decode("utf-8")
        results = json.loads(content)['results']
        
        # Tạo dữ liệu JSON để gửi
        data = {
            "first_name":results[0]['name']['first'],
            "last_name":results[0]['name']['last'],
            "email": results[0]['email'],
            "phone": results[0]['phone'],
            "password":"app.backend.password",
        }
        
        # Chuyển dữ liệu thành chuỗi JSON
        json_data = json.dumps(data)
        
        # Gửi yêu cầu POST với dữ liệu JSON
        response = requests.post(
            url="http://localhost:5000/api/v1/auth/signup",
            headers={"Content-Type": "application/json"},
            data=json_data
        )
        
        print('status code:', response.status_code)
        print('response:', response.content)
    

threads = []

for _ in range(10):
    thread = threading.Thread(target=adduser)
    thread.start()
    threads.append(thread)

for thread in threads:
    thread.join()