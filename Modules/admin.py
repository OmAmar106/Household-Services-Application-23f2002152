from flask import Flask, redirect, render_template, request, jsonify
from flask import session
from flask import url_for
from functools import wraps
from flask_caching import Cache
from model import *
import io
import base64
import matplotlib.pyplot as plt

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('islogin',False) and session.get('type','')=='A':
            return f(*args, **kwargs)
        return redirect('/')
    return decorated_function


def index(app,cache):

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
            f = ServiceList.query.filter_by(Service=ServiceName).first()
            f.BasePayment = BasePay
            f.Details = Details
            db.session.commit()
            return jsonify({'message':'Payment and Details Updated Successfully'}),200
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
    
    @login_required
    @app.route('/getstats',methods=['GET'])
    @cache.cached(timeout=100)
    def stats():
        def fig_to_base64(fig):
            img = io.BytesIO()
            fig.savefig(img, format='png', transparent=True)
            img.seek(0)
            return base64.b64encode(img.getvalue()).decode('utf-8')
        
        user = Users.query.all()
        ccount = 0
        active = 0
        nonactive = 0
        pcount = 0
        for i in user:
            if i.type=='C':
                ccount += 1
            else:
                pcount += 1
            if i.isactive:
                active += 1
            else:
                nonactive += 1
        
        d = {}
        fig3, ax3 = plt.subplots()
        ax3.pie([ccount,pcount], labels=['Customer','Professional'], autopct='%1.1f%%')
        ax3.set_title('Users')
        img3_base64 = fig_to_base64(fig3)
        d["pie"] = img3_base64

        fig3, ax3 = plt.subplots()
        ax3.pie([active,nonactive], labels=['Active','Inactive'], autopct='%1.1f%%')
        ax3.set_title('Active Users')
        img3_base64 = fig_to_base64(fig3)
        d["pie1"] = img3_base64

        user = Professional.query.all()
        L = []
        for i in user:
            L.append(i.Reveiwsum/i.Reveiwcount)
        
        fig3, ax3 = plt.subplots(figsize=(8, 6))
        ax3.hist(L, bins=10, edgecolor='black', alpha=0.7)
        ax3.set_title('Distribution of User Ratings')
        ax3.set_xlabel('Rating')
        ax3.set_ylabel('Frequency')
        img3_base64 = fig_to_base64(fig3)
        d["hist"] = img3_base64

        serv = Services.query.all()
        rej = rev = acc = com = 0
        for i in serv:
            if i.isactive==-1:
                rej += 1
            elif i.isactive==0:
                rev += 1
            elif i.isactive==1:
                acc += 1
            else:
                com += 1

        fig3, ax3 = plt.subplots()
        ax3.pie([rev,acc,com,rej], labels=['Review','Ongoing','Completed','Rejected'], autopct='%1.1f%%')
        ax3.set_title('Service Requests')
        img3_base64 = fig_to_base64(fig3)
        d["pie3"] = img3_base64

        return jsonify(d),200
        