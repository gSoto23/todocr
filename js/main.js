// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000',
    ENDPOINTS: {
        CONTACT: '/api/email/contact-home'
    }
};

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

// Form validation
function validateForm() {
    let isValid = true;
    const errors = {};

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));

    // Validations
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

    // Validate each field
    Object.entries(fields).forEach(([fieldName, rules]) => {
        const field = F(fieldName);
        let hasError = false;

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

            const errorContainer = document.createElement('div');
            errorContainer.className = 'error-message text-red-500 text-xs mt-1';
            errorContainer.textContent = i18n[currentLang][`error_${fieldName}`];

            const parent = field.parentElement;
            if (parent.classList.contains('md:col-span-2')) {
                parent.appendChild(errorContainer);
            } else {
                field.insertAdjacentElement('afterend', errorContainer);
            }
        }
    });

    return isValid;
}

// Show notification
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Handle email submit
async function handleEmailSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const sendEmailBtn = F('sendEmail');
    const originalText = sendEmailBtn.textContent;

    try {
        sendEmailBtn.disabled = true;
        sendEmailBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            ${i18n[currentLang].sending}
        `;

        // Recopilar datos del formulario
        const formData = {
            name: F('name').value.trim(),
            email: F('email').value.trim(),
            phone: F('phone').value.trim(),
            service: F('serviceType').value,
            size: F('size').value.trim(),
            date: F('date').value,
            message: F('message').value.trim()
        };

        console.log('Sending data:', formData);

        const response = await fetch(`${API_CONFIG.BASE_URL}/api/email/contact-home`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            showNotification('success', i18n[currentLang].email_sent);
            F('contactForm').reset();
        } else {
            throw new Error(data.message || 'Error sending email');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('error', i18n[currentLang].email_error);
    } finally {
        sendEmailBtn.disabled = false;
        sendEmailBtn.textContent = originalText;
    }
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
        sendEmail.addEventListener('click', handleEmailSubmit);
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

    // Form input handlers
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