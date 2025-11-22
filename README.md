# daePolska - Vehicle Inspection Platform 🚗🔍

**daePolska** (Diagnostic Auto Export) is a modern web platform connecting car buyers from Poland with professional vehicle inspectors in Belgium, the Netherlands, and Germany. The application offers a seamless booking experience, secure payments, and multi-language support.

🌐 **Live Site:** [www.daePoland.com](https://www.daePoland.com) (Coming Soon)

## ✨ Key Features

* **🌍 Multi-Language Support:** Full interface available in Polish (PL), English (EN), and Dutch (NL).
* **💳 Secure Payments:** Integrated **Stripe** gateway for credit card, BLIK, and other payment methods.
* **📱 Responsive Design:** "Mobile-first" approach with glassmorphism UI and video backgrounds.
* **📄 Dynamic PDF Generation:** Built-in templates for generating professional inspection reports (HTML to PDF).
* **🛒 Tiered Pricing:** Interactive pricing table (Basic, Standard, Premium) with currency conversion (EUR/PLN).
* **✉️ Contact & Admin:** Contact form integration and backend database for order management.

## 🛠️ Tech Stack

* **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Payment Processing:** Stripe API
* **Hosting:** Render.com (Web Service + Managed PostgreSQL)

## 🚀 Local Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/daePolska-app.git](https://github.com/YOUR_USERNAME/daePolska-app.git)
    cd daePolska-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory and add your credentials:
    ```env
    DB_USER=your_postgres_user
    DB_PASSWORD=your_postgres_password
    DB_HOST=localhost
    DB_NAME=daepolska_db
    DB_PORT=5432
    STRIPE_SECRET_KEY=sk_test_...
    STRIPE_PUBLIC_KEY=pk_test_...
    PORT=3000
    ```

4.  **Database Initialization:**
    Run the SQL scripts provided in `database.sql` (or via pgAdmin) to create `users`, `orders`, and `messages` tables.

5.  **Run the server:**
    ```bash
    node server.js
    ```
    Visit `http://localhost:3000` in your browser.

## 📂 Project Structure

* `/public` - Static files (HTML, CSS, Client-side JS, Images, Videos).
* `server.js` - Main application entry point and API routes.
* `database.sql` - Database schema definitions.

## 📄 License

This project is proprietary software developed for **daePolska**.

---
*Built with ❤️ by daePolska Dev Team*