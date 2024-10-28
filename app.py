from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')  # Make sure 'contact.html' is in the 'templates' directory

if __name__ == '__main__':
    app.run(debug=True)