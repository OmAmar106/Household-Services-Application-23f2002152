broker_url = "redis://localhost:6380/1"
result_backend = "redis://localhost:6380/2"
broker_connection_retry_on_startup = True
timezone = "UTC"

# use this port since the other one is already in use 

# client pushes the message in message broker ---> celery distributes the task to the workers --> Once the taks is 
# complete the result will be pushed to the result backend
# download thunderclient 

# after git clone and all then cd then this
# Step 1 : pip install reqtxt
# Step 2 : sudo apt install redis-server
# Step 3 : sudo apt-get -y install golang-go
# Step 4 : go install github.com/mailhog/MailHog@latest
# Step 5 : ~go/bin/MailHog


# Step 6 : redis-server --port 6380
# Step 7 : celery -A app.cel worker -l INFO
# Step 8 : celery -A app.cel beat -l INFO
# Step 9 : python app.py