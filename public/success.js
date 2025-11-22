document.addEventListener('DOMContentLoaded', () => {
    // 1. Pobierz parametry z URL
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang') || 'pl'; // Domyślnie PL
    const method = params.get('method') || 'card'; // Domyślnie Karta

    // 2. Słownik tłumaczeń dla tej podstrony
    const texts = {
        pl: {
            title: "DZIĘKUJEMY!",
            desc: "Twoje zamówienie zostało opłacone i przyjęte do realizacji.",
            what_now: "CO TERAZ?",
            step1: "Nasz koordynator skontaktuje się ze sprzedawcą w ciągu 24h.",
            step2: "Potwierdzimy dostępność auta i termin inspekcji mailowo.",
            step3: "Po inspekcji otrzymasz Raport PDF i link do zdjęć.",
            btn_home: "Powrót na stronę główną",
            summary_title: "PODSUMOWANIE",
            lbl_date: "Data zakupu",
            lbl_order: "Numer zamówienia",
            lbl_method: "Metoda płatności",
            lbl_pkg: "Pakiet",
            lbl_amount: "Kwota",
            lbl_buyer: "Dane Kupującego",
            footer_note: "Potwierdzenie zostało wysłane na Twój adres email."
        },
        en: {
            title: "THANK YOU!",
            desc: "Your order has been paid and accepted for processing.",
            what_now: "WHAT'S NEXT?",
            step1: "Our coordinator will contact the seller within 24h.",
            step2: "We will confirm car availability and inspection date via email.",
            step3: "After inspection, you will receive a PDF Report and photo link.",
            btn_home: "Back to Home",
            summary_title: "SUMMARY",
            lbl_date: "Date",
            lbl_order: "Order ID",
            lbl_method: "Payment Method",
            lbl_pkg: "Package",
            lbl_amount: "Amount",
            lbl_buyer: "Buyer Details",
            footer_note: "A confirmation has been sent to your email address."
        },
        nl: {
            title: "BEDANKT!",
            desc: "Uw bestelling is betaald en geaccepteerd voor verwerking.",
            what_now: "WAT NU?",
            step1: "Onze coördinator neemt binnen 24 uur contact op met de verkoper.",
            step2: "We bevestigen de beschikbaarheid en inspectiedatum per e-mail.",
            step3: "Na inspectie ontvangt u een PDF-rapport en fotolink.",
            btn_home: "Terug naar Start",
            summary_title: "OVERZICHT",
            lbl_date: "Datum",
            lbl_order: "Bestelnummer",
            lbl_method: "Betaalmethode",
            lbl_pkg: "Pakket",
            lbl_amount: "Bedrag",
            lbl_buyer: "Kopersgegevens",
            footer_note: "Een bevestiging is naar uw e-mailadres verzonden."
        }
    };

    // 3. Aplikuj tłumaczenia
    const t = texts[lang];
    
    if (t) {
        document.getElementById('t-title').innerText = t.title;
        document.getElementById('t-desc').innerText = t.desc;
        document.getElementById('t-what-now').innerText = t.what_now;
        document.getElementById('t-step1').innerText = t.step1;
        document.getElementById('t-step2').innerText = t.step2;
        document.getElementById('t-step3').innerText = t.step3;
        document.getElementById('t-btn-home').innerHTML = `<i class="fas fa-arrow-left mr-2"></i> ${t.btn_home}`;
        
        document.getElementById('t-summary-title').innerText = t.summary_title;
        document.getElementById('t-lbl-date').innerText = t.lbl_date;
        document.getElementById('t-lbl-order').innerText = t.lbl_order;
        document.getElementById('t-lbl-method').innerText = t.lbl_method;
        document.getElementById('t-lbl-pkg').innerText = t.lbl_pkg;
        document.getElementById('t-lbl-amount').innerText = t.lbl_amount;
        document.getElementById('t-lbl-buyer').innerText = t.lbl_buyer;
        document.getElementById('t-footer-note').innerText = t.footer_note;
    }

    // 4. Wypełnij dane z URL
    const now = new Date();
    document.getElementById('date').innerText = now.toLocaleDateString();
    
    document.getElementById('order-id').innerText = params.get('id') || '#---';
    document.getElementById('pkg-name').innerText = (params.get('pkg') || 'Standard').toUpperCase();
    document.getElementById('price').innerText = params.get('price') || '---';
    document.getElementById('client-name').innerText = params.get('name') || '---';
    document.getElementById('client-email').innerText = params.get('email') || '---';

    // 5. Obsługa ikony płatności
    const methodEl = document.getElementById('payment-method-display');
    if (method === 'blik') {
        methodEl.innerHTML = '<i class="fas fa-mobile-alt text-red-500"></i> BLIK';
    } else if (method === 'paypal') {
        methodEl.innerHTML = '<i class="fab fa-paypal text-blue-400"></i> PayPal';
    } else {
        // Domyślnie Karta
        methodEl.innerHTML = '<i class="fas fa-credit-card"></i> ' + (lang === 'pl' ? 'Karta' : 'Card');
    }
});