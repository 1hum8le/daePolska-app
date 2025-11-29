export const translations = {
    // ================= POLSKI (PL) - BAZA =================
    pl: {
        // NAWIGACJA
        nav_info: "Proces", nav_services: "Cennik", nav_reviews: "Opinie", nav_contact: "Kontakt", nav_whyus: "Dlaczego My?",
        // NAWIGACJA FOOTER
        nav_info_footer: "Proces Inspekcji", nav_services_footer: "Cennik i Pakiety", nav_reviews_footer: "Opinie Klientow", nav_contact_footer: "Kontakt", nav_whyus_footer: "Dlaczego My?",
        
        // HERO
        hero_title: "KUPUJ AUTA ZZA GRANICY<br><span class=\"text-accent-orange text-stroke\">BEZ RYZYKA.</span>",
        hero_subtitle: "Kompleksowe raporty techniczne aut w Belgii, Holandii i Niemczech. Sprawdzamy to, czego handlarz nie powie. Oszczędź czas i uniknij kosztownych wpadek.",
        stat_cars: "Sprawdzonych Aut", stat_saved: "Zaoszczędzone", stat_time: "Czas Reakcji", stat_satisfaction: "Gwarancja Usługi",
        hero_cta_desc: "Zaufaj ekspertom. Oszczędź czas, nerwy i pieniądze.",
        hero_btn: "SPRAWDŹ OFERTĘ",

        // PROCES
        info_title: "CO DOKŁADNIE SPRAWDZAMY?",
        info_body_title: "1. Nadwozie i Lakier", info_body_desc: "Precyzyjny pomiar grubości lakieru (wykrywanie szpachli i drugiej warstwy). Ocena spasowania elementów, oryginalności szyb, stanu opon i felg oraz poszukiwanie śladów demontażu.",
        info_eng_title: "2. Silnik i Osprzęt", info_eng_desc: "Analiza pracy na zimnym i ciepłym silniku. Weryfikacja wycieków, pracy wtryskiwaczy, turbosprężarki, paska osprzętu oraz dymienia z układu wydechowego.",
        info_drive_title: "3. Napęd i Zawieszenie", info_drive_desc: "Test pracy skrzyni biegów (płynność, szarpanie). Ocena stanu hamulców (tarcze/klocki), amortyzatorów oraz luzów w układzie kierowniczym i zawieszeniu.",
        info_int_title: "4. Wnętrze i Wyposażenie", info_int_desc: "Weryfikacja zużycia (kierownica, fotele) względem przebiegu. Test całej elektroniki, klimatyzacji, systemów audio oraz poszukiwanie śladów wilgoci/zalania.",
        info_diag_title: "5. Diagnostyka Komputerowa", info_diag_desc: "Podłączenie profesjonalnego skanera OBD. Odczyt błędów aktywnych i historycznych. Weryfikacja zapełnienia DPF oraz porównanie przebiegu w modułach sterujących.",
        info_test_title: "6. Jazda Próbna", info_test_desc: "Test dynamiczny przy różnych prędkościach. Weryfikacja prowadzenia, hamowania awaryjnego, pracy zawieszenia na nierównościach oraz niepokojących dźwięków.",

        // DLACZEGO MY (Brakowało tego!)
        why_title: "DLACZEGO TO SIĘ <span class=\"text-accent-orange\">OPŁACA?</span>",
        why_desc: "Import auta to nie tylko lepsza jakość dróg i serwisu. To przede wszystkim matematyka. Kupując bezpośrednio, omijasz marżę handlarza, koszty jego transportu i ryzyko \"korekty licznika\".",
        why_ex_title: "PRZYKŁAD Z ŻYCIA (BMW Seria 3):",
        why_pl_label: "Cena u handlarza w PL:",
        why_be_label: "To samo auto w Belgii:",
        why_save_label: "TWOJA OSZCZĘDNOŚĆ:",
        why_note: "*Nawet po odliczeniu kosztów inspekcji i transportu, zyskujesz pewne auto i tysiące złotych w kieszeni.",
        
        why_icon1_title: "Digital Control", why_icon1_desc: "Pełna transparentność. Widzisz auto tak, jakbyś tam był. 50+ zdjęć i wideo 4K.",
        why_icon2_title: "Pomoc w Transporcie", why_icon2_desc: "Nie masz lawety? Pomożemy zorganizować bezpieczny transport pod Twój dom w uczciwej cenie.",
        why_icon3_title: "Negocjacje w cenie", why_icon3_desc: "Znamy język i rynek. Często urywamy z ceny więcej, niż kosztuje nasza usługa.",

        // CENNIK
        packages_title: "WYBIERZ PAKIET",
        package_desc: "Każdy pakiet zawiera dojazd do klienta w promieniu 150km od Antwerpii. Dalsze trasy wyceniamy indywidualnie.",
        // Basic
        pkg_photos: "30-40 Zdjęć", pkg_photos_desc: "Wysoka rozdzielczość. Dokumentacja każdej rysy, wgniecenia i detalu wnętrza.",
        pkg_docs: "Weryfikacja Dokumentów", pkg_docs_desc: "Sprawdzenie zgodności VIN, dowodu rej., Car-Pass i historii serwisowej.",
        pkg_pdf: "Raport PDF", pkg_pdf_desc: "Czytelne podsumowanie stanu wizualnego wysłane na Twój e-mail.",
        // Standard
        pkg_basic_incl: "Wszystko co w pakiecie Basic",
        most_popular: "Najczęściej Wybierany",
        pkg_obd: "Pełna Diagnostyka OBD", pkg_obd_desc: "Podpięcie komputera. Skan wtrysków, DPF, skrzyni i weryfikacja przebiegu w modułach.",
        pkg_paint: "Miernik Lakieru", pkg_paint_desc: "Profesjonalny pomiar grubości powłoki. Wykrywamy szpachlę i powypadkową przeszłość.",
        pkg_drive: "Jazda Próbna", pkg_drive_desc: "Test dynamiczny. Sprawdzenie zawieszenia, hamulców, sprzęgła i prowadzenia auta.",
        // Premium
        pkg_standard_incl: "Wszystko co w pakiecie Standard",
        pkg_negotiation: "Negocjacja Ceny", pkg_negotiation_desc: "Negocjujemy w Twoim imieniu w lokalnym języku. Często odzyskujemy koszt tej usługi z nawiązką.",
        pkg_video: "Wideo 4K + VIP", pkg_video_desc: "Szczegółowe nagranie z komentarzem eksperta. Priorytetowa realizacja zlecenia.",
        
        // PRZYCISKI WYBORU
        btn_select_basic: "WYBIERZ BASIC",
        btn_select_standard: "WYBIERZ STANDARD",
        btn_select_premium: "WYBIERZ PREMIUM",
        
        // OPINIE
        reviews_title: "HISTORIE KLIENTÓW",
        review_1: "\"Handlarz zarzekał się, że auto to 'igła'. Raport DAE pokazał wspawaną ćwiartkę i brak poduszek. Uratowaliście mi 60 tys. zł. Dziękuję!\"",
        review_2: "\"Chciałem jechać 1200km w ciemno. Inspekcja wykazała uszkodzone wtryski i dwumasę. Koszt naprawy przewyższyłby wartość auta. Nie warto ryzykować.\"",
        review_3: "\"Wzięłam pakiet Premium. Pan Jakub wynegocjował po niderlandzku 800 EUR rabatu. Usługa nie tylko się zwróciła, ale jeszcze na tym zarobiłam.\"",
        review_4: "\"Raport PDF to mistrzostwo. 50 zdjęć, wideo 4K, pomiar każdego elementu blacharskiego. Wiedziałem o aucie więcej niż sprzedający.\"",
        
       // --- FAQ (Zgodne z index.html PL) ---
        faq_title: "CZĘSTE PYTANIA",
        faq_q1: "Jak szybko otrzymam raport?", 
        faq_a1: "Szanujemy Twój czas, a dobre auta znikają szybko. Działamy natychmiast po zaksięgowaniu wpłaty. Kontaktujemy się ze sprzedawcą, rezerwujemy oględziny i zazwyczaj dostarczamy pełny raport w ciągu 24-48 godzin roboczych.",
        
        faq_q2: "Czy wynegocjujecie lepszą cenę?", 
        faq_a2: "Tak, to kluczowy element pakietu Premium. Znamy lokalny rynek, język i techniczne argumenty, których trudno użyć przez telefon z Polski. Często uzyskujemy rabaty przewyższające koszt naszej usługi, więc inspekcja może Cię nic nie kosztować.",
        
        faq_q3: "Gdzie dokładnie działacie?", 
        faq_a3: "Nasza baza operacyjna znajduje się w strategicznym punkcie – w Antwerpii. Pozwala nam to szybko dotrzeć do każdego auta w Belgii, całej Holandii oraz w zachodniej części Niemiec (rejon Nadrenii Północnej-Westfalii). Dalsze trasy realizujemy po indywidualnej wycenie.",
        
        faq_q4: "Co jeśli auto zostanie sprzedane przed waszym przyjazdem?", 
        faq_a4: "Nic nie ryzykujesz. Działamy fair. Jeśli po opłaceniu zamówienia okaże się, że auto zniknęło z rynku lub sprzedawca odmówił oględzin zanim wyruszyliśmy w trasę – otrzymujesz natychmiastowy zwrot 100% wpłaconych środków na konto.",
        
        faq_q5: "Czy mogę jechać z wami na inspekcję?", 
        faq_a5: "Nasz model pracy opiera się na szybkości i logistyce – inspektorzy często realizują kilka zleceń na jednej trasie, dlatego pracujemy zdalnie. Jesteśmy Twoimi oczami na miejscu. Jeśli zależy Ci na wspólnym wyjeździe lub odbiorze z lotniska, skontaktuj się z nami w celu ustalenia indywidualnej usługi Concierge.",
        
        faq_q6: "Jak wygląda płatność i faktura?", 
        faq_a6: "Stawiamy na bezpieczeństwo. Płatność odbywa się przez certyfikowaną bramkę Stripe (Karta, Google Pay, Apple Pay). Środki są chronione. Na każdą usługę wystawiamy legalną fakturę/rachunek (bez VAT lub VAT marża w zależności od usługi), co jest gwarancją legalności naszej firmy.",
        
        // FORMULARZ
        raport:"ZOBACZ PRZYKŁADOWY RAPORT",
        form_title: "SFINALIZUJ ZAMÓWIENIE", form_selected: "Wybrano", form_payment_method: "Wybierz metodę płatności",
        form_car_details: "DANE POJAZDU", btn_pay: "ZAPŁAĆ BEZPIECZNIE", 
        terms_text: "Akceptuję <a href='terms.html' target='_blank' class='underline hover:text-accent-orange'>Regulamin</a> i <a href='privacy.html' target='_blank' class='underline hover:text-accent-orange'>Politykę Prywatności</a>. Rozumiem, że usługa jest opinią techniczną.",
        err_required: "To pole jest wymagane.",
        err_terms: "Musisz zaakceptować regulamin.",
        btn_processing: "Przetwarzanie...",
        
        // KONTAKT
        contact_title: "GOTOWY NA IMPORT?", contact_desc: "Masz pytania przed zamówieniem? Chcesz ustalić szczegóły nietypowego zlecenia? Skontaktuj się z nami bezpośrednio lub wyślij wiadomość przez formularz.",
        contact_form_title: "Wyślij zapytanie", lbl_name: "Imię i Nazwisko", ph_name: "Jan Kowalski",
        lbl_email: "Email", ph_email: "jan@przyklad.com", lbl_message: "Wiadomość", btn_send: "WYŚLIJ WIADOMOŚĆ", ph_message: "Treść wiadomości...",
        lbl_phone_title: "Telefon / WhatsApp", // NOWE
        lbl_email_title: "Email", // NOWE

        // --- FOOTER (Z NOWYMI KLUCZAMI) ---
        footer_about: "Profesjonalne inspekcje przedzakupowe na terenie Belgii, Holandii i Niemiec. Chronimy Twój kapitał przed nieuczciwymi sprzedawcami, dostarczając rzetelną wiedzę techniczną.", // NOWE
        footer_nav_title: "Nawigacja", // NOWE
        footer_docs_title: "Dokumenty Prawne", // NOWE
        footer_office_title: "Dane Kontaktowe", // NOWE
        footer_address: "Antwerpia, Belgia", // NOWE
        footer_hq: "(Baza Operacyjna / Siedziba)", // NOWE
        footer_rights: "Wszelkie prawa zastrzeżone.",
        footer_terms: "Regulamin Świadczenia Usług", // NOWE
        footer_privacy: "Polityka Prywatności (RODO)", // NOWE
        footer_cookies: "Polityka Plików Cookies", // NOWE
        footer_refunds: "Zwroty i Reklamacje", // NOWE
        footer_secured: "Secure Payments by Stripe", // NOWE
        footer_ssl: "SSL Encrypted Connection", // NOWE
        
        lbl_phone: "Telefon (Opcjonalnie)", ph_phone: "+48 ... (Opcjonalnie)",
        ph_url: "Link do ogłoszenia", ph_loc: "Miasto, Kraj",
        txt_secure: "Płatności szyfrowane SSL", txt_redirect: "Przekierowanie", txt_redirect_desc: "Zostaniesz przeniesiony do bramki płatności po kliknięciu.",
        footer_rights: "Wszelkie prawa zastrzeżone.",

        // --- NOWE KLUCZE DO FORMULARZA (WKLEJ DO translations.js) ---
        lbl_client_data: "Dane Zlecającego", // Client Details
        lbl_url: "Link do ogłoszenia",       // Listing Link / Ad URL
        lbl_loc: "Lokalizacja (Miasto)",     // Location (City)
        form_payment_header: "Płatność",     // Payment
        
        lbl_phone: "Telefon (Opcjonalnie)", ph_phone: "+48 ... (Opcjonalnie)",
        ph_url: "Link do ogłoszenia", ph_loc: "Miasto, Kraj",
        txt_secure: "Płatności szyfrowane SSL", txt_redirect: "Przekierowanie", txt_redirect_desc: "Zostaniesz przeniesiony do bramki płatności po kliknięciu.",
    },

    // ================= ANGIELSKI (EN) =================
    en: {
        // --- NAVIGATION ---
        nav_info: "Process", 
        nav_services: "Pricing", 
        nav_reviews: "Reviews", 
        nav_contact: "Contact",
        nav_whyus: "Why Us?",
        
        // --- HERO SECTION ---
        hero_title: "BUY CARS ABROAD<br><span class=\"text-accent-orange text-stroke\">WITHOUT RISK.</span>",
        hero_subtitle: "Comprehensive technical reports in Belgium, Netherlands, and Germany. We verify what the dealer won't tell you. Save time and avoid costly mistakes.",
        stat_cars: "Cars Inspected", 
        stat_saved: "Money Saved", 
        stat_time: "Response Time", 
        stat_satisfaction: "Service Guarantee",
        hero_cta_desc: "Trust the experts. Save time, stress, and money.",
        hero_btn: "CHECK PRICES",

        // --- PROCESS ---
        info_title: "WHAT EXACTLY DO WE CHECK?",
        info_body_title: "1. Body & Paint", 
        info_body_desc: "Precise paint thickness measurement (detecting putty and second layers). Assessment of panel gaps, glass originality, tire and rim condition, and search for disassembly traces.",
        
        info_eng_title: "2. Engine & Components", 
        info_eng_desc: "Cold and warm engine operation analysis. Verification of leaks, injector performance, turbocharger operation, accessory belt, and exhaust smoke.",
        
        info_drive_title: "3. Drivetrain & Suspension", 
        info_drive_desc: "Gearbox operation test (smoothness, jerking). Assessment of brakes (discs/pads), shock absorbers, steering play, and suspension noise.",
        
        info_int_title: "4. Interior & Equipment", 
        info_int_desc: "Wear verification (steering wheel, seats) versus mileage. Testing all electronics, air conditioning, audio systems, and searching for moisture/flood traces.",
        
        info_diag_title: "5. Computer Diagnostics", 
        info_diag_desc: "Connection of a professional OBD scanner. Reading active and historic faults. DPF saturation verification and mileage comparison in control modules.",
        
        info_test_title: "6. Test Drive", 
        info_test_desc: "Dynamic test at various speeds. Verification of handling, emergency braking, suspension operation on bumps, and disturbing noises.",

        // --- WHY US? ---
        why_title: "WHY IS IT <span class=\"text-accent-orange\">WORTH IT?</span>",
        why_desc: "Importing a car is not just about better roads and service. It's mainly math. Buying directly, you skip the dealer's margin, transport costs, and \"odometer fraud\" risks.",
        why_ex_title: "REAL EXAMPLE (BMW 3 Series):",
        why_pl_label: "Dealer price in PL:",
        why_be_label: "Same car in Belgium:",
        why_save_label: "YOUR SAVINGS:",
        why_note: "*Even after deducting inspection and transport costs, you gain a reliable car and thousands in your pocket.",
        
        why_icon1_title: "Digital Control", 
        why_icon1_desc: "Full transparency. You see the car as if you were there. 50+ photos and 4K video.",
        why_icon2_title: "Transport Help", 
        why_icon2_desc: "Don't have a trailer? We help organize safe transport to your door at a fair price.",
        why_icon3_title: "Price Negotiation", 
        why_icon3_desc: "We know the language and market. We often cut more from the price than our service costs.",

     // PRICING
        packages_title: "SELECT YOUR TIER",
        package_desc: "Every package includes travel within a 150km radius of Antwerp. Further distances are priced individually.",
        raport: "VIEW SAMPLE REPORT",
        btn_processing: "PROCESSING...",
        // Basic
        pkg_photos: "30-40 Photos", pkg_photos_desc: "High resolution. Documentation of every scratch, dent, and interior detail.",
        pkg_docs: "Docs Verification", pkg_docs_desc: "Checking VIN match, registration papers, Car-Pass, and service history.",
        pkg_pdf: "PDF Report", pkg_pdf_desc: "A clear visual condition summary sent directly to your email.",
        // Standard
        pkg_basic_incl: "All in Basic",
        most_popular: "Most Popular",
        pkg_obd: "Full OBD Diagnostics", pkg_obd_desc: "Computer connection. Scanning injectors, DPF, gearbox, and verifying mileage in modules.",
        pkg_paint: "Paint Thickness", pkg_paint_desc: "Professional coating measurement. We detect putty and accident history.",
        pkg_drive: "Test Drive", pkg_drive_desc: "Dynamic test. Checking suspension, brakes, clutch, and handling.",
        // Premium
        pkg_standard_incl: "All in Standard",
        pkg_negotiation: "Price Negotiation", pkg_negotiation_desc: "We negotiate on your behalf in the local language. We often recover the service cost with interest.",
        pkg_video: "4K Video + VIP", pkg_video_desc: "Detailed recording with expert commentary. Priority service execution.",

        // BUTTONS
        btn_select_basic: "CHOOSE BASIC",
        btn_select_standard: "CHOOSE STANDARD",
        btn_select_premium: "CHOOSE PREMIUM",

        // --- REVIEWS ---
        reviews_title: "CLIENT STORIES",
        review_1: "\"The dealer swore the car was perfect. DAE report showed a welded quarter panel and missing airbags. You saved me 60k PLN. Thank you!\"",
        review_2: "\"I wanted to drive 1200km blindly. Inspection revealed damaged injectors and dual-mass flywheel. Repair would exceed car value. Not worth the risk.\"",
        review_3: "\"I took the Premium package. Mr. Jakub negotiated an 800 EUR discount in Dutch. The service paid for itself and I even made a profit.\"",
        review_4: "\"The PDF report is a masterpiece. 50 photos, 4K video, measurement of every body element. I knew more about the car than the seller did.\"",

        lbl_client_data: "Client Details", // Client Details
        lbl_url: "Listing Link",       // Listing Link / Ad URL
        lbl_loc: "Location (City)",     // Location (City)
        form_payment_header: "Payment",     // Payment


// --- FAQ (English - Full Sales Copy) ---
        faq_title: "FREQUENTLY ASKED QUESTIONS",
        
        faq_q1: "How fast do I get the report?", 
        faq_a1: "We respect your time, and good cars disappear quickly. We act immediately after the payment is booked. We contact the seller, schedule the inspection, and usually deliver the full report within 24-48 working hours.",
        
        faq_q2: "Do you negotiate prices?", 
        faq_a2: "Yes, this is a key element of the Premium package. We know the local market, the language, and technical arguments that are hard to use over the phone from abroad. We often obtain discounts exceeding the cost of our service, so the inspection might cost you nothing.",
        
        faq_q3: "Where exactly do you operate?", 
        faq_a3: "Our operational base is located in a strategic point – Antwerp. This allows us to quickly reach any car in Belgium, the entire Netherlands, and Western Germany (North Rhine-Westphalia). Further routes are realized upon individual valuation.",
        
        faq_q4: "What if the car is sold before your arrival?", 
        faq_a4: "You risk nothing. We play fair. If, after paying for the order, it turns out the car has disappeared from the market or the seller refused inspection before we hit the road – you receive an instant 100% refund to your account.",
        
        faq_q5: "Can I go with you for the inspection?", 
        faq_a5: "Our work model is based on speed and logistics – inspectors often handle several orders on one route, which is why we work remotely. We are your eyes on the spot. If you care about a joint trip or airport pickup, please contact us to arrange an individual Concierge service.",
        
        faq_q6: "What does payment and invoice look like?", 
        faq_a6: "We focus on security. Payment takes place via the certified Stripe gateway (Card, Google Pay, Apple Pay). Funds are protected. For every service, we issue a legal invoice/bill, which is a guarantee of our company's legality.",

        // --- ORDER FORM & CONTACT ---
        form_title: "FINALIZE ORDER", 
        form_selected: "Selected", 
        form_payment_method: "Payment Method",
        form_car_details: "VEHICLE DETAILS", 
        btn_pay: "PAY SECURELY",
        
        contact_title: "READY TO IMPORT?",
        contact_desc: "Have questions before ordering? Want to discuss the details of a custom order? Contact us directly or send a message through the form.",
        contact_form_title: "Send Inquiry", 
        lbl_name: "Full Name", ph_name: "John Doe",
        lbl_email: "Email", ph_email: "john@example.com", 
        lbl_message: "Message", ph_message: "Your message...",
        btn_send: "SEND MESSAGE",
        footer_rights: "All rights reserved.",

        lbl_phone_title: "Phone / WhatsApp",
        lbl_email_title: "Email",
        
        lbl_phone: "Phone (Optional)", ph_phone: "+1 ... (Optional)",
        ph_url: "Listing Link", ph_loc: "City, Country",
        
        txt_secure: "Encrypted by Stripe SSL", 
        txt_redirect: "Redirecting...", 
        txt_redirect_desc: "You will be redirected to payment gateway.",
        // ...
        terms_text: "I accept the <a href='terms.html' target='_blank' class='underline hover:text-accent-orange'>Terms</a> & <a href='privacy.html' target='_blank' class='underline hover:text-accent-orange'>Privacy Policy</a>. I understand the service is a technical opinion.",
        err_required: "This field is required.",
        err_terms: "You must accept the terms.",
        // ...
        // --- FOOTER (WITH NEW KEYS) ---
        footer_about: "Professional pre-purchase inspections in Belgium, Netherlands, and Germany. We protect your capital from dishonest sellers by providing reliable technical knowledge.",
        footer_nav_title: "Navigation",
        footer_docs_title: "Legal Documents",
        footer_office_title: "Contact Details",
        footer_address: "Antwerp, Belgium",
        footer_hq: "(Operational Base / HQ)",
        footer_terms: "Terms of Service",
        footer_privacy: "Privacy Policy (GDPR)",
        footer_cookies: "Cookie Policy",
        footer_refunds: "Returns & Complaints",
        footer_secured: "Secure Payments by Stripe",
        footer_ssl: "SSL Encrypted Connection",
        
    },
    
    // ================= NIDERLANDZKI (NL) =================
    nl: {
        // --- NAVIGATIE ---
        nav_info: "Werkwijze", 
        nav_services: "Tarieven", 
        nav_reviews: "Reviews", 
        nav_contact: "Contact",
        nav_whyus: "Waarom Wij?",
        
        // --- HERO SECTION ---
        hero_title: "KOOP AUTO'S IN HET BUITENLAND<br><span class=\"text-accent-orange text-stroke\">ZONDER RISICO.</span>",
        hero_subtitle: "Uitgebreide technische rapporten in België, Nederland en Duitsland. Wij controleren wat de handelaar u niet vertelt. Bespaar tijd en vermijd dure miskopen.",
        stat_cars: "Geïnspecteerd", 
        stat_saved: "Bespaard", 
        stat_time: "Reactietijd", 
        stat_satisfaction: "Service Garantie",
        hero_cta_desc: "Vertrouw op de experts. Bespaar tijd, stress en geld.",
        hero_btn: "BEKIJK TARIEVEN",

        // --- PROCES ---
        info_title: "WAT CONTROLEREN WIJ PRECIES?",
        info_body_title: "1. Carrosserie & Lak", 
        info_body_desc: "Nauwkeurige lakdiktemeting (detectie van plamuur en tweede laklaag). Beoordeling van paneelnaden, originaliteit van glas, staat van banden en velgen, en zoeken naar sporen van demontage.",
        
        info_eng_title: "2. Motor & Onderdelen", 
        info_eng_desc: "Analyse van de motorwerking (koud en warm). Controle op lekkages, werking van injectoren, turbo, multiriem en rook uit het uitlaatsysteem.",
        
        info_drive_title: "3. Aandrijving & Ophanging", 
        info_drive_desc: "Test van de versnellingsbak (soepelheid, schokken). Beoordeling van remmen (schijven/blokken), schokdempers, stuurspeling en bijgeluiden.",
        
        info_int_title: "4. Interieur & Uitrusting", 
        info_int_desc: "Slijtagecontrole (stuur, stoelen) ten opzichte van de kilometerstand. Testen van alle elektronica, airconditioning, audiosystemen en zoeken naar sporen van vocht/waterschade.",
        
        info_diag_title: "5. Computerdiagnose", 
        info_diag_desc: "Aansluiting van professionele OBD-scanner. Uitlezen van actieve en historische foutcodes. Verificatie van DPF-vulling en vergelijking van kilometerstand in stuurmodules.",
        
        info_test_title: "6. Proefrit", 
        info_test_desc: "Dynamische test bij verschillende snelheden. Verificatie van weggedrag, noodstop, werking van de ophanging op oneffenheden en verontrustende geluiden.",

        // --- WAAROM WIJ? ---
        why_title: "WAAROM IS HET <span class=\"text-accent-orange\">DE MOEITE WAARD?</span>",
        why_desc: "Een auto importeren gaat niet alleen over betere wegen en onderhoud. Het is vooral wiskunde. Door direct te kopen vermijdt u de marge van de tussenpersoon, transportkosten en het risico op 'tellerfraude'.",
        why_ex_title: "PRAKTIJKVOORBEELD (BMW 3 Serie):",
        why_pl_label: "Prijs handelaar in PL:",
        why_be_label: "Zelfde auto in België:",
        why_save_label: "UW BESPARING:",
        why_note: "*Zelfs na aftrek van inspectie- en transportkosten wint u een betrouwbare auto en duizenden zloty's.",
        
        why_icon1_title: "Digitale Controle", 
        why_icon1_desc: "Volledige transparantie. U ziet de auto alsof u er zelf bij was. 50+ foto's en 4K video.",
        why_icon2_title: "Hulp bij Transport", 
        why_icon2_desc: "Geen trailer? Wij helpen veilig transport tot aan uw deur te organiseren voor een eerlijke prijs.",
        why_icon3_title: "Prijs Onderhandeling", 
        why_icon3_desc: "Wij kennen de taal en de markt. Vaak onderhandelen we meer van de prijs af dan onze dienst kost.",

    // TARIEVEN
        packages_title: "KIES UW PAKKET",
        package_desc: "Elk pakket is inclusief verplaatsing binnen een straal van 150km rond Antwerpen. Verdere afstanden op aanvraag.",
        raport:" BEKIJK VOORBEELD RAPPORT",
        btn_processing: "VERWERKEN...",
        // Basic
        pkg_photos: "30-40 Foto's", pkg_photos_desc: "Hoge resolutie. Documentatie van elke kras, deuk en interieurdetail.",
        pkg_docs: "Documenten", pkg_docs_desc: "Controle van VIN, inschrijvingsbewijs, Car-Pass en onderhoudshistorie.",
        pkg_pdf: "PDF Rapport", pkg_pdf_desc: "Duidelijk overzicht van de visuele staat rechtstreeks naar uw e-mail.",
        // Standard
        pkg_basic_incl: "Alles wat in het Basic pakket zit",
        most_popular: "Meest Gekozen",
        pkg_obd: "Volledige OBD Diagnose", pkg_obd_desc: "Computer aansluiting. Scannen van injectoren, DPF, versnellingsbak en kilometerverificatie.",
        pkg_paint: "Lakdikte Meting", pkg_paint_desc: "Professionele meting. Wij detecteren plamuur en ongevalhistorie.",
        pkg_drive: "Proefrit", pkg_drive_desc: "Dynamische test. Controle van ophanging, remmen, koppeling en weggedrag.",
        // Premium
        pkg_standard_incl: "Alles wat in het Standaard pakket zit",
        pkg_negotiation: "Prijs Onderhandeling", pkg_negotiation_desc: "Wij onderhandelen namens u in de lokale taal. Vaak verdienen we de servicekosten terug.",
        pkg_video: "4K Video + VIP", pkg_video_desc: "Gedetailleerde opname met commentaar van de expert. Prioritaire uitvoering.",

        btn_select_basic: "KIES BASIC",
        btn_select_standard: "KIES STANDAARD",
        btn_select_premium: "KIES PREMIUM",

        // --- REVIEWS ---
        reviews_title: "KLANTVERHALEN",
        review_1: "\"De handelaar zwoer dat de auto perfect was. DAE rapport toonde een gelast achterscherm en ontbrekende airbags. Jullie hebben me 60k PLN bespaard. Bedankt!\"",
        review_2: "\"Ik wilde 1200km blind rijden. Inspectie toonde defecte injectoren en vliegwiel. Reparatiekosten hoger dan de dagwaarde. Het risico niet waard.\"",
        review_3: "\"Ik nam het Premium pakket. Dhr. Jakub onderhandelde 800 EUR korting in het Nederlands. De dienst betaalde zichzelf terug en ik maakte winst.\"",
        review_4: "\"Het PDF rapport is een meesterwerk. 50 foto's, 4K video, meting van elk carrosserie-element. Ik wist meer over de auto dan de verkoper.\"",
        
        // --- FAQ (Nederlands - Full Sales Copy) ---
        faq_title: "VEELGESTELDE VRAGEN",
        
        faq_q1: "Hoe snel ontvang ik het rapport?", 
        faq_a1: "Wij respecteren uw tijd, en goede auto's zijn snel weg. Wij handelen direct na ontvangst van de betaling. We nemen contact op met de verkoper, plannen de inspectie en leveren het volledige rapport meestal binnen 24-48 werkuren.",
        
        faq_q2: "Onderhandelen jullie over de prijs?", 
        faq_a2: "Ja, dit is een essentieel onderdeel van het Premium-pakket. Wij kennen de lokale markt, de taal en technische argumenten die telefonisch lastig over te brengen zijn. Vaak bedingen wij kortingen die hoger zijn dan de kosten van onze service, waardoor de inspectie u per saldo niets kost.",
        
        faq_q3: "Waar zijn jullie precies actief?", 
        faq_a3: "Onze operationele basis bevindt zich op een strategisch punt – in Antwerpen. Hierdoor kunnen we snel elke auto in België, heel Nederland en het westen van Duitsland (Noordrijn-Westfalen) bereiken. Verdere routes voeren wij uit op basis van een individuele offerte.",
        
        faq_q4: "Wat als de auto verkocht is voor jullie aankomst?", 
        faq_a4: "U loopt geen enkel risico. Wij spelen open kaart. Als na betaling blijkt dat de auto van de markt is verdwenen of de verkoper een inspectie weigert voordat wij vertrokken zijn – ontvangt u direct 100% van het betaalde bedrag terug op uw rekening.",
        
        faq_q5: "Kan ik met jullie meegaan naar de inspectie?", 
        faq_a5: "Ons werkmodel is gebaseerd op snelheid en logistiek – inspecteurs combineren vaak meerdere opdrachten op één route, daarom werken wij op afstand. Wij zijn uw ogen ter plaatse. Als u waarde hecht aan een gezamenlijke reis of ophalen van de luchthaven, neem dan contact met ons op voor een individuele Concierge-service.",
        
        faq_q6: "Hoe zien de betaling en factuur eruit?", 
        faq_a6: "Wij zetten in op veiligheid. De betaling verloopt via de gecertificeerde Stripe-gateway (Kaart, Google Pay, Apple Pay). Uw geld is beschermd. Voor elke dienst reiken wij een wettelijke factuur uit, wat de legaliteit van ons bedrijf garandeert.",

        // --- FORMULIEREN ---
        form_title: "BESTELLING AFRONDEN", 
        form_selected: "Geselecteerd", 
        form_payment_method: "Betaalmethode",
        form_car_details: "VOERTUIGDETAILS", 
        btn_pay: "VEILIG BETALEN",
        
        contact_title: "KLAAR VOOR IMPORT?",
        contact_desc: "Vragen vooraf? Wil je de details van een speciaal verzoek bespreken? Neem direct contact op of stuur een bericht via het formulier.",
        contact_form_title: "Stuur bericht", 
        lbl_name: "Volledige Naam", ph_name: "Jan Jansen",
        lbl_email: "E-mail", ph_email: "jan@voorbeeld.nl",
        lbl_message: "Bericht",  ph_message: "Uw bericht...",
        btn_send: "VERSTUUR",
        footer_rights: "Alle rechten voorbehouden.",
        
        lbl_phone: "Telefoon (Optioneel)", ph_phone: "+32 ... (Optioneel)",
        ph_url: "Link naar advertentie", ph_loc: "Stad, Land",
        txt_secure: "Betalingen versleuteld via Stripe SSL", 
        txt_redirect: "Doorverwijzing...", 
        txt_redirect_desc: "U wordt doorgestuurd naar de betaalpagina.",
        terms_text: "Ik ga akkoord met de <a href='terms.html' target='_blank' class='underline hover:text-accent-orange'>Voorwaarden</a> en <a href='privacy.html' target='_blank' class='underline hover:text-accent-orange'>Privacybeleid</a>.",
        err_required: "Dit veld is verplicht.",
        err_terms: "U moet de voorwaarden accepteren.",

        lbl_client_data: "Klantgegevens",
        lbl_url: "Link naar advertentie",
        lbl_loc: "Locatie (Stad)",
        form_payment_header: "Betaling",

        // --- FOOTER (WITH NEW KEYS) ---
        footer_about: "Professionele aankoopkeuringen in België, Nederland en Duitsland. Wij beschermen uw kapitaal tegen oneerlijke verkopers door betrouwbare technische kennis te leveren.",
        footer_nav_title: "Navigatie",
        footer_docs_title: "Juridische Documenten",
        footer_office_title: "Contactgegevens",
        footer_address: "Antwerpen, België",
        footer_hq: "(Operationele Basis / Hoofdkantoor)",
        footer_terms: "Algemene Voorwaarden",
        footer_privacy: "Privacybeleid (AVG)",
        footer_cookies: "Cookiebeleid",
        footer_refunds: "Retourneren & Klachten",
        footer_secured: "Veilige Betaling via Stripe",
        footer_ssl: "SSL Versleutelde Verbinding",
        
    },

// ================= FRANCUSKI (FR) =================
    fr: {
        nav_info: "Processus", nav_services: "Tarifs", nav_reviews: "Avis", nav_contact: "Contact", nav_whyus: "Pourquoi Nous?",
        
        hero_title: "ACHETEZ À L'ÉTRANGER<br><span class=\"text-accent-orange text-stroke\">SANS RISQUE.</span>",
        hero_subtitle: "Rapports techniques complets en Belgique, aux Pays-Bas et en Allemagne. Nous vérifions ce que le vendeur ne vous dit pas. Gagnez du temps et évitez les erreurs coûteuses.",
        stat_cars: "Voitures inspectées", stat_saved: "Économisé", stat_time: "Temps de réponse", stat_satisfaction: "Garantie",
        hero_cta_desc: "Faites confiance aux experts. Économisez du temps, du stress et de l'argent.",
        hero_btn: "VOIR LES OFFRES",

        info_title: "QUE VÉRIFIONS-NOUS EXACTEMENT ?",
        info_body_title: "1. Carrosserie & Peinture", info_body_desc: "Mesure précise de l'épaisseur de la peinture (détection de mastic et de seconde couche). Évaluation de l'ajustement des panneaux, de l'originalité des vitres, de l'état des pneus et des jantes, et recherche de traces de démontage.",
        info_eng_title: "2. Moteur & Composants", info_eng_desc: "Analyse du fonctionnement du moteur à froid et à chaud. Vérification des fuites, performance des injecteurs, fonctionnement du turbocompresseur, courroie accessoire et fumée d'échappement.",
        info_drive_title: "3. Transmission & Suspension", info_drive_desc: "Test de la boîte de vitesses (fluidité, à-coups). Évaluation des freins (disques/plaquettes), amortisseurs, jeu de direction et bruits de suspension.",
        info_int_title: "4. Intérieur & Équipement", info_int_desc: "Vérification de l'usure (volant, sièges) par rapport au kilométrage. Test de toute l'électronique, climatisation, systèmes audio et recherche de traces d'humidité/inondation.",
        info_diag_title: "5. Diagnostic Informatique", info_diag_desc: "Connexion d'un scanner OBD professionnel. Lecture des défauts actifs et historiques. Vérification de la saturation du FAP et comparaison du kilométrage dans les modules de commande.",
        info_test_title: "6. Essai Routier", info_test_desc: "Test dynamique à différentes vitesses. Vérification de la tenue de route, freinage d'urgence, comportement de la suspension sur les bosses et bruits anormaux.",

        why_title: "POURQUOI <span class=\"text-accent-orange\">ÇA VAUT LE COUP ?</span>",
        why_desc: "L'importation n'est pas seulement une question de meilleures routes. C'est surtout des mathématiques. En achetant directement, vous évitez la marge du revendeur, les frais de transport et le risque de \"compteur trafiqué\".",
        why_ex_title: "EXEMPLE RÉEL (BMW Série 3) :",
        why_pl_label: "Prix revendeur en PL :",
        why_be_label: "Même voiture en Belgique :",
        why_save_label: "VOTRE ÉCONOMIE :",
        why_note: "*Même après déduction de l'inspection et du transport, vous gagnez une voiture fiable et des milliers en poche.",
        
        why_icon1_title: "Contrôle Numérique", why_icon1_desc: "Transparence totale. Vous voyez la voiture comme si vous y étiez. 50+ photos et vidéo 4K.",
        why_icon2_title: "Aide au Transport", why_icon2_desc: "Pas de remorque ? Nous aidons à organiser un transport sûr jusqu'à votre porte à un prix équitable.",
        why_icon3_title: "Négociation de Prix", why_icon3_desc: "Nous connaissons la langue et le marché. Nous réduisons souvent le prix bien plus que le coût de notre service.",

        // TARIFS
        packages_title: "CHOISISSEZ VOTRE PACK",
        package_desc: "Chaque pack inclut le déplacement dans un rayon de 150km autour d'Anvers. Distances plus longues sur devis.",
        raport: "VOIR UN RAPPORT D'EXEMPLE",
        btn_processing: "TRAITEMENT...",
        // Basic
        pkg_photos: "30-40 Photos", pkg_photos_desc: "Haute résolution. Documentation de chaque rayure, bosse et détail intérieur.",
        pkg_docs: "Vérification Docs", pkg_docs_desc: "Vérification VIN, carte grise, Car-Pass et historique d'entretien.",
        pkg_pdf: "Rapport PDF", pkg_pdf_desc: "Résumé clair de l'état visuel envoyé directement sur votre e-mail.",
        // Standard
        pkg_basic_incl: "Tout ce qui est dans le pack Basic",
        most_popular: "Le Plus Populaire",
        pkg_obd: "Diagnostic OBD Complet", pkg_obd_desc: "Connexion ordinateur. Scan des injecteurs, FAP, boîte et vérification kilométrage modules.",
        pkg_paint: "Mesure Peinture", pkg_paint_desc: "Mesure professionnelle. Nous détectons le mastic et l'historique d'accidents.",
        pkg_drive: "Essai Routier", pkg_drive_desc: "Test dynamique. Vérification suspension, freins, embrayage et conduite.",
        // Premium
        pkg_standard_incl: "Tout ce qui est dans le pack Standard",
        pkg_negotiation: "Négociation Prix", pkg_negotiation_desc: "Nous négocions pour vous en langue locale. Nous récupérons souvent le coût du service avec intérêts.",
        pkg_video: "Vidéo 4K + VIP", pkg_video_desc: "Enregistrement détaillé avec commentaire d'expert. Exécution prioritaire.",

        // BUTTONS
        btn_select_basic: "CHOISIR BASIC",
        btn_select_standard: "CHOISIR STANDARD",
        btn_select_premium: "CHOISIR PREMIUM",  

        reviews_title: "HISTOIRES CLIENTS",
        review_1: "\"Le vendeur jurait que la voiture était parfaite. Le rapport DAE a montré une aile soudée et pas d'airbags. Vous m'avez sauvé 60k PLN. Merci !\"",
        review_2: "\"Je voulais faire 1200km à l'aveugle. L'inspection a révélé des injecteurs et volant moteur HS. Réparation supérieure à la valeur. Pas de risque.\"",
        review_3: "\"J'ai pris le pack Premium. M. Jakub a négocié 800 EUR de rabais en néerlandais. Le service s'est remboursé et j'ai fait un bénéfice.\"",
        review_4: "\"Le rapport PDF est un chef-d'œuvre. 50 photos, vidéo 4K, mesure de chaque élément de carrosserie. Je savais plus sur la voiture que le vendeur.\"",

        lbl_client_data: "Détails Client", // Client Details
        lbl_url: "Lien de l'annonce",       // Listing Link / Ad URL    
        lbl_loc: "Emplacement (Ville)",     // Location (City)
        form_payment_header: "Paiement",     // Payment

       // --- FAQ (Français - Full Sales Copy) ---
        faq_title: "QUESTIONS FRÉQUENTES",
        
        faq_q1: "En combien de temps reçois-je le rapport ?", 
        faq_a1: "Nous respectons votre temps, et les bonnes voitures partent vite. Nous agissons immédiatement après l'enregistrement du paiement. Nous contactons le vendeur, planifions l'inspection et fournissons généralement le rapport complet sous 24-48 heures ouvrables.",
        
        faq_q2: "Négociez-vous les prix ?", 
        faq_a2: "Oui, c'est un élément clé du pack Premium. Nous connaissons le marché local, la langue et les arguments techniques difficiles à utiliser au téléphone depuis l'étranger. Nous obtenons souvent des rabais supérieurs au coût de notre service, l'inspection peut donc ne rien vous coûter au final.",
        
        faq_q3: "Où opérez-vous exactement ?", 
        faq_a3: "Notre base opérationnelle est située à un point stratégique – Anvers. Cela nous permet d'atteindre rapidement n'importe quelle voiture en Belgique, dans tous les Pays-Bas et dans l'ouest de l'Allemagne (Rhénanie-du-Nord-Westphalie). Les trajets plus lointains sont réalisés sur devis individuel.",
        
        faq_q4: "Que se passe-t-il si la voiture est vendue avant votre arrivée ?", 
        faq_a4: "Vous ne risquez rien. Nous jouons franc jeu. Si, après le paiement, il s'avère que la voiture a disparu du marché ou que le vendeur a refusé l'inspection avant notre départ – vous recevez un remboursement immédiat de 100% des fonds sur votre compte.",
        
        faq_q5: "Puis-je venir avec vous pour l'inspection ?", 
        faq_a5: "Notre modèle repose sur la rapidité et la logistique – les inspecteurs traitent souvent plusieurs commandes sur un même itinéraire, c'est pourquoi nous travaillons à distance. Nous sommes vos yeux sur place. Si vous souhaitez un voyage commun ou une prise en charge à l'aéroport, contactez-nous pour un service Concierge individuel.",
        
        faq_q6: "Comment se passent le paiement et la facturation ?", 
        faq_a6: "Nous misons sur la sécurité. Le paiement s'effectue via la passerelle certifiée Stripe (Carte, Google Pay, Apple Pay). Les fonds sont protégés. Pour chaque service, nous émettons une facture légale, ce qui garantit la légalité de notre entreprise.",
        
        form_title: "FINALISER LA COMMANDE", form_selected: "Sélectionné", form_payment_method: "Méthode de paiement",
        form_car_details: "DÉTAILS DU VÉHICULE", btn_pay: "PAYER EN TOUTE SÉCURITÉ",
        contact_title: "PRÊT À IMPORTER ?",
        contact_desc: "Des questions avant de commander ? Vous souhaitez discuter des détails d'une commande personnalisée ? Contactez-nous directement ou envoyez un message via le formulaire.",
        contact_form_title: "Envoyer une demande", 
        lbl_name: "Nom complet", lbl_email: "Email", lbl_message: "Message", ph_message: "Votre message...", btn_send: "ENVOYER",
        footer_rights: "Tous droits réservés.",
        
        lbl_phone: "Téléphone (Optionnel)", ph_name: "Jean Dupont", ph_email: "jean@exemple.fr", ph_phone: "+33 ...",
        ph_url: "Lien de l'annonce", ph_loc: "Ville, Pays",
        txt_secure: "Crypté par Stripe SSL", txt_redirect: "Redirection...", txt_redirect_desc: "Vous serez redirigé vers la passerelle de paiement.",
        terms_text: "J'accepte les <a href='terms.html' target='_blank' class='underline hover:text-accent-orange'>Conditions</a> et la <a href='privacy.html' target='_blank' class='underline hover:text-accent-orange'>Politique de Confidentialité</a>.",
        err_required: "Ce champ est requis.",
        err_terms: "Vous devez accepter les conditions.",

        // --- FOOTER (WITH NEW KEYS) ---
        footer_about: "Inspections professionnelles avant achat en Belgique, aux Pays-Bas et en Allemagne. Nous protégeons votre capital contre les vendeurs malhonnêtes en fournissant des connaissances techniques fiables.",
        footer_nav_title: "Navigation",
        footer_docs_title: "Documents Légaux",
        footer_office_title: "Coordonnées",
        footer_address: "Anvers, Belgique",
        footer_hq: "(Base Opérationnelle / Siège)",
        footer_terms: "Conditions Générales",
        footer_privacy: "Politique de Confidentialité (RGPD)",
        footer_cookies: "Politique de Cookies",
        footer_refunds: "Retours & Réclamations",
        footer_secured: "Paiements Sécurisés par Stripe",
        footer_ssl: "Connexion Cryptée SSL",
    },

    // ================= HISZPAŃSKI (ES) =================
    es: {
        nav_info: "Proceso", nav_services: "Precios", nav_reviews: "Reseñas", nav_contact: "Contacto", nav_whyus: "¿Por Qué Nosotros?",
        
        hero_title: "COMPRA COCHES EN EL EXTRANJERO<br><span class=\"text-accent-orange text-stroke\">SIN RIESGO.</span>",
        hero_subtitle: "Informes técnicos completos en Bélgica, Países Bajos y Alemania. Verificamos lo que el vendedor no te dice. Ahorra tiempo y evita errores costosos.",
        stat_cars: "Coches Inspeccionados", stat_saved: "Ahorrado", stat_time: "Tiempo de Respuesta", stat_satisfaction: "Garantía",
        hero_cta_desc: "Confía en los expertos. Ahorra tiempo, estrés y dinero.",
        hero_btn: "VER PRECIOS",

        info_title: "¿QUÉ VERIFICAMOS EXACTAMENTE?",
        info_body_title: "1. Carrocería y Pintura", info_body_desc: "Medición precisa del espesor de la pintura (detección de masilla y segundas capas). Evaluación de ajuste de paneles, originalidad de vidrios, estado de neumáticos y llantas, y búsqueda de rastros de desmontaje.",
        info_eng_title: "2. Motor y Componentes", info_eng_desc: "Análisis del funcionamiento del motor en frío y caliente. Verificación de fugas, rendimiento de inyectores, funcionamiento del turbocompresor, correa de accesorios y humo de escape.",
        info_drive_title: "3. Transmisión y Suspensión", info_drive_desc: "Prueba de funcionamiento de la caja de cambios (suavidad, tirones). Evaluación de frenos (discos/pastillas), amortiguadores, juego de dirección y ruidos de suspensión.",
        info_int_title: "4. Interior y Equipamiento", info_int_desc: "Verificación de desgaste (volante, asientos) frente al kilometraje. Prueba de toda la electrónica, aire acondicionado, sistemas de audio y búsqueda de rastros de humedad/inundación.",
        info_diag_title: "5. Diagnóstico por Computadora", info_diag_desc: "Conexión de escáner OBD profesional. Lectura de fallos activos e históricos. Verificación de saturación de DPF y comparación de kilometraje en módulos de control.",
        info_test_title: "6. Prueba de Conducción", info_test_desc: "Prueba dinámica a varias velocidades. Verificación de manejo, frenado de emergencia, comportamiento de la suspensión en baches y ruidos anormales.",

        why_title: "¿POR QUÉ <span class=\"text-accent-orange\">VALE LA PENA?</span>",
        why_desc: "Importar un coche no es solo mejores carreteras y servicio. Es principalmente matemáticas. Comprando directamente, evitas el margen del intermediario, costos de transporte y riesgo de \"ajuste de kilometraje\".",
        why_ex_title: "EJEMPLO REAL (BMW Serie 3):",
        why_pl_label: "Precio distribuidor en PL:",
        why_be_label: "Mismo coche en Bélgica:",
        why_save_label: "TU AHORRO:",
        why_note: "*Incluso después de deducir la inspección y transporte, ganas un coche fiable y miles en el bolsillo.",
        
        why_icon1_title: "Control Digital", why_icon1_desc: "Transparencia total. Ves el coche como si estuvieras allí. 50+ fotos y video 4K.",
        why_icon2_title: "Ayuda en Transporte", why_icon2_desc: "¿Sin remolque? Ayudamos a organizar transporte seguro a tu puerta a precio justo.",
        why_icon3_title: "Negociación de Precio", why_icon3_desc: "Conocemos el idioma y mercado. A menudo reducimos el precio más que el costo de nuestro servicio.",

        // PRECIOS
        packages_title: "SELECCIONA TU PAQUETE",
        package_desc: "Cada paquete incluye desplazamiento en un radio de 150km desde Amberes. Distancias mayores bajo presupuesto.",
        raport: "VER INFORME DE EJEMPLO",
        btn_processing: "PROCESANDO...",
        // Basic
        pkg_photos: "30-40 Fotos", pkg_photos_desc: "Alta resolución. Documentación de cada rasguño, abolladura y detalle interior.",
        pkg_docs: "Verificación Docs", pkg_docs_desc: "Verificación de VIN, papeles de registro, Car-Pass e historial de servicio.",
        pkg_pdf: "Informe PDF", pkg_pdf_desc: "Resumen claro de la condición visual enviado directamente a tu email.",
        // Standard
        pkg_basic_incl: "Todo lo que incluye el paquete Básico",
        most_popular: "Más Popular",
        pkg_obd: "Diagnóstico OBD", pkg_obd_desc: "Conexión computadora. Escaneo de inyectores, DPF, caja de cambios y verificación de kilometraje en módulos.",
        pkg_paint: "Medición Pintura", pkg_paint_desc: "Medición profesional. Detectamos masilla e historial de accidentes.",
        pkg_drive: "Prueba Manejo", pkg_drive_desc: "Prueba dinámica. Verificación de suspensión, frenos, embrague y manejo.",
        // Premium
        pkg_standard_incl: "Todo lo que incluye el paquete Estándar",
        pkg_negotiation: "Negociación", pkg_negotiation_desc: "Negociamos en tu nombre en el idioma local. A menudo recuperamos el costo del servicio con intereses.",
        pkg_video: "Video 4K + VIP", pkg_video_desc: "Grabación detallada con comentarios de expertos. Ejecución de servicio prioritaria.",

        // BUTTONS
        btn_select_basic: "ELEGIR BÁSICO",
        btn_select_standard: "ELEGIR ESTÁNDAR",
        btn_select_premium: "ELEGIR PREMIUM",

        reviews_title: "HISTORIAS DE CLIENTES",
        review_1: "\"El vendedor juraba que el coche era perfecto. El informe DAE mostró un cuarto soldado y falta de airbags. Me ahorraron 60k PLN. ¡Gracias!\"",
        review_2: "\"Quería conducir 1200km a ciegas. La inspección reveló inyectores y volante dañados. La reparación superaría el valor. No vale la pena el riesgo.\"",
        review_3: "\"Tomé el paquete Premium. El Sr. Jakub negoció un descuento de 800 EUR en holandés. El servicio se pagó solo y obtuve ganancias.\"",
        review_4: "\"El informe PDF es una obra maestra. 50 fotos, video 4K, medición de cada elemento de la carrocería. Sabía más sobre el coche que el vendedor.\"",

        lbl_client_data: "Detalles del Cliente", // Client Details
        lbl_url: "Enlace del anuncio",       // Listing Link / Ad URL    
        lbl_loc: "Ubicación (Ciudad)",     // Location (City)
        form_payment_header: "Pago",    // Payment

// --- FAQ (Español - Full Sales Copy) ---
        faq_title: "PREGUNTAS FRECUENTES",
        
        faq_q1: "¿Qué tan rápido recibo el informe?", 
        faq_a1: "Respetamos tu tiempo y los buenos coches desaparecen rápido. Actuamos inmediatamente después de registrar el pago. Contactamos al vendedor, programamos la inspección y generalmente entregamos el informe completo en 24-48 horas laborables.",
        
        faq_q2: "¿Negocian los precios?", 
        faq_a2: "Sí, es un elemento clave del paquete Premium. Conocemos el mercado local, el idioma y los argumentos técnicos que son difíciles de usar por teléfono desde el extranjero. A menudo obtenemos descuentos que superan el costo de nuestro servicio, por lo que la inspección puede no costarte nada.",
        
        faq_q3: "¿Dónde operan exactamente?", 
        faq_a3: "Nuestra base operativa se encuentra en un punto estratégico: Amberes. Esto nos permite llegar rápidamente a cualquier coche en Bélgica, todos los Países Bajos y el oeste de Alemania (Renania del Norte-Westfalia). Las rutas más lejanas se realizan bajo presupuesto individual.",
        
        faq_q4: "¿Qué pasa si el coche se vende antes de su llegada?", 
        faq_a4: "No arriesgas nada. Jugamos limpio. Si después de pagar el pedido resulta que el coche ha desaparecido del mercado o el vendedor ha rechazado la inspección antes de que salgamos a la carretera, recibes un reembolso instantáneo del 100% de los fondos en tu cuenta.",
        
        faq_q5: "¿Puedo ir con ustedes a la inspección?", 
        faq_a5: "Nuestro modelo de trabajo se basa en la rapidez y la logística: los inspectores a menudo manejan varios pedidos en una sola ruta, por eso trabajamos de forma remota. Somos tus ojos en el lugar. Si te interesa un viaje conjunto o recogida en el aeropuerto, contáctanos para concertar un servicio de Concierge individual.",
        
        faq_q6: "¿Cómo son el pago y la factura?", 
        faq_a6: "Apostamos por la seguridad. El pago se realiza a través de la pasarela certificada Stripe (Tarjeta, Google Pay, Apple Pay). Los fondos están protegidos. Por cada servicio emitimos una factura legal, lo que garantiza la legalidad de nuestra empresa.",
        
        form_title: "FINALIZAR PEDIDO", form_selected: "Seleccionado", form_payment_method: "Método de Pago",
        form_car_details: "DETALLES DEL VEHÍCULO", btn_pay: "PAGAR SEGURO",
        contact_title: "¿LISTO PARA IMPORTAR?",
        contact_desc: "¿Preguntas antes de pedir? ¿Quieres discutir los detalles de un pedido personalizado? Contáctanos directamente o envía un mensaje a través del formulario.",
        contact_form_title: "Enviar consulta", 
        lbl_name: "Nombre completo", lbl_email: "Email", lbl_message: "Mensaje", ph_message: "Tu mensaje...", btn_send: "ENVIAR",
        footer_rights: "Todos los derechos reservados.",
        
        lbl_phone: "Teléfono (Opcional)", ph_name: "Juan Pérez", ph_email: "juan@ejemplo.es", ph_phone: "+34 ...",
        ph_url: "Enlace del anuncio", ph_loc: "Ciudad, País",
        txt_secure: "Encriptado por Stripe SSL", txt_redirect: "Redirigiendo...", txt_redirect_desc: "Serás redirigido a la pasarela de pago.",
        terms_text: "Acepto los <a href='terms.html' target='_blank' class='underline hover:text-accent-orange'>Términos</a> y la <a href='privacy.html' target='_blank' class='underline hover:text-accent-orange'>Política de Privacidad</a>.",
        err_required: "Este campo es obligatorio.",
        err_terms: "Debes aceptar los términos.",

        // --- FOOTER (WITH NEW KEYS) ---
        footer_about: "Inspecciones profesionales pre-compra en Bélgica, Países Bajos y Alemania. Protegemos tu capital de vendedores deshonestos proporcionando conocimientos técnicos fiables.",
        footer_nav_title: "Navegación",
        footer_docs_title: "Documentos Legales",
        footer_office_title: "Datos de Contacto",
        footer_address: "Amberes, Bélgica",
        footer_hq: "(Base Operativa / Sede)",
        footer_terms: "Términos y Condiciones",
        footer_privacy: "Política de Privacidad (RGPD)",
        footer_cookies: "Política de Cookies",
        footer_refunds: "Devoluciones y Quejas",
        footer_secured: "Pagos Seguros por Stripe",
        footer_ssl: "Conexión Encriptada SSL",
    }
};