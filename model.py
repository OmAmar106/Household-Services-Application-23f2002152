from flask_sqlalchemy import SQLAlchemy 
db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = 'Users'
    ID = db.Column(db.Integer,primary_key = True,autoincrement = True)
    username = db.Column(db.String,nullable=False,unique=True)
    password = db.Column(db.String,nullable=False)
    type = db.Column(db.String,nullable=False)
    isactive = db.Column(db.Integer,nullable=False)
    email = db.Column(db.String,nullable=False,unique=True)

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
    serviceID = db.Column(db.Integer,nullable=False) # connected to class services
    remark = db.Column(db.String)
    star = db.Column(db.String)

class ServiceList(db.Model):
    __tablename__ = 'ServiceList'
    ID = db.Column(db.Integer,primary_key = True,autoincrement = True)
    Service = db.Column(db.String,nullable=False)
    Details = db.Column(db.String) 
    BasePayment = db.Column(db.String) 

class Queries(db.Model):
    __tablename__ = 'queries'
    ID = db.Column(db.Integer,primary_key = True,autoincrement = True)
    name = db.Column(db.String)
    query1 = db.Column(db.String)
    emailid = db.Column(db.String)
