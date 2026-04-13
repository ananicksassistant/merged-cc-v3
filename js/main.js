/**
 * FRAME//SHIFT v3 — Hyper-Interactive Cinematic JS
 * GSAP + ScrollTrigger + Lenis + Magnetic Cursor
 */

gsap.registerPlugin(ScrollTrigger);

// ===== LENIS SMOOTH SCROLL =====
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ===== PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
progressBar.id = 'progressBar';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
}, { passive: true });

// ===== FILM BURN EFFECT =====
const filmBurn = document.createElement('div');
filmBurn.className = 'film-burn';
filmBurn.id = 'filmBurn';
document.body.appendChild(filmBurn);

// ===== SNAP DOTS =====
const sections = document.querySelectorAll('section[id]');
const snapIndicator = document.createElement('div');
snapIndicator.className = 'snap-indicator';
snapIndicator.id = 'snapIndicator';
sections.forEach(section => {
  const dot = document.createElement('div');
  dot.className = 'snap-dot';
  dot.dataset.section = section.id;
  dot.addEventListener('click', () => {
    lenis.scrollTo(section);
  });
  snapIndicator.appendChild(dot);
});
document.body.appendChild(snapIndicator);

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (cursor && follower && window.matchMedia('(hover: hover)').matches) {
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  function updateCursor() {
    const cx = parseFloat(cursor.style.left) || mouseX;
    const cy = parseFloat(cursor.style.top) || mouseY;
    
    cursor.style.left = mouseX - 4 + 'px';
    cursor.style.top = mouseY - 4 + 'px';
    follower.style.left = cx + (mouseX - cx) * 0.15 - 20 + 'px';
    follower.style.top = cy + (mouseY - cy) * 0.15 - 20 + 'px';
    
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
  
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

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 50);
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

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) lenis.scrollTo(target);
  });
});

// ===== HERO ANIMATIONS =====
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  // Kill existing tweens
  gsap.set('.hero__title-line', { opacity: 0, y: 60 });
  gsap.set('.hero__subtitle', { opacity: 0, y: 30 });
  gsap.set('.hero__cta', { opacity: 0, y: 30 });
  gsap.set('.hero__kicker', { opacity: 0, y: 20 });
  gsap.set('.hero__scroll', { opacity: 0 });
  gsap.set('.hero__meta', { opacity: 0 });
  
  tl.to('.hero__kicker', { opacity: 1, y: 0, duration: 0.8 }, 0.2)
    .to('.hero__title-line', { opacity: 1, y: 0, duration: 1, stagger: 0.15 }, 0.3)
    .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.8 }, 0.6)
    .to('.hero__cta', { opacity: 1, y: 0, duration: 0.8 }, 0.8)
    .to('.hero__meta', { opacity: 1, duration: 1 }, 1)
    .to('.hero__scroll', { opacity: 1, duration: 1 }, 1.2);
    
  // Hero video zoom
  gsap.from('.hero__video', { scale: 1.3, duration: 4, ease: 'power2.out' });
}

// ===== SECTION ANIMATIONS =====
function initSectionAnimations() {
  // Section labels
  gsap.utils.toArray('.section-label, .assembly__label').forEach(el => {
    gsap.from(el, {
      opacity: 0, x: -30, duration: 0.8,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
  
  // Section titles
  gsap.utils.toArray('.section-title, .assembly__title').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 50, duration: 1,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
  
  // Assembly items
  gsap.utils.toArray('[data-assemble]').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, y: 60, rotateY: 15,
      duration: 0.8, delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 85%' }
    });
  });
  
  // Service panels
  gsap.utils.toArray('.service-panel').forEach((panel, i) => {
    gsap.from(panel, {
      opacity: 0, y: 50, duration: 0.8, delay: i * 0.1,
      scrollTrigger: { trigger: panel, start: 'top 85%' }
    });
  });
  
  // Case cards
  gsap.utils.toArray('.case-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 80, duration: 1, delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%' }
    });
  });
  
  // Process phases
  gsap.utils.toArray('.process-phase').forEach((phase, i) => {
    gsap.from(phase, {
      opacity: 0, x: 60, duration: 0.6, delay: i * 0.1,
      scrollTrigger: { trigger: phase, start: 'left 90%' }
    });
  });
  
  // Manifesto statements
  gsap.utils.toArray('[data-manifesto]').forEach((stmt) => {
    gsap.from(stmt, {
      opacity: 0.2, duration: 0.5,
      scrollTrigger: {
        trigger: stmt, start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });
  
  // Metrics (animated counters)
  gsap.utils.toArray('.metric').forEach((metric, i) => {
    gsap.from(metric, {
      opacity: 0, y: 30, duration: 0.6, delay: i * 0.15,
      scrollTrigger: { trigger: metric, start: 'top 85%' }
    });
  });
  
  // Final frame
  gsap.from('.final-frame__content', {
    opacity: 0, y: 50, duration: 1,
    scrollTrigger: { trigger: '.final-frame', start: 'top 70%' }
  });
}

// ===== PARALLAX EFFECTS =====
function initParallax() {
  // Hero video parallax
  gsap.to('.hero__video', {
    yPercent: 20, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
  
  // Assembly parallax
  gsap.utils.toArray('.assembly__visual').forEach((el) => {
    gsap.to(el, {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });
  
  // Case cards parallax
  gsap.utils.toArray('.case-card__media').forEach((el) => {
    gsap.to(el, {
      yPercent: 15, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });
}

// ===== FILM BURN ON SECTION CHANGE =====
function initFilmBurn() {
  const sectionIds = ['hero', 'assembly', 'services', 'work', 'process', 'about', 'proof', 'contact'];
  
  sectionIds.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    
    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => {
        filmBurn.classList.add('active');
        setTimeout(() => filmBurn.classList.remove('active'), 300);
      }
    });
  });
}

// ===== SNAP DOTS UPDATE =====
function updateSnapDots() {
  const dots = document.querySelectorAll('.snap-dot');
  const scrollPos = window.scrollY + window.innerHeight / 2;
  
  dots.forEach(dot => {
    const section = document.getElementById(dot.dataset.section);
    if (!section) return;
    
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    
    if (scrollPos >= top && scrollPos < bottom) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', updateSnapDots, { passive: true });

// ===== MAGNETIC ELEMENTS =====
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    });
  });
}

// ===== SERVICE PANEL BACKGROUND =====
const serviceBg = document.getElementById('servicesBg');
document.querySelectorAll('.service-panel').forEach(panel => {
  panel.addEventListener('mouseenter', () => {
    const colors = {
      film: 'radial-gradient(circle at 30% 50%, rgba(59,231,213,0.08) 0%, transparent 50%)',
      motion: 'radial-gradient(circle at 50% 30%, rgba(124,108,255,0.08) 0%, transparent 50%)',
      '3d': 'radial-gradient(circle at 70% 50%, rgba(59,231,213,0.06) 0%, transparent 50%)',
      ai: 'radial-gradient(circle at 50% 70%, rgba(124,108,255,0.06) 0%, transparent 50%)'
    };
    if (serviceBg) serviceBg.style.background = colors[panel.dataset.service] || '';
  });
  panel.addEventListener('mouseleave', () => {
    if (serviceBg) serviceBg.style.background = '';
  });
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Small delay for preloader feel
  setTimeout(() => {
    animateHero();
    initSectionAnimations();
    initParallax();
    initFilmBurn();
    updateSnapDots();
  }, 300);
});

console.log('%cFRAME//SHIFT v3', 'font-size: 20px; font-weight: bold; color: #3BE7D5;');
console.log('%cCinematic Signal — Hyper-Interactive Edition', 'font-size: 12px; color: #A8AFB8;');