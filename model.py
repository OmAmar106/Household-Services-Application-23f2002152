from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
import uuid

db = SQLAlchemy()

roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('Users.ID')),
    db.Column('role_id', db.Integer(), db.ForeignKey('Role.ID'))
)

class Role(db.Model, RoleMixin):
    __tablename__ = 'Role'
    ID = db.Column(db.Integer(), primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Users(db.Model, UserMixin):
    __tablename__ = 'Users'
    ID = db.Column(db.Integer,primary_key = True,autoincrement = True)
    username = db.Column(db.String,nullable=False,unique=True)
    password = db.Column(db.String,nullable=False)
    type = db.Column(db.String,nullable=False)
    isactive = db.Column(db.Integer,nullable=False)
    email = db.Column(db.String,nullable=False,unique=True)
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))
    fs_uniquifier = db.Column(db.String, unique=True, default=lambda: str(uuid.uuid4()))

class Customers(db.Model):
    __tablename__ = 'Customers'
    ID = db.Column(db.Integer,primary_key = True,autoincrement = True)
    UserID = db.Column(db.Integer,unique=True)
    Firstname = db.Column(db.String,nullable = False)
    Lastname = db.Column(db.String,nullable = False)
    pincode = db.Column(db.Integer)
    address = db.Column(db.String) # will store image as customer name 

class Professional(db.Model):
    __tablename__ = 'Professional'
    ID = db.Column(db.Integer,primary_key = True,autoincrement = True)
    UserID = db.Column(db.Integer,unique=True)
    company = db.Column(db.String,nullable=False)
    pincode = db.Column(db.Integer)
    address = db.Column(db.String)
    Experience = db.Column(db.Integer)
    ServicelistID = db.Column(db.Integer) #connected to service list id 
    Reveiwsum = db.Column(db.Integer)
    Reveiwcount = db.Column(db.Integer)
    Resume = db.Column(db.Integer,nullable=False)
    #xould add a pdf column whether it exists or not

class Services(db.Model):
    __tablename__ = 'Services'
    ID = db.Column(db.Integer,primary_key = True,autoincrement = True)
    servicelistID = db.Column(db.Integer,nullable=False) # connected to service list id 
    customerID = db.Column(db.Integer,nullable=False)
    ProfessionalID = db.Column(db.String)
    Payment = db.Column(db.Integer,nullable=False)
    Details = db.Column(db.String)
    isactive = db.Column(db.Integer) 
    startdate = db.Column(db.Date,nullable=False)

class Remarks(db.Model):
    __tablename__ = 'Remarks'
    ID = db.Column(db.Integer,primary_key = True,autoincrement = True)
    serviceID = db.Column(db.Integer,nullable=False)
    remark = db.Column(db.String)
    star = db.Column(db.String)

class ServiceList(db.Model):
    __tablename__ = 'ServiceList'
    ID = db.Column(db.Integer,primary_key = True,autoincrement = True)
    Service = db.Column(db.String,nullable=False) #idhar mention nahi kiya hain par ise bhi unique rakhna hain 
    Details = db.Column(db.String) 
    BasePayment = db.Column(db.Integer,nullable=False) 

class Queries(db.Model):
    __tablename__ = 'queries'
    ID = db.Column(db.Integer,primary_key = True,autoincrement = True)
    name = db.Column(db.String)
    query1 = db.Column(db.String)
    emailid = db.Column(db.String)
