/**
 * YORISHID ACADEMY 2.0 - MODERN JAVASCRIPT
 * Interactive, Smooth, Performant
 */

// ========================================
// 1. CONFIGURATION
// ========================================

const CONFIG = {
    navHeight: 80,
    animationDuration: 500,
    scrollThrottle: 16, // ~60fps
    breakpoints: {
        mobile: 640,
        tablet: 768,
        desktop: 1024
    }
};

// ========================================
// 2. UTILITIES
// ========================================

/**
 * Throttle function for performance
 */
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function(...args) {
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

/**
 * Debounce function
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
        rect.bottom >= 0
    );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(target, offset = CONFIG.navHeight) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ========================================
// 3. LOADING SCREEN
// ========================================

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading');
    
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Remove from DOM after transition
            setTimeout(() => {
                loadingScreen.remove();
            }, CONFIG.animationDuration);
        }, 300);
    }
}

// ========================================
// 4. NAVIGATION
// ========================================

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
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close menu on overlay click
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => this.closeMobileMenu());
        }
        
        // Smooth scroll for all nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavLinkClick(e));
        });
        
        // Scroll events
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
        
        // Check if it's an internal link
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                    
                    // Delay scroll until menu is closed
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
        
        // Add/remove scrolled class
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
        
        // Update active state
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

// ========================================
// 5. SCROLL PROGRESS BAR
// ========================================

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

// ========================================
// 6. INTERSECTION OBSERVER (Animations)
// ========================================

class AnimationObserver {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }
    
    init() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: just add animation classes immediately
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
                    
                    // Optimize: stop observing after animation
                    if (entry.target.hasAttribute('data-aos-once') || true) {
                        this.observer.unobserve(entry.target);
                    }
                }
            });
        }, options);
        
        this.elements.forEach(el => this.observer.observe(el));
    }
}

// ========================================
// 7. PARALLAX EFFECTS
// ========================================

class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.parallax');
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        // Disable on mobile for performance
        if (window.innerWidth < CONFIG.breakpoints.tablet) return;
        
        window.addEventListener('scroll', throttle(() => {
            this.updateParallax();
        }, CONFIG.scrollThrottle), { passive: true });
    }
    
    updateParallax() {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach(el => {
            if (!isInViewport(el, 200)) return;
            
            const speed = parseFloat(el.dataset.speed) || 0.5;
            const yPos = -(scrolled * speed);
            
            // Use transform for better performance
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
}

// ========================================
// 8. PERFORMANCE OPTIMIZATIONS
// ========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Add will-change to animated elements
        this.optimizeAnimatedElements();
        
        // Lazy load images (if needed)
        this.lazyLoadImages();
        
        // Remove will-change after animation
        this.cleanupAfterAnimations();
    }
    
    optimizeAnimatedElements() {
        const animatedElements = document.querySelectorAll(
            '.btn-primary, .about-card, .benefit-card, .pricing-card'
        );
        
        animatedElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                this.style.willChange = 'transform';
            }, { once: false });
            
            el.addEventListener('mouseleave', function() {
                // Remove will-change after animation
                setTimeout(() => {
                    this.style.willChange = 'auto';
                }, 500);
            }, { once: false });
        });
    }
    
    lazyLoadImages() {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        } else {
            // Use Intersection Observer fallback
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    cleanupAfterAnimations() {
        // Remove will-change after AOS animations complete
        document.addEventListener('aos:in', ({ detail }) => {
            setTimeout(() => {
                detail.style.willChange = 'auto';
            }, 1000);
        });
    }
}

// ========================================
// 9. BUTTON INTERACTIONS
// ========================================

class ButtonEffects {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary');
        this.init();
    }
    
    init() {
        this.buttons.forEach(button => {
            // Ripple effect
            button.addEventListener('click', (e) => this.createRipple(e));
            
            // Micro-interaction on hover
            button.addEventListener('mouseenter', function() {
                this.style.willChange = 'transform';
            });
            
            button.addEventListener('mouseleave', function() {
                setTimeout(() => {
                    this.style.willChange = 'auto';
                }, 300);
            });
        });
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
        
        // Remove existing ripples
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 600);
    }
}

// Add ripple CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
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
document.head.appendChild(rippleStyle);

// ========================================
// 10. SMOOTH REVEAL ANIMATIONS
// ========================================

class SmoothReveal {
    constructor() {
        this.cards = document.querySelectorAll(
            '.about-card, .benefit-card, .feature-item'
        );
        this.init();
    }
    
    init() {
        this.cards.forEach((card, index) => {
            // Stagger animation delays
            const delay = index * 50; // 50ms between each card
            
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, delay);
        });
    }
}

// ========================================
// 11. RESPONSIVE BEHAVIOR
// ========================================

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
        
        // Disable parallax on mobile
        if (width < CONFIG.breakpoints.tablet) {
            document.querySelectorAll('.parallax').forEach(el => {
                el.style.transform = 'none';
            });
        }
        
        // Update AOS on mobile
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

// ========================================
// 12. INITIALIZATION
// ========================================

class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Initialize AOS library
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic',
                disable: false
            });
        }
        
        // Initialize custom modules
        new Navigation();
        new ScrollProgress();
        new AnimationObserver();
        new ParallaxEffect();
        new PerformanceOptimizer();
        new ButtonEffects();
        new ResponsiveHandler();
        
        // Hide loading screen
        hideLoadingScreen();
        
        // Smooth reveal for cards (after AOS)
        setTimeout(() => {
            new SmoothReveal();
        }, 100);
    }
}

// ========================================
// 13. START APPLICATION
// ========================================

// Initialize app
const app = new App();

// ========================================
// 14. ADDITIONAL FEATURES
// ========================================

/**
 * Easter Egg: Konami Code
 */
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        // Fun animation!
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 5000);
        
        console.log('🎉 Easter egg found! You discovered the rainbow mode!');
    }
});

/**
 * Performance monitoring (Development only)
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Performance Metrics:');
            console.log(`DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
            console.log(`Page Load Time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            console.log(`Total Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        }
    });
}

/**
 * Export for testing (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        ScrollProgress,
        AnimationObserver,
        ParallaxEffect,
        PerformanceOptimizer,
        ButtonEffects
    };
}
