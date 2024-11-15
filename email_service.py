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

    def send_password_email(self, user_email, user_password):
        # Construct the email content (for password recovery)
        subject = "Password Recovery"
        body = f"Your password is: {user_password}"
        print("User email : " + user_email + "Pass: " + user_password)

        # Call send_email to send the email
        return self.send_email(subject, body, user_email, user_password)

    def send_email(self, subject, body, to_email, from_name="No Reply", to_name=None, is_html=False):
        # Create the email message
        msg = EmailMessage()
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
