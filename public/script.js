import { translations } from './translations.js';

// --- 1. KONFIGURACJA I ROUTING ---
const STRIPE_KEY = 'pk_live_51SWHULKFe9AoXQziuebBTUPo7kPggvwQ9VVFaZomNvO5U6N3MzwoGaoTbfl8VWJCxhwciaFrMKikw8I6eWy12x4000FmqMoFgh'; 
const stripe = Stripe(STRIPE_KEY); 

// Dostępne języki
const availableLangs = ['pl', 'en', 'nl', 'fr', 'es'];

// Mapowanie skrótów na pełne nazwy (do wyświetlania w nagłówku)
const langFullNames = {
    'pl': 'POLSKI',
    'en': 'ENGLISH',
    'nl': 'NEDERLANDS',
    'fr': 'FRANÇAIS',
    'es': 'ESPAÑOL'
};

const langFlags = {
    'pl': '🇵🇱', 'en': '🇬🇧', 'nl': '🇳🇱', 'fr': '🇫🇷', 'es': '🇪🇸'
};

// Funkcja: Pobierz język z URL (np. daepoland.com/en -> 'en')
function getLangFromUrl() {
    const path = window.location.pathname.replace('/', '');
    if (availableLangs.includes(path)) {
        return path;
    }
    return null;
}

function updateHeaderUI() {
    const nameEl = document.getElementById('current-lang-name');
    const flagEl = document.getElementById('current-flag');

    // Ustaw tekst (np. NEDERLANDS)
    if (nameEl) {
        nameEl.innerText = langFullNames[currentLang] || 'POLSKI';
    }

    // Ustaw flagę (np. 🇳🇱)
    if (flagEl) {
        flagEl.innerText = langFlags[currentLang] || '🇵🇱';
    }
}

// Inicjalizacja Języka (Priorytet: URL > Zapisany > Przeglądarka > Domyślny PL)
let savedLang = localStorage.getItem('selectedLang');
let urlLang = getLangFromUrl();
let browserLang = navigator.language.slice(0, 2);

let currentLang = urlLang || savedLang || (availableLangs.includes(browserLang) ? browserLang : 'pl');

// Jeśli brak języka w URL, dopisz go (np. wejście na stronę główną -> /pl)
if (!urlLang) {
    window.history.replaceState({}, '', `/${currentLang}`);
}

let elements = null;
let currentPackage = 'Standard';
let clientSecret = null;

const prices = {
    Basic: { eur: 115, pln: 497 },
    Standard: { eur: 235, pln: 990 },
    Premium: { eur: 525, pln: 2250 }
};

// --- 2. PŁATNOŚCI (STRIPE) ---

async function initializePayment() {
    const currency = currentLang === 'pl' ? 'pln' : 'eur';
    const priceValue = prices[currentPackage][currency];
    const amount = priceValue * 100;

    try {
        // Pobierz sekret z serwera
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
        });
        
        if (!response.ok) throw new Error('Błąd połączenia z płatnościami');
        
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

        // Rysujemy formularz
        elements = stripe.elements({ appearance, clientSecret, locale: currentLang });
        const paymentElement = elements.create("payment", { layout: "tabs" });
        
        const mountPoint = document.getElementById("payment-element");
        if (mountPoint) {
            // Czyść kontener przed ponownym montowaniem (przy zmianie waluty)
            mountPoint.innerHTML = ''; 
            paymentElement.mount("#payment-element");
        }
    } catch (e) {
        console.error("Stripe Error:", e);
    }
}

// --- 3. UI & TŁUMACZENIA ---

function updateContent() {
    // Tłumaczenie tekstów
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang]?.[key]) el.innerHTML = translations[currentLang][key];
    });
    // Tłumaczenie placeholderów
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang]?.[key]) el.placeholder = translations[currentLang][key];
    });
    
    // Ustawienie waluty w ukrytym polu
    const currencyCode = currentLang === 'pl' ? 'pln' : 'eur';
    const inputCurr = document.getElementById('current-currency');
    if(inputCurr) inputCurr.value = currencyCode;

    // --- LOGIKA WIDOCZNOŚCI SEKCJI (PL vs RESZTA) ---
    const whyUsSection = document.getElementById('why-us');        // Sekcja "Matematyka" (PL)
    const beforePurchaseSection = document.getElementById('before-purchase'); // Sekcja "Bezpieczeństwo" (Global)

    if (whyUsSection && beforePurchaseSection) {
        if (currentLang === 'pl') {
            // DLA POLSKI: Pokaż matematykę
            whyUsSection.classList.remove('hidden');
            beforePurchaseSection.classList.add('hidden'); 
        } else {
            // DLA INNYCH: Pokaż bezpieczeństwo
            whyUsSection.classList.add('hidden');
            beforePurchaseSection.classList.remove('hidden');
        }
    }
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
    
    const priceInput = document.getElementById('pkg-price-eur');
    if(priceInput) priceInput.value = prices[currentPackage]['eur'];
}

// --- 4. FUNKCJE GLOBALNE ---

// Zmiana języka (Z PRZEŁADOWANIEM STRONY)
window.changeLanguage = function(langCode) {
    localStorage.setItem('selectedLang', langCode);
    window.location.href = `/${langCode}`;
}

// Wybór Pakietu
window.selectPackage = function(pkgName) {
    currentPackage = pkgName;
    const inputPkg = document.getElementById('selected-pkg');
    if(inputPkg) inputPkg.value = pkgName;
    
    updateSelectedPackageText();
    
    document.getElementById('order').scrollIntoView({behavior: 'smooth'});
    initializePayment(); // Odśwież kwotę w Stripe
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

// --- 6. LOGIKA ODKRYWANIA PŁATNOŚCI (Mobile UX) ---
const inputsToWatch = ['name', 'email', 'phone', 'url', 'location'];
const paymentWrapper = document.getElementById('payment-section-wrapper');
const fillMsg = document.getElementById('fill-data-msg');

function checkInputs() {
    const allFilled = inputsToWatch.every(id => {
        const el = document.getElementById(id);
        // Telefon nie jest zawsze wymagany, ale reszta tak. 
        // Jeśli telefon jest opcjonalny w HTML (brak 'required'), pomijamy go w walidacji "czy pełne"
        if (!el) return true;
        if (!el.hasAttribute('required') && el.id === 'phone') return true;
        return el.value.trim().length > 2; 
    });

    if (allFilled) {
        if (paymentWrapper && paymentWrapper.classList.contains('hidden')) {
            if(fillMsg) fillMsg.classList.add('hidden');
            paymentWrapper.classList.remove('hidden');
            
            // Małe opóźnienie dla animacji fade-in
            setTimeout(() => {
                paymentWrapper.classList.remove('opacity-0');
                // Na mobile przeskroluj delikatnie do płatności
                if(window.innerWidth < 1024) {
                    paymentWrapper.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            }, 50);
        }
    }
}

// Dodaj nasłuchiwanie
inputsToWatch.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', checkInputs);
});

// --- 7. FORMULARZ ZAMÓWIENIA ---
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
        
        const termsBox = document.getElementById('terms');
        if(termsBox && !termsBox.checked) {
            isValid = false;
            // Znajdź komunikat błędu obok checkboxa
            const termErr = termsBox.parentElement.parentElement.querySelector('.error-msg');
            if(termErr) termErr.classList.remove('hidden');
        }

        if (!isValid) return;

        // Blokada przycisku
        submitBtn.disabled = true;
        const processingText = translations[currentLang].btn_processing || "Przetwarzanie...";
        submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin mr-2"></i> ${processingText}`;

        const orderData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            url: document.getElementById('url').value,
            location: document.getElementById('location').value,
            packageType: currentPackage,
            price: prices[currentPackage][currentLang === 'pl' ? 'pln' : 'eur'],
            paymentId: clientSecret // ID intencji z serwera
        };

        try {
            // 1. Zapisz wstępnie w bazie (żeby mieć rekord nawet jak płatność przerwie)
            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            // 2. Potwierdź w Stripe
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    // Po sukcesie wróć tutaj:
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
                // Reset przycisku
                const payText = translations[currentLang].btn_pay || "ZAPŁAĆ";
                submitBtn.innerHTML = `<i class="fas fa-lock mr-2"></i> ${payText}`;
            }
        } catch (err) {
            console.error(err);
            document.getElementById('card-errors').innerText = "Błąd połączenia. Spróbuj ponownie.";
            submitBtn.disabled = false;
            const payText = translations[currentLang].btn_pay || "ZAPŁAĆ";
            submitBtn.innerHTML = `<i class="fas fa-lock mr-2"></i> ${payText}`;
        }
    });
}

// --- 8. KONTAKT ---
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
        finally { 
            btn.disabled = false; 
            btn.innerText = orgText; 
        }
    });
}

// --- START APLIKACJI ---
updatePricesDisplay();
updateSelectedPackageText();
updateContent();
initializePayment();
updateHeaderUI();