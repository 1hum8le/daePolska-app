require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serwuje pliki statyczne (HTML, CSS, JS)

// Konfiguracja Bazy Danych
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// --- ENDPOINTY API ---

// 1. Utworzenie intencji płatności (Stripe)
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. Zapisanie zamówienia po płatności
app.post('/api/orders', async (req, res) => {
    const { name, email, phone, url, location, packageType, price, paymentId } = req.body;
    try {
        const newOrder = await pool.query(
            "INSERT INTO orders (client_name, email, phone, listing_url, vehicle_location, package_type, price, status, stripe_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8) RETURNING *",
            [name, email, phone, url, location, packageType, price, paymentId]
        );
        res.json(newOrder.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 3. Formularz kontaktowy
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await pool.query(
            "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
            [name, email, message]
        );
        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 4. Logowanie Admina (proste)
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) return res.status(401).json("Invalid Credential");

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).json("Invalid Credential");

        res.json({ status: 'logged_in' }); 
        // W produkcji tutaj generujemy JWT token!
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 5. Pobieranie zamówień (Dla Admina)
app.get('/api/admin/orders', async (req, res) => {
    // Tutaj powinieneś sprawdzać token autoryzacyjny
    try {
        const allOrders = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
        res.json(allOrders.rows);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});