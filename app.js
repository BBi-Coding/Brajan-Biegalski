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

// 1b. Apple-style scroll-driven services animation (desktop only; disabled on iPhone/small screens)
(function() {
    var section = document.querySelector('[data-scroll-section]');
    if (!section) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

    /* Disable scroll animation on small viewports (iPhone, etc.) – show everything immediately */
    if (window.matchMedia('(max-width: 768px)').matches) {
        showAllNoAnimation();
        return;
    }

    /* Title visible right away (0–0.3% scroll); then cards */
    var timeline = {
        'badge':    { start: 0.00, end: 0.001, y: 40, scale: false },
        'title':    { start: 0.00, end: 0.002, y: 40, scale: true  },
        'subtitle': { start: 0.00, end: 0.003, y: 30, scale: false },
        'card-0':   { start: 0.00, end: 0.30, y: 80, scale: true  },
        'card-1':   { start: 0.30, end: 0.60, y: 80, scale: true  },
        'card-2':   { start: 0.60, end: 0.90, y: 80, scale: true  }
    };

    function ease(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    var ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function() {
            ticking = false;
            var rect = section.getBoundingClientRect();
            var scrollable = section.offsetHeight - window.innerHeight;
            if (scrollable <= 0) return;
            var raw = -rect.top / scrollable;
            var progress = Math.max(0, Math.min(1, raw));

            for (var key in timeline) {
                var el = map[key];
                if (!el) continue;
                var t = timeline[key];
                var local;
                if (progress <= t.start) local = 0;
                else if (progress >= t.end) local = 1;
                else local = (progress - t.start) / (t.end - t.start);
                local = ease(local);

                var opacity = local;
                var translateY = t.y * (1 - local);
                var scaleVal = t.scale ? 0.85 + 0.15 * local : 1;
                if (key.indexOf('card') === 0) scaleVal = 0.95 + 0.05 * local;

                el.style.opacity = opacity;
                el.style.transform = 'translateY(' + translateY + 'px) scale(' + scaleVal + ')';
            }
            /* Title visible right away when section is in view */
            if (progress >= 0 && (map.badge || map.title || map.subtitle)) {
                if (map.badge) { map.badge.style.opacity = '1'; map.badge.style.transform = 'none'; }
                if (map.title) { map.title.style.opacity = '1'; map.title.style.transform = 'none'; }
                if (map.subtitle) { map.subtitle.style.opacity = '1'; map.subtitle.style.transform = 'none'; }
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// 2. Service Cards Interaction (Accordion) – event delegation
document.addEventListener('click', (e) => {
    const card = e.target.closest('.service-card');
    if (!card) return;
    const details = card.querySelector('.service-details');
    const btn = card.querySelector('.more-info-btn');
    if (!details || !btn) return;

    const isActive = card.classList.contains('active');
    document.querySelectorAll('.service-card').forEach(c => {
        c.classList.remove('active');
        const b = c.querySelector('.more-info-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
    });
    if (!isActive) {
        card.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
    }
});

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

// Observe all elements with class "hidden", excluding scroll-driven services items
document.querySelectorAll('.hidden').forEach((el) => {
    if (!el.closest('[data-scroll-section]')) observer.observe(el);
});


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
        "image": [baseUrl + "/img/4.jpg", baseUrl + "/img/brajan.png"],
        "telephone": "+49-176-55742979",
        "email": "service-bb@gmx.de",
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
