require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const app = express();

// 1. Konfiguracja Proxy (Kluczowe dla Render.com, aby rate limiter działał poprawnie)
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;

// --- KONFIGURACJA EMAIL (BREVO SMTP) ---
// Używamy Brevo, aby ominąć blokady Microsoftu/Gmaila na serwerach w chmurze
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // false dla portu 587 (STARTTLS)
    auth: {
        user: process.env.EMAIL_USER, // Twój login Brevo
        pass: process.env.EMAIL_PASS  // Twój KLUCZ SMTP (nie hasło do poczty!)
    },
    tls: {
        rejectUnauthorized: false
    }
});

// --- ZABEZPIECZENIA ---
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));

const limiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, 
    max: 100 
});
app.use(limiter);

const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 5,
    message: "Za dużo wiadomości. Spróbuj później."
});

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

// 1. Płatność Stripe (Tworzenie intencji)
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (e) {
        console.error("Stripe Error:", e);
        res.status(500).json({ error: e.message });
    }
});

// 2. Zapis Zamówienia + WYSYŁKA EMAILA (Główna logika)
app.post('/api/orders', async (req, res) => {
    const { name, email, phone, url, location, packageType, price, paymentId } = req.body;
    
    try {
        // A. Zapisz w bazie danych
        const newOrder = await pool.query(
            "INSERT INTO orders (client_name, email, phone, listing_url, vehicle_location, package_type, price, status, stripe_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8) RETURNING *",
            [name, email, phone, url, location, packageType, price, paymentId]
        );

        const orderId = newOrder.rows[0].id;

        // B. Treść Emaila dla ADMINA (Ciebie)
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Wysyłasz do siebie
            subject: `💰 NOWE ZLECENIE: ${packageType} - ${name}`,
            text: `
=========================================
 NOWE ZAMÓWIENIE OPŁACONE
=========================================

DANE KLIENTA:
👤 Imię i nazwisko: ${name}
📧 Email: ${email}
📞 Telefon: ${phone || "Nie podano"}

SZCZEGÓŁY ZLECENIA:
📦 Pakiet: ${packageType}
💰 Kwota: ${price}
🆔 ID Płatności: ${paymentId}

DANE POJAZDU:
📍 Lokalizacja: ${location}
🚗 Link: ${url}

-----------------------------------------
Zaloguj się do bazy lub Stripe, aby sprawdzić szczegóły.
`
        };
        
        // C. Treść Emaila dla KLIENTA (Ładnie sformatowana)
        const clientMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Potwierdzenie zamówienia #${orderId} - daePoland 🚗`,
            text: `
Dzień dobry ${name}!

Dziękujemy za opłacenie zamówienia na inspekcję pojazdu.
Twój numer zamówienia to: #${orderId}

Co dzieje się teraz?
1. Nasz koordynator skontaktuje się ze sprzedawcą auta (zazwyczaj w ciągu 24h).
2. Potwierdzimy dostępność samochodu.
3. Ustalimy termin inspekcji i poinformujemy Cię mailowo.

SZCZEGÓŁY ZAMÓWIENIA:
--------------------------------------------------
📦 Pakiet: ${packageType}
🚗 Link do auta: ${url}
📍 Lokalizacja: ${location}
--------------------------------------------------

Ważne informacje:
Jest to wiadomość automatyczna - prosimy na nią nie odpowiadać bezpośrednio.
W razie pytań prosimy o kontakt poprzez formularz na stronie lub bezpośrednio na email biura.

Dziękujemy za zaufanie!

Pozdrawiamy,
Zespół daePoland

--
Email: info@daepoland.com
Strona: https://daepoland.com
            `
        };

        // Wysyłamy maile w tle (bez await, żeby nie blokować odpowiedzi serwera)
        transporter.sendMail(adminMailOptions).catch(err => console.error("Błąd wysyłki do Admina:", err));
        transporter.sendMail(clientMailOptions).catch(err => console.error("Błąd wysyłki do Klienta:", err));

        // Zwracamy sukces do frontendu
        res.json(newOrder.rows[0]);

    } catch (err) {
        console.error("Błąd bazy danych (Orders):", err.message);
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
            replyTo: email, // Abyś mógł kliknąć "Odpowiedz" i pisać do klienta
            subject: `📩 WIADOMOŚĆ ZE STRONY od: ${name}`,
            text: `Masz nowe zapytanie ze strony:\n\nOd: ${name} (${email})\n\nTreść wiadomości:\n${message}`
        });

        res.json({ status: 'success' });
    } catch (err) {
        console.error("Błąd kontaktu:", err);
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});