# 🚗 daePoland - Vehicle Inspection Platform

**daePoland** (Diagnostic Auto Export) is a comprehensive web platform designed to connect car buyers from Poland with professional vehicle inspectors in Belgium, the Netherlands, and Germany. The application facilitates the booking process, secure payments, and automated communication between the client and the business.

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-Proprietary-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

## 🌟 Key Features

### Frontend (Client Side)
* **🌍 Multi-Language Support:** Native Polish (PL) interface with dynamic switching to English (EN) and Dutch (NL) using ES6 Modules.
* **📱 Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop using **Tailwind CSS** with a "Mobile First" approach.
* **🎨 Modern UI:** Glassmorphism aesthetics, video background with loading optimization, and smooth scroll-snap navigation.
* **✨ Interactive Forms:** Real-time validation, dynamic price calculation based on selected packages.
* **✅ Success Page:** Dynamic post-purchase page generating a summary receipt based on URL parameters.

### Backend (Server Side)
* **💳 Secure Payments:** Full integration with **Stripe API** (Payment Intents & secure card processing).
* **🗄️ Database:** **PostgreSQL** integration to store Orders, Users, and Contact Messages.
* **📧 Email Automation:** **Nodemailer** integration sending automatic confirmations to clients and admins upon purchase or contact form submission.
* **🛡️ Security:** Implemented **Helmet.js** (secure headers with CSP config) and **Rate Limiting** (DDoS/Spam protection).
* **🔌 API:** RESTful endpoints for handling contact forms and order processing.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript (ES6 Modules).
* **Backend:** Node.js, Express.js.
* **Database:** PostgreSQL.
* **Payment Gateway:** Stripe.
* **Email Service:** Nodemailer (SMTP via Gmail/Outlook).
* **Deployment:** Render.com (Web Service + Managed PostgreSQL).

## 📂 Project Structure

```text
daePolska-app/
├── public/               # Static files served by Express
│   ├── src/              # Assets (videos, images)
│   ├── index.html        # Main landing page
│   ├── success.html      # Order confirmation page
│   ├── style.css         # Custom styles (Glassmorphism, Animations)
│   ├── script.js         # Main frontend logic
│   ├── success.js        # Success page logic
│   ├── translations.js   # Language dictionaries (PL/EN/NL)
│   └── report_templates/ # HTML templates for PDF generation
├── .env                  # Environment variables (Excluded from Repo)
├── database.sql          # SQL schema for database creation
├── server.js             # Main backend application entry point
├── package.json          # Project dependencies
└── README.md             # Documentation

## 🚀 Installation & Setup

### Prerequisites
* Node.js (v16 or higher)
* PostgreSQL installed locally or a cloud instance
* Stripe Account (for API keys)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/daePolska-app.git
cd daePolska-app
```
### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following credentials. **Do not commit this file to GitHub.**

# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_NAME=daepolska_db
DB_PORT=5432

# Stripe Configuration (Use pk_test_... for local development)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Email Configuration (Gmail/Outlook with App Password)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password

# Server Config
PORT=3000

### 4. Database Setup

Run the following SQL commands (using pgAdmin or psql) to create the necessary tables:
```bash
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    listing_url TEXT,
    vehicle_location VARCHAR(150),
    package_type VARCHAR(50),
    price DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending',
    stripe_payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
### 5. Run the Application
```bash
node server.js
```

The server will start at `http://localhost:3000`.

## 🔒 Security Measures Implemented

* **Parameterized Queries:** Prevents SQL Injection attacks by separating SQL code from data.
* **Rate Limiting:** Limits repeated requests to public APIs (e.g., max 5 contact requests/hour per IP) to prevent spam and brute-force.
* **Helmet:** Sets secure HTTP headers. CSP (Content Security Policy) is configured to allow external scripts like Stripe & Tailwind CDN.
* **Environment Variables:** Sensitive keys (Database passwords, Stripe secrets) are stored in `.env` and never committed to the repository.

## 🌍 Deployment (Render.com)

This project is configured for deployment on **Render**.

1.  Create a new **Web Service** connected to this repository.
2.  Create a **PostgreSQL** database on Render (in the same region).
3.  Add all variables from your `.env` file to Render's **Environment Variables** settings.
4.  **Important:** Change `STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY` to **Live (Production)** keys in Render dashboard.
5.  Update `public/script.js` (if not fetching from backend) to use the Live Public Key before final push.

---

&copy; 2025 daePoland. All rights reserved.