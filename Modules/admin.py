from flask import Flask, redirect, render_template, request, jsonify
from flask import session
from flask import url_for
from functools import wraps
from model import *
import os

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('islogin',False) and session.get('type','')=='A':
            return f(*args, **kwargs)
        return redirect('/')
    return decorated_function


def index(app):

    @app.route('/admin')
    @login_required
    def adash():
        return render_template('admin.html')
    
    @app.route('/crserv', methods=['POST'])
    def crserv():
        data = request.json
        ServiceName = data.get('ServiceName')
        Details = data.get('Details')
        BasePay = data.get('BasePay')
        # print(ServiceName)
        # print(Details)
        # print(BasePay)
        if ServiceList.query.filter_by(Service=ServiceName).first():
            return jsonify({'message':'Service already exists'}),400
        newservice = ServiceList(Service=ServiceName,Details=Details,BasePayment=BasePay)
        db.session.add(newservice)
        db.session.commit()
        return jsonify({'message':'Created Succesfully'}),200
    
    @app.route('/toggleactive',methods=['POST'])
    def toggleactive():
        data = request.json
        user = Users.query.filter_by(ID=data.get('ID')).first()
        if user.isactive:
            user.isactive = 0
        else:
            user.isactive = 1
        db.session.commit()
        return jsonify({'message':':)'}),200
