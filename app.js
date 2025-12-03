// 1. Mobile Menü Steuerung
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Schließt das Menü, wenn ein Link geklickt wird
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    navMenu.classList.remove('active');
}));


// 2. Service Karten Interaktion (Accordion Effekt)
// Funktion wird im HTML via onclick aufgerufen
function toggleDetails(id) {
    const details = document.getElementById(id);
    const card = details.parentElement;
    
    // Toggle die 'active' Klasse für CSS styling
    if (card.classList.contains('active')) {
        card.classList.remove('active');
    } else {
        // Schließe erst alle anderen Karten für sauberen Look
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
        // Öffne die geklickte Karte
        card.classList.add('active');
    }
}


// 3. Scroll Animationen (Intersection Observer)
// Das sorgt dafür, dass Elemente sanft eingeblendet werden, wenn man scrollt
const observerOptions = {
    threshold: 0.2 // Startet Animation, wenn 20% des Elements sichtbar sind
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// Alle Elemente mit der Klasse "hidden" beobachten
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


// 4. Smooth Scroll für Anker-Links (Safari Unterstützung)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// 5. Cookie Consent Configuration
// Ensure the library is loaded in HTML before this runs
CookieConsent.run({
    guiOptions: {
        consentModal: {
            layout: "box",
            position: "bottom left",
            equalWeightButtons: true,
            flipButtons: false
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: false
        }
    },
    categories: {
        necessary: {
            readOnly: true
        },
        analytics: {}
    },
    language: {
        default: "de",
        translations: {
            de: {
                consentModal: {
                    title: "Wir verwenden Cookies",
                    description: "Diese Website nutzt Cookies, um Ihnen das beste Erlebnis zu bieten.",
                    acceptAllBtn: "Alle akzeptieren",
                    acceptNecessaryBtn: "Nur Notwendige",
                    showPreferencesBtn: "Einstellungen",
                    footer: "<a href='datenschutz.html'>Datenschutz</a>\n<a href='impressum.html'>Impressum</a>"
                },
                preferencesModal: {
                    title: "Cookie-Einstellungen",
                    acceptAllBtn: "Alle akzeptieren",
                    acceptNecessaryBtn: "Nur Notwendige",
                    savePreferencesBtn: "Einstellungen speichern",
                    closeIconLabel: "Schließen",
                    sections: [
                        {
                            title: "Cookie-Nutzung",
                            description: "Ich nutze Cookies, um die grundlegenden Funktionen der Website sicherzustellen und das Nutzererlebnis zu verbessern."
                        },
                        {
                            title: "Notwendige Cookies",
                            description: "Diese Cookies sind für das Funktionieren der Website unerlässlich.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Analyse & Performance",
                            description: "Diese Cookies helfen mir zu verstehen, wie Besucher mit der Website interagieren (z.B. Google Analytics in Zukunft).",
                            linkedCategory: "analytics"
                        }
                    ]
                }
            }
        }
    }
});