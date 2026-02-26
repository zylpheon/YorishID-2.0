/* ── Navbar Scroll Effect ───────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.pageYOffset > 30);
}, { passive: true });

/* ── Hamburger / Mobile Menu ────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function openMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', function () {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

document.querySelectorAll('[data-mobile-link]').forEach(function (link) {
    link.addEventListener('click', closeMenu);
});