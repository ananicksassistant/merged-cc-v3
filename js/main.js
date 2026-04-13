/**
 * FRAME//SHIFT v2 — Cinematic JavaScript
 * GSAP + ScrollTrigger animations
 */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initNavigation();
    initHeroAnimations();
    initAssemblyAnimation();
    initServicePanels();
    initManifestoReveal();
    initScrollAnimations();
    initMagneticElements();
});

// Preloader
function initPreloader() {
    // Animate hero elements with delay
    setTimeout(() => {
        animateHero();
    }, 300);
}

// Custom Cursor
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    
    if (!cursor || !follower) return;
    if (window.matchMedia('(hover: none)').matches) return;
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - 4 + 'px';
        cursor.style.top = mouseY - 4 + 'px';
    });
    
    function animateFollower() {
        const followerX = parseFloat(follower.style.left) || mouseX;
        const followerY = parseFloat(follower.style.top) || mouseY;
        
        follower.style.left = followerX + (mouseX - followerX) * 0.1 - 20 + 'px';
        follower.style.top = followerY + (mouseY - followerY) * 0.1 - 20 + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Hover effects
    document.querySelectorAll('a, button, .case-card, .service-panel, .process-phase, .manifesto__statement').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

// Navigation
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    window.addEventListener('scroll', () => {
        nav.classList.toggle('nav--scrolled', window.pageYOffset > 50);
    }, { passive: true });
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        navMenu.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = nav ? nav.offsetHeight : 0;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero Animations
function initHeroAnimations() {
    // Just set initial states, animateHero() will be called after preloader
}

function animateHero() {
    const tl = gsap.timeline();
    
    tl.to('.hero__title-line', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
    })
    .to('.hero__subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5')
    .to('.hero__cta', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    }, '-=0.5')
    .to('.hero__scroll', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    }, '-=0.3');
    
    // Hero video zoom
    gsap.from('.hero__video', {
        scale: 1.2,
        duration: 3,
        ease: 'power2.out'
    });
}

// Assembly Section
function initAssemblyAnimation() {
    gsap.utils.toArray('[data-assemble]').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            }
        });
    });
}

// Service Panels
function initServicePanels() {
    const panels = document.querySelectorAll('.service-panel');
    const bg = document.getElementById('servicesBg');
    
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            const service = panel.dataset.service;
            const colors = {
                film: 'rgba(59, 231, 213, 0.05)',
                motion: 'rgba(124, 108, 255, 0.05)',
                '3d': 'rgba(59, 231, 213, 0.05)',
                ai: 'rgba(124, 108, 255, 0.05)'
            };
            if (bg) bg.style.background = colors[service] || '';
        });
        
        panel.addEventListener('mouseleave', () => {
            if (bg) bg.style.background = '';
        });
    });
}

// Manifesto Reveal
function initManifestoReveal() {
    gsap.utils.toArray('[data-manifesto]').forEach((stmt) => {
        gsap.from(stmt, {
            opacity: 0.3,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: stmt,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// General Scroll Animations
function initScrollAnimations() {
    // Section headers
    gsap.utils.toArray('.section-label, .assembly__label').forEach(el => {
        gsap.from(el, {
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%'
            }
        });
    });
    
    gsap.utils.toArray('.section-title, .assembly__title').forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%'
            }
        });
    });
    
    // Case cards
    gsap.utils.toArray('.case-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            }
        });
    });
    
    // Process phases
    gsap.utils.toArray('.process-phase').forEach((phase, i) => {
        gsap.from(phase, {
            opacity: 0,
            x: 50,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: phase,
                start: 'left 90%'
            }
        });
    });
    
    // Service panels
    gsap.utils.toArray('.service-panel').forEach((panel, i) => {
        gsap.from(panel, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: panel,
                start: 'top 85%'
            }
        });
    });
    
    // Metrics
    gsap.utils.toArray('.metric').forEach((metric, i) => {
        gsap.from(metric, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: metric,
                start: 'top 85%'
            }
        });
    });
    
    // Final frame
    gsap.from('.final-frame__content', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.final-frame',
            start: 'top 70%'
        }
    });
    
    // Hero parallax
    gsap.to('.hero__video', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
}

// Magnetic Elements
function initMagneticElements() {
    if (window.matchMedia('(hover: none)').matches) return;
    
    document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

console.log('%cFRAME//SHIFT', 'font-size: 24px; font-weight: bold; color: #3BE7D5;');
console.log('%cMerged Studio — Cinematic Signal', 'font-size: 14px; color: #A8AFB8;');