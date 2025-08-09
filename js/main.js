// Datos de Schema.org
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

// Datos de internacionalización
const i18n = {
    es: {
        nav_services: "Servicios", nav_plans: "Planes", nav_process: "Proceso", nav_gallery: "Galería",
        nav_testimonials: "Testimonios", nav_faq: "FAQ", nav_contact: "Contacto", nav_login: "Login Cotizador",
        cta_quote: "Cotiza ahora",
        hero_title: "Mantenimiento integral para Airbnb, Hoteles y Condominios",
        hero_sub: "Jardinería, limpieza y reparaciones confiables en Poás y Alajuela Centro. Respuesta ágil, calidad constante.",
        hero_badge: "Cobertura: Poás · Alajuela Centro",
        hero_cta: "Solicitar cotización",
        services_title: "Servicios",
        services_intro: "Detallamos qué incluye cada servicio, su modalidad de tarifa y consideraciones.",
        svc_garden: "Jardinería (por m²)",
        g1: "Corte de césped y bordes — incluye orillado y soplado.",
        g2: "Poda ligera de arbustos y árboles (altura segura).",
        g3: "Limpieza de zonas verdes; retiro de hojas.",
        g4: "Riego y abonado básico.",
        g5: "Diseño y reposición de plantas (estimativo).",
        g_tariffs: "Rendimientos ref.: 200 m²/h (corte), 150 m²/h (limpieza), 50 m²/h (poda). Tarifas orientativas: ₡120–₡160/m² según terreno y accesibilidad.",
        svc_clean: "Limpieza (por m²)",
        c1: "Turnover Airbnb: recámaras, baño, cocina liviana, blancos y básicos.",
        c2: "Limpieza profunda: desengrase, juntas, interiores de mobiliario.",
        c3: "Vidrios interior/exterior.",
        c4: "Post-remodelación.",
        c5: "Sanitización focal (áreas críticas).",
        c_tariffs: "Rendimientos ref.: 50 m²/h (turnover), 30 m²/h (profunda), 20 m²/h (vidrios). Materiales especiales se cotizan aparte.",
        svc_maint: "Mantenimiento y Reparaciones (por hora)",
        m1: "Electricidad y fontanería básica (reemplazos y ajustes menores).",
        m2: "Pintura interior/exterior y de techos.",
        m3: "Instalaciones menores (TV, repisas, cortinas).",
        m4: "Diagnóstico preventivo con reporte y fotos.",
        m5: "Urgencias 24 h (según disponibilidad).",
        m_tariffs: "Tarifa ref.: ₡10.700–₡16.050/h, mínimo 0.5 h. Materiales con +10% de manejo. Traslado fuera de Poás/Alajuela Centro se cotiza aparte.",
        plans_title: "Planes",
        plan_express: "Plan Express",
        plan_express_desc: "1 visita única: turnover + mantenimiento ligero. Ideal entre reservas.",
        plan_full: "Plan Completo",
        plan_full_desc: "2 visitas/mes: jardinería + limpieza + checklist técnico con fotos.",
        plan_urgent: "Plan Urgencias",
        plan_urgent_desc: "Atención en 24 horas (según disponibilidad). Ideal para imprevistos.",
        plan_from: "Desde",
        process_title: "Cómo trabajamos",
        p1_t: "1) Solicitud",
        p1_d: "Cuéntanos el tipo de servicio, m²/horas y fecha tentativa.",
        p2_t: "2) Diagnóstico",
        p2_d: "Validamos alcance, ajustamos materiales y tiempos.",
        p3_t: "3) Ejecución",
        p3_d: "Equipo asignado con checklist y estándares de calidad.",
        p4_t: "4) Entrega",
        p4_d: "Reporte con fotos y recomendaciones preventivas.",
        gallery_title: "Galería",
        testimonials_title: "Testimonios",
        t1_role: "Host Airbnb · Poás",
        t1_txt: "Excelente turnover, llegaron a tiempo y dejaron todo impecable. ¡Recomendados!",
    t2_role: "Administrador · Condominio",
    t2_txt: "Buenas prácticas de seguridad y comunicación clara. Reporte con fotos muy útil.",
    t3_role: "Hotel · Alajuela",
    t3_txt: "Soporte de urgencias 24 h cuando lo necesitamos. Muy profesionales.",
    coverage_title: "Cobertura",
    coverage_txt: "Poás y Alajuela Centro. Para otras locaciones, se cotiza el traslado.",
    faq_title: "Preguntas frecuentes",
    faq1_q: "¿Materiales incluidos?",
    faq1_a: "Incluimos básicos; materiales especiales y posobra se cotizan aparte (+10% manejo).",
    faq2_q: "¿Cómo se calcula el precio?",
    faq2_a: "Por m² con productividades (jardinería/limpieza) o por hora (mantenimiento). Cotiza para detalle.",
    faq3_q: "¿Reprogramaciones?",
    faq3_a: "Sin costo con 24 h de aviso; urgencias sujetas a disponibilidad.",
    faq4_q: "¿Garantía?",
    faq4_a: "Revisamos incidencias reportadas en 48 h y realizamos corrección si aplica.",
    contact_title: "Contacto",
    contact_sub: "Cuéntanos sobre tu propiedad y te contactamos.",
    contact_email: "Enviar por email",
    contact_wa: "Enviar por WhatsApp"
},
en: {
    nav_services: "Services", nav_plans: "Plans", nav_process: "Process", nav_gallery: "Gallery",
        nav_testimonials: "Testimonials", nav_faq: "FAQ", nav_contact: "Contact", nav_login: "Estimator Login",
        cta_quote: "Get a quote",
        hero_title: "Full maintenance for Airbnb, Hotels and Condos",
        hero_sub: "Reliable gardening, cleaning and repairs in Poás and Alajuela Center. Fast response, consistent quality.",
        hero_badge: "Coverage: Poás · Alajuela Center",
        hero_cta: "Request a quote",
        services_title: "Services",
        services_intro: "What each service includes, pricing mode and considerations.",
        svc_garden: "Gardening (by m²)",
        g1: "Grass cutting & edging — includes edging and blowing.",
        g2: "Light trimming of bushes and trees (safe height).",
        g3: "Green area clean-up; leaf removal.",
        g4: "Basic watering and fertilizing.",
        g5: "Design & plant replacement (estimate).",
        g_tariffs: "Ref. productivity: 200 m²/h (cut), 150 m²/h (clean-up), 50 m²/h (trimming). Indicative rates: ₡120–₡160/m² depending on terrain and access.",
        svc_clean: "Cleaning (by m²)",
        c1: "Airbnb turnover: bedrooms, bathroom, light kitchen, linens and essentials.",
        c2: "Deep clean: degreasing, grout, inside furniture.",
        c3: "Windows inside/outside.",
        c4: "Post-remodel cleaning.",
        c5: "Targeted sanitization (critical areas).",
        c_tariffs: "Ref. productivity: 50 m²/h (turnover), 30 m²/h (deep), 20 m²/h (windows). Special materials quoted separately.",
        svc_maint: "Maintenance & Repairs (hourly)",
        m1: "Basic electrical and plumbing (replacements, minor fixes).",
        m2: "Interior/exterior and roof painting.",
        m3: "Minor installs (TV, shelves, curtains).",
        m4: "Preventive diagnosis with photo report.",
        m5: "24h emergencies (subject to availability).",
        m_tariffs: "Ref. rate: ₡10,700–₡16,050/h, 0.5 h minimum. Materials +10% handling. Travel outside Poás/Alajuela Center quoted separately.",
        plans_title: "Plans",
        plan_express: "Express Plan",
        plan_express_desc: "One-time visit: turnover + light maintenance. Ideal between stays.",
        plan_full: "Full Property Plan",
        plan_full_desc: "2 visits/month: gardening + cleaning + technical checklist with photos.",
        plan_urgent: "Emergency Plan",
        plan_urgent_desc: "24-hour response (subject to availability).",
        plan_from: "From",
        process_title: "How we work",
        p1_t: "1) Request",
        p1_d: "Tell us the service type, m²/hours and preferred date.",
        p2_t: "2) Assessment",
        p2_d: "We validate scope and adjust materials and timing.",
        p3_t: "3) Execution",
        p3_d: "Assigned crew with checklist and quality standards.",
        p4_t: "4) Handover",
        p4_d: "Report with photos and preventive recommendations.",
        gallery_title: "Gallery",
        testimonials_title: "Testimonials",
        t1_role: "Airbnb Host · Poás",
        t1_txt: "Great turnover, on time and spotless. Highly recommended!",
        t2_role: "Building Manager",
        t2_txt: "Good safety practices and clear comms. Photo report is very helpful.",
        t3_role: "Hotel · Alajuela",
        t3_txt: "24h emergency support when we needed it. Very professional.",
        coverage_title: "Coverage",
        coverage_txt: "Poás and Alajuela Center. Travel fee applies for other locations.",
        faq_title: "FAQ",
        faq1_q: "Are materials included?",
        faq1_a: "Basics included; special/after-construction materials are quoted separately (+10% handling).",
        faq2_q: "How is pricing calculated?",
        faq2_a: "By m² using productivity (gardening/cleaning) or hourly (maintenance). Ask for a quote for details.",
        faq3_q: "Rescheduling?",
        faq3_a: "No cost with 24h notice; emergencies subject to availability.",
        faq4_q: "Guarantee?",
        faq4_a: "We review incidents reported within 48h and correct if applicable.",
        contact_title: "Contact",
        contact_sub: "Tell us about your property and we'll get back to you.",
        contact_email: "Send by email",
        contact_wa: "Send by WhatsApp"
}
};

// Función auxiliar para obtener elementos del DOM
const F = id => document.getElementById(id);

// Función para construir el resumen del formulario
function buildSummary() {
    const name = F('name').value || '-';
    const email = F('email').value || '-';
    const phone = F('phone').value || '-';
    const svc = F('serviceType').value || '-';
    const size = F('size').value || '-';
    const date = F('date').value || '-';
    const msg = F('message').value || '-';

    const subject = encodeURIComponent(`Cotización TODOCR · ${svc}`);
    const body = `Cliente: ${name}
Email: ${email}
WhatsApp: ${phone}
Servicio: ${svc}
m²/horas: ${size}
Fecha tentativa: ${date}

Mensaje:
${msg}

— Enviado desde www.todocr.com`;

    return {
        subject,
        body,
        wa: encodeURIComponent(body)
    };
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Insertar Schema.org
    const script = document.createElement('script');
    script.type = "application/ld+json";
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    // Actualizar año
    const yearElement = F('yr');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Toggle de idioma
    let lang = 'es';
    const toggle = F('langToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            lang = (lang === 'es') ? 'en' : 'es';
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (i18n[lang][key]) {
                    el.textContent = i18n[lang][key];
                }
            });
            document.documentElement.lang = lang;
        });
    }

    // Eventos de contacto
    const sendEmail = F('sendEmail');
    if (sendEmail) {
        sendEmail.addEventListener('click', () => {
            const { subject, body } = buildSummary();
            window.location.href = `mailto:info.todocr@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
        });
    }

    const sendWA = F('sendWA');
    if (sendWA) {
        sendWA.addEventListener('click', () => {
            const { wa } = buildSummary();
            window.open(`https://wa.me/50670808613?text=${wa}`, '_blank');
        });
    }
});

// Manejo del idioma
let lang = 'es';
const toggle = F('langToggle');
const currentLang = F('currentLang');

if (toggle && currentLang) {
    toggle.classList.add('es'); // Clase inicial

    toggle.addEventListener('click', () => {
        lang = (lang === 'es') ? 'en' : 'es';

        // Actualizar el botón
        toggle.classList.remove('es', 'en');
        toggle.classList.add(lang);
        currentLang.textContent = lang.toUpperCase();

        // Actualizar textos
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[lang][key]) {
                el.textContent = i18n[lang][key];
            }
        });
        document.documentElement.lang = lang;
    });
}

// Manejo de la navegación activa
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollPos = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Ajuste para el header fijo
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

// Evento scroll para actualizar la navegación activa
window.addEventListener('scroll', highlightNavigation);

// Activar la navegación inicial
highlightNavigation();

// Smooth scroll para los enlaces de navegación
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
