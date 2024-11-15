import smtplib
from email.message import EmailMessage
from email.utils import formataddr
import os

import env  # Import the env.py module

class EmailService:
    def __init__(self):
        # Load credentials from env.py
        self.smtp_server = env.SMTP_SERVER
        self.smtp_port = env.SMTP_PORT
        self.username = env.EMAIL_USERNAME
        self.password = env.EMAIL_PASSWORD

    def send_password_email(self, user_email, user_password, user_name):
    # Construct the email content (for password recovery)
        subject = "Reminder: Your Password for Task Managerment"

        body = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reminder</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    color: #333;
                    padding: 20px;
                    margin: 0;
                }}
                .container {{
                    background-color: #ffffff;
                    border: 1px solid #e0e0e0;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border-radius: 8px;
                }}
                .header {{
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                }}
                .content {{
                    font-size: 16px;
                    line-height: 1.5;
                    color: #555;
                }}
                .footer {{
                    font-size: 12px;
                    text-align: center;
                    margin-top: 20px;
                    color: #888;
                }}
                .button {{
                    background-color: #4CAF50;
                    color: white;
                    padding: 12px 20px;
                    text-align: center;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 4px;
                    display: inline-block;
                    margin-top: 20px;
                }}
                .button:hover {{
                    background-color: #45a049;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Password Reminder for Task Managerment</div>
                <div class="content">
                    <p>Dear {user_name},</p>
                    <p>We received a request to remind you of your password for your account with <strong>Task Managerment</strong>.</p>
                    <p>Your login details are as follows:</p>
                    <p><strong>Username:</strong> {user_name}</p>
                    <p><strong>Password:</strong> {user_password}</p>
                    <p>For security reasons, please make sure to keep your login details safe and secure. If you did not request this reminder, please ignore this message.</p>
                    <p>If you need further assistance, feel free to contact our support team at <a href="mailto:taskmanagerment2@gmail.com">taskmanagerment2@gmail.com</a>.</p>
                    <a href="[Reset Password URL]" class="button">Reset Your Password</a>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Task Managerment. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

        print(f"Sending email to: {user_email} with password: {user_password}")

        # Call send_email to send the email
        return self.send_email(subject, body, user_email)


    def send_email(self, subject, body, to_email, from_name="No Reply", to_name=None, is_html=True):
        # Create the email message
        msg = EmailMessage()
        msg.add_header('Content-Type', 'text/html')
        msg.set_content(body, subtype='html' if is_html else 'plain')
        msg['Subject'] = subject
        msg['From'] = formataddr((from_name, self.username))
        msg['To'] = formataddr((to_email if to_name else to_email, to_email))

        # Connect to the SMTP server and send the email
        try:
            with smtplib.SMTP_SSL(self.smtp_server, self.smtp_port) as server:
                server.login(self.username, self.password)
                server.send_message(msg)
                print(f"Email sent to {to_email} successfully!!!")
                return True  # Return True if email is sent successfully
        except Exception as e:
            print(f"Error sending email: {e}")
            return False  # Return False if there was an error
