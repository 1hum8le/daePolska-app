import { translations } from './translations.js';

// ==========================================
// 1. KONFIGURACJA
// ==========================================
const STRIPE_KEY = 'pk_live_51SWHULKFe9AoXQziuebBTUPo7kPggvwQ9VVFaZomNvO5U6N3MzwoGaoTbfl8VWJCxhwciaFrMKikw8I6eWy12x4000FmqMoFgh'; 
const stripe = Stripe(STRIPE_KEY); 

const availableLangs = ['pl', 'en', 'nl', 'fr', 'es'];
const langFullNames = { 'pl': 'POLSKI', 'en': 'ENGLISH', 'nl': 'NEDERLANDS', 'fr': 'FRANÇAIS', 'es': 'ESPAÑOL' };
const langFlagClasses = { 'pl': 'fi-pl', 'en': 'fi-gb', 'nl': 'fi-nl', 'fr': 'fi-fr', 'es': 'fi-es' };

const prices = {
    Basic: { eur: 115, pln: 497 },
    Standard: { eur: 235, pln: 990 },
    Premium: { eur: 525, pln: 2250 }
};

let currentPackage = 'Standard';
let elements = null;
let clientSecret = null;

// ==========================================
// 2. ROUTING I INICJALIZACJA
// ==========================================
function getLangFromUrl() {
    // Pobiera "pl" z "/pl" lub "/pl/"
    const parts = window.location.pathname.split('/');
    // Szukamy w częściach adresu czy któraś to znany język
    return parts.find(p => availableLangs.includes(p)) || null;
}

// CZYSTY START:
let urlLang = getLangFromUrl();
let savedLang = localStorage.getItem('selectedLang');
let browserLang = navigator.language.slice(0, 2);

// PRIORYTET ABSOLUTNY: Adres URL > Pamięć > Przeglądarka
// Jeśli jesteś na /pl, to currentLang MA BYĆ 'pl', nieważne co mówi localStorage
let currentLang = urlLang; 

if (!currentLang) {
    // Jeśli URL jest "czysty" (strona główna), bierzemy z pamięci lub domyślny
    currentLang = savedLang || (availableLangs.includes(browserLang) ? browserLang : 'pl');
    // I dopisujemy go do URL bez przeładowania
    window.history.replaceState({}, '', `/${currentLang}`);
}

// Zapisz ostateczny wynik do pamięci na przyszłość
localStorage.setItem('selectedLang', currentLang);

// ==========================================
// 3. UI I AKTUALIZACJE
// ==========================================

function updateHeaderUI() {
    const nameEl = document.getElementById('current-lang-name');
    const flagEl = document.getElementById('current-flag');
    const safeLang = langFullNames[currentLang] ? currentLang : 'pl';

    if (nameEl) nameEl.innerText = langFullNames[safeLang];
    if (flagEl) {
        flagEl.className = `fi ${langFlagClasses[safeLang]} text-lg rounded-sm shadow-sm`;
    }
}

function updateContent() {
    // Tłumaczenia tekstów
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang]?.[key]) el.innerHTML = translations[currentLang][key];
    });
    // Tłumaczenia placeholderów
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang]?.[key]) el.placeholder = translations[currentLang][key];
    });
    
    // Waluta
    const inputCurr = document.getElementById('current-currency');
    if(inputCurr) inputCurr.value = currentLang === 'pl' ? 'pln' : 'eur';

    // Sekcje PL vs Global
    const whyUs = document.getElementById('why-us');
    const beforePurchase = document.getElementById('before-purchase');
    if (whyUs && beforePurchase) {
        if (currentLang === 'pl') {
            whyUs.classList.remove('hidden');
            beforePurchase.classList.add('hidden'); 
        } else {
            whyUs.classList.add('hidden');
            beforePurchase.classList.remove('hidden');
        }
    }
}

function updatePricesDisplay() {
    const curr = currentLang === 'pl' ? 'pln' : 'eur';
    const sym = currentLang === 'pl' ? 'PLN' : '€';
    
    document.querySelectorAll('.price-display').forEach(el => {
        const pkg = el.getAttribute('data-pkg'); 
        if (pkg) {
            const key = pkg.charAt(0).toUpperCase() + pkg.slice(1);
            if(prices[key]) {
                const val = prices[key][curr];
                el.innerText = currentLang === 'pl' ? `${val} ${sym}` : `${sym}${val}`;
            }
        }
    });
    updateSelectedPackageText();
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

// ==========================================
// 4. FUNKCJE GLOBALNE (Dla HTML onclick)
// ==========================================

window.changeLanguage = function(langCode) {
    localStorage.setItem('selectedLang', langCode);
    // Hard reload na nowy URL
    window.location.href = `/${langCode}`;
}

window.selectPackage = function(pkgName) {
    currentPackage = pkgName;
    
    // 1. Zaktualizuj tekst w formularzu
    const inputPkg = document.getElementById('selected-pkg');
    if(inputPkg) inputPkg.value = pkgName;
    
    updateSelectedPackageText();
    
    // 2. Wymuś scroll do formularza (z małym opóźnieniem dla stabilności)
    setTimeout(() => {
        const formTarget = document.getElementById('inspection-form');
        if(formTarget) {
            formTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
    
    // 3. Odśwież cenę w Stripe
    initializePayment();
}

window.toggleFaq = function(element) {
    // Element to div.faq-item. Dodajemy/usuwamy klasę 'active'
    // W CSS upewnij się, że .faq-item.active .faq-answer { max-height: 200px; }
    element.classList.toggle('active');
    
    // Opcjonalnie: obróć strzałkę (jeśli masz ikonę w środku)
    const icon = element.querySelector('.faq-icon');
    if(icon) {
        // Jeśli jest active, obróć o 180, jeśli nie, wróć do 0
        icon.style.transform = element.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if(menu) menu.classList.toggle('translate-x-full');
}

// ==========================================
// 5. OBSŁUGA ZDARZEŃ (DOM Ready)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Init Widoku
    updateHeaderUI();
    updateContent();
    updatePricesDisplay();
    initializePayment();

    // 2. NAPRAWA MENU JĘZYKOWEGO (Izolacja zdarzeń)
    const langBtn = document.getElementById('lang-btn');
    const dropdown = document.getElementById('lang-dropdown');
    const arrow = document.getElementById('lang-arrow');

    if (langBtn && dropdown) {
        // Usuwamy stare eventy poprzez klonowanie przycisku
        const newBtn = langBtn.cloneNode(true);
        langBtn.parentNode.replaceChild(newBtn, langBtn);

        // Obsługa kliknięcia w przycisk
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // KLUCZOWE: Stopujemy propagację do document
            
            const isHidden = dropdown.classList.contains('hidden');
            if (isHidden) {
                // Otwórz
                dropdown.classList.remove('hidden');
                setTimeout(() => dropdown.classList.remove('opacity-0', 'scale-95'), 10);
                if(arrow) arrow.style.transform = 'rotate(180deg)';
            } else {
                // Zamknij
                closeDropdown();
            }
        });

        // Funkcja zamykania
        function closeDropdown() {
            dropdown.classList.add('opacity-0', 'scale-95');
            setTimeout(() => dropdown.classList.add('hidden'), 200);
            if(arrow) arrow.style.transform = 'rotate(0deg)';
        }

        // Kliknięcie gdziekolwiek indziej zamyka menu
        document.addEventListener('click', (e) => {
            // Zamknij tylko jeśli kliknięto poza menu I poza przyciskiem
            if (!dropdown.classList.contains('hidden') && !dropdown.contains(e.target) && !newBtn.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    // 3. NAPRAWA SCROLLOWANIA (Ignorowanie base href dla linków #)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Zatrzymaj przeładowanie strony przez base href
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Zamknij mobile menu jeśli otwarte
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
                mobileMenu.classList.add('translate-x-full');
            }
        });
    });

    // 4. OBSŁUGA FORMULARZA ZAMÓWIENIA
    const orderForm = document.getElementById('inspection-form');
    const submitBtn = document.getElementById('submit-btn');
    const inputsToWatch = ['name', 'email', 'url', 'location'];
    const paymentWrapper = document.getElementById('payment-section-wrapper');
    const fillMsg = document.getElementById('fill-data-msg');

    function checkInputs() {
        const allFilled = inputsToWatch.every(id => {
            const el = document.getElementById(id);
            return el && el.value.trim().length > 2; 
        });

        if (allFilled && paymentWrapper && paymentWrapper.classList.contains('hidden')) {
            if(fillMsg) fillMsg.classList.add('hidden');
            paymentWrapper.classList.remove('hidden');
            setTimeout(() => {
                paymentWrapper.classList.remove('opacity-0');
                if(window.innerWidth < 1024) paymentWrapper.scrollIntoView({behavior: 'smooth', block: 'center'});
            }, 50);
        }
    }

    inputsToWatch.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', checkInputs);
    });

    if(orderForm) {
        orderForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // Walidacja
            let isValid = true;
            document.querySelectorAll('.error-msg').forEach(e => e.classList.add('hidden'));
            
            orderForm.querySelectorAll('input[required]').forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    const msg = input.parentElement.querySelector('.error-msg');
                    if(msg) msg.classList.remove('hidden');
                }
            });
            const terms = document.getElementById('terms');
            if (terms && !terms.checked) {
                isValid = false;
                const termsMsg = terms.parentElement.parentElement.querySelector('.error-msg');
                if(termsMsg) termsMsg.classList.remove('hidden');
            }

            if (!isValid) return;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Przetwarzanie...';

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
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                const { error } = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `${window.location.origin}/success.html?name=${encodeURIComponent(orderData.name)}&pkg=${currentPackage}`,
                        payment_method_data: {
                            billing_details: { name: orderData.name, email: orderData.email }
                        }
                    },
                });

                if (error) {
                    document.getElementById('card-errors').innerText = error.message;
                    submitBtn.disabled = false;
                    submitBtn.innerText = "ZAPŁAĆ";
                }
            } catch (err) {
                console.error(err);
                submitBtn.disabled = false;
                submitBtn.innerText = "ZAPŁAĆ";
            }
        });
    }

    // 5. KONTAKT FORMULARZ
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
});

// ==========================================
// 6. PŁATNOŚCI
// ==========================================
async function initializePayment() {
    const currency = currentLang === 'pl' ? 'pln' : 'eur';
    const amount = prices[currentPackage][currency] * 100;

    try {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
        });
        
        if (!response.ok) return;
        const data = await response.json();
        clientSecret = data.clientSecret;

        const appearance = { theme: 'night', variables: { colorPrimary: '#FF5722', colorBackground: '#1e1e2f', colorText: '#ffffff' } };
        
        elements = stripe.elements({ appearance, clientSecret, locale: currentLang });
        const paymentElement = elements.create("payment", { layout: "tabs" });
        
        const mountPoint = document.getElementById("payment-element");
        if (mountPoint) {
            mountPoint.innerHTML = ''; 
            paymentElement.mount("#payment-element");
        }
    } catch (e) {
        console.error("Stripe Error:", e);
    }
}

// ==========================================
// 7. FIX: OBSŁUGA MENU JĘZYKOWEGO (Na sztywno)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Ładowanie obsługi menu..."); // Diagnostyka w konsoli

    const langBtn = document.getElementById('lang-btn');
    const dropdown = document.getElementById('lang-dropdown');
    const arrow = document.getElementById('lang-arrow');

    // Sprawdź czy elementy istnieją, zanim spróbujesz ich użyć
    if (langBtn && dropdown) {
        
        // Kliknięcie w przycisk (Flaga)
        langBtn.onclick = function(e) {
            e.stopPropagation(); // Nie zamykaj od razu
            
            // Sprawdź czy jest ukryte
            const isHidden = dropdown.classList.contains('hidden');

            if (isHidden) {
                // OTWIERANIE
                dropdown.classList.remove('hidden');
                // Małe opóźnienie, żeby animacja opacity zadziałała
                setTimeout(() => {
                    dropdown.classList.remove('opacity-0', 'scale-95');
                }, 10);
                if(arrow) arrow.style.transform = 'rotate(180deg)';
            } else {
                // ZAMYKANIE
                dropdown.classList.add('opacity-0', 'scale-95');
                setTimeout(() => dropdown.classList.add('hidden'), 200);
                if(arrow) arrow.style.transform = 'rotate(0deg)';
            }
        };

        // Kliknięcie gdziekolwiek indziej -> Zamknij menu
        document.onclick = function(e) {
            // Jeśli kliknięto poza przyciskiem i menu jest otwarte
            if (!dropdown.classList.contains('hidden') && !langBtn.contains(e.target)) {
                dropdown.classList.add('opacity-0', 'scale-95');
                setTimeout(() => dropdown.classList.add('hidden'), 200);
                if(arrow) arrow.style.transform = 'rotate(0deg)';
            }
        };
    } else {
        console.error("BŁĄD: Nie znaleziono elementu #lang-btn lub #lang-dropdown w HTML!");
    }
});
// --- START APLIKACJI ---
updatePricesDisplay();
updateSelectedPackageText();
updateContent();
initializePayment();
updateHeaderUI();