from flask import Flask, redirect, render_template, request, jsonify
from flask import session
from flask import url_for
from functools import wraps

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get('islogin',False) and session.get('type','')=='C':
            return f(*args, **kwargs)
        return redirect('/')
    return decorated_function


def index(app):
    @app.route('/customer')
    @login_required
    def sdash():
        return render_template('customer.html')

    # @app.route('/getdetails',methods=['POST','GET'])
    # def func():
    #     return jsonify({'name':'om'})