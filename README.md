# 🚗 daePoland - Vehicle Inspection Platform

**daePoland** (Diagnostic Auto Export) is a comprehensive web platform designed to connect car buyers from Poland with professional vehicle inspectors in Belgium, the Netherlands, and Germany. The application facilitates the booking process, secure payments, and automated communication between the client and the business.

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-Proprietary-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

## 🌟 Key Features

### Frontend (Client Side)
* **🌍 Multi-Language Support:** Native Polish (PL) interface with dynamic switching to English (EN), Dutch (NL), French (FR), and Spanish (ES) using ES6 Modules.
* **📱 Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop using **Tailwind CSS** with a "Mobile First" approach.
* **🎨 Modern UI:** Glassmorphism aesthetics, video background with loading optimization, and smooth scroll-snap navigation.
* **✨ Interactive Forms:** Real-time validation, dynamic price calculation based on selected packages.
* **✅ Success Page:** Dynamic post-purchase page generating a summary receipt based on URL parameters.

### Backend (Server Side)
* **💳 Secure Payments:** Full integration with **Stripe API** (Payment Intents & secure card processing).
* **🗄️ Database:** **PostgreSQL** integration to store Orders, Users, and Contact Messages.
* **📧 Email Automation:** **Nodemailer** integration (Gmail SMTP via secure IPv4) sending automatic HTML confirmations to clients and admins.
* **🛡️ Security:** Implemented **Helmet.js** (secure headers with CSP config), **Rate Limiting** (DDoS protection), and **Trust Proxy** config.
* **🔌 API:** RESTful endpoints for handling contact forms and order processing.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript (ES6 Modules).
* **Backend:** Node.js, Express.js.
* **Database:** PostgreSQL (Hosted on Render).
* **Payment Gateway:** Stripe.
* **Email Service:** Nodemailer (SMTP via Gmail App Password). 
* **Deployment:** Render.com (Web Service + Managed PostgreSQL).

## 📂 Project Structure

```
daePolska-app/
├── public/               # Static files served by Express
│   ├── src/              # Assets (videos, images, favicon)
│   ├── index.html        # Main landing page
│   ├── success.html      # Order confirmation page
│   ├── style.css         # Custom styles (Glassmorphism, Animations)
│   ├── script.js         # Main frontend logic (Stripe, Lang, Forms)
│   ├── success.js        # Success page logic & rendering
│   ├── translations.js   # Language dictionaries (PL/EN/NL/FR/ES)
│   └── report_templates/ # HTML templates for PDF generation
├── .env                  # Environment variables (Excluded from Repo)
├── database.sql          # SQL schema for database creation
├── emailTemplates.js     # HTML Email templates for Nodemailer
├── server.js             # Main backend application entry point
├── package.json          # Project dependencies
└── README.md             # Documentation
```

## 🚀 Installation & Setup

### Prerequisites
* Node.js (v16 or higher)
* PostgreSQL installed locally or a cloud instance
* Stripe Account (for API keys)

### 1. Clone the repository
```bash
git clone [https://github.com/1hum8le/daePolska-app.git](https://github.com/1hum8le/daePolska-app.git)
cd daePolska-app
````

### 2\. Install dependencies

```bash
npm install
```

### 3\. Configure Environment Variables

Create a `.env` file in the root directory and add the following credentials. **Do not commit this file to GitHub.**

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_NAME=daepolska_db
DB_PORT=5432

# Stripe Configuration (Use pk_test_... for local development)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Email Configuration (Gmail App Password Required)
EMAIL_USER=daePoland.kontakt@gmail.com
EMAIL_PASS=your_16_char_app_password

# Server Config
PORT=3000
```

### 4\. Database Setup

Run the following SQL commands (using pgAdmin or psql) to create the necessary tables:

```sql
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

### 5\. Run the Application

```bash
node server.js
```

The server will start at `http://localhost:3000`.

## 🔌 API Endpoints

| Method | Endpoint | Description | Body Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/create-payment-intent` | Creates Stripe Intent | `{ amount, currency }` |
| `POST` | `/api/orders` | Saves order & sends email | `{ name, email, phone, url, location, packageType, price, paymentId }` |
| `POST` | `/api/contact` | Sends contact msg | `{ name, email, message }` |

## 🔧 Troubleshooting

  * **Email Error (ETIMEDOUT):**
      * Ensure `EMAIL_PASS` is an **App Password** (not login password).
      * Ensure `server.js` uses `family: 4` in Nodemailer config to force IPv4.
      * Check if Render firewall is blocking SMTP ports (use port 587 or 465).
  * **Database Connection Error:**
      * Verify `DATABASE_URL` in Render Environment Variables.
      * Ensure the IP is allowed (or use Internal Connection string).
  * **Static Files Not Loading:**
      * Check `app.use(express.static('public'))` in `server.js`.
      * Verify file paths in HTML (e.g., `/src/favicon.png`).

## 🔒 Security Measures Implemented

  * **Parameterized Queries:** Prevents SQL Injection attacks.
  * **Rate Limiting:** Limits public API requests (e.g., max 5 contact requests/hour).
  * **Helmet:** Sets secure HTTP headers. CSP configured for Stripe & Tailwind.
  * **Environment Variables:** Sensitive keys stored in `.env`.

## 🌍 Deployment (Render.com)

This project is configured for deployment on **Render**.

1.  Create a new **Web Service** connected to this repository.
2.  Create a **PostgreSQL** database on Render (same region).
3.  Add all variables from `.env` to Render's **Environment Variables**.
4.  **Important:** Change Stripe keys to **Live (Production)** before launch.
5.  Update `script.js` with Live Publishable Key.

-----

## 📅 Roadmap (v2.0 Plans)

  * [ ] Admin Dashboard for order management.
  * [ ] Automated PDF generation from the web form.
  * [ ] WhatsApp API integration for notifications.

-----

© 2025 daePoland. All rights reserved.

```
```