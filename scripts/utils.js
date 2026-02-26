/* ── Utilities ──────────────────────────────────────────── */

/* Current year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Progress bar */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });