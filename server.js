require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer'); // Wracamy do nodemailer

// Import szablonów
const { getAdminEmailText, getClientEmailText } = require('./emailTemplates');

const app = express();
app.set('trust proxy', 1); 
const PORT = process.env.PORT || 3000;

// --- KONFIGURACJA GMAIL (BYPASS FIREWALL) ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,              // Używamy 587 zamiast 465 (lepiej przechodzi przez chmury)
    secure: false,          // Musi być false dla portu 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false // Ignoruj błędy certyfikatów
    },
    family: 4, // <--- KLUCZOWE: Wymusza IPv4. Render + Gmail + IPv6 = Timeout.
    timeout: 5000 // 5 sekund timeout
});

// Adres nadawcy to Twój Gmail
const SENDER_EMAIL = process.env.EMAIL_USER;

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

app.post('/api/orders', async (req, res) => {
    const { name, email, phone, url, location, packageType, price, paymentId } = req.body;
    
    try {
        const newOrder = await pool.query(
            "INSERT INTO orders (client_name, email, phone, listing_url, vehicle_location, package_type, price, status, stripe_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8) RETURNING *",
            [name, email, phone, url, location, packageType, price, paymentId]
        );

        const adminText = getAdminEmailText({ name, email, phone, url, location, packageType, price, paymentId });
        const clientText = getClientEmailText({ name, orderId: newOrder.rows[0].id, packageType, url, location });

        // WYSYŁKA GMAIL (SMTP)
        const adminMailOptions = {
            from: SENDER_EMAIL,
            to: SENDER_EMAIL, // Do Ciebie
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
        console.error("DB Error:", err);
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

        // WYSYŁKA GMAIL (SMTP)
        await transporter.sendMail({
            from: SENDER_EMAIL,
            to: SENDER_EMAIL, 
            replyTo: email,
            subject: `📩 WIADOMOŚĆ ZE STRONY: ${name}`,
            text: `Od: ${name} (${email})\n\n${message}`
        });

        res.json({ status: 'success' });
    } catch (err) {
        console.error("SMTP Error:", err);
        res.status(500).send("Server Error");
    }
});

app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) return res.status(401).json("Invalid Credential");
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).json("Invalid Credential");
        res.json({ status: 'logged_in' }); 
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});