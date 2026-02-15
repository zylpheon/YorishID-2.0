// Configuration
const CONFIG = {
    navHeight: 80,
    animationDuration: 500,
    scrollThrottle: 16,
    breakpoints: {
        mobile: 640,
        tablet: 768,
        desktop: 1024
    }
};

// Utility Functions
function throttle(func, delay) {
    let timeoutId, lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime < delay) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastExecTime = currentTime;
                func.apply(this, args);
            }, delay - (currentTime - lastExecTime));
        } else {
            lastExecTime = currentTime;
            func.apply(this, args);
        }
    };
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function smoothScrollTo(target, offset = CONFIG.navHeight) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, CONFIG.animationDuration);
        }, 300);
    }
}

// Navigation Class
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.menuOverlay = document.getElementById('menu-overlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileLinks = document.querySelectorAll('.mobile-menu a');
        this.lastScrollY = 0;
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateActiveLink();
    }

    setupEventListeners() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => this.closeMobileMenu());
        }

        // Handle all nav links (desktop and mobile)
        [...this.navLinks, ...this.mobileLinks].forEach(link => {
            link.addEventListener('click', (e) => this.handleNavLinkClick(e));
        });

        window.addEventListener('scroll', throttle(() => {
            this.updateNavbarOnScroll();
            this.updateActiveLink();
        }, CONFIG.scrollThrottle), { passive: true });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        if (this.isMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenu.classList.add('open');
        this.mobileMenuBtn.classList.add('active');
        this.menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('open');
        this.mobileMenuBtn.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        this.isMenuOpen = false;
    }

    handleNavLinkClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                    setTimeout(() => {
                        smoothScrollTo(targetElement);
                    }, CONFIG.animationDuration);
                } else {
                    smoothScrollTo(targetElement);
                }
            }
        }
    }

    updateNavbarOnScroll() {
        const scrollY = window.pageYOffset;

        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        this.lastScrollY = scrollY;
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.navHeight - 100;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Scroll Progress Class
class ScrollProgress {
    constructor() {
        this.progressBar = document.getElementById('scroll-progress');
        this.init();
    }

    init() {
        if (!this.progressBar) return;

        window.addEventListener('scroll', throttle(() => {
            this.updateProgress();
        }, CONFIG.scrollThrottle), { passive: true });
    }

    updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;

        this.progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
}

// Animation Observer Class
class AnimationObserver {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            this.elements.forEach(el => el.classList.add('aos-animate'));
            return;
        }

        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    if (entry.target.hasAttribute('data-aos-once') || true) {
                        this.observer.unobserve(entry.target);
                    }
                }
            });
        }, options);

        this.elements.forEach(el => this.observer.observe(el));
    }
}

// Button Effects Class
class ButtonEffects {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e));
        });
        this.addRippleCSS();
    }

    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        const rect = button.getBoundingClientRect();

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - rect.left - radius}px`;
        ripple.style.top = `${event.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple');

        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    addRippleCSS() {
        if (document.getElementById('ripple-style')) return;

        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.6);
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Responsive Handler Class
class ResponsiveHandler {
    constructor() {
        this.init();
    }

    init() {
        this.handleResize();
        window.addEventListener('resize', debounce(() => {
            this.handleResize();
        }, 250));
    }

    handleResize() {
        const width = window.innerWidth;

        if (width < CONFIG.breakpoints.tablet) {
            this.simplifyAnimationsOnMobile();
        }
    }

    simplifyAnimationsOnMobile() {
        const elementsWithDelay = document.querySelectorAll('[data-aos-delay]');
        elementsWithDelay.forEach(el => {
            el.removeAttribute('data-aos-delay');
        });
    }
}

// Main App Class
class App {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic',
                disable: false
            });
        }

        // Initialize all components
        new Navigation();
        new ScrollProgress();
        new AnimationObserver();
        new ButtonEffects();
        new ResponsiveHandler();

        // Update footer year
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        // Hide loading screen
        hideLoadingScreen();
    }
}

// Initialize the app
const app = new App();