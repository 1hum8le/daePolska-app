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
        title: "daeCenter | Profesjonalne Inspekcje Pojazdów",
        desc: "Kupujesz auto w Belgii, Holandii lub Niemczech? Zleć profesjonalną inspekcję przed zakupem. Raport w 24h.",
        ogTitle: "daeCenter | Nie kupuj kota w worku!",
        ogDesc: "Sprawdzamy auta w Belgii, Holandii i Niemczech. Oszczędź czas i pieniądze. Pełny raport techniczny."
    },
    en: {
        title: "daeCenter | Professional Vehicle Inspections",
        desc: "Buying a car in Belgium, Netherlands or Germany? Order a professional pre-purchase inspection. Report within 24h.",
        ogTitle: "daeCenter | Don't buy a lemon!",
        ogDesc: "We check cars in Belgium, Netherlands and Germany. Save time and money. Full technical report."
    },
    nl: {
        title: "daeCenter | Professionele Aankoopkeuring",
        desc: "Auto kopen in België, Nederland of Duitsland? Bestel een professionele aankoopkeuring. Rapport binnen 24u.",
        ogTitle: "daeCenter | Koop geen kat in de zak!",
        ogDesc: "Wij controleren auto's in België, Nederland en Duitsland. Bespaar tijd en geld. Volledig technisch rapport."
    },
    fr: {
        title: "daeCenter | Inspection Automobile Pro",
        desc: "Vous achetez une voiture en Belgique? Commandez une inspection professionnelle. Rapport complet en 24h.",
        ogTitle: "daeCenter | N'achetez pas les yeux fermés!",
        ogDesc: "Nous vérifions les voitures en Belgique, aux Pays-Bas et en Allemagne. Économisez du temps et de l'argent."
    },
    es: {
        title: "daeCenter | Inspección Profesional",
        desc: "¿Compras un coche en Bélgica o Alemania? Solicita una inspección profesional. Informe en 24h.",
        ogTitle: "daeCenter | ¡No compres a ciegas!",
        ogDesc: "Revisamos coches en Bélgica, Holanda y Alemania. Ahorra tiempo y dinero. Informe técnico completo."
    }
};

// --- 1. BEZPIECZEŃSTWO (NAPRAWIONE CSP) ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            // TO JEST NOWOŚĆ - POZWALA NA ONCLICK W HTML:
            scriptSrcAttr: ["'unsafe-inline'"], 
            
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "'unsafe-eval'",
                "https://js.stripe.com", 
                "https://cdn.tailwindcss.com"
            ],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'",
                "https://fonts.googleapis.com", 
                "https://cdnjs.cloudflare.com", 
                "https://cdn.jsdelivr.net"
            ],
            fontSrc: [
                "'self'", 
                "https://fonts.gstatic.com", 
                "https://cdnjs.cloudflare.com"
            ],
            imgSrc: [
                "'self'", 
                "data:", 
                "https://upload.wikimedia.org", 
                "https://*.stripe.com",
                "https://daeCenter.com", 
                "https://cdn.jsdelivr.net"
            ],
            connectSrc: [
                "'self'", 
                "https://api.stripe.com"
            ],
            frameSrc: [
                "'self'", 
                "https://js.stripe.com", 
                "https://hooks.stripe.com"
            ],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// CORS
const allowedOrigins = [
    'https://daeCenter.com', 
    'https://www.daeCenter.com',
    'https://daeCenter-web.onrender.com', 
    'http://localhost:3000'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Tymczasowo pozwalamy wszystkim, żebyś mógł testować
        }
    },
    methods: ['GET', 'POST']
}));

app.use(express.json({ limit: '10kb' }));
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
        sender: { name: 'daeCenter', email: process.env.EMAIL_USER },
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
    const { amount, currency, description_url, description_location, package_name } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, currency,
             automatic_payment_methods: { enabled: true },

             metadata: {
                'URL': description_url || 'N/A',
                'Adres': description_location || 'N/A',
                'Package': package_name || 'Standard'
             },
             description: `Zamówienie: ${package_name} - ${description_location} - ${description_url}`,
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/orders', async (req, res) => {
    const { name, email, phone, url, location, packageType, price, paymentId } = req.body;

    try {
        // --- 1. AKTUALIZACJA DANYCH W STRIPE (To naprawia puste pola "N/A") ---
        if (paymentId) {
            // Jeśli frontend wysyła client_secret (np. pi_123..._secret_456...), musimy wyciągnąć samo ID
            const intentId = paymentId.includes('_secret_') ? paymentId.split('_secret_')[0] : paymentId;

            await stripe.paymentIntents.update(intentId, {
                receipt_email: email, // Dzięki temu email trafi do powiadomienia
                metadata: {
                    'Adres': location, // Nadpisujemy "N/A" prawdziwą lokalizacją
                    'URL': url,        // Nadpisujemy "N/A" prawdziwym linkiem
                    'Pakiet': packageType,
                    'Klient': name,
                    'Telefon': phone
                },
                description: `Zamówienie: ${packageType} od ${name}`
            });
            console.log(`Stripe zaktualizowany dla ID: ${intentId}`);
        }
        // ---------------------------------------------------------------------

        // --- 2. ZAPIS DO BAZY DANYCH (Twój oryginalny kod) ---
        const newOrder = await pool.query(
            "INSERT INTO orders (client_name, email, phone, listing_url, vehicle_location, package_type, price, status, stripe_payment_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'paid', $8) RETURNING *",
            [name, email, phone, url, location, packageType, price, paymentId]
        );

        // --- 3. WYSYŁKA MAILI ---
        const adminText = getAdminEmailText(req.body);
        // Do maila klienta dodajemy ID zamówienia z bazy
        const clientText = getClientEmailText({ ...req.body, orderId: newOrder.rows[0].id });
        
        // Pamiętaj o await przy wysyłaniu maili (opcjonalne, ale dobra praktyka, żeby wyłapać błędy)
        await sendEmail(process.env.EMAIL_USER, `💰 NOWE ZLECENIE: ${packageType}`, adminText);
        await sendEmail(email, `Potwierdzenie zamówienia #${newOrder.rows[0].id}`, clientText);

        // --- 4. ODPOWIEDŹ DO FRONTENDU ---
        res.json(newOrder.rows[0]);

    } catch (err) {
        console.error("Błąd w /api/orders:", err); // Ważne: logowanie błędu w konsoli serwera
        res.status(500).send("Server Error");
    }
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

const supportedLanguages = ['pl', 'en', 'nl', 'fr', 'es', 'de'];

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
                .replace('<title>daeCenter | Profesjonalne Inspekcje Pojazdów</title>', `<title>${data.title}</title>`)
                .replace(/content="Kupujesz auto w Belgii.*?Raport nawet do 24h\."/, `content="${data.desc}"`)
                .replace(/content="daeCenter \| Nie kupuj kota.*?Inspekcje Aut"/, `content="${data.ogTitle}"`)
                .replace(/content="Sprawdzamy auta w Belgii.*?Zamów online\."/, `content="${data.ogDesc}"`);

            res.send(result);
        });
    } else {
        next();
    }
});

// --- NOWY ENDPOINT: Aktualizacja danych przed płatnością ---
app.post('/api/update-intent', async (req, res) => {
    const { paymentId, email, url, location, name, packageType } = req.body;

    try {
        // Wyciągamy czyste ID (jeśli przyszło jako client_secret)
        const intentId = paymentId.includes('_secret_') ? paymentId.split('_secret_')[0] : paymentId;

        await stripe.paymentIntents.update(intentId, {
            receipt_email: email, // To naprawi puste pole Email w Make
            metadata: {
                'Adres': location, // To naprawi "N/A"
                'URL': url,        // To naprawi "N/A"
                'Pakiet': packageType,
                'Klient': name
            },
            description: `Zamówienie: ${packageType} od ${name}`
        });

        res.json({ success: true });
    } catch (e) {
        console.error("Błąd aktualizacji Stripe:", e);
        res.status(500).json({ error: e.message });
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`🚀 Server Secure & Running on ${PORT}`));