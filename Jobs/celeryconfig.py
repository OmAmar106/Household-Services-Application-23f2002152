broker_url = "redis://localhost:6380/1"
result_backend = "redis://localhost:6380/2"
broker_connection_retry_on_startup = True
timezone = "UTC"

# after git clone and all then cd then this
# Step 1 : pip install reqtxt
# Step 2 : sudo apt install redis-server
# Step 3 : sudo apt-get -y install golang-go
# Step 4 : go install github.com/mailhog/MailHog@latest

# Step 5 : ~go/bin/MailHog
# Step 6 : sudo systemctl stop redis
# Step 7 : redis-server --port 6380
# Step 8 : celery -A app.cel worker -l INFO
# Step 9 : celery -A app.cel beat -l INFO
# Step 10 : python app.py
# Note : All this to be done in the curdir

# Add all this in a readme file and remove from here.