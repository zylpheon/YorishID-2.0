gsap.registerPlugin(ScrollTrigger);
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
    .from('#h-badge', { opacity: 0, y: 22, duration: .6 })
    .from('#h-title', { opacity: 0, y: 44, duration: .85 }, '-=.35')
    .from('#h-sub', { opacity: 0, y: 22, duration: .6 }, '-=.5')
    .from('#h-price', { opacity: 0, y: 22, duration: .55 }, '-=.4')
    .from('#h-cta', { opacity: 0, y: 18, duration: .5 }, '-=.35')
    .from('#h-note', { opacity: 0, duration: .5 }, '-=.2');
gsap.utils.toArray('.gs-fade-up').forEach(function (el) {
    gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
            opacity: 1, y: 0,
            duration: .75,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        }
    );
});
const staggerGroups = [
    '.whom-grid .whom-card',
    '.benefits-grid .benefit-card',
    '.note-cards .note-card'
];
staggerGroups.forEach(function (selector) {
    const items = gsap.utils.toArray(selector);
    if (!items.length) return;
    const chunkSize = 3;
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        gsap.fromTo(chunk,
            { opacity: 0, y: 28 },
            {
                opacity: 1, y: 0,
                duration: .65,
                stagger: .1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: chunk[0],
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }
});
gsap.fromTo('.pricing-card',
    { opacity: 0, y: 40, scale: .98 },
    {
        opacity: 1, y: 0, scale: 1,
        duration: .8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.pricing-card',
            start: 'top 85%',
            toggleActions: 'play none none none'
        }
    }
);
gsap.utils.toArray('#cta .gs-fade-up').forEach(function (el, i) {
    gsap.fromTo(el,
        { opacity: 0, y: 24 },
        {
            opacity: 1, y: 0,
            duration: .65,
            delay: i * .12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#cta',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        }
    );
});
gsap.to('.hero-glow-1', {
    y: -60,
    ease: 'none',
    scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
    }
});
gsap.to('.hero-glow-2', {
    y: -40,
    ease: 'none',
    scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 2
    }
});