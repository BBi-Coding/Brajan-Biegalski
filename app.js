// 0. Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// 1. Mobile Menu Control (Barrierefrei / Accessible)
const menuBtn = document.getElementById('mobile-menu');
// We use the ID 'primary-navigation' to match the HTML aria-controls attribute
const navList = document.getElementById('primary-navigation') || document.querySelector('.nav-menu');

if (menuBtn && navList) {
    function setMenuOpen(open) {
        menuBtn.setAttribute('aria-expanded', open);
        menuBtn.classList.toggle('active', open);
        navList.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }
    menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        setMenuOpen(!isExpanded);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
    });
}

// 1b. Services section: show content without complex scroll animation
(function() {
    var section = document.querySelector('[data-scroll-section]');
    if (!section) return;

    var items = section.querySelectorAll('[data-scroll-item]');
    var map = {};
    items.forEach(function(el) { map[el.getAttribute('data-scroll-item')] = el; });

    function showAllNoAnimation() {
        for (var key in map) {
            if (map[key]) {
                map[key].style.opacity = '1';
                map[key].style.transform = 'none';
            }
        }
    }

    // Immediately reveal all scroll items; no extra scroll handler needed
    showAllNoAnimation();
})();

// 2. Scroll Animations (Intersection Observer)
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

// Observe all elements with class "hidden", excluding scroll-driven services items
document.querySelectorAll('.hidden').forEach((el) => {
    if (!el.closest('[data-scroll-section]')) observer.observe(el);
});


// 2b. Reveal service lists on scroll (desktop only)
(function () {
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const lists = document.querySelectorAll('.service-list');
    const cards = document.querySelectorAll('.service-card');
    if (!lists.length && !cards.length) return;

    const listObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('service-list--visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    lists.forEach(list => {
        list.classList.add('service-list--reveal');
        listObserver.observe(list);
    });

    const cardObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('service-card--visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    cards.forEach(card => {
        card.classList.add('service-card--reveal');
        cardObserver.observe(card);
    });
})();

// 3. Smooth Scroll for Anchor Links
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

// 4b. Gallery lightbox – click to open fullscreen image
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item img').forEach((img, i) => {
        img.closest('.gallery-item').addEventListener('click', (e) => {
            e.preventDefault();
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Galeriebild';
            lightbox.hidden = false;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });
    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.hidden = true;
        document.body.style.overflow = '';
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}


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

// 6. Schema.org JSON-LD – LocalBusiness + WebSite for SEO
(function() {
    const baseUrl = 'https://www.brajanbiegalski.com';

    const localBusiness = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": baseUrl + "#business",
        "name": "Service-BB",
        "alternateName": "Service-BB Smart Home Brajan Biegalski",
        "description": "Smart Home Experte in Dinslaken: Hausautomation, Sicherheitssysteme, Kameraüberwachung und Sprachsteuerung. Beratung, Installation und Wartung in Dinslaken und NRW.",
        "url": baseUrl + "/",
        "logo": baseUrl + "/img/B_logo.png",
        "image": [baseUrl + "/img/4.jpg", baseUrl + "/img/brajan.png"],
        "telephone": "+49-176-55742979",
        "email": "service-bb@gmx.de",
        "taxID": "319/5055/6755",
        "identifier": "DE461538572",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dinslaken",
            "postalCode": "46535",
            "addressRegion": "NRW",
            "addressCountry": "DE"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "addressLocality": "Dinslaken",
            "postalCode": "46535"
        },
        "areaServed": [
            { "@type": "City", "name": "Dinslaken" },
            { "@type": "State", "name": "Nordrhein-Westfalen" }
        ],
        "priceRange": "€€",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Smart Home Dienstleistungen",
            "itemListElement": [
                { "@type": "Offer", "name": "Hausautomation – Licht, Heizung, Rollläden" },
                { "@type": "Offer", "name": "Sicherheitssysteme – Kameras, Alarmanlagen, Video-Türklingel" },
                { "@type": "Offer", "name": "Sprachsteuerung, Smart TV & Multiroom Audio" }
            ]
        },
        "sameAs": []
    };

    const webSite = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": baseUrl + "#website",
        "url": baseUrl + "/",
        "name": "Service-BB Smart Home Dinslaken",
        "description": "Ihr Smart Home Experte in Dinslaken und NRW.",
        "publisher": { "@id": baseUrl + "#business" },
        "inLanguage": "de-DE",
        "potentialAction": {
            "@type": "SearchAction",
            "target": { "@type": "EntryPoint", "urlTemplate": baseUrl + "/#contact" },
            "query-input": "required name=anfrage"
        }
    };

    [localBusiness, webSite].forEach(function(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
    });
})();
