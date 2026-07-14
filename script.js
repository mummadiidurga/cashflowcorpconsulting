document.addEventListener('DOMContentLoaded', () => {

    // ==============================
    // DARK / LIGHT MODE TOGGLE
    // ==============================
    const html = document.getElementById('html-root');
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = themeBtn?.querySelector('.theme-icon');

    // Load saved preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        html.classList.add('dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    }

    themeBtn?.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
    });

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ==============================
    // MOBILE MENU TOGGLE
    // ==============================
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileToggle?.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const spans = mobileToggle.querySelectorAll('span');
        const isOpen = mobileMenu.classList.contains('active');
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : 'none';
        spans[1].style.opacity  = isOpen ? '0' : '1';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(7px,-7px)' : 'none';
    });

    // Close mobile menu on link click
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // ==============================
    // SCROLL REVEAL (Intersection Observer)
    // ==============================
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));

    // ==============================
    // ANIMATED COUNTER (Stats)
    // ==============================
    function animateCount(el, target, duration = 2000) {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { start = target; clearInterval(timer); }
            el.textContent = Math.floor(start).toLocaleString();
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const nums = entry.target.querySelectorAll('.badge-num, .why-stat strong');
                nums.forEach(num => {
                    const raw = num.textContent.replace(/[^0-9]/g, '');
                    if (raw) {
                        const suffix = num.textContent.replace(/[0-9,]/g, '');
                        const target = parseInt(raw);
                        let count = 0;
                        const step = Math.ceil(target / 80);
                        const timer = setInterval(() => {
                            count = Math.min(count + step, target);
                            num.textContent = count + suffix;
                            if (count >= target) clearInterval(timer);
                        }, 20);
                    }
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.about-img-wrapper, .why-stats').forEach(el => {
        counterObserver.observe(el);
    });

    // ==============================
    // SERVICE CARD HOVER TILT
    // ==============================
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('#navbar .nav-links a, .mobile-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) a.classList.add('active');
        });
    }, { passive: true });

    // ==============================
    // CONTACT FORM → WHATSAPP
    // ==============================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            const whatsappNumber = "919391081985";
            const text = `*New Enquiry – Cashflow Corp*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Service:* ${encodeURIComponent(service)}%0A*Message:* ${encodeURIComponent(message)}`;
            window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
        });
    }

    // ==============================
    // SERVICE CARD HOVER TILT
    // ==============================
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -4;
            const rotY = ((x - cx) / cx) * 4;
            card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

});
