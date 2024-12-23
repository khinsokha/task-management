from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from email_service import EmailService
# import env
from env import app_config


app = Flask(__name__)
app.config.from_object(app_config)

email_service = EmailService()

@app.route('/config')
def get_config():
    return jsonify(app.config['URL_ENDPOINTS'])

@app.route('/')
def index():
    return render_template('login.html', urlEndPoints=app.config['URL_ENDPOINTS'], headers=app_config.HEADERS)

@app.route('/dashboard')
def dashboard():
    return render_template('index.html', urlEndPoints=app_config.URL_ENDPOINTS, headers=app_config.HEADERS)


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
    user_name = data.get('username')
    success = email_service.send_password_email(user_email, user_password, user_name)  # Send the email
    

    if success:
        return jsonify({"message": "Password sent successfully!!","code":0}), 200  # Return 200 on success
    else:
        return jsonify({"message": "Failed to send email."}), 500  # Return 500 if there was an error

if __name__ == '__main__':
    app.run(debug=True)
