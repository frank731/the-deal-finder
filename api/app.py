from flask import Flask, request, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
import db
import scraper

app = Flask(__name__)
app.secret_key = "&Qq$96bcG6xGB$F!"
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
app.config['CORS_HEADERS'] = 'Content-Type'
app_bcrypt = Bcrypt(app)
CORS(app)

@app.route('/signup', methods = ['POST'])
@cross_origin(supports_credentials=True)
def add_user():
    content_type = request.headers.get('Content-Type')
    # Check if send value is a json
    if content_type == 'application/json':
        email = request.json['email']
        password = request.json['password']
        # Add given user to the database
        status = db.add_user(email, password)
        if status == "success":
            session['email'] = email
        return {'status': status }
    else:
        return {'status': "Content type not supported" }

@app.route('/login', methods = ['POST'])
@cross_origin(supports_credentials=True)
def login_user():
    content_type = request.headers.get('Content-Type')
    # Check if send value is a json
    if content_type == 'application/json':
        email = request.json['email']
        password = request.json['password']
        # Add given user to the database
        if db.check_user_exists(email):
            if app_bcrypt.check_password_hash(db.get_pw_hash(email), password):
                session['email'] = email
                return {'status': 'work'}
            else:
                return {'status': 'wrong'}
        else:
            return {'status': 'no email' }
    else:
        return {'status': "Content type not supported" }

@app.route('/logout', methods = ['GET'])
@cross_origin(supports_credentials=True)
def logout_user():
    if 'email' in session:
        # Deletes email from session
        session.pop('email', None)
        return {'status': "logged out"}
    else:
        return {'status': "already logged out"}

@app.route('/scrape', methods = ['POST'])
@cross_origin(supports_credentials=True)
def start_scraper():
    content_type = request.headers.get('Content-Type')
    results = {}
    # Check if send value is a json
    if(content_type == 'application/json'):
        for item in request.json['items']:
            results[item] = scraper.get_best_result(item)
        return {'results': results}
    else:
        return {'results': ["Content type not supported"]}

@app.route('/check-login', methods=['GET'])
@cross_origin(supports_credentials=True)
def check_login():
    if 'email' in session:
        return {'result': session['email']}
    else:
        return {'result': "not logged in"}

@app.route('/update-wishlist', methods=['POST'])
@cross_origin(supports_credentials=True)
def update_wishlist():
    # Check if user currently logged in 
    email = check_login().json['result']
    if email != "not logged in":
        db.update_wishlist(email, request.json['items'])
        return {'status': "database saved"}
    return {'status': "database not saved"}

@app.route('/get-wishlist', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_wishlist():
    # Check if user currently logged in 
    email = check_login().json['result']
    if email != "not logged in":
        return {'items': db.get_wishlist(email)}
    return {'items': []}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, 
    ssl_context=('C:/Certbot/live/the-deal-finder-api.canadaeast.cloudapp.azure.com/fullchain.pem', 
    'C:/Certbot/live/the-deal-finder-api.canadaeast.cloudapp.azure.com/privkey.pem'))
    