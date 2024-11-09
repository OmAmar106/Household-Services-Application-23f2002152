from flask import Flask, redirect, render_template, request, jsonify, session
from flask_caching import Cache
from model import *
import Modules.login as login
import Modules.customer as customer
import Modules.service as service
import Modules.admin as admin
from flask_security import Security, SQLAlchemyUserDatastore, login_required
import os
from sqlalchemy import or_

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

@app.route('/getusers',methods=['GET'])
def getusers():
    data = Users.query.all()
    data1 = Customers.query.all()
    data2 = Professional.query.all()
    d = {}
    for i in data2:
        d[i.UserID] = {}
        for key, value in i.__dict__.items():
            if not key.startswith('_'):
                d[i.UserID][key] = value
        d[i.UserID]['service'] = ServiceList.query.filter_by(ID=i.ServicelistID).first().Service

    for i in data1:
        d[i.UserID] = {}
        for key, value in i.__dict__.items():
            if not key.startswith('_'):
                d[i.UserID][key] = value
    
    for i in data:
        for key, value in i.__dict__.items():
            if not key.startswith('_') and key!="fs_uniquifier" and key!="password":
                d[i.ID][key] = value
        directory = "static/images/Profile"
        files = [f for f in os.listdir(directory) if f.startswith(i.username+".")]
        if files:
            d[i.ID]["profilepic"] = '/'+directory+'/'+files[0]
        else:
            d[i.ID]["profilepic"] = '/'+directory+'/default.png'
    # for i in d:
    #     print(i,d[i])
    
    return jsonify(d),200

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

@app.route('/profile/<string:s>')
def profile(s):
    user = Users.query.filter_by(username=s)
    if user.first():
        data = user
        data1 = Customers.query.filter_by(UserID=data.first().ID)
        data2 = Professional.query.filter_by(UserID=data.first().ID)
        data3 = Services.query.filter(or_(Services.ProfessionalID==data.first().ID,Services.customerID==data.first().ID)).all()
        d = {}
        for i in data2:
            d["dets"] = {}
            for key, value in i.__dict__.items():
                if not key.startswith('_'):
                    d["dets"][key] = value

        for i in data1:
            d["dets"] = {}
            for key, value in i.__dict__.items():
                if not key.startswith('_'):
                    d["dets"][key] = value        
        
        for i in data:
            for key, value in i.__dict__.items():
                if not key.startswith('_') and key!="fs_uniquifier" and key!="password":
                    d["dets"][key] = value
            directory = "static/images/Profile"
            files = [f for f in os.listdir(directory) if f.startswith(i.username+".")]
            if files:
                d["dets"]["profilepic"] = '/'+directory+'/'+files[0]
            else:
                d["dets"]["profilepic"] = '/'+directory+'/default.png'
        # for i in d:
        #     print(i,d[i])
        d["Services"] = {}

        for i in data3:
            for key, value in i.__dict__.items():
                if not key.startswith('_') and key!="fs_uniquifier" and key!="password":
                    d["Services"][key] = value
            d["Services"]["name"] = ServiceList.query.filter_by(ID=i.servicelistID).first().Service

        return jsonify(d),200
    # idhar add krna hain profile ke liye alag se with back button
    return render_template('error.html')

if __name__ == '__main__':
    initialise()
    app.run(debug=True)
