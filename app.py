from flask import Flask, redirect, render_template, request, jsonify, session
from flask_caching import Cache
from model import *
import Modules.login as login
import Modules.customer as customer
import Modules.service as service
import Modules.admin as admin
from flask_security import Security, SQLAlchemyUserDatastore, login_required

def createapp():
    app = Flask(__name__, static_folder='static')
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///household.sqlite3"
  
    app.config['CACHE_TYPE'] = 'SimpleCache'
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300  
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = "APtlnuRu04uv"
    app.config['SECURITY_PASSWORD_SALT'] = 'UVRapoeaeaReres'
    app.config['SECURITY_SEND_REGISTER_EMAIL'] = False
    db.init_app(app)
    cache = Cache(app)
    app.config['SECURITY_LOGIN_URL'] = '/undetermined'
    app.config['SECURITY_REGISTERABLE'] = False
    app.config['SECURITY_LOGOUT_URL'] = '/undetermined'
    user_datastore = SQLAlchemyUserDatastore(db, Users, Role)
    security = Security(app, user_datastore)
    with app.app_context():
        db.create_all()

    return app

app = createapp()

@app.route('/signout')
def logout():
    session.clear()
    return redirect('/')


def start():
    login.index(app)
    customer.index(app)
    service.index(app)
    admin.index(app)

def initialise():
    start()

@app.route('/dashbord')
def red():
    if session['type']=='C':
        return redirect('/customer')
    elif session['type']=='S':
        return redirect('/service')
    else:
        return redirect('/admin')

@app.route('/error')
def error():
    return render_template('error.html')

if __name__ == '__main__':
    initialise()
    app.run(debug=True)
