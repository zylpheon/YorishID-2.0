/* ── Smooth Scroll ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.pageYOffset - 72;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    });
});