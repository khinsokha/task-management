# config.py
import os
import base64

# Store email credentials here
EMAIL_USERNAME = "taskmanagerment2@gmail.com"
EMAIL_PASSWORD = 'dpaiawlzvpfdgrbh'#'nS0q;_Y"(poNW5JsfS*^3b'
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465  # SSL port for Gmail

#end-point task managerment
class Config:
   # Store the Authorization and Content-Type headers
    username = "smey.dev"
    password = "$mey@168"
    auth_string = f"{username}:{password}"
    # credentials = base64.b64encode(auth_string.encode("utf-8")).decode("utf-8")

    AUTHORIZATION = base64.b64encode(auth_string.encode("utf-8")).decode("utf-8")
    CONTENT_TYPE = "application/json"

   

    # You can also define other global headers here as needed
    HEADERS = {
        "Authorization": AUTHORIZATION,
        "ContentType": CONTENT_TYPE
    }

    ENV = os.environ.get('FLASK_ENV', 'dev')  # Default to 'development'
    if ENV == 'pro':
        URL_ENDPOINTS = {
            "retrive_task": "https://sambathreasmey1app.pythonanywhere.com/api/task/retrive_task",
            "update_task": "https://sambathreasmey1app.pythonanywhere.com/api/task/update_task",
            "add_task": "https://sambathreasmey1app.pythonanywhere.com/api/task/add_task",
            "delete_task": "https://sambathreasmey1app.pythonanywhere.com/api/task/delete_task"
           
        }
    else:
        URL_ENDPOINTS = {
            "retrive_task": "https://sambathreasmey1app.pythonanywhere.com/api/task/retrive_task",
            "update_task": "https://sambathreasmey1app.pythonanywhere.com/api/task/update_task",
            "add_task": "https://sambathreasmey1app.pythonanywhere.com/api/task/add_task",
            "delete_task": "https://sambathreasmey1app.pythonanywhere.com/api/task/delete_task"
        }
    # URL_ENDPOINT = "https://sambathreasmey1app.pythonanywhere.com/api/task/"
    # URL_ENDPOINTUAT = "https://localhost:7001/api/task/"

app_config = Config()
