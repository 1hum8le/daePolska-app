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

// --- 0. AUDYT STARTOWY (CRASH IF INSECURE) ---
if (!process.env.JWT_SECRET) {
    console.error("🚨 CRITICAL: Brak JWT_SECRET! Serwer zatrzymany.");
    process.exit(1);
}
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("🚨 CRITICAL: Brak kluczy Stripe! Serwer zatrzymany.");
    process.exit(1);
}

// Import szablonów e-mail
const { getAdminEmailText, getClientEmailText } = require('./emailTemplates');

const app = express();
app.disable('x-powered-by'); // Security through obscurity
app.set('trust proxy', 1);   // Wymagane na Renderze
const PORT = process.env.PORT || 3000;

// --- DANE SEO ---
const META_DATA = {
    pl: {
        title: "daePoland | Profesjonalne Inspekcje Pojazdów",
        desc: "Kupujesz auto w Belgii, Holandii lub Niemczech? Zleć profesjonalną inspekcję przed zakupem. Raport w 24h.",
        ogTitle: "daePoland | Nie kupuj kota w worku!",
        ogDesc: "Sprawdzamy auta w Belgii, Holandii i Niemczech. Oszczędź czas i pieniądze. Pełny raport techniczny."
    },
    en: {
        title: "daePoland | Professional Vehicle Inspections",
        desc: "Buying a car in Belgium, Netherlands or Germany? Order a professional pre-purchase inspection. Report within 24h.",
        ogTitle: "daePoland | Don't buy a lemon!",
        ogDesc: "We check cars in Belgium, Netherlands and Germany. Save time and money. Full technical report."
    },
    nl: {
        title: "daePoland | Professionele Aankoopkeuring",
        desc: "Auto kopen in België, Nederland of Duitsland? Bestel een professionele aankoopkeuring. Rapport binnen 24u.",
        ogTitle: "daePoland | Koop geen kat in de zak!",
        ogDesc: "Wij controleren auto's in België, Nederland en Duitsland. Bespaar tijd en geld. Volledig technisch rapport."
    },
    fr: {
        title: "daePoland | Inspection Automobile Pro",
        desc: "Vous achetez une voiture en Belgique? Commandez une inspection professionnelle. Rapport complet en 24h.",
        ogTitle: "daePoland | N'achetez pas les yeux fermés!",
        ogDesc: "Nous vérifions les voitures en Belgique, aux Pays-Bas et en Allemagne. Économisez du temps et de l'argent."
    },
    es: {
        title: "daePoland | Inspección Profesional",
        desc: "¿Compras un coche en Bélgica o Alemania? Solicita una inspección profesional. Informe en 24h.",
        ogTitle: "daePoland | ¡No compres a ciegas!",
        ogDesc: "Revisamos coches en Bélgica, Holanda y Alemania. Ahorra tiempo y dinero. Informe técnico completo."
    }
};

// --- 1. BEZPIECZEŃSTWO I MIDDLEWARE ---

// CSP (Content Security Policy) - Whitelist
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://js.stripe.com", "https://cdn.tailwindcss.com"],
            styleSrc: ["'self'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https://upload.wikimedia.org", "https://*.stripe.com"],
            connectSrc: ["'self'", "https://api.stripe.com"],
            frameSrc: ["'self'", "https://js.stripe.com", "https://hooks.stripe.com"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// CORS - HYBRYDOWY (PRODUKCJA + TESTY)
const allowedOrigins = [
    'https://daepoland.com',              // Przyszła domena (główna)
    'https://www.daepoland.com',          // Przyszła domena (www)
    'https://daepoland-web.onrender.com', // Obecny hosting (Render)
    'http://localhost:3000',              // Lokalne testy
    'http://127.0.0.1:3000'               // Lokalne testy (alternatywa)
];

app.use(cors({
    origin: function (origin, callback) {
        // Pozwól na zapytania bez origin (np. Postman, server-to-server) lub z listy
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Zablokowano CORS dla:", origin); // Logowanie prób ataku
            callback(new Error('Błąd CORS: Niedozwolona domena.'));
        }
    },
    methods: ['GET', 'POST']
}));

app.use(express.json({ limit: '10kb' })); // Ochrona przed floodem

// Rate Limiters
const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }); 
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Za dużo prób logowania." }); 
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: "Za dużo wiadomości." }); 

app.use(globalLimiter);

// PLIKI STATYCZNE (Muszą być TU, przed routingiem)
app.use(express.static(path.join(__dirname, 'public')));

// --- 2. BAZA DANYCH ---
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL 
    ? process.env.DATABASE_URL 
    : `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// --- 3. JWT AUTH ---
const JWT_SECRET = process.env.JWT_SECRET; 

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

// --- 4. MAILING (Brevo) ---
async function sendEmail(to, subject, textContent, replyToEmail = null) {
    const url = 'https://api.brevo.com/v3/smtp/email';
    const body = {
        sender: { name: 'daePoland', email: process.env.EMAIL_USER },
        to: [{ email: to }],
        subject: subject,
        textContent: textContent
    };
    if (replyToEmail) body.replyTo = { email: replyToEmail };

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
    } catch (error) { console.error("Email Error:", error); }
}

// --- 5. ENDPOINTY ---

app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, currency, automatic_payment_methods: { enabled: true },
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/orders', async (req, res) => {
    const { name, email, phone, url, location, packageType, price, paymentId } = req.body;
    try {
        const newOrder = await pool.query(
            "INSERT INTO orders (client_name, email, phone, listing_url, vehicle_location, package_type, price, status, stripe_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8) RETURNING *",
            [name, email, phone, url, location, packageType, price, paymentId]
        );
        const adminText = getAdminEmailText(req.body);
        const clientText = getClientEmailText({ ...req.body, orderId: newOrder.rows[0].id });
        
        sendEmail(process.env.EMAIL_USER, `💰 NOWE ZLECENIE: ${packageType}`, adminText);
        sendEmail(email, `Potwierdzenie zamówienia #${newOrder.rows[0].id}`, clientText);
        res.json(newOrder.rows[0]);
    } catch (err) { res.status(500).send("Server Error"); }
});

app.post('/api/contact', contactLimiter, async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await pool.query("INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)", [name, email, message]);
        await sendEmail(process.env.EMAIL_USER, `📩 WIADOMOŚĆ: ${name}`, `Od: ${name} (${email})\n\n${message}`, email);
        res.json({ status: 'success' });
    } catch (err) { res.status(500).send("Server Error"); }
});

// LOGOWANIE ADMINA (Z authLimiter!)
app.post('/api/admin/login', authLimiter, async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) return res.status(401).json({ error: "Błędne dane" });
        
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).json({ error: "Błędne dane" });
        
        const token = jwt.sign({ id: user.rows[0].id, role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token }); 
    } catch (err) { res.status(500).send("Server Error"); }
});

// DANE ADMINA (Chronione)
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
    try { const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100"); res.json(result.rows); } 
    catch (err) { res.status(500).send("DB Error"); }
});
app.get('/api/admin/messages', authenticateToken, async (req, res) => {
    try { const result = await pool.query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 100"); res.json(result.rows); } 
    catch (err) { res.status(500).send("DB Error"); }
});

// --- 6. ROUTING (Server-Side Injection) ---

// Narzędzia
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/generator', (req, res) => res.sendFile(path.join(__dirname, 'public', 'generator.html')));
app.get('/generator-en', (req, res) => res.sendFile(path.join(__dirname, 'public', 'generator_en.html')));
app.get('/generator-nl', (req, res) => res.sendFile(path.join(__dirname, 'public', 'generator_nl.html')));

const supportedLanguages = ['pl', 'en', 'nl', 'fr', 'es'];

app.get('/:lang', (req, res, next) => {
    const lang = req.params.lang;
    if (supportedLanguages.includes(lang)) {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, 'utf8', (err, htmlData) => {
            if (err) return next();
            if (lang === 'pl') return res.send(htmlData);

            const data = META_DATA[lang];
            if (!data) return res.send(htmlData);

            // Podmiana tagów dla SEO/Facebooka
            let result = htmlData.replace('<html lang="pl">', `<html lang="${lang}">`)
                .replace('<title>daePoland | Profesjonalne Inspekcje Pojazdów</title>', `<title>${data.title}</title>`)
                .replace(/content="Kupujesz auto w Belgii.*?Raport nawet do 24h\."/, `content="${data.desc}"`)
                .replace(/content="daePoland \| Nie kupuj kota.*?Inspekcje Aut"/, `content="${data.ogTitle}"`)
                .replace(/content="Sprawdzamy auta w Belgii.*?Zamów online\."/, `content="${data.ogDesc}"`);

            res.send(result);
        });
    } else {
        next();
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`🚀 Server Secure & Running on ${PORT}`));