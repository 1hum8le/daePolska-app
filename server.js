require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Wymagane do logowania!
const path = require('path');       // Wymagane do ścieżek plików!

// Import szablonów e-mail
const { getAdminEmailText, getClientEmailText } = require('./emailTemplates');

const app = express();
// Ustawienie proxy dla Rendera (wymagane dla rate limitera)
app.set('trust proxy', 1); 
const PORT = process.env.PORT || 3000;

// --- 1. MIDDLEWARE I BEZPIECZEŃSTWO ---
app.use(helmet({ 
    contentSecurityPolicy: false, 
    crossOriginEmbedderPolicy: false 
}));
app.use(cors());
app.use(express.json());

// WAŻNE: Pliki statyczne (HTML, CSS, JS) muszą być obsłużone PIERWSZE
// Dzięki temu wejście na /style.css nie jest traktowane jako język /style
app.use(express.static(path.join(__dirname, 'public')));

// Limity zapytań (Anty-DDOS / Spam)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });

// --- 2. BAZA DANYCH ---
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL 
    ? process.env.DATABASE_URL 
    : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// --- 3. KONFIGURACJA JWT (ADMIN) ---
const JWT_SECRET = process.env.JWT_SECRET || 'tymczasowy_sekret_zmien_w_env';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// --- 4. FUNKCJA EMAIL (BREVO) ---
async function sendEmail(to, subject, textContent, replyToEmail = null) {
    const url = 'https://api.brevo.com/v3/smtp/email';
    const senderEmail = process.env.EMAIL_USER; 

    const body = {
        sender: { name: 'daePoland', email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        textContent: textContent
    };

    if (replyToEmail) body.replyTo = { email: replyToEmail };

    try {
        console.log(`📨 Wysyłanie emaila do: ${to}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Błąd Brevo API:", JSON.stringify(errorData));
        } else {
            console.log(`✅ Email wysłany (200 OK)`);
        }
    } catch (error) {
        console.error("❌ Błąd sieci (Fetch):", error);
    }
}

// --- 5. ENDPOINTY API ---

// Płatność Stripe
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: { enabled: true },
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (e) {
        console.error("Stripe Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// Zamówienie (Baza + Emaile)
app.post('/api/orders', async (req, res) => {
    const { name, email, phone, url, location, packageType, price, paymentId } = req.body;
    try {
        const newOrder = await pool.query(
            "INSERT INTO orders (client_name, email, phone, listing_url, vehicle_location, package_type, price, status, stripe_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8) RETURNING *",
            [name, email, phone, url, location, packageType, price, paymentId]
        );

        const adminText = getAdminEmailText({ name, email, phone, url, location, packageType, price, paymentId });
        const clientText = getClientEmailText({ name, orderId: newOrder.rows[0].id, packageType, url, location });

        // Email do Admina
        sendEmail(process.env.EMAIL_USER, `💰 NOWE ZLECENIE: ${packageType} - ${name}`, adminText);
        // Email do Klienta
        sendEmail(email, `Potwierdzenie zamówienia #${newOrder.rows[0].id} - daePoland`, clientText);

        res.json(newOrder.rows[0]);
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).send("Server Error");
    }
});

// Kontakt (Formularz)
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await pool.query(
            "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
            [name, email, message]
        );
        
        await sendEmail(
            process.env.EMAIL_USER, 
            `📩 WIADOMOŚĆ ZE STRONY: ${name}`, 
            `Od: ${name} (${email})\n\n${message}`,
            email
        );

        res.json({ status: 'success' });
    } catch (err) {
        console.error("Contact Error:", err);
        res.status(500).send("Server Error");
    }
});

// Admin Logowanie (JWT)
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) return res.status(401).json({ error: "Błędny login lub hasło" });
        
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).json({ error: "Błędny login lub hasło" });
        
        const token = jwt.sign({ id: user.rows[0].id, role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token }); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Admin Dane (Chronione)
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100");
        res.json(result.rows);
    } catch (err) { res.status(500).send("DB Error"); }
});

app.get('/api/admin/messages', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 100");
        res.json(result.rows);
    } catch (err) { res.status(500).send("DB Error"); }
});

// --- 6. ROUTING STRONY (JĘZYKI I NARZĘDZIA) ---

// Bezpośrednie linki do narzędzi (bez .html)
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/generator', (req, res) => res.sendFile(path.join(__dirname, 'public', 'generator.html')));
// Opcjonalnie: wersje językowe generatora
app.get('/generator-en', (req, res) => res.sendFile(path.join(__dirname, 'public', 'generator_en.html')));
app.get('/generator-nl', (req, res) => res.sendFile(path.join(__dirname, 'public', 'generator_nl.html')));

// Routing Językowy (/pl, /en, /nl)
const supportedLanguages = ['pl', 'en', 'nl', 'fr', 'es'];

app.get('/:lang', (req, res, next) => {
    const lang = req.params.lang;
    // Sprawdzamy czy to faktycznie język, a nie np. błędny plik
    if (supportedLanguages.includes(lang)) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        next(); // Jeśli to nie język, przekaż dalej (np. 404)
    }
});

// Strona główna (Root)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- START SERWERA ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});