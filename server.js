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
// Ustawienie proxy dla Rendera (ważne dla rate limitera)
app.set('trust proxy', 1); 
const PORT = process.env.PORT || 3000;

// --- FUNKCJA WYSYŁAJĄCA (BREVO API - HTTP FETCH) ---
async function sendEmail(to, subject, textContent, replyToEmail = null) {
    const url = 'https://api.brevo.com/v3/smtp/email';
    
    // Nadawca: Twój Gmail (Musi być zweryfikowany w Brevo -> Senders)
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
                'api-key': process.env.BREVO_API_KEY, // Klucz xkeysib...
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Błąd Brevo API:", JSON.stringify(errorData, null, 2));
        } else {
            console.log(`✅ Email wysłany poprawnie (HTTP 200) do: ${to}`);
        }
    } catch (error) {
        console.error("❌ Błąd połączenia sieciowego (Fetch):", error);
    }
}

// --- BCRYPT DO HASŁA ADMINA ---
const bcrypt = require('bcrypt');


// --- JSON WEB TOKENY (JWT) ---
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// --- MIDDLEWARE SPRAWDZAJĄCY CZY TO ADMIN ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) return res.sendStatus(401); // Brak przepustki

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Zła przepustka
        req.user = user;
        next(); // Wchodzisz!
    });
}

// --- API DLA ADMINA (CHRONIONE) ---

// 1. Logowanie (Generuje token)
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) return res.status(401).json({ error: "Błędny login" });
        
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).json({ error: "Błędne hasło" });
        
        // Generuj token ważny 1 godzinę
        const token = jwt.sign({ id: user.rows[0].id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token }); 
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// 2. Pobierz Zamówienia (Wymaga tokenu)
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
    try {
        // Pobierz 50 ostatnich zamówień
        const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 50");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Błąd bazy");
    }
});

// 3. Pobierz Wiadomości (Wymaga tokenu)
app.get('/api/admin/messages', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 50");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Błąd bazy");
    }
});


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

// 1. Płatność Stripe (Payment Element - BLIK, Bancontact, Apple Pay)
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            // To magiczna linijka: włącza BLIK, Bancontact, Klarnę itd.
            // (pod warunkiem, że włączyłeś je w Stripe Dashboard)
            automatic_payment_methods: { enabled: true },
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (e) {
        console.error("Stripe Error:", e);
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

        // 2. Generuj treści z szablonów
        const adminText = getAdminEmailText({ name, email, phone, url, location, packageType, price, paymentId });
        const clientText = getClientEmailText({ name, orderId: newOrder.rows[0].id, packageType, url, location });

        // 3. Wyślij przez API (w tle)
        // Mail do Ciebie (na Gmaila)
        sendEmail(process.env.EMAIL_USER, `💰 NOWE ZLECENIE: ${packageType} - ${name}`, adminText);
        
        // Mail do Klienta (Potwierdzenie)
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

        // Wysyłka przez API do Ciebie
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