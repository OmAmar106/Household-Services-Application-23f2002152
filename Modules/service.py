from flask import Flask, redirect, render_template, request, jsonify
from flask import session
from flask import url_for
from functools import wraps
from model import *
import os

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('islogin',False) and session.get('type','')=='S':
            return f(*args, **kwargs)
        return redirect('/')
    return decorated_function

def index(app):
    @app.route('/service')
    @login_required
    def sd1ash():
        return render_template('service.html')

    # @app.route('/getdetails',methods=['POST','GET'])
    # def func():
    #     return jsonify({'name':'om'})
    @app.route('/seller/getdetails',methods=['GET'])
    def sellerget():
        username = session['username']
        user = Users.query.filter_by(username=username).first()
        cuser = Professional.query.filter_by(UserID=user.ID).first()
        d = {column.name: getattr(user, column.name) for column in user.__table__.columns if column.name!="password"}
        d |= {column.name: getattr(cuser, column.name) for column in cuser.__table__.columns}
        directory = "static/images/Profile"
        files = [f for f in os.listdir(directory) if f.startswith(username+".")]
        if files:
            d["profilepic"] = directory+'/'+files[0]
        else:
            d["profilepic"] = directory+'/default.png'
        return jsonify(d)
    
    @app.route('/seller/resumeadd',methods=['POST'])
    def addresume():
        username = session['username']
        servicename = request.form.get('servicename')
        pdf = request.files.get('file')

        if pdf.content_type != 'application/pdf':
            return jsonify({'message':'File must be PDF'}),400

        if len(pdf.read()) > 10*1024*1024:
            return jsonify({'message':'File size must be less than 10 MB.'}),400

        pdf.seek(0)
        filename = session['username']+'.pdf'
        pdf.save(os.path.join('static/pdfs/resume/', filename))

        user = Users.query.filter_by(username=username).first()
        cuser = Professional.query.filter_by(UserID=user.ID).first()
        cuser.Resume = 1
        cuser.ServicelistID = ServiceList.query.filter_by(Service=servicename).first().ID
        db.session.commit()
        cuser = Professional.query.filter_by(UserID=user.ID).first()
        return jsonify({'message':':)'}),200

    @app.route('/listservice',methods=['GET'])
    def listservice():
        L = ServiceList.query.all()
        L = [i.Service for i in L]
        return jsonify(L)