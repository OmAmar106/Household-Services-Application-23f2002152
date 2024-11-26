import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from flask import Flask, redirect, render_template, request, jsonify, session
from flask_caching import Cache
from model import *
import Modules.login as login
import Modules.customer as customer
import Modules.service as service
import Modules.admin as admin
from flask_security import Security, SQLAlchemyUserDatastore, login_required
from sqlalchemy import or_
from Jobs.worker import cel
import Jobs.task as task
from celery.schedules import crontab
from functools import wraps

def createapp():
    app = Flask(__name__, static_folder='static')
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join('/tmp', 'household.sqlite3')}"
    db_path = '/tmp/household.sqlite3'
    if not os.path.exists(db_path):
        open(db_path, 'w').close()
    os.chmod(db_path, 0o777)
    app.config['CACHE_TYPE'] = 'SimpleCache'
    app.config['CACHE_DEFAULT_TIMEOUT'] = 300  
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = "APtlnuRu04uv"
    app.config['SECURITY_PASSWORD_SALT'] = 'UVRapoeaeaReres'
    app.config['SECURITY_SEND_REGISTER_EMAIL'] = False
    db.init_app(app)
    cache = Cache(app, config={'CACHE_TYPE': 'simple'})
    cache.init_app(app)
    app.config['SECURITY_LOGIN_URL'] = '/undetermined'
    app.config['SECURITY_REGISTERABLE'] = False
    app.config['SECURITY_LOGOUT_URL'] = '/undetermined'
    user_datastore = SQLAlchemyUserDatastore(db, Users, Role)
    security = Security(app, user_datastore)
    with app.app_context():
        db.create_all()

        users = Customers.query.all()

        for user in users:
            user_id = user.ID
            acuser = Users.query.filter_by(ID=user.UserID).first()
            alservice = Services.query.filter_by(customerID=user_id).all()
            message = "Your Ongoing Services\n\n"
            count = 1
            for i in alservice:
                if i.isactive==1:
                    message += "No. "+str(count)+":"
                    message += "\nFrom : "+acuser.username+"\n"
                    name = Professional.query.filter_by(ID=i.ProfessionalID).first().UserID
                    name = Users.query.filter_by(ID=name).first().username
                    message += "To : "+name+"\n"
                    message += "Service : "+ServiceList.query.filter_by(ID=Professional.query.filter_by(ID=i.ProfessionalID).first().ServicelistID).first().Service+"\n"
                    message += "Details : "+i.Details+"\n"
                    message += "StartDate : "+str(i.startdate)+"\n"
                    message += "Payment : "+str(i.Payment)+"\n"
                    count += 1
                message += "\n"

            cel.conf.beat_schedule[f'send-task-every-month-user-{user_id}'] = {
                'task': 'Jobs.task.monthly',
                'schedule': crontab(minute="0",hour="0",day_of_month="1"),
                'args': (acuser.email,'Your Monthly Report',message),
            }
 
    # from datetime import timedelta
    # cel.conf.beat_schedule = {
    #     'sum-every-10-seconds': {
    #         'task': 'Jobs.task.sum',
    #         'schedule': timedelta(seconds=10),
    #         # crontab(seconds=10),
    #         'args': (5, 5),
    #     },
    # }

    return app,cache

app,cache = createapp()

def login_notrequired(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('islogin',False):
            return redirect('/dashbord')
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
@login_notrequired
def base():
    return render_template('index.html')

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
    admin.index(app,cache)

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

@app.route('/profile/<string:s>',methods=['GET'])
def profile(s):
    user = Users.query.filter_by(username=s)
    if user.first():
        data = user
        data1 = Customers.query.filter_by(UserID=data.first().ID)
        data2 = Professional.query.filter_by(UserID=data.first().ID)
        if data1.first():
            data3 = Services.query.filter_by(customerID=data1.first().ID).all()
        else:
            data3 = Services.query.filter_by(ProfessionalID=data2.first().ID).all()
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

        count = 0
        for i in data3:
            d["Services"][count] = {}
            for key, value in i.__dict__.items():
                if not key.startswith('_') and key!="fs_uniquifier" and key!="password":
                    d["Services"][count][key] = value
            d["Services"][count]["name"] = ServiceList.query.filter_by(ID=i.servicelistID).first().Service
            count += 1

        return render_template('profile.html',d=d)
    # idhar add krna hain profile ke liye alag se with back button
    return render_template('error.html')

@app.route('/getprofile/<string:s>',methods=['GET'])
def profil1e(s):
    user = Users.query.filter_by(username=s)
    if user.first():
        data = user
        data1 = Customers.query.filter_by(UserID=data.first().ID)
        data2 = Professional.query.filter_by(UserID=data.first().ID)
        if data1.first():
            data3 = Services.query.filter_by(customerID=data1.first().ID).all()
        else:
            data3 = Services.query.filter_by(ProfessionalID=data2.first().ID).all()
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

        count = 0
        for i in data3:
            d["Services"][count] = {}
            for key, value in i.__dict__.items():
                if not key.startswith('_') and key!="fs_uniquifier" and key!="password":
                    d["Services"][count][key] = value
            d["Services"][count]["name"] = ServiceList.query.filter_by(ID=i.servicelistID).first().Service
            count += 1

        return jsonify(d),200
    # idhar add krna hain profile ke liye alag se with back button
    return jsonify({}),404

# @app.route('/profile/<string:s>')
# def profile1(s):
#     return render_template('profile.html')

@app.route('/updateProfilePicture',methods=['POST'])
def updateprofilepicture():
    if 'profilepic' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['profilepic']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    filename = file.filename
    if '.jpg' not in filename and '.png' not in filename and '.jpeg' not in filename:
        return jsonify({"message",":("}),400

    username = session['username']

    ext = file.filename.rsplit('.', 1)[1].lower()
    
    fid = os.listdir('static/images/Profile/')
    for existing_file in fid:
        if existing_file.startswith((username+'.')):
            os.remove(os.path.join('static/images/Profile/', existing_file))
            
    filepath = os.path.join('static/images/Profile/',(session['username']+'.'+ext))

    file.save(filepath)
    return jsonify({"message": "Profile picture updated successfully!"}), 200

if __name__ == '__main__':
    initialise()
    app.run(debug=True)
