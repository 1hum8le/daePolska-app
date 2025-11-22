import { translations } from './translations.js';

// --- 1. KONFIGURACJA STRIPE ---
// Pamiętaj: Użyj klucza pk_test_... do testów lokalnych!
const STRIPE_KEY = 'pk_test_51SWHULKFe9AoXQziiNpozXsfUqZ2hLoTD5GCWae1GlRt9zyWW1y3jj4nNaKhYLXG35osEkXFxNZP80BnA1OnaJTc00Mw8A5rXK'; 
const stripe = Stripe(STRIPE_KEY); 
let elements = null;
let card = null;

// --- 2. USTAWIENIA POCZĄTKOWE ---
let currentLang = 'pl';
let currentPackage = 'Standard';

const prices = {
    Basic: { eur: 120, pln: 520 },
    Standard: { eur: 245, pln: 1050 },
    Premium: { eur: 545, pln: 2350 }
};

// --- 3. FUNKCJE POMOCNICZE ---

// Funkcja do wyświetlania komunikatów (zamiast alertów)
function showMessage(elementId, message, isError = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    el.innerText = message;
    el.classList.remove('hidden', 'text-green-500', 'text-red-400', 'text-red-500'); 
    
    if (isError) {
        el.classList.add('text-red-400'); // Czerwony dla błędu
    } else {
        el.classList.add('text-green-500'); // Zielony dla sukcesu
    }
    
    el.style.display = 'block';
    
    // Ukryj automatycznie po 6 sekundach
    setTimeout(() => {
        el.style.display = 'none';
    }, 6000);
}

// --- 4. STRIPE I PŁATNOŚCI ---

function setupStripe(locale) {
    if (card) card.destroy();
    
    // Mapowanie języków dla Stripe
    const stripeLocale = locale === 'pl' ? 'pl' : (locale === 'nl' ? 'nl' : 'en');
    
    elements = stripe.elements({ locale: stripeLocale });
    card = elements.create('card', {
        style: {
            base: {
                fontSize: '14px',
                color: '#ffffff',
                fontFamily: '"Inter", sans-serif',
                '::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
                iconColor: '#FF5722',
            },
            invalid: { color: '#ff6b6b', iconColor: '#ff6b6b' },
        },
    });
    card.mount('#card-element');
}

// --- 5. ZARZĄDZANIE TREŚCIĄ I CENAMI ---

function updateContent() {
    // Tłumaczenie tekstów
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.innerHTML = translations[currentLang][key];
        }
    });
    // Tłumaczenie placeholderów
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.placeholder = translations[currentLang][key];
        }
    });
    // Waluta
    const currencyCode = currentLang === 'pl' ? 'pln' : 'eur';
    const inputCurr = document.getElementById('current-currency');
    if(inputCurr) inputCurr.value = currencyCode;
}

function updatePricesDisplay() {
    const curr = (currentLang === 'pl') ? 'pln' : 'eur';
    const sym = (currentLang === 'pl') ? 'PLN' : '€';
    
    document.querySelectorAll('.price-display').forEach(el => {
        const pkg = el.getAttribute('data-pkg'); 
        const key = pkg.charAt(0).toUpperCase() + pkg.slice(1);
        if(prices[key]) {
            el.innerText = (currentLang === 'pl') ? `${prices[key][curr]} ${sym}` : `${sym}${prices[key][curr]}`;
        }
    });
}

function updateSelectedPackageText() {
    const curr = (currentLang === 'pl') ? 'pln' : 'eur';
    const sym = (currentLang === 'pl') ? 'PLN' : '€';
    const price = prices[currentPackage][curr];
    
    const display = document.getElementById('display-price-form');
    if(display) display.innerText = (currentLang === 'pl') ? `${price} ${sym}` : `${sym}${price}`;
    
    const inputPrice = document.getElementById('pkg-price-eur');
    if(inputPrice) inputPrice.value = prices[currentPackage]['eur'];
}

// --- 6. ZDARZENIA (EVENT LISTENERS) ---

// Zmiana Języka
const langSelector = document.getElementById('lang-selector');
if(langSelector) {
    langSelector.addEventListener('change', (e) => {
        currentLang = e.target.value;
        updateContent();
        setupStripe(currentLang);
        updatePricesDisplay();
        updateSelectedPackageText();
    });
}

// --- 7. FUNKCJE GLOBALNE (Dostępne dla HTML) ---

window.selectPackage = function(pkgName) {
    currentPackage = pkgName;
    const input = document.getElementById('selected-pkg');
    if(input) input.value = pkgName;
    
    updateSelectedPackageText();
    
    const section = document.getElementById('order');
    if(section) section.scrollIntoView({behavior: 'smooth'});
}

window.selectPayment = function(method) {
    const input = document.getElementById('selected-payment-method');
    if(input) input.value = method;
    
    // Reset Stylów
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.className = 'payment-option border border-white/10 bg-white/5 p-2 rounded-lg text-center cursor-pointer transition opacity-60 hover:opacity-100 hover:bg-white/10';
        opt.querySelector('span').className = 'text-[10px] font-bold text-gray-300';
        const icon = opt.querySelector('i');
        icon.className = icon.className.replace('text-white', '').trim();
        
        if(opt.id === 'pm-paypal') icon.classList.add('text-blue-400');
        if(opt.id === 'pm-blik') icon.classList.add('text-red-500');
        if(opt.id === 'pm-card') icon.classList.add('text-white');
    });

    // Aktywacja
    const activeBtn = document.getElementById(`pm-${method}`);
    if(activeBtn) {
        activeBtn.className = 'payment-option border border-accent-orange bg-accent-orange/20 p-2 rounded-lg text-center cursor-pointer transition transform scale-105 shadow-lg shadow-orange-500/20';
        activeBtn.querySelector('span').className = 'text-[10px] font-bold text-white';
        const activeIcon = activeBtn.querySelector('i');
        activeIcon.className = activeIcon.className.replace('text-blue-400', '').replace('text-red-500', '').trim();
        activeIcon.classList.add('text-white');
    }

    // Widoczność sekcji
    const stripeSection = document.getElementById('stripe-section');
    const altSection = document.getElementById('alt-payment-section');

    if (method === 'card') {
        if(stripeSection) stripeSection.classList.remove('hidden');
        if(altSection) altSection.classList.add('hidden');
    } else {
        if(stripeSection) stripeSection.classList.add('hidden');
        if(altSection) altSection.classList.remove('hidden');
    }
}

// --- 8. OBSŁUGA FORMULARZA ZAMÓWIENIA (GŁÓWNA LOGIKA) ---

const orderForm = document.getElementById('inspection-form');
const submitBtn = document.getElementById('submit-btn');
const originalBtnText = submitBtn ? submitBtn.innerHTML : 'ZAPŁAĆ';

if(orderForm) {
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // 1. Sprawdzenie metody płatności
        const method = document.getElementById('selected-payment-method').value;
        if (method !== 'card') {
            // Zamiast alertu, pokazujemy błąd w polu błędów i przełączamy na kartę
            const msg = currentLang === 'pl' 
                ? "Automatyczna płatność dostępna tylko kartą. Przełączono na Kartę." 
                : "Only Card payment is currently automated. Switched to Card.";
            
            showMessage('card-errors', msg, true);
            window.selectPayment('card');
            return;
        }

        // 2. UI Loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> ...';
        document.getElementById('card-errors').innerText = '';

        // 3. Dane do płatności
        const currency = currentLang === 'pl' ? 'pln' : 'eur';
        const priceValue = prices[currentPackage][currency];
        const amount = priceValue * 100;

        try {
            // 4. Pobierz Client Secret z serwera
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amount, currency: currency })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // 5. Potwierdź płatność w Stripe
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: document.getElementById('name').value,
                        email: document.getElementById('email').value
                    }
                }
            });

            if (result.error) throw new Error(result.error.message);

            // 6. SUKCES! Zapisz i Przekieruj
            if (result.paymentIntent.status === 'succeeded') {
                
                const orderData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    url: document.getElementById('url').value,
                    location: document.getElementById('location').value,
                    packageType: currentPackage,
                    price: amount / 100,
                    paymentId: result.paymentIntent.id
                };

                // Zapisz w bazie danych
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                
                // PRZEKIEROWANIE DO SUCCESS PAGE
                const clientName = encodeURIComponent(orderData.name);
                const clientEmail = encodeURIComponent(orderData.email);
                const pkgName = encodeURIComponent(currentPackage);
                const priceDisplay = encodeURIComponent(document.getElementById('display-price-form').innerText);
                const orderId = result.paymentIntent.id.slice(-8).toUpperCase();
                 // Pobierz metodę z formularza (tę z hidden input)
                const paymentMethod = document.getElementById('selected-payment-method').value;

                // Dodaj &method=${paymentMethod} na końcu linku
                window.location.href = `/success.html?name=${clientName}&email=${clientEmail}&pkg=${pkgName}&price=${priceDisplay}&id=${orderId}&lang=${currentLang}&method=${paymentMethod}`;
            }

        } catch (error) {
            // Obsługa błędów
            console.error(error);
            showMessage('card-errors', error.message || "Błąd płatności", true);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// --- 9. OBSŁUGA FORMULARZA KONTAKTOWEGO ---

const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        
        btn.disabled = true;
        btn.innerText = "...";

        const msgData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            message: document.getElementById('contact-message').value
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(msgData)
            });
            
            if(res.ok) {
                const successMsg = currentLang === 'pl' ? 'Wiadomość wysłana!' : 'Message sent!';
                showMessage('contact-status', successMsg, false);
                contactForm.reset();
            } else {
                throw new Error('Server Error');
            }
        } catch (err) {
            const errorMsg = currentLang === 'pl' ? 'Błąd wysyłania. Spróbuj WhatsApp.' : 'Error. Try WhatsApp.';
            showMessage('contact-status', errorMsg, true);
        } finally {
            btn.disabled = false;
            btn.innerText = originalText;
        }
    });
}

// --- START APLIKACJI ---
setupStripe('pl');
updatePricesDisplay();
updateSelectedPackageText();