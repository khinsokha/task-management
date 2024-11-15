from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from email_service import EmailService

app = Flask(__name__)

# Configure Flask-Mail
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 587  # Usually 587 for TLS
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USERNAME'] = 'taskmanagerment2@gmail.com'  # Your email
# app.config['MAIL_PASSWORD'] = 'dpaiawlzvpfdgrbh'#'nS0q;_Y"(poNW5JsfS*^3b'  # Your email password 
# app.config['MAIL_DEFAULT_SENDER'] = 'taskmanagerment@gmail.com'  # Default sender

# mail = Mail(app)

email_service = EmailService()

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    return render_template('index.html')

@app.route('/password_recovery')
def password_recovery():
    return render_template('password_recovery.html')

@app.route('/register')
def signup():
    return render_template('signup.html')

@app.route('/send_password', methods=['POST'])
def send_password():
    data = request.get_json()
    user_email = data.get('email')  # Get the user's email from the request
    user_password = data.get('password') # Replace this with the actual password retrieval logic
    success = email_service.send_password_email(user_email, user_password)  # Send the email

    if success:
        return jsonify({"message": "Password sent successfully!!","code":0}), 200  # Return 200 on success
    else:
        return jsonify({"message": "Failed to send email."}), 500  # Return 500 if there was an error

if __name__ == '__main__':
    app.run(debug=True)
