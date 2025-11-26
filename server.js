require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Import szablonów
const { getAdminEmailText, getClientEmailText } = require('./emailTemplates');

const app = express();
app.set('trust proxy', 1); 
const PORT = process.env.PORT || 3000;

// --- FUNKCJA WYSYŁAJĄCA (BREVO API - HTTP) ---
// To omija blokady portów SMTP, bo działa jak przeglądanie strony www
async function sendEmail(to, subject, textContent, replyToEmail = null) {
    const url = 'https://api.brevo.com/v3/smtp/email';
    
    // Adres nadawcy (Musi być zweryfikowany w Brevo -> Senders)
    const senderEmail = process.env.EMAIL_USER; 

    const body = {
        sender: { name: 'daePoland', email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        textContent: textContent
    };

    if (replyToEmail) {
        body.replyTo = { email: replyToEmail };
    }

    try {
        console.log(`Próba wysyłki API do: ${to}`);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY, // Tu musi być klucz xkeysib...
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            // Jeśli API zwróci błąd, wypisz go w logach
            const errorData = await response.json();
            console.error("❌ Błąd Brevo API:", JSON.stringify(errorData, null, 2));
        } else {
            console.log(`✅ Email wysłany poprawnie (HTTP 200) do: ${to}`);
        }
    } catch (error) {
        console.error("❌ Błąd połączenia sieciowego (Fetch):", error);
    }
}

// --- ZABEZPIECZENIA ---
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });

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

// API ZAMÓWIENIA (ZAPIS + EMAIL)
app.post('/api/orders', async (req, res) => {
    const { name, email, phone, url, location, packageType, price, paymentId } = req.body;
    
    try {
        // 1. Zapisz w bazie
        const newOrder = await pool.query(
            "INSERT INTO orders (client_name, email, phone, listing_url, vehicle_location, package_type, price, status, stripe_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8) RETURNING *",
            [name, email, phone, url, location, packageType, price, paymentId]
        );

        // 2. Generuj treści
        const adminText = getAdminEmailText({ name, email, phone, url, location, packageType, price, paymentId });
        const clientText = getClientEmailText({ name, orderId: newOrder.rows[0].id, packageType, url, location });

        // 3. Wyślij przez API (w tle)
        // Mail do Ciebie
        sendEmail(process.env.EMAIL_USER, `💰 NOWE ZLECENIE: ${packageType} - ${name}`, adminText);
        // Mail do Klienta
        sendEmail(email, `Potwierdzenie zamówienia #${newOrder.rows[0].id} - daePoland`, clientText);

        res.json(newOrder.rows[0]);
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).send("Server Error");
    }
});

// API KONTAKT (ZAPIS + EMAIL)
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, message } = req.body;
    try {
        // Baza
        await pool.query(
            "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
            [name, email, message]
        );

        // Wysyłka przez API
        await sendEmail(
            process.env.EMAIL_USER, // Do Ciebie
            `📩 WIADOMOŚĆ ZE STRONY: ${name}`, 
            `Od: ${name} (${email})\n\n${message}`,
            email // Reply-To ustawione na klienta
        );

        res.json({ status: 'success' });
    } catch (err) {
        console.error("Contact Error:", err);
        res.status(500).send("Server Error");
    }
});

app.post('/api/admin/login', async (req, res) => {
    // Logika logowania bez zmian...
    res.json({ status: 'logged_in' }); 
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});