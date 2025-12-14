document.addEventListener('DOMContentLoaded', () => {
    // 1. Pobierz parametry z URL
    const params = new URLSearchParams(window.location.search);
    
    // Priorytet: URL (?lang=fr) -> LocalStorage -> Domyślnie PL
    const lang = params.get('lang') || localStorage.getItem('selectedLang') || 'pl';
    const method = params.get('method') || 'card';

    // 2. Baza tłumaczeń (PL, EN, NL, FR, ES)
    const translations = {
        // POLSKI
        pl: {
            page_title: "Zamówienie Potwierdzone | daePolska",
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
            footer_note: "Potwierdzenie zostało wysłane na Twój adres email.",
            pay_card: "Karta",
            pay_blik: "BLIK",
            pay_paypal: "PayPal"
        },
        // ENGLISH
        en: {
            page_title: "Order Confirmed | daePolska",
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
            footer_note: "A confirmation has been sent to your email address.",
            pay_card: "Card",
            pay_blik: "BLIK",
            pay_paypal: "PayPal"
        },
        // NEDERLANDS
        nl: {
            page_title: "Bestelling Bevestigd | daePolska",
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
            footer_note: "Een bevestiging is naar uw e-mailadres verzonden.",
            pay_card: "Kaart",
            pay_blik: "BLIK",
            pay_paypal: "PayPal"
        },
        // FRANÇAIS
        fr: {
            page_title: "Commande Confirmée | daePolska",
            title: "MERCI !",
            desc: "Votre commande a été payée et acceptée pour traitement.",
            what_now: "ET MAINTENANT ?",
            step1: "Notre coordinateur contactera le vendeur sous 24h.",
            step2: "Nous confirmerons la disponibilité et la date par e-mail.",
            step3: "Après l'inspection, vous recevrez un rapport PDF et des photos.",
            btn_home: "Retour à l'accueil",
            summary_title: "RÉSUMÉ",
            lbl_date: "Date",
            lbl_order: "N° de commande",
            lbl_method: "Moyen de paiement",
            lbl_pkg: "Forfait",
            lbl_amount: "Montant",
            lbl_buyer: "Acheteur",
            footer_note: "Une confirmation a été envoyée à votre adresse e-mail.",
            pay_card: "Carte Bancaire",
            pay_blik: "BLIK",
            pay_paypal: "PayPal"
        },
        // ESPAÑOL
        es: {
            page_title: "Pedido Confirmado | daePolska",
            title: "¡GRACIAS!",
            desc: "Su pedido ha sido pagado y aceptado para su procesamiento.",
            what_now: "¿QUÉ SIGUE?",
            step1: "Nuestro coordinador contactará al vendedor en 24h.",
            step2: "Confirmaremos disponibilidad y fecha de inspección por correo.",
            step3: "Tras la inspección, recibirá un informe PDF y enlace a fotos.",
            btn_home: "Volver al inicio",
            summary_title: "RESUMEN",
            lbl_date: "Fecha",
            lbl_order: "Nº de pedido",
            lbl_method: "Método de pago",
            lbl_pkg: "Paquete",
            lbl_amount: "Importe",
            lbl_buyer: "Datos del comprador",
            footer_note: "Se ha enviado una confirmación a su correo electrónico.",
            pay_card: "Tarjeta",
            pay_blik: "BLIK",
            pay_paypal: "PayPal"
        }
    };

    // 3. Aplikuj tłumaczenia (Fallback na PL jeśli brak języka)
    const t = translations[lang] || translations['pl']; 

    // Pętla po wszystkich elementach z data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.innerText = t[key];
        }
    });

    // 4. Wypełnij dane z URL
    const now = new Date();
    document.getElementById('date').innerText = now.toLocaleDateString(lang === 'pl' ? 'pl-PL' : lang === 'en' ? 'en-GB' : 'fr-FR');
    
    document.getElementById('order-id').innerText = params.get('id') || '#---';
    document.getElementById('pkg-name').innerText = (params.get('pkg') || 'Standard').toUpperCase();
    document.getElementById('price').innerText = params.get('price') || '---';
    document.getElementById('client-name').innerText = params.get('name') || '---';
    document.getElementById('client-email').innerText = params.get('email') || '---';

    // 5. Obsługa ikony płatności
    const methodEl = document.getElementById('payment-method-display');
    if (method === 'blik') {
        methodEl.innerHTML = `<i class="fas fa-mobile-alt text-red-500"></i> ${t.pay_blik}`;
    } else if (method === 'paypal') {
        methodEl.innerHTML = `<i class="fab fa-paypal text-blue-400"></i> ${t.pay_paypal}`;
    } else {
        // Domyślnie Karta
        methodEl.innerHTML = `<i class="fas fa-credit-card"></i> ${t.pay_card}`;
    }
});