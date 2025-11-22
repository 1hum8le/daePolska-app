// Konfiguracja Stripe - WPISZ TUTAJ SWÓJ KLUCZ PUBLICZNY (pk_test_...)
const stripe = Stripe('pk_live_51SWHULKFe9AoXQziuebBTUPo7kPggvwQ9VVFaZomNvO5U6N3MzwoGaoTbfl8VWJCxhwciaFrMKikw8I6eWy12x4000FmqMoFgh'); 
const elements = stripe.elements();
const card = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            '::placeholder': { color: '#aab7c4' },
        },
    },
});
card.mount('#card-element');

// --- SŁOWNIK TŁUMACZEŃ I CENY ---
const translations = {
    en: {
        nav_services: "Services", nav_order: "Order Inspection", nav_contact: "Contact",
        hero_title: "Professional Vehicle Inspections",
        hero_subtitle: "We verify cars in Belgium, Netherlands & Germany. Buy with confidence.",
        hero_btn: "Book Inspection Now",
        packages_title: "Select Your Package",
        pkg_photos: "30-40 Photos", pkg_docs: "Document Check", pkg_pdf: "PDF Report",
        pkg_basic_incl: "Everything in Basic", pkg_obd: "OBD Diagnostics", pkg_paint: "Paint Thickness", pkg_drive: "Test Drive",
        pkg_standard_incl: "Everything in Standard", pkg_negotiation: "Price Negotiation", pkg_video: "4K Video",
        btn_select: "Select", badge_popular: "Most Popular",
        form_title: "Order Your Inspection", form_selected: "Selected Package", form_car_details: "Vehicle Details", form_payment: "Secure Payment", btn_pay: "Pay & Order"
    },
    pl: {
        nav_services: "Usługi", nav_order: "Zamów Inspekcję", nav_contact: "Kontakt",
        hero_title: "Profesjonalne Inspekcje Aut",
        hero_subtitle: "Sprawdzamy auta w Belgii, Holandii i Niemczech. Kupuj bez ryzyka.",
        hero_btn: "Zamów Sprawdzenie",
        packages_title: "Wybierz Pakiet",
        pkg_photos: "30-40 Zdjęć", pkg_docs: "Weryfikacja Dokumentów", pkg_pdf: "Raport PDF",
        pkg_basic_incl: "Wszystko z Basic", pkg_obd: "Diagnostyka OBD", pkg_paint: "Miernik Lakieru", pkg_drive: "Jazda Próbna",
        pkg_standard_incl: "Wszystko ze Standard", pkg_negotiation: "Negocjacja Ceny", pkg_video: "Wideo 4K",
        btn_select: "Wybierz", badge_popular: "Najczęściej Wybierany",
        form_title: "Formularz Zamówienia", form_selected: "Wybrany Pakiet", form_car_details: "Dane Pojazdu", form_payment: "Bezpieczna Płatność", btn_pay: "Zapłać i Zamów"
    },
    nl: {
        nav_services: "Diensten", nav_order: "Keuring Bestellen", nav_contact: "Contact",
        hero_title: "Professionele Auto-inspecties",
        hero_subtitle: "Wij controleren auto's in België, Nederland en Duitsland.",
        hero_btn: "Nu Boeken",
        packages_title: "Kies uw Pakket",
        pkg_photos: "30-40 Foto's", pkg_docs: "Documentcontrole", pkg_pdf: "PDF Rapport",
        pkg_basic_incl: "Alles in Basic", pkg_obd: "OBD Diagnose", pkg_paint: "Lakdikte Meting", pkg_drive: "Proefrit",
        pkg_standard_incl: "Alles in Standaard", pkg_negotiation: "Prijs onderhandeling", pkg_video: "4K Video",
        btn_select: "Selecteer", badge_popular: "Populairste",
        form_title: "Bestel uw Inspectie", form_selected: "Geselecteerd Pakket", form_car_details: "Voertuigdetails", form_payment: "Veilige Betaling", btn_pay: "Betalen & Bestellen"
    }
};

const prices = {
    Basic: { eur: 200, pln: 850 },
    Standard: { eur: 300, pln: 1300 },
    Premium: { eur: 450, pln: 1950 }
};

let currentLang = 'en';
let currentPackage = 'Standard';

// --- FUNKCJE LOGIKI ---

// 1. Zmiana Języka
document.getElementById('lang-selector').addEventListener('change', (e) => {
    currentLang = e.target.value;
    updateContent();
    updatePricesDisplay();
    // Jeśli użytkownik jest już w formularzu, zaktualizuj też cenę tam
    selectPackage(currentPackage);
});

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.innerText = translations[currentLang][key];
        }
    });
    
    // Zmiana waluty w ukrytym polu
    const currencyCode = currentLang === 'pl' ? 'pln' : 'eur';
    document.getElementById('current-currency').value = currencyCode;
}

function updatePricesDisplay() {
    const currency = currentLang === 'pl' ? 'pln' : 'eur';
    const symbol = currentLang === 'pl' ? 'PLN' : '€';

    document.querySelectorAll('.price-display').forEach(el => {
        const pkgType = el.getAttribute('data-pkg'); // basic, standard, premium
        // Musimy zmapować 'basic' na 'Basic' dla obiektu prices
        const pkgKey = pkgType.charAt(0).toUpperCase() + pkgType.slice(1);
        
        if (prices[pkgKey]) {
            el.innerText = currentLang === 'pl' ? `${prices[pkgKey][currency]} ${symbol}` : `${symbol}${prices[pkgKey][currency]}`;
        }
    });
}

// 2. Wybór Pakietu
window.selectPackage = function(pkgName) {
    currentPackage = pkgName;
    document.getElementById('selected-pkg').value = pkgName;
    
    // Pobierz odpowiednią cenę
    const currency = currentLang === 'pl' ? 'pln' : 'eur';
    const price = prices[pkgName][currency];
    const symbol = currentLang === 'pl' ? 'PLN' : '€';

    // Aktualizuj widok w formularzu
    document.getElementById('display-price-form').innerText = currentLang === 'pl' ? `${price} ${symbol}` : `${symbol}${price}`;
    
    // Aktualizuj ukryte pola (dla wysyłki do API)
    document.getElementById('pkg-price-eur').value = prices[pkgName]['eur']; // Zawsze wysyłamy bazową wartość lub przeliczoną
    
    // Scroll do formularza
    document.getElementById('order').scrollIntoView({behavior: 'smooth'});
}

// 3. Obsługa Płatności (To samo co wcześniej, z drobną modyfikacją waluty)
const form = document.getElementById('inspection-form');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Pobieramy cenę w zależności od waluty
    const currency = currentLang === 'pl' ? 'pln' : 'eur';
    const priceValue = prices[currentPackage][currency];
    const amount = priceValue * 100; // Centy/Grosze

    try {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amount, currency: currency })
        });
        
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        const { clientSecret } = data;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value
                }
            }
        });

        if (result.error) {
            throw new Error(result.error.message);
        } 
        
        if (result.paymentIntent.status === 'succeeded') {
            // Zapis do bazy
            const orderData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                url: document.getElementById('url').value,
                location: document.getElementById('location').value,
                packageType: currentPackage,
                price: priceValue, // Zapisujemy kwotę w wybranej walucie
                paymentId: result.paymentIntent.id
            };

            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            
            alert(currentLang === 'pl' ? 'Dziękujemy! Zamówienie przyjęte.' : 'Thank you! Order received.');
            form.reset();
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Paid';
        }
    } catch (error) {
        document.getElementById('card-errors').innerText = error.message;
        submitBtn.disabled = false;
        submitBtn.innerText = "Try Again";
    }
});

// Inicjalizacja domyślna
updatePricesDisplay();