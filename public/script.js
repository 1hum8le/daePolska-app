import { translations } from './translations.js';

// --- 1. KONFIGURACJA I ZMIENNE ---
// Pamiętaj: Użyj klucza pk_test_... do testów lokalnych, a pk_live_... na produkcji!
const STRIPE_KEY = 'pk_live_51SWHULKFe9AoXQziuebBTUPo7kPggvwQ9VVFaZomNvO5U6N3MzwoGaoTbfl8VWJCxhwciaFrMKikw8I6eWy12x4000FmqMoFgh'; 
const stripe = Stripe(STRIPE_KEY); 
let elements = null;
let card = null;

let currentLang = 'pl';
let currentPackage = 'Standard';

const prices = {
    Basic: { eur: 120, pln: 520 },
    Standard: { eur: 245, pln: 1050 },
    Premium: { eur: 545, pln: 2350 }
};

// --- 2. FUNKCJE POMOCNICZE (UI) ---

function showMessage(elementId, message, isError = false) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    el.innerText = message;
    el.classList.remove('hidden', 'text-green-500', 'text-red-400', 'text-red-500'); 
    
    if (isError) {
        el.classList.add('text-red-400');
    } else {
        el.classList.add('text-green-500');
    }
    
    el.style.display = 'block';
    
    setTimeout(() => {
        el.style.display = 'none';
    }, 6000);
}

// --- 3. ZARZĄDZANIE STRIPE I CENAMI ---

function setupStripe(locale) {
    if (card) card.destroy();
    
    // Mapowanie języków dla Stripe (obsługuje tylko główne kody)
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

function updateContent() {
    // Teksty
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.innerHTML = translations[currentLang][key];
        }
    });
    // Placeholdery
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

// --- 4. FUNKCJE GLOBALNE (DLA HTML) ---

// Zmiana Języka (Custom Dropdown)
window.changeLanguage = function(langCode, flag, name) {
    // Aktualizacja UI przycisku
    const flagEl = document.getElementById('current-flag');
    const nameEl = document.getElementById('current-lang-name');
    if(flagEl) flagEl.innerText = flag;
    if(nameEl) nameEl.innerText = name;
    
    currentLang = langCode;
    
    // Zamknij menu (logika toggle jest niżej w Event Listeners)
    // Tu po prostu wymuszamy odświeżenie widoku
    updateContent();
    setupStripe(currentLang);
    updatePricesDisplay();
    updateSelectedPackageText();
}

// Wybór Pakietu (Scrolluje do formularza)
window.selectPackage = function(pkgName) {
    currentPackage = pkgName;
    const input = document.getElementById('selected-pkg');
    if(input) input.value = pkgName;
    
    updateSelectedPackageText();
    
    const section = document.getElementById('order');
    if(section) section.scrollIntoView({behavior: 'smooth'});
}

// Wybór Płatności (Wizualny + Logika chowania)
window.selectPayment = function(method) {
    const input = document.getElementById('selected-payment-method');
    if(input) input.value = method;
    
    // Reset stylów
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

    // Pokaż/Ukryj sekcje
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

// Akordeon FAQ
window.toggleFaq = function(element) {
    if (element.classList.contains('active')) {
        element.classList.remove('active');
    } else {
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        element.classList.add('active');
    }
}

// --- 5. EVENT LISTENERS (OBSŁUGA ZDARZEŃ) ---

// Menu Językowe (Dropdown)
const langBtn = document.getElementById('lang-btn');
const langDropdown = document.getElementById('lang-dropdown');
const langArrow = document.getElementById('lang-arrow');
let isLangOpen = false;

function toggleLangMenu() {
    if (isLangOpen) {
        langDropdown.classList.remove('hidden', 'scale-95', 'opacity-0');
        langDropdown.classList.add('scale-100', 'opacity-100');
        if(langArrow) langArrow.style.transform = 'rotate(180deg)';
    } else {
        langDropdown.classList.add('scale-95', 'opacity-0');
        if(langArrow) langArrow.style.transform = 'rotate(0deg)';
        setTimeout(() => {
             if(!isLangOpen) langDropdown.classList.add('hidden');
        }, 200);
    }
}

if(langBtn) {
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isLangOpen = !isLangOpen;
        toggleLangMenu();
    });
}

document.addEventListener('click', (e) => {
    if (isLangOpen && langDropdown && !langDropdown.contains(e.target) && !langBtn.contains(e.target)) {
        isLangOpen = false;
        toggleLangMenu();
    }
});

// Zmiana Języka (dla starego selecta, jeśli jeszcze gdzieś został - dla kompatybilności)
const langSelector = document.getElementById('lang-selector');
if(langSelector && langSelector.tagName === 'SELECT') {
    langSelector.addEventListener('change', (e) => {
        window.changeLanguage(e.target.value, '', '');
    });
}

// Formularz Zamówienia
const orderForm = document.getElementById('inspection-form');
const submitBtn = document.getElementById('submit-btn');
const originalBtnText = submitBtn ? submitBtn.innerHTML : 'ZAPŁAĆ';

// --- WALIDACJA I WYSYŁKA ZAMÓWIENIA ---
if(orderForm) {
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // 1. Customowa Walidacja (Czerwone ramki + napisy)
        let isValid = true;
        
        // Reset błędów
        document.querySelectorAll('.error-msg').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.glass-input').forEach(el => el.classList.remove('border-red-500'));

        // Sprawdź inputy wymagane
        const requiredInputs = orderForm.querySelectorAll('input[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('border-red-500'); // Czerwona ramka
                // Znajdź najbliższy komunikat błędu w tym samym kontenerze
                const errorMsg = input.parentElement.querySelector('.error-msg');
                if (errorMsg) errorMsg.classList.remove('hidden');
            }
        });

        // Sprawdź checkbox
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            isValid = false;
            const termError = terms.parentElement.parentElement.querySelector('.error-msg');
            if (termError) termError.classList.remove('hidden');
        }

        // Jeśli walidacja nie przeszła -> Stop
        if (!isValid) {
            // Opcjonalnie: potrząśnij przyciskiem lub scrolluj do błędu
            return;
        }

        // 2. Metoda Płatności
        const method = document.getElementById('selected-payment-method').value;
        if (method !== 'card') {
            const msg = currentLang === 'pl' 
                ? "Automatyczna płatność dostępna tylko kartą. Przełączono na Kartę." 
                : "Only Card payment is currently automated. Switched to Card.";
            showMessage('card-errors', msg, true);
            window.selectPayment('card');
            return;
        }

        // 3. Procesowanie Płatności (Stripe)
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> ...';
        document.getElementById('card-errors').innerText = '';

        const currency = currentLang === 'pl' ? 'pln' : 'eur';
        const priceValue = prices[currentPackage][currency];
        const amount = priceValue * 100;

        try {
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amount, currency: currency })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);

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

                // Zapisz i wyślij maila
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                
                // Przekierowanie
                const clientName = encodeURIComponent(orderData.name);
                const clientEmail = encodeURIComponent(orderData.email);
                const pkgName = encodeURIComponent(currentPackage);
                const priceDisplay = encodeURIComponent(document.getElementById('display-price-form').innerText);
                const orderId = result.paymentIntent.id.slice(-8).toUpperCase();
                const paymentMethod = document.getElementById('selected-payment-method').value;

                window.location.href = `/success.html?name=${clientName}&email=${clientEmail}&pkg=${pkgName}&price=${priceDisplay}&id=${orderId}&lang=${currentLang}&method=${paymentMethod}`;
            }

        } catch (error) {
            console.error(error);
            showMessage('card-errors', error.message || "Błąd płatności", true);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// Formularz Kontaktowy
const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const orgText = btn.innerText;
        
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
            const errorMsg = currentLang === 'pl' ? 'Błąd. Spróbuj WhatsApp.' : 'Error. Try WhatsApp.';
            showMessage('contact-status', errorMsg, true);
        } finally {
            btn.disabled = false;
            btn.innerText = orgText;
        }
    });
}

// --- 6. START APLIKACJI ---
setupStripe('pl');
updatePricesDisplay();
updateSelectedPackageText();