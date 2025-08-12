// Schema.org data
const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TODOCR",
    "image": "https://www.todocr.com/assets/hero.jpg",
    "url": "https://www.todocr.com/",
    "telephone": "+50670808613",
    "email": "info.todocr@gmail.com",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Poás",
        "addressRegion": "Alajuela",
        "addressCountry": "CR"
    },
    "areaServed": ["Poás", "Alajuela Centro", "Costa Rica"],
    "sameAs": ["https://wa.me/50670808613"]
};

// Helper function for DOM elements
const F = id => document.getElementById(id);

// Language management
let currentLang = localStorage.getItem('preferred_lang') || 'es';

// Populate all texts from i18n
function populateTexts() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18n[currentLang][key]) {
            element.textContent = i18n[currentLang][key];

            // For inputs, also update placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = i18n[currentLang][key];
            }
        }
    });
    document.documentElement.lang = currentLang;
}

// Contact form summary builder
function buildSummary() {
    const name = F('name')?.value || '-';
    const email = F('email')?.value || '-';
    const phone = F('phone')?.value || '-';
    const svc = F('serviceType')?.value || '-';
    const size = F('size')?.value || '-';
    const date = F('date')?.value || '-';
    const msg = F('message')?.value || '-';

    const subject = encodeURIComponent(`${i18n[currentLang].quote_subject} · ${svc}`);
    const body = `${i18n[currentLang].client}: ${name}
Email: ${email}
WhatsApp: ${phone}
${i18n[currentLang].service}: ${svc}
m²/horas: ${size}
${i18n[currentLang].tentative_date}: ${date}

${i18n[currentLang].message}:
${msg}

— ${i18n[currentLang].sent_from} www.todocr.com`;

    return {
        subject,
        body: encodeURIComponent(body),
        wa: encodeURIComponent(body)
    };
}

// Navigation highlight
function highlightNavigation() {
    const scrollPos = window.scrollY;
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Language toggle handler
function handleLanguageToggle() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('preferred_lang', currentLang);

    // Update UI
    const currentLangButton = F('currentLang');
    const nextLangButton = F('nextLang');
    if (currentLangButton && nextLangButton) {
        currentLangButton.textContent = currentLang.toUpperCase();
        nextLangButton.textContent = (currentLang === 'es' ? 'EN' : 'ES');

        // Update visual states
        currentLangButton.classList.remove('text-slate-400');
        nextLangButton.classList.add('text-slate-400');
    }

    populateTexts();
}

// Función de validación del formulario
function validateForm() {
    let isValid = true;
    const errors = {};

    // Limpiar errores previos
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));

    // Validaciones
    const fields = {
        name: {
            required: true,
            value: F('name').value.trim(),
            minLength: 2
        },
        email: {
            required: true,
            value: F('email').value.trim(),
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        phone: {
            required: true,
            value: F('phone').value.trim(),
            pattern: /^\+?[\d\s-]{8,}$/
        },
        date: {
            required: true,
            value: F('date').value,
            custom: (v) => v && v >= new Date().toISOString().split('T')[0]
        },
        size: {
            required: false,
            value: F('size').value.trim()
        },
        message: {
            required: false,
            value: F('message').value.trim()
        }
    };

    // Validar cada campo
    Object.entries(fields).forEach(([fieldName, rules]) => {
        const field = F(fieldName);
        let hasError = false;

        // Solo validar si el campo es requerido o tiene valor
        if (rules.required) {
            if (!rules.value || rules.value.length === 0) {
                hasError = true;
            } else if (rules.minLength && rules.value.length < rules.minLength) {
                hasError = true;
            } else if (rules.pattern && !rules.pattern.test(rules.value)) {
                hasError = true;
            } else if (rules.custom && !rules.custom(rules.value)) {
                hasError = true;
            }
        }

        if (hasError) {
            isValid = false;
            field.classList.add('error-input');

            // Crear contenedor para el mensaje de error
            const errorContainer = document.createElement('div');
            errorContainer.className = 'error-message text-red-500 text-xs mt-1';
            errorContainer.textContent = i18n[currentLang][`error_${fieldName}`];

            // Insertar mensaje de error después del campo
            const parent = field.parentElement;
            if (parent.classList.contains('md:col-span-2')) {
                // Para campos que ocupan todo el ancho
                parent.appendChild(errorContainer);
            } else {
                // Para campos en columnas
                field.insertAdjacentElement('afterend', errorContainer);
            }
        }
    });

    return isValid;
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Insert Schema.org
    const script = document.createElement('script');
    script.type = "application/ld+json";
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    // Set current year
    const yearElement = F('yr');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Initial language setup
    const currentLangButton = F('currentLang');
    const nextLangButton = F('nextLang');
    if (currentLangButton && nextLangButton) {
        currentLangButton.textContent = currentLang.toUpperCase();
        nextLangButton.textContent = (currentLang === 'es' ? 'EN' : 'ES');
        currentLangButton.classList.remove('text-slate-400');
        nextLangButton.classList.add('text-slate-400');
    }

    // Initial text population
    populateTexts();

    // Language toggle setup
    const toggle = F('langToggle');
    if (toggle) {
        toggle.addEventListener('click', handleLanguageToggle);
    }

    // Contact form handlers
    const sendEmail = F('sendEmail');
    if (sendEmail) {
        sendEmail.addEventListener('click', () => {
            if (validateForm()) {
                const { subject, body } = buildSummary();
                window.location.href = `mailto:info.todocr@gmail.com?subject=${subject}&body=${body}`;
            }
        });
    }

    const sendWA = F('sendWA');
    if (sendWA) {
        sendWA.addEventListener('click', () => {
            if (validateForm()) {
                const { wa } = buildSummary();
                window.open(`https://wa.me/50670808613?text=${wa}`, '_blank');
            }
        });
    }

    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    formInputs.forEach(input => {
        input.addEventListener('input', function () {
            this.classList.remove('error-input');
            const wrapper = this.closest('.form-control');
            const msg = wrapper && wrapper.querySelector('.error-message');
            if (msg) msg.remove();
        });
    });

    // Navigation setup
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Initial navigation highlight
    highlightNavigation();
});

// Scroll event for navigation highlight
window.addEventListener('scroll', highlightNavigation);