from flask import Flask, redirect, render_template, request, jsonify
from flask import session
from flask import url_for
from functools import wraps

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