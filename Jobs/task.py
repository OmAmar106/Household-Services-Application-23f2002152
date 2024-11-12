from Jobs.worker import cel 

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import csv

SMTP_SERVER_HOST = "localhost"
SMTP_SERVER_PORT = 1025
SENDER_EMAIL = "noreply@cleansweep.com"
SENDER_PASSWORD = ""

@cel.task
def monthly(email,subject,message):
    msg = MIMEMultipart()
    msg["To"] = email
    msg["From"] = SENDER_EMAIL
    msg["Subject"] = subject
    msg.attach(MIMEText(message,"plain"))
    server = smtplib.SMTP(host=SMTP_SERVER_HOST,port=SMTP_SERVER_PORT)
    server.login(user=SENDER_EMAIL,password=SENDER_PASSWORD)
    server.send_message(msg)
    server.quit()

@cel.task
def exportcsv(L):
    file = 'static/pdfs/data.csv'
    file = open(file,'w')
    fieldnames = L[0].keys()
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(L)