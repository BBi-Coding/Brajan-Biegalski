// 1. Mobile Menu Control (Barrierefrei / Accessible)
const menuBtn = document.getElementById('mobile-menu');
// We use the ID 'primary-navigation' to match the HTML aria-controls attribute
const navList = document.getElementById('primary-navigation') || document.querySelector('.nav-menu');

if (menuBtn && navList) {
    menuBtn.addEventListener('click', () => {
        // Toggle ARIA state for screen readers (Accessibility)
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle Visual classes
        menuBtn.classList.toggle('active');
        navList.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.classList.remove('active');
            navList.classList.remove('active');
        });
    });
}

// 2. Service Cards Interaction (Accordion)
// Made globally available for the onclick="" in HTML
window.toggleDetails = function(id) {
    const details = document.getElementById(id);
    if (!details) return;

    const card = details.parentElement;
    
    // Check if currently active
    const isActive = card.classList.contains('active');

    // Close all other cards first for a clean look
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));

    // Open the clicked card only if it wasn't already open
    if (!isActive) {
        card.classList.add('active');
    }
};

// 3. Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.15 // Trigger when 15% of element is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// Observe all elements with class "hidden"
document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));


// 4. Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


// 5. Cookie Consent Configuration
// Wraps your original config in a safety check to prevent errors if the library fails to load
if (typeof CookieConsent !== 'undefined') {
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
                                description: "Diese Cookies helfen mir zu verstehen, wie Besucher mit der Website interagieren.",
                                linkedCategory: "analytics"
                            }
                        ]
                    }
                }
            }
        }
    });
}

// 6. Schema.org JSON-LD Injection
(function() {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Brajan Biegalski IT & Home Assistance",
      "image": "https://www.brajanbiegalski.com/img/brajan.png",
      "url": "https://www.brajanbiegalski.com",
      "telephone": "+49-176-55742979",
      "priceRange": "$$",
      "description": "IT-Support, Ubuntu Server Einrichtung und Smart Home Installation in Dinslaken und Oberhausen.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dinslaken",
        "postalCode": "46535",
        "addressCountry": "DE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "51.5606", 
        "longitude": "6.7380"
      },
      "areaServed": [
        { "@type": "City", "name": "Dinslaken" },
        { "@type": "City", "name": "Oberhausen" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Dienstleistungen",
        "itemListElement": [
          { "@type": "Offer", "name": "PC-Hilfe & Reparatur" },
          { "@type": "Offer", "name": "Heimserver & VPN (WireGuard)" },
          { "@type": "Offer", "name": "Seniorenhilfe & Alltagssupport" }
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
})();