require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Pool } = require('pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Import szablonów
const { getAdminEmailText, getClientEmailText } = require('./emailTemplates');

const app = express();
app.set('trust proxy', 1); // Wymagane na Renderze do poprawnego działania Rate Limitera
const PORT = process.env.PORT || 3000;

// --- DANE SEO (TŁUMACZENIA METATAGÓW) ---
const META_DATA = {
    pl: {
        title: "daePoland | Profesjonalne Inspekcje Pojazdów",
        desc: "Kupujesz auto w Belgii, Holandii lub Niemczech? Zleć profesjonalną inspekcję przed zakupem. Sprawdzamy lakier, silnik i elektronikę. Raport nawet do 24h.",
        ogTitle: "daePoland | Nie kupuj kota w worku! Profesjonalne Inspekcje Aut",
        ogDesc: "Sprawdzamy auta w Belgii, Holandii i Niemczech. Oszczędź czas i pieniądze. Pełny raport techniczny, zdjęcia i wideo w 24h. Zamów online."
    },
    en: {
        title: "daePoland | Professional Vehicle Inspections",
        desc: "Buying a car in Belgium, Netherlands or Germany? Order a professional pre-purchase inspection. We check paint, engine, and electronics. Report within 24h.",
        ogTitle: "daePoland | Don't buy a lemon! Professional Car Inspections",
        ogDesc: "We check cars in Belgium, Netherlands and Germany. Save time and money. Full technical report, photos and video in 24h. Order online."
    },
    nl: {
        title: "daePoland | Professionele Voertuiginspecties",
        desc: "Auto kopen in België, Nederland of Duitsland? Bestel een professionele aankoopkeuring. Wij controleren lak, motor en elektronica. Rapport binnen 24u.",
        ogTitle: "daePoland | Koop geen kat in de zak! Professionele Auto Inspecties",
        ogDesc: "Wij controleren auto's in België, Nederland en Duitsland. Bespaar tijd en geld. Volledig technisch rapport, foto's en video in 24u. Bestel online."
    },
    fr: {
        title: "daePoland | Inspection Automobile Professionnelle",
        desc: "Vous achetez une voiture en Belgique, aux Pays-Bas ou en Allemagne? Commandez une inspection professionnelle. Nous vérifions la peinture, le moteur et l'électronique.",
        ogTitle: "daePoland | N'achetez pas les yeux fermés! Inspection Pro",
        ogDesc: "Nous vérifions les voitures en Belgique, aux Pays-Bas et en Allemagne. Économisez du temps et de l'argent. Rapport complet en 24h."
    },
    es: {
        title: "daePoland | Inspección Profesional de Vehículos",
        desc: "¿Compras un coche en Bélgica, Holanda o Alemania? Solicita una inspección profesional. Revisamos pintura, motor y electrónica.",
        ogTitle: "daePoland | ¡No compres a ciegas! Inspección Profesional",
        ogDesc: "Revisamos coches en Bélgica, Holanda y Alemania. Ahorra tiempo y dinero. Informe técnico completo en 24h."
    }
};

// --- 1. BEZPIECZEŃSTWO I MIDDLEWARE ---

// Helmet: Nagłówki bezpieczeństwa HTTP (Ochrona przed XSS, Sniffing)
app.use(helmet({ 
    contentSecurityPolicy: false, // Wyłączamy CSP bo używasz zewnętrznych skryptów (Stripe, Tailwind)
    crossOriginEmbedderPolicy: false 
}));

// CORS: Pozwala przeglądarce łączyć się z Twoim API
app.use(cors({
    origin: ['https://daepoland.com', 'https://www.daepoland.com'], // Dozwolone Domeny 
    methods: ['GET', 'POST',]
}));

// Ochrona przed atakami DoS (zbyt duże zapytania)
app.use(express.json({ limit: '10kb' })); 

// Rate Limiter: Ochrona przed spamem i brute-force
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }); // 100 zapytań na 15 min
app.use(limiter);

const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 }); // 5 maili na godzinę z jednego IP

// --- 2. PLIKI STATYCZNE (Muszą być przed routingiem językowym) ---
app.use(express.static(path.join(__dirname, 'public')));

// --- 3. BAZA DANYCH (PostgreSQL) ---
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL 
    ? process.env.DATABASE_URL 
    : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// --- 4. JWT AUTH (Ochrona Admina) ---
const JWT_SECRET = process.env.JWT_SECRET;
if (!process.env.JWT_SECRET) {
    throw new Error("FATAL: Brak JWT_SECRET. Serwer zatrzymany.");
} // Blokada startu bez JWT_SECRET

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401); // Brak dostępu

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token sfałszowany/wygasł
        req.user = user;
        next();
    });
}

// --- 5. OBSŁUGA MAILI (Brevo API) ---
async function sendEmail(to, subject, textContent, replyToEmail = null) {
    const url = 'https://api.brevo.com/v3/smtp/email';
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
        await fetch(url, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        });
    } catch (error) {
        console.error("❌ Błąd wysyłki maila:", error);
    }
}

// --- 6. ENDPOINTY API ---

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

// Nowe Zamówienie
app.post('/api/orders', async (req, res) => {
    // SQL Injection Protection: Używamy parametrów $1, $2...
    const { name, email, phone, url, location, packageType, price, paymentId } = req.body;
    
    try {
        const newOrder = await pool.query(
            "INSERT INTO orders (client_name, email, phone, listing_url, vehicle_location, package_type, price, status, stripe_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8) RETURNING *",
            [name, email, phone, url, location, packageType, price, paymentId]
        );

        const adminText = getAdminEmailText(req.body);
        const clientText = getClientEmailText({ ...req.body, orderId: newOrder.rows[0].id });

        sendEmail(process.env.EMAIL_USER, `💰 NOWE ZLECENIE: ${packageType} - ${name}`, adminText);
        sendEmail(email, `Potwierdzenie zamówienia #${newOrder.rows[0].id} - daePoland`, clientText);

        res.json(newOrder.rows[0]);
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).send("Server Error");
    }
});

// Formularz Kontaktowy
app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await pool.query(
            "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
            [name, email, message]
        );
        
        await sendEmail(
            process.env.EMAIL_USER, 
            `📩 WIADOMOŚĆ: ${name}`, 
            `Od: ${name} (${email})\n\n${message}`,
            email
        );

        res.json({ status: 'success' });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// Logowanie Admina (Jedyny poprawny endpoint)
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // 1. Sprawdź usera
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) return res.status(401).json({ error: "Błędne dane" });
        
        // 2. Sprawdź hash hasła (Bcrypt)
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).json({ error: "Błędne dane" });
        
        // 3. Wygeneruj token
        const token = jwt.sign({ id: user.rows[0].id, role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token }); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Pobieranie Danych (Chronione Tokenem)
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

// --- 7. ROUTING I NARZĘDZIA ---

app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/generator', (req, res) => res.sendFile(path.join(__dirname, 'public', 'generator.html')));
app.get('/generator-en', (req, res) => res.sendFile(path.join(__dirname, 'public', 'generator_en.html')));
app.get('/generator-nl', (req, res) => res.sendFile(path.join(__dirname, 'public', 'generator_nl.html')));

const supportedLanguages = ['pl', 'en', 'nl', 'fr', 'es'];

// Server-Side Injection dla SEO (Podmiana metatagów)
app.get('/:lang', (req, res, next) => {
    const lang = req.params.lang;

    if (supportedLanguages.includes(lang)) {
        const filePath = path.join(__dirname, 'public', 'index.html');
        
        fs.readFile(filePath, 'utf8', (err, htmlData) => {
            if (err) return next();

            // Jeśli PL, wysyłamy bez zmian (bo plik jest domyślnie po polsku)
            if (lang === 'pl') {
                return res.send(htmlData);
            }

            const data = META_DATA[lang];
            if (!data) return res.send(htmlData); 

            // PODMIANA METATAGÓW
            let result = htmlData.replace('<html lang="pl">', `<html lang="${lang}">`);
            
            result = result.replace(
                '<title>daePoland | Profesjonalne Inspekcje Pojazdów</title>', 
                `<title>${data.title}</title>`
            );

            result = result.replace(
                'content="Kupujesz auto w Belgii, Holandii lub Niemczech? Zleć profesjonalną inspekcję przed zakupem. Sprawdzamy lakier, silnik i elektronikę. Raport nawet do 24h."',
                `content="${data.desc}"`
            );

            result = result.replace(
                'content="daePoland | Nie kupuj kota w worku! Profesjonalne Inspekcje Aut"',
                `content="${data.ogTitle}"`
            );

            result = result.replace(
                'content="Sprawdzamy auta w Belgii, Holandii i Niemczech. Oszczędź czas i pieniądze. Pełny raport techniczny, zdjęcia i wideo w 24h. Zamów online."',
                `content="${data.ogDesc}"`
            );

            res.send(result);
        });
    } else {
        // To nie jest kod języka, więc to pewnie API lub 404
        next();
    }
});

// Fallback dla strony głównej
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- START SERWERA ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});