from flask import Flask, redirect, render_template, request, jsonify, session
from flask_caching import Cache
from model import *
import Modules.login as login
import Modules.customer as customer
import Modules.service as service

def createapp():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///household.sqlite3"
    app.config['CACHE_TYPE'] = 'SimpleCache'
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300  
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = "APtlnuRu04uv"
    db.init_app(app)
    cache = Cache(app)
    with app.app_context():
        db.create_all()
    return app

app = createapp()

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')


def start():
    login.index(app)
    customer.index(app)
    service.index(app)

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

if __name__ == '__main__':
    initialise()
    app.run(debug=True)
