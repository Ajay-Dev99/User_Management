# Node.js

This project is a Node.js application that provides functionalities for user registration, login, and other features. It includes a MongoDB database setup for data storage, uses JWT for authentication, and integrates with nodemailer for sending emails.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed on your local machine
- MongoDB installed locally or a MongoDB Atlas account
- An email account for sending emails via Nodemailer


## Installation

1. Clone the repository:
2. Go To Server folder

  ```bash
cd server
```
3.npm install
  ```bash
npm install
```
4.create  .env file
  ```bash
PORT=4000
MONGODB_URL=<your-mongodb-url>
ADMIN_EMAIL=<your-admin-email>
ADMIN_PASSWORD=<your-admin-password>
JWT_SECRET_KEY=<your-jwt-secret-key>
```
(If you are using MongoDB Atlas, replace <your-mongodb-url> with your MongoDB Atlas connection string)

5.Configure Nodemailer credentials:
-Replace <your-admin-email> and <your-admin-password> with your email credentials for nodemailer. Note that for Gmail, you may need to generate an App Password if you have two-factor authentication enabled.

## Usage

Once you have completed the installation steps, you can start the server:
  ```bash
npm start
```





# matics_technologies-mt
