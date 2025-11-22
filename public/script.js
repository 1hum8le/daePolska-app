// WPISZ SWÓJ KLUCZ PUBLICZNY STRIPE
const stripe = Stripe('pk_live_51SWHULKFe9AoXQziuebBTUPo7kPggvwQ9VVFaZomNvO5U6N3MzwoGaoTbfl8VWJCxhwciaFrMKikw8I6eWy12x4000FmqMoFgh'); 
const elements = stripe.elements();
const card = elements.create('card', {
    style: {
        base: { fontSize: '16px', color: '#ffffff', fontFamily: '"Inter", sans-serif', '::placeholder': { color: 'rgba(255, 255, 255, 0.5)' }, iconColor: '#FF5722' },
        invalid: { color: '#ff6b6b', iconColor: '#ff6b6b' },
    },
});
card.mount('#card-element');

let currentLang = 'pl';
let currentPackage = 'Standard';

const translations = {
    pl: {
        nav_info: "Proces", nav_services: "Cennik", nav_reviews: "Opinie & FAQ", nav_contact: "Kontakt",
        hero_title: "KUPUJ AUTA ZZA GRANICY<br><span class=\"text-accent-orange text-stroke\">BEZ RYZYKA.</span>",
        hero_subtitle: "Kompleksowe raporty techniczne aut w Belgii, Holandii i Niemczech. Sprawdzamy to, czego handlarz nie powie. Oszczędź czas i uniknij kosztownych wpadek.",
        stat_cars: "Sprawdzonych Aut", stat_saved: "Zaoszczędzone", stat_time: "Czas Reakcji", stat_satisfaction: "Gwarancja Usługi",
        hero_cta_desc: "Zaufaj ekspertom. Oszczędź czas, nerwy i pieniądze.",
        hero_btn: "SPRAWDŹ OFERTĘ",

        // 6 KAFELKÓW INFO
        info_title: "CO DOKŁADNIE SPRAWDZAMY?",
        info_body_title: "1. Nadwozie i Lakier", info_body_desc: "Precyzyjny pomiar grubości lakieru (wykrywanie szpachli i drugiej warstwy). Ocena spasowania elementów, oryginalności szyb, stanu opon i felg oraz poszukiwanie śladów demontażu.",
        info_eng_title: "2. Silnik i Osprzęt", info_eng_desc: "Analiza pracy na zimnym i ciepłym silniku. Weryfikacja wycieków, pracy wtryskiwaczy, turbosprężarki, paska osprzętu oraz dymienia z układu wydechowego.",
        info_drive_title: "3. Napęd i Zawieszenie", info_drive_desc: "Test pracy skrzyni biegów (płynność, szarpanie). Ocena stanu hamulców (tarcze/klocki), amortyzatorów oraz luzów w układzie kierowniczym i zawieszeniu.",
        info_int_title: "4. Wnętrze i Wyposażenie", info_int_desc: "Weryfikacja zużycia (kierownica, fotele) względem przebiegu. Test całej elektroniki, klimatyzacji, systemów audio oraz poszukiwanie śladów wilgoci/zalania.",
        info_diag_title: "5. Diagnostyka Komputerowa", info_diag_desc: "Podłączenie profesjonalnego skanera OBD. Odczyt błędów aktywnych i historycznych. Weryfikacja zapełnienia DPF oraz porównanie przebiegu w modułach sterujących.",
        info_test_title: "6. Jazda Próbna", info_test_desc: "Test dynamiczny przy różnych prędkościach. Weryfikacja prowadzenia, hamowania awaryjnego, pracy zawieszenia na nierównościach oraz niepokojących dźwięków.",

        packages_title: "WYBIERZ PAKIET",
        pkg_photos: "30-40 Zdjęć", pkg_docs: "Dokumenty", pkg_pdf: "Raport PDF",
        pkg_basic_incl: "Wszystko z Basic", pkg_obd: "Diagnostyka OBD", pkg_paint: "Miernik Lakieru", pkg_drive: "Jazda Próbna",
        pkg_standard_incl: "Wszystko ze Standard", pkg_negotiation: "Negocjacja Ceny", pkg_video: "Wideo 4K",
        btn_select: "WYBIERZ",

        reviews_title: "Klienci o nas",
        review_1: "\"Uratowali mnie przed zakupem powypadkowego BMW. Raport był niesamowicie szczegółowy.\"",
        review_2: "\"Profesjonalne podejście. Wideo z inspekcji pokazało problemy z silnikiem, które bym przeoczył.\"",
        review_3: "\"Auto kupione! Negocjacje pokryły koszt usługi z nawiązką. Polecam.\"",
        
        faq_title: "Częste Pytania",
        faq_q1: "Jak szybko otrzymam raport?", faq_a1: "Działamy błyskawicznie. Raport otrzymasz zazwyczaj w ciągu 24-48h od opłacenia zamówienia, zależnie od dostępności sprzedającego.",
        faq_q2: "Czy negocjujecie cenę?", faq_a2: "Tak, w pakiecie Premium. Znamy lokalny rynek i język, co pozwala nam często uzyskać rabaty przewyższające koszt naszej usługi.",
        faq_q3: "Gdzie dokładnie działacie?", faq_a3: "Nasza baza to Antwerpia. Obsługujemy całą Belgię, Holandię oraz zachodnie Niemcy (Nadrenia Północna-Westfalia).",
        faq_q4: "Co jeśli auto zostanie sprzedane?", faq_a4: "Jeśli nie zdążymy dojechać na inspekcję, bo auto zniknie z rynku – otrzymujesz natychmiastowy zwrot 100% środków.",
        faq_q5: "Czy mogę jechać z wami?", faq_a5: "Zazwyczaj działamy zdalnie, aby oszczędzić Twój czas, ale w pakiecie VIP jest możliwość wspólnego wyjazdu lub odbioru z lotniska.",
        faq_q6: "Jak wygląda płatność?", faq_a6: "Płacisz bezpiecznie online (Karta/BLIK) przez Stripe. Otrzymujesz fakturę na każdą usługę.",

        form_title: "SFINALIZUJ ZAMÓWIENIE", form_selected: "Wybrano", form_payment_method: "Wybierz metodę płatności",
        form_car_details: "DANE POJAZDU", btn_pay: "ZAPŁAĆ BEZPIECZNIE",
        contact_title: "GOTOWY NA IMPORT?",
        contact_desc: "Masz pytania przed zamówieniem? Skontaktuj się z nami bezpośrednio lub wyślij wiadomość.",
        contact_form_title: "Wyślij zapytanie", lbl_name: "Imię", lbl_email: "Email", lbl_message: "Wiadomość", btn_send: "WYŚLIJ WIADOMOŚĆ",
        footer_rights: "Wszelkie prawa zastrzeżone."
    },
    en: {
        nav_info: "Process", nav_services: "Pricing", nav_reviews: "Reviews & FAQ", nav_contact: "Contact",
        hero_title: "BUY CARS ABROAD<br><span class=\"text-accent-orange text-stroke\">WITHOUT RISK.</span>",
        hero_subtitle: "Comprehensive technical reports in Belgium, Netherlands, and Germany. We check what dealers won't tell you. Save time and avoid costly mistakes.",
        stat_cars: "Cars Inspected", stat_saved: "Money Saved", stat_time: "Response Time", stat_satisfaction: "Service Guarantee",
        hero_cta_desc: "Trust the experts. Save time, stress, and money.",
        hero_btn: "CHECK PRICES",

        info_title: "WHAT EXACTLY DO WE CHECK?",
        info_body_title: "1. Body & Paint", info_body_desc: "Precise paint thickness measurement (detecting putty and resprays). Panel gap analysis, glass originality, tire/rim condition, and signs of disassembly.",
        info_eng_title: "2. Engine & Components", info_eng_desc: "Cold and warm start analysis. Checking for leaks, injector performance, turbocharger operation, belts, and exhaust smoke.",
        info_drive_title: "3. Drivetrain & Suspension", info_drive_desc: "Gearbox test (smoothness, jerking). Evaluation of brakes (discs/pads), shock absorbers, steering play, and suspension noise.",
        info_int_title: "4. Interior & Equipment", info_int_desc: "Wear verification (steering wheel, seats) vs mileage. Testing all electronics, AC, audio systems, and checking for moisture/flood damage.",
        info_diag_title: "5. Computer Diagnostics", info_diag_desc: "Professional OBD scanning. Reading active and historic faults. DPF status check and mileage verification in control modules.",
        info_test_title: "6. Test Drive", info_test_desc: "Dynamic test at various speeds. Verification of handling, emergency braking, suspension behavior on bumps, and abnormal noises.",

        packages_title: "SELECT YOUR TIER",
        pkg_photos: "30-40 Photos", pkg_docs: "Docs Check", pkg_pdf: "PDF Report",
        pkg_basic_incl: "All in Basic", pkg_obd: "OBD Check", pkg_paint: "Paint Check", pkg_drive: "Test Drive",
        pkg_standard_incl: "All in Standard", pkg_negotiation: "Negotiation", pkg_video: "4K Video",
        btn_select: "SELECT",

        reviews_title: "Client Stories",
        review_1: "\"Saved me from buying a wrecked BMW. The report was incredibly detailed.\"",
        review_2: "\"Professional approach. The inspection video showed engine issues I would have missed.\"",
        review_3: "\"Car bought! The negotiations covered the service cost and more. Highly recommended.\"",

        faq_title: "Frequently Asked Questions",
        faq_q1: "How fast do I get the report?", faq_a1: "We act fast. Usually within 24-48h of payment, depending on seller availability.",
        faq_q2: "Do you negotiate prices?", faq_a2: "Yes, in the Premium package. We know the market and language, often saving you more than our fee.",
        faq_q3: "Where do you operate?", faq_a3: "Our base is Antwerp. We cover Belgium, Netherlands, and Western Germany (NRW).",
        faq_q4: "What if the car is sold?", faq_a4: "If we can't inspect because the car is gone, you get a 100% instant refund.",
        faq_q5: "Can I go with you?", faq_a5: "We usually work remotely to save your time, but VIP packages allow for joint trips or airport pickups.",
        faq_q6: "How does payment work?", faq_a6: "Secure online payment (Card/BLIK) via Stripe. You get an invoice for every service.",

        form_title: "FINALIZE ORDER", form_selected: "Selected", form_payment_method: "Select Payment Method",
        form_car_details: "VEHICLE DETAILS", btn_pay: "PAY SECURELY",
        contact_title: "READY TO IMPORT?",
        contact_desc: "Questions before ordering? Contact us directly or send a message.",
        contact_form_title: "Send Inquiry", lbl_name: "Name", lbl_email: "Email", lbl_message: "Message", btn_send: "SEND MESSAGE",
        footer_rights: "All rights reserved."
    },
    nl: {
        // NL Tłumaczenie (skrócone dla przykładu, zachowuje strukturę)
        nav_info: "Proces", nav_services: "Prijzen", nav_reviews: "Reviews & FAQ", nav_contact: "Contact",
        hero_title: "KOOP AUTO'S IN HET BUITENLAND<br><span class=\"text-accent-orange text-stroke\">ZONDER RISICO.</span>",
        hero_subtitle: "Uitgebreide technische rapporten in België, Nederland en Duitsland. Wij controleren wat de dealer niet vertelt.",
        stat_cars: "Auto's Gekeurd", stat_saved: "Geld Bespaard", stat_time: "Reactietijd", stat_satisfaction: "Garantie",
        hero_cta_desc: "Vertrouw de experts. Bespaar tijd en geld.",
        hero_btn: "BEKIJK PRIJZEN",

        info_title: "WAT CONTROLEREN WIJ PRECIES?",
        info_body_title: "1. Carrosserie & Lak", info_body_desc: "Nauwkeurige lakdikte meting. Controle op ongevallen, plamuur en corrosie.",
        info_eng_title: "2. Motor & Onderdelen", info_eng_desc: "Koude start analyse, lekkages, turbo, injectoren en uitlaatgassen.",
        info_drive_title: "3. Aandrijving & Ophanging", info_drive_desc: "Versnellingsbak test, remmen, schokdempers en stuurinrichting.",
        info_int_title: "4. Interieur & Uitrusting", info_int_desc: "Slijtagecheck vs kilometerstand. Test van elektronica en waterschade.",
        info_diag_title: "5. Computer Diagnose", info_diag_desc: "Professionele OBD-scan op foutcodes en kilometerstand verificatie.",
        info_test_title: "6. Proefrit", info_test_desc: "Dynamische test op de weg. Controle op weggedrag en geluiden.",

        packages_title: "KIES UW PAKKET",
        pkg_photos: "30-40 Foto's", pkg_docs: "Documenten", pkg_pdf: "PDF Rapport",
        pkg_basic_incl: "Alles in Basic", pkg_obd: "OBD Check", pkg_paint: "Lakdikte", pkg_drive: "Proefrit",
        pkg_standard_incl: "Alles in Standaard", pkg_negotiation: "Onderhandeling", pkg_video: "4K Video",
        btn_select: "KIES",

        reviews_title: "Klantverhalen",
        review_1: "\"Heeft me gered van een miskoop. Het rapport was zeer gedetailleerd.\"",
        review_2: "\"Professionele aanpak. De video toonde motorproblemen aan.\"",
        review_3: "\"Auto gekocht! De onderhandeling betaalde de service terug.\"",
        
        faq_title: "Veelgestelde Vragen",
        faq_q1: "Hoe snel krijg ik het rapport?", faq_a1: "Meestal binnen 24-48 uur.",
        faq_q2: "Onderhandelen jullie?", faq_a2: "Ja, in het Premium pakket.",
        faq_q3: "Waar werken jullie?", faq_a3: "Basis in Antwerpen. Dekking in BE/NL/DE.",
        faq_q4: "Wat als de auto verkocht is?", faq_a4: "100% terugbetaling.",
        faq_q5: "Kan ik mee?", faq_a5: "Meestal op afstand, maar VIP opties beschikbaar.",
        faq_q6: "Hoe betalen?", faq_a6: "Veilig online via Stripe (Kaart).",

        form_title: "ROND BESTELLING AF", form_selected: "Geselecteerd", form_payment_method: "Kies betaalmethode",
        form_car_details: "VOERTUIGDETAILS", btn_pay: "VEILIG BETALEN",
        contact_title: "KLAAR VOOR IMPORT?", contact_desc: "Vragen vooraf? Neem contact op.",
        contact_form_title: "Stuur bericht", lbl_name: "Naam", lbl_email: "E-mail", lbl_message: "Bericht", btn_send: "VERSTUUR",
        footer_rights: "Alle rechten voorbehouden."
    }
};

const prices = {
    Basic: { eur: 120, pln: 520 },
    Standard: { eur: 245, pln: 1050 },
    Premium: { eur: 545, pln: 2350 }
};

document.getElementById('lang-selector').addEventListener('change', (e) => {
    currentLang = e.target.value;
    updateContent();
    updatePricesDisplay();
});

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.innerHTML = translations[currentLang][key];
        }
    });
    const currencyCode = currentLang === 'pl' ? 'pln' : 'eur';
    document.getElementById('current-currency').value = currencyCode;
}

function updatePricesDisplay() {
    const currency = currentLang === 'pl' ? 'pln' : 'eur';
    const symbol = currentLang === 'pl' ? 'PLN' : '€';
    document.querySelectorAll('.price-display').forEach(el => {
        const pkgType = el.getAttribute('data-pkg');
        const pkgKey = pkgType.charAt(0).toUpperCase() + pkgType.slice(1);
        if (prices[pkgKey]) {
            el.innerText = currentLang === 'pl' ? `${prices[pkgKey][currency]} ${symbol}` : `${symbol}${prices[pkgKey][currency]}`;
        }
    });
}

window.selectPackage = function(pkgName) {
    currentPackage = pkgName;
    document.getElementById('selected-pkg').value = pkgName;
    const currency = currentLang === 'pl' ? 'pln' : 'eur';
    const price = prices[pkgName][currency];
    const symbol = currentLang === 'pl' ? 'PLN' : '€';
    document.getElementById('display-price-form').innerText = currentLang === 'pl' ? `${price} ${symbol}` : `${symbol}${price}`;
    document.getElementById('pkg-price-eur').value = prices[pkgName]['eur'];
    document.getElementById('order').scrollIntoView({behavior: 'smooth'});
}

const orderForm = document.getElementById('inspection-form');
const submitBtn = document.getElementById('submit-btn');
const originalBtnText = submitBtn.innerHTML;

orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-3"></i> Przetwarzanie...';
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
                price: priceValue,
                paymentId: result.paymentIntent.id
            };

            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            
            alert(currentLang === 'pl' ? 'Dziękujemy! Zamówienie opłacone.' : 'Thank you! Order paid.');
            orderForm.reset();
            card.clear();
            submitBtn.innerHTML = '<i class="fas fa-check-circle mr-3"></i> Opłacone';
            setTimeout(() => { submitBtn.disabled = false; submitBtn.innerHTML = originalBtnText; }, 3000);
        }
    } catch (error) {
        document.getElementById('card-errors').innerText = error.message;
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// Contact Form Logic
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
                alert(currentLang === 'pl' ? 'Wiadomość wysłana!' : 'Message sent!');
                contactForm.reset();
            } else {
                throw new Error('Error');
            }
        } catch (err) {
            alert('Błąd wysyłania. Spróbuj WhatsApp.');
        } finally {
            btn.disabled = false;
            btn.innerText = originalText;
        }
    });
}

updatePricesDisplay();
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) target.scrollIntoView();
    });
});