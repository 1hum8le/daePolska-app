import { translations } from './translations.js';

// --- 1. KONFIGURACJA ---
const STRIPE_KEY = 'pk_live_51SWHULKFe9AoXQziuebBTUPo7kPggvwQ9VVFaZomNvO5U6N3MzwoGaoTbfl8VWJCxhwciaFrMKikw8I6eWy12x4000FmqMoFgh'; 
const stripe = Stripe(STRIPE_KEY); 

let elements = null;
let currentLang = 'pl';
let currentPackage = 'Standard';
let clientSecret = null;

const prices = {
    Basic: { eur: 120, pln: 520 },
    Standard: { eur: 245, pln: 1050 },
    Premium: { eur: 545, pln: 2350 }
};

// --- 2. PŁATNOŚCI (PAYMENT ELEMENT) ---

async function initializePayment() {
    const currency = currentLang === 'pl' ? 'pln' : 'eur';
    const priceValue = prices[currentPackage][currency];
    const amount = priceValue * 100;

    // Pobierz sekret z serwera
    const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency })
    });
    const data = await response.json();
    clientSecret = data.clientSecret;

    // Wygląd formularza Stripe (Ciemny)
    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#FF5722',
            colorBackground: '#1e1e2f',
            colorText: '#ffffff',
            colorDanger: '#df1b41',
            fontFamily: 'Inter, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
        },
    };

    // Rysujemy formularz (Stripe sam dobiera metody np. BLIK)
    elements = stripe.elements({ appearance, clientSecret });
    const paymentElement = elements.create("payment", {
        layout: "tabs",
    });
    paymentElement.mount("#card-element"); // Montujemy w divie z HTML
}

// --- 3. UI & TŁUMACZENIA ---

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang]?.[key]) el.innerHTML = translations[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang]?.[key]) el.placeholder = translations[currentLang][key];
    });
    const currencyCode = currentLang === 'pl' ? 'pln' : 'eur';
    const inputCurr = document.getElementById('current-currency');
    if(inputCurr) inputCurr.value = currencyCode;
}

function updatePricesDisplay() {
    const curr = currentLang === 'pl' ? 'pln' : 'eur';
    const sym = currentLang === 'pl' ? 'PLN' : '€';
    document.querySelectorAll('.price-display').forEach(el => {
        const pkg = el.getAttribute('data-pkg'); 
        const key = pkg.charAt(0).toUpperCase() + pkg.slice(1);
        if(prices[key]) el.innerText = currentLang === 'pl' ? `${prices[key][curr]} ${sym}` : `${sym}${prices[key][curr]}`;
    });
}

function updateSelectedPackageText() {
    const curr = currentLang === 'pl' ? 'pln' : 'eur';
    const sym = currentLang === 'pl' ? 'PLN' : '€';
    const price = prices[currentPackage][curr];
    const display = document.getElementById('display-price-form');
    if(display) display.innerText = currentLang === 'pl' ? `${price} ${sym}` : `${sym}${price}`;
    document.getElementById('pkg-price-eur').value = prices[currentPackage]['eur'];
}

// --- 4. FUNKCJE GLOBALNE ---

// Zmiana języka (Odświeża płatność bo zmienia walutę)
window.changeLanguage = function(langCode, flag, name) {
    const flagEl = document.getElementById('current-flag');
    const nameEl = document.getElementById('current-lang-name');
    if(flagEl) flagEl.innerText = flag;
    if(nameEl) nameEl.innerText = name;

    currentLang = langCode;
    
    // Zamknij menu
    const menu = document.getElementById('lang-dropdown');
    const arrow = document.getElementById('lang-arrow');
    if(menu) {
        menu.classList.add('scale-95', 'opacity-0');
        setTimeout(() => menu.classList.add('hidden'), 200);
    }
    if(arrow) arrow.style.transform = 'rotate(0deg)';
    
    updateContent();
    updatePricesDisplay();
    updateSelectedPackageText();
    
    // PRZEŁADUJ STRIPE (Nowa waluta)
    initializePayment();
}

// Wybór Pakietu (Odświeża płatność bo zmienia kwotę)
window.selectPackage = function(pkgName) {
    currentPackage = pkgName;
    document.getElementById('selected-pkg').value = pkgName;
    updateSelectedPackageText();
    
    document.getElementById('order').scrollIntoView({behavior: 'smooth'});
    initializePayment();
}

window.toggleFaq = function(element) {
    element.classList.toggle('active');
}

// --- 5. OBSŁUGA MENU JĘZYKOWEGO ---
const langBtn = document.getElementById('lang-btn');
if(langBtn) {
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.getElementById('lang-dropdown');
        const arrow = document.getElementById('lang-arrow');
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
            setTimeout(() => menu.classList.remove('scale-95', 'opacity-0'), 10);
            arrow.style.transform = 'rotate(180deg)';
        } else {
            menu.classList.add('scale-95', 'opacity-0');
            setTimeout(() => menu.classList.add('hidden'), 200);
            arrow.style.transform = 'rotate(0deg)';
        }
    });
}
document.addEventListener('click', () => {
    const menu = document.getElementById('lang-dropdown');
    const arrow = document.getElementById('lang-arrow');
    if(menu && !menu.classList.contains('hidden')) {
        menu.classList.add('scale-95', 'opacity-0');
        setTimeout(() => menu.classList.add('hidden'), 200);
        arrow.style.transform = 'rotate(0deg)';
    }
});

// --- 6. FORMULARZ ZAMÓWIENIA ---
const orderForm = document.getElementById('inspection-form');
const submitBtn = document.getElementById('submit-btn');

if(orderForm) {
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Walidacja
        let isValid = true;
        document.querySelectorAll('.error-msg').forEach(e => e.classList.add('hidden'));
        document.querySelectorAll('.glass-input').forEach(e => e.classList.remove('border-red-500'));

        orderForm.querySelectorAll('input[required]').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('border-red-500');
                const msg = input.parentElement.querySelector('.error-msg');
                if(msg) msg.classList.remove('hidden');
            }
        });
        
        if(!document.getElementById('terms').checked) {
            isValid = false;
            const termErr = document.querySelector('#terms').parentElement.parentElement.querySelector('.error-msg');
            if(termErr) termErr.classList.remove('hidden');
        }

        if (!isValid) return;

        submitBtn.disabled = true;
        submitBtn.innerText = 'Przetwarzanie...';

        const orderData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            url: document.getElementById('url').value,
            location: document.getElementById('location').value,
            packageType: currentPackage,
            price: prices[currentPackage][currentLang === 'pl' ? 'pln' : 'eur'],
            paymentId: clientSecret
        };

        try {
            // 1. Zapisz wstępnie w bazie
            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            // 2. Potwierdź w Stripe (Przekierowanie do banku/BLIK)
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/success.html?name=${encodeURIComponent(orderData.name)}&pkg=${currentPackage}`,
                    payment_method_data: {
                        billing_details: {
                            name: orderData.name,
                            email: orderData.email
                        }
                    }
                },
            });

            if (error) {
                document.getElementById('card-errors').innerText = error.message;
                submitBtn.disabled = false;
                submitBtn.innerText = 'ZAPŁAĆ BEZPIECZNIE';
            }
        } catch (err) {
            console.error(err);
            document.getElementById('card-errors').innerText = "Błąd połączenia.";
            submitBtn.disabled = false;
            submitBtn.innerText = 'ZAPŁAĆ BEZPIECZNIE';
        }
    });
}

// --- 7. KONTAKT ---
const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const orgText = btn.innerText;
        btn.disabled = true;
        btn.innerText = "...";
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: document.getElementById('contact-name').value,
                    email: document.getElementById('contact-email').value,
                    message: document.getElementById('contact-message').value
                })
            });
            if(res.ok) {
                const msgEl = document.getElementById('contact-status');
                msgEl.innerText = currentLang === 'pl' ? 'Wysłano!' : 'Sent!';
                msgEl.classList.remove('hidden', 'text-red-500');
                msgEl.classList.add('text-green-500', 'block');
                contactForm.reset();
            }
        } catch(err) { 
            console.error(err); 
            const msgEl = document.getElementById('contact-status');
            msgEl.innerText = "Error";
            msgEl.classList.remove('hidden');
            msgEl.classList.add('text-red-500');
        } 
        finally { btn.disabled = false; btn.innerText = orgText; }
    });
}

// Start
updatePricesDisplay();
updateSelectedPackageText();
initializePayment();