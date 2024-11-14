from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message

app = Flask(__name__)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587  # Usually 587 for TLS
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'taskmanagerment2@gmail.com'  # Your email
app.config['MAIL_PASSWORD'] = 'dpaiawlzvpfdgrbh'#'nS0q;_Y"(poNW5JsfS*^3b'  # Your email password 
app.config['MAIL_DEFAULT_SENDER'] = 'taskmanagerment@gmail.com'  # Default sender

mail = Mail(app)

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
    user_password = "your_password"  # Replace this with the actual password retrieval logic

    # Create the email
    msg = Message("Password Recovery", recipients=[user_email])
    msg.body = f"Greet! This user password is {user_password}"

    # Send the email
    try:
        mail.send(msg)
        return jsonify({"code": 200, "message": "Email sent successfully"})
    except Exception as e:
        return jsonify({"code": 500, "message": f"Failed to send email: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)
