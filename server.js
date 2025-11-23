require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

// Import szablonów
const { getAdminEmailText, getClientEmailText } = require('./emailTemplates');

const app = express();
app.set('trust proxy', 1); 
const PORT = process.env.PORT || 3000;

// --- KONFIGURACJA EMAIL (GMAIL - SZTYWNA) ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Konkretny adres serwera
    port: 465,              // Port SSL
    secure: true,           // Wymagane dla portu 465
    auth: {
        user: process.env.EMAIL_USER, // Twój nowy gmail
        pass: process.env.EMAIL_PASS  // Hasło Aplikacji (16 znaków)
    },
    tls: {
        rejectUnauthorized: false
    },
    // --- TO JEST KLUCZ DO SUKCESU ---
    family: 4, // Wymusza IPv4 (Render domyślnie pcha IPv6 co powoduje błąd)
    connectionTimeout: 10000 // 10 sekund timeoutu
});

// Nadawca to ten sam Gmail (żeby uniknąć blokady antyspamowej)
const SENDER_EMAIL = process.env.EMAIL_USER; 

// --- ZABEZPIECZENIA ---
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: "Limit wiadomości." });

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- BAZA DANYCH ---
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL 
    ? process.env.DATABASE_URL 
    : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// --- ENDPOINTY ---

app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({ amount, currency });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/orders', async (req, res) => {
    const { name, email, phone, url, location, packageType, price, paymentId } = req.body;
    
    try {
        const newOrder = await pool.query(
            "INSERT INTO orders (client_name, email, phone, listing_url, vehicle_location, package_type, price, status, stripe_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8) RETURNING *",
            [name, email, phone, url, location, packageType, price, paymentId]
        );

        // Generowanie treści
        const adminText = getAdminEmailText({ name, email, phone, url, location, packageType, price, paymentId });
        const clientText = getClientEmailText({ name, orderId: newOrder.rows[0].id, packageType, url, location });

        // Wysyłka
        const adminMailOptions = {
            from: SENDER_EMAIL,
            to: SENDER_EMAIL, // Do Ciebie (na Gmaila)
            subject: `💰 NOWE ZLECENIE: ${packageType} - ${name}`,
            text: adminText
        };
        
        const clientMailOptions = {
            from: SENDER_EMAIL,
            to: email, // Do Klienta
            subject: `Potwierdzenie zamówienia #${newOrder.rows[0].id}`,
            text: clientText
        };

        transporter.sendMail(adminMailOptions).catch(console.error);
        transporter.sendMail(clientMailOptions).catch(console.error);

        res.json(newOrder.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await pool.query(
            "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
            [name, email, message]
        );

        await transporter.sendMail({
            from: SENDER_EMAIL,
            to: SENDER_EMAIL, // Do Ciebie
            replyTo: email,   // Żebyś mógł kliknąć "Odpowiedz"
            subject: `📩 WIADOMOŚĆ ZE STRONY: ${name}`,
            text: `Od: ${name} (${email})\n\n${message}`
        });

        res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.post('/api/admin/login', async (req, res) => {
    // ... (logika logowania bez zmian) ...
    res.json({ status: 'logged_in' }); 
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});