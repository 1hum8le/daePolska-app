// Plik: emailTemplates.js

const getAdminEmailText = (data) => {
    return `
=========================================
 NOWE ZAMÓWIENIE OPŁACONE
=========================================

DANE KLIENTA:
👤 Imię i nazwisko: ${data.name}
📧 Email: ${data.email}
📞 Telefon: ${data.phone || "Nie podano"}

SZCZEGÓŁY ZLECENIA:
📦 Pakiet: ${data.packageType}
💰 Kwota: ${data.price}
🆔 ID Płatności: ${data.paymentId}

DANE POJAZDU:
📍 Lokalizacja: ${data.location}
🚗 Link: ${data.url}

-----------------------------------------
Zaloguj się do bazy lub Stripe, aby sprawdzić szczegóły.
`;
};

const getClientEmailText = (data) => {
    return `
Dzień dobry ${data.name}!

Dziękujemy za opłacenie zamówienia na inspekcję pojazdu.
Twój numer zamówienia to: #${data.orderId}

Co dzieje się teraz?
1. Nasz koordynator skontaktuje się ze sprzedawcą auta (zazwyczaj w ciągu 24h).
2. Potwierdzimy dostępność samochodu.
3. Ustalimy termin inspekcji i poinformujemy Cię mailowo.

SZCZEGÓŁY ZAMÓWIENIA:
--------------------------------------------------
📦 Pakiet: ${data.packageType}
🚗 Link do auta: ${data.url}
📍 Lokalizacja: ${data.location}
--------------------------------------------------

Ważne informacje:
Jest to wiadomość automatyczna - prosimy na nią nie odpowiadać bezpośrednio.
W razie pytań prosimy o kontakt poprzez formularz na stronie lub bezpośrednio na email biura.

Dziękujemy za zaufanie!

Pozdrawiamy,
Zespół daePoland

--
Email: daePoland@outlook.com
Strona: https://daepoland.com
`;
};

module.exports = { getAdminEmailText, getClientEmailText };