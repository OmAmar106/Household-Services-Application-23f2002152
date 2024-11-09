from flask import Flask, redirect, render_template, request, jsonify
from flask import session
from flask import url_for
from Modules.password import *
from functools import wraps
from model import *
from sqlalchemy import or_

def login_notrequired(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('islogin',False):
            return redirect('/dashbord')
        return f(*args, **kwargs)
    return decorated_function

def index(app):
    
    @app.errorhandler(404)
    def error(e):
        return redirect(url_for('base'))

    @app.route('/')
    @login_notrequired
    def base():
        return render_template('index.html')

    @app.route('/add_customer', methods=['POST'])
    def add_user():
        data = request.json
        username = data.get('username')
        email = data.get('email')
        existing_user = Users.query.filter_by(username=username).first()
        user1 = Users.query.filter_by(email=email).first()
        if existing_user or username=='admin':
            return jsonify({'message': 'Users already exists'}), 400
        if user1:
            return jsonify({'message': 'email already in use'}),400
        password = hash(data.get('password'))
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        address = data.get('address')
        pincode = data.get('pincode')
        new_user = Users(username=username,password=password,type="C",isactive=1,email=email)
        db.session.add(new_user)
        db.session.commit()
        id = Users.query.filter_by(username=username).first().ID
        new_cus = Customers(UserID = id,Firstname = firstname,Lastname = lastname,pincode=pincode,address=address)
        db.session.add(new_cus)
        db.session.commit()
        session['islogin'] = True
        session['type'] = 'C'
        session['username'] = username
        return jsonify({'message': ':)'}),200
    
    @app.route('/add_professional', methods=['POST'])
    def add_user1():
        data = request.json
        username = data.get('username')
        email = data.get('email')
        existing_user = Users.query.filter_by(username=username).first()
        user1 = Users.query.filter_by(email=email).first()
        if existing_user or username=='admin':
            return jsonify({'message': 'Users already exists'}), 400
        if user1:
            return jsonify({'message': 'email already in use'}),400
        password = hash(data.get('password'))
        compname = data.get('compname')
        exp = data.get('exp')
        address = data.get('address')
        pincode = data.get('pincode')
        new_user = Users(username=username,password=password,type="S",isactive=-1,email=email)
        db.session.add(new_user)
        db.session.commit()
        id = Users.query.filter_by(username=username).first().ID
        new_cus = Professional(UserID = id,company = compname,Experience = exp,pincode=pincode,address=address,Reveiwsum=5,Reveiwcount=1,Resume=0)
        db.session.add(new_cus)
        db.session.commit()
        session['islogin'] = True
        session['type'] = 'S'
        session['username'] = username
        return jsonify({'message': ':)'}),200

    @app.route('/check',methods=['POST'])
    def check():
        data = request.json
        username = data['username']
        password = hash(data['password'])
        if username=='admin' and password=='687492387':
            session['type'] = 'A'
            session['islogin'] = True
            session['username'] = 'admin'
            return jsonify({'message':':)'}),200
        elif username=='admin':
            return jsonify({'message':'password does not match'}),400
        user = Users.query.filter(or_(Users.username == username, Users.email == username)).first()
        if not user:
            return jsonify({'message':'user does not exist'}),400
        if int(user.password)!=int(password):
            return jsonify({'message':'password does not match'}),400
        session['type'] = user.type
        session['islogin'] = True
        session['username'] = user.username
        return jsonify({'message':':)'}),200
    # @app.route('/getdetails',methods=['POST','GET'])
    # def func():
    #     return jsonify({'name':'om'})
    # if successful login , redirect to dashbord 