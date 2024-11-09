from flask import Flask, redirect, render_template, request, jsonify
from flask import session
from flask import url_for
from functools import wraps
from model import *
import os
from datetime import datetime

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
        d['isactive'] = user.isactive
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
        user.isactive = 0
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
    
    @app.route('/getservices',methods=['GET'])
    def getservices():
        L = Professional.query.all()
        L1 = []
        for i in L:
            if Users.query.filter_by(ID=i.UserID).first().isactive:
                L1.append(i)
        
        d = {}
        
        for i in L1:
            d[i.UserID] = {}
            for key, value in i.__dict__.items():
                if not key.startswith('_'):
                    d[i.UserID][key] = value
            t = ServiceList.query.filter_by(ID=i.ServicelistID).first()
            d[i.UserID]["service"] = [t.Service,t.Details,t.BasePayment]
            d[i.UserID]["remarks"] = {}
            d[i.UserID]["username"] = Users.query.filter_by(ID=i.UserID).first().username
            d[i.UserID]["email"] = Users.query.filter_by(ID=i.UserID).first().email

            count = 0

            for k in Remarks.query.filter_by(serviceID=i.ID).all():
                d[i.UserID]["remarks"][count] = {}
                for key,value in k.__dict__.items():
                    if not key.startswith('_'):
                        d[i.UserID]["remarks"][count][key] = value
                count += 1
            
            directory = "static/images/Profile"
            files = [f for f in os.listdir(directory) if f.startswith(d[i.UserID]["username"]+".")]
            if files:
                d[i.UserID]["profilepic"] = '/'+directory+'/'+files[0]
            else:
                d[i.UserID]["profilepic"] = '/'+directory+'/default.png'

        return jsonify(d),200 

    @app.route('/reqser',methods=['POST'])
    def reqser():
        data = request.json
        prof = Professional.query.filter_by(UserID=int(data['seller'])).first()
        find = Users.query.filter_by(username=session['username']).first()
        newser = Services(servicelistID=prof.ServicelistID,customerID=Customers.query.filter_by(UserID=find.ID).first().ID,ProfessionalID=prof.ID,Payment=data['BasePay'],Details=data['Details'],isactive=0,startdate=datetime.today().date())
        db.session.add(newser)
        db.session.commit()
        return jsonify({'message':':)'}),200
    
    @app.route('/pendingservice',methods=['GET'])
    def pendingservice():
        id = Users.query.filter_by(username=session['username']).first().ID
        id1 = Professional.query.filter_by(UserID=id).first().ID
        serv = Services.query.filter_by(ProfessionalID=id1).all()

        d = {}

        for i in serv:
            if i.isactive!=0:
                continue

            d[i.ID] = {}
            for key,value in i.__dict__.items():
                if not key.startswith('_'):
                    d[i.ID][key] = value
        
        return jsonify(d),200