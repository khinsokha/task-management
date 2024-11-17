# config.py
import os


# Store email credentials here
EMAIL_USERNAME = "taskmanagerment2@gmail.com"
EMAIL_PASSWORD = 'dpaiawlzvpfdgrbh'#'nS0q;_Y"(poNW5JsfS*^3b'
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465  # SSL port for Gmail

#end-point task managerment
# urlEndPoint = 'https://sambathreasmey1app.pythonanywhere.com/api/task/'

class Config:
    URL_ENDPOINT = "https://sambathreasmey1app.pythonanywhere.com/api/task/"

app_config = Config()
