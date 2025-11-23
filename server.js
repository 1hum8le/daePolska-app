require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); // <--- NOWOŚĆ

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// --- KONFIGURACJA EMAIL (OUTLOOK / OFFICE 365) ---
const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // Dla kont prywatnych (@outlook, @hotmail)
    // Jeśli masz konto firmowe (Office 365), użyj: "smtp.office365.com"
    port: 587,
    secure: false, // false dla portu 587 (STARTTLS)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        ciphers: 'SSLv3' // Wymagane przez Outlooka
    }
});

// --- ZABEZPIECZENIA ---
// Zabezpieczenia nagłówków (Z wyłączonym CSP dla Tailwinda i Stripe)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, max: 5,
    message: "Za dużo wiadomości. Spróbuj później."
});

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- BAZA DANYCH (Obsługa Produkcji SSL) ---
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL 
    ? process.env.DATABASE_URL 
    : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// --- ENDPOINTY ---

// 1. Płatność Stripe
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 2. Zapis Zamówienia + WYSYŁKA EMAILA
app.post('/api/orders', async (req, res) => {
    const { name, email, phone, url, location, packageType, price, paymentId } = req.body;
    
    try {
        // A. Zapisz w bazie
        const newOrder = await pool.query(
            "INSERT INTO orders (client_name, email, phone, listing_url, vehicle_location, package_type, price, status, stripe_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8) RETURNING *",
            [name, email, phone, url, location, packageType, price, paymentId]
        );

        // B. Wyślij Email do CIEBIE (Admina)
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Wysyłasz sam do siebie
            subject: `💰 NOWE ZLECENIE: ${packageType} - ${name}`,
            text: `
                Nowe zamówienie opłacone!
                Klient: ${name}
                Email: ${email}
                Telefon: ${phone}
                Auto: ${url}
                Lokalizacja: ${location}
                Pakiet: ${packageType}
                Kwota: ${price}
                Stripe ID: ${paymentId}
            `
        };
        
        // C. Wyślij Email do KLIENTA
        const clientMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Potwierdzenie zamówienia - daePolska',
            text: `
                Dzień dobry ${name}!
                
                Dziękujemy za opłacenie zamówienia na inspekcję pojazdu.
                Twój numer zamówienia to: #${newOrder.rows[0].id}
                
                Nasz koordynator skontaktuje się ze sprzedawcą auta w ciągu 24h i potwierdzi termin inspekcji.
                
                Szczegóły:
                Pakiet: ${packageType}
                Link do auta: ${url}
                
                Pozdrawiamy,
                Zespół daePolska
            `
        };

        // Wysyłamy maile w tle (nie blokujemy odpowiedzi)
        transporter.sendMail(adminMailOptions).catch(err => console.error("Błąd email admina:", err));
        transporter.sendMail(clientMailOptions).catch(err => console.error("Błąd email klienta:", err));

        res.json(newOrder.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 3. Formularz Kontaktowy + EMAIL
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, message } = req.body;
    try {
        // Zapisz w bazie
        await pool.query(
            "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
            [name, email, message]
        );

        // Wyślij powiadomienie do Ciebie
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `📩 NOWA WIADOMOŚĆ od ${name}`,
            text: `Od: ${name} (${email})\n\nWiadomość:\n${message}`
        });

        res.json({ status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// 4. Admin Login
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