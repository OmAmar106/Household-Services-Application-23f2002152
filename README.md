# Household Services Application

## 📋 Overview
The **Household Services Application** is a scalable platform designed to connect users with service providers for various household needs. It provides a seamless experience for users to browse, book, and manage household services such as plumbing, electrical repairs, cleaning, and more.

---

## ✨ Features
- **User-Friendly Interface**: Simple navigation for users to find and book services easily.
- **Service Interface**: You may login as a Service Provider and provide services to other users.
- **Customer Interface**: You may login as a Customer and request for services from Service Providers.
- **Notifications**: Email notifications for confirmation and reminders.
- **Admin Dashboard**: Manage users, services, and bookings efficiently and view site stats.
- **Backend Jobs**: Integrated Features such as export in csv, email notifications, etc. as a part of the backend jobs through Celery, Redis and MailHog.

---

## 🛠️ Technologies Used

### Frontend:
- **Vue.js**
- **HTML5 & CSS3**
- **JavaScript**

### Backend:
- **Flask**
- **Flask Security**
- **Flask Caching**
- **Celery Module**
- **SQLAlchemy**

### Database:
- **SQLite**

### Other Tools:
- **Redis**
- **Celery**
- **MailHog**

---

## 🚀 How to Run the Project

### Prerequisites
- **Python 3.11 or above**
- **Linux**

### Steps
1. Clone the repository:

   ```bash
   >> git clone https://github.com/OmAmar106/Household-Services-Application-23f2002152.git
   >> cd Household-Services-Application-23f2002152
   ```
3. Create a Virtual Environment:

   ```bash
   >> python3 -m venv venv
   >> source venv/bin/activate
   ```
4. Installing the Modules:

   ```bash
   >> pip3 install requirements.txt
   ```
5. Installing Other Dependencies:

   ```bash
   >> sudo apt install redis-server
   >> sudo apt-get -y install golang-go
   >> go install github.com/mailhog/MailHog@latest
   ```
7. Running Other Dependencies:

   ```bash
   >> ~/go/bin/MailHog
   >> redis-server --port 6380
   >> celery -A app.cel worker -l INFO
   >> celery -A app.cel beat -l INFO
   ```
8. Running the Python App:

   ```bash
   >> python app.py
   ```
---

## Screenshots

![Screenshot 2024-11-26 183405](https://github.com/user-attachments/assets/9f39fd03-c525-4930-929c-0c67bbf82c17)

![Screenshot 2024-11-26 183439](https://github.com/user-attachments/assets/bcdda0bd-d7b7-46f9-a482-b50fe96a7e5a)

![Screenshot 2024-11-26 183455](https://github.com/user-attachments/assets/bb4188af-099f-47fb-b14b-938d47e94faf)

![Screenshot 2024-11-26 183514](https://github.com/user-attachments/assets/b6c88e93-4a8d-4b8b-83c1-2efa26a065c7)



