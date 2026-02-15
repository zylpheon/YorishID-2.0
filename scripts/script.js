const CONFIG = {
    navHeight: 80,
    animationDuration: 500,
    scrollThrottle: 16,
    breakpoints: { mobile: 640, tablet: 768, desktop: 1024 }
};

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
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            setTimeout(() => loadingScreen.remove(), CONFIG.animationDuration);
        }, 300);
    }
}

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.menuOverlay = document.getElementById('menu-overlay');
        this.navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
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
        this.navLinks.forEach(link => {
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
        this.mobileMenu.style.maxHeight = '400px';
        this.mobileMenuBtn.classList.add('active');
        this.menuOverlay.style.opacity = '1';
        this.menuOverlay.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }

    closeMobileMenu() {
        this.mobileMenu.style.maxHeight = '0';
        this.mobileMenuBtn.classList.remove('active');
        this.menuOverlay.style.opacity = '0';
        this.menuOverlay.style.visibility = 'hidden';
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
                    setTimeout(() => smoothScrollTo(targetElement), CONFIG.animationDuration);
                } else {
                    smoothScrollTo(targetElement);
                }
            }
        }
    }

    updateNavbarOnScroll() {
        const scrollY = window.pageYOffset;
        if (scrollY > 50) {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            this.navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        } else {
            this.navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            this.navbar.style.boxShadow = 'none';
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
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic',
                disable: false
            });
        }
        new Navigation();
        new ScrollProgress();
        hideLoadingScreen();
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
}

const app = new App();