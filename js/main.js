/**
 * FRAME//SHIFT v3 — Full Hyper-Interactive Edition
 * GSAP + ScrollTrigger + Lenis + Sound Design
 */

gsap.registerPlugin(ScrollTrigger);

// ===== LENIS SMOOTH SCROLL =====
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ===== SOUND DESIGN =====
class SoundDesign {
  constructor() {
    this.audioCtx = null;
    this.enabled = false;
    this.sounds = {};
  }

  init() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.enabled = true;
      this.createSounds();
    } catch(e) {
      this.enabled = false;
    }
  }

  createSounds() {
    // Film click sound
    this.sounds.click = () => {
      if (!this.enabled || !this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    };

    // Whoosh sound (for section transitions)
    this.sounds.whoosh = () => {
      if (!this.enabled || !this.audioCtx) return;
      const noise = this.audioCtx.createBufferSource();
      const buffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 0.3, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.1));
      }
      noise.buffer = buffer;
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2000;
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      gain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
      noise.start();
    };

    // Hover tick
    this.sounds.tick = () => {
      if (!this.enabled || !this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.03);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.03);
    };
  }

  play(name) {
    if (!this.enabled) {
      // Init on first user interaction
      this.init();
      return;
    }
    if (this.sounds[name]) this.sounds[name]();
  }
}

const sound = new SoundDesign();

// Init sound on first click
document.addEventListener('click', () => { sound.init(); }, { once: true });

// ===== PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
progressBar.id = 'progressBar';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
}, { passive: true });

// ===== FILM BURN =====
const filmBurn = document.createElement('div');
filmBurn.className = 'film-burn';
filmBurn.id = 'filmBurn';
document.body.appendChild(filmBurn);

// ===== SNAP DOTS =====
const sections = document.querySelectorAll('section[id]');
const snapIndicator = document.createElement('div');
snapIndicator.className = 'snap-indicator';
snapIndicator.id = 'snapIndicator';
const sectionLabels = {
  'hero': '01', 'assembly': '02', 'services': '03',
  'work': '04', 'process': '05', 'about': '06',
  'proof': '07', 'contact': '08'
};

sections.forEach(section => {
  const dot = document.createElement('div');
  dot.className = 'snap-dot';
  dot.dataset.section = section.id;
  dot.innerHTML = `<span>${sectionLabels[section.id] || ''}</span>`;
  dot.addEventListener('click', () => { lenis.scrollTo(section); sound.play('click'); });
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
    cursor.style.left = mouseX - 4 + 'px';
    cursor.style.top = mouseY - 4 + 'px';
  });
  
  function updateFollower() {
    const fx = parseFloat(follower.style.left) || mouseX;
    const fy = parseFloat(follower.style.top) || mouseY;
    follower.style.left = fx + (mouseX - fx) * 0.12 - 20 + 'px';
    follower.style.top = fy + (mouseY - fy) * 0.12 - 20 + 'px';
    requestAnimationFrame(updateFollower);
  }
  updateFollower();
  
  const hoverEls = 'a, button, .case-card, .service-panel, .process-phase, .manifesto__statement, .snap-dot, .client-logo';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
      sound.play('tick');
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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { lenis.scrollTo(target); sound.play('click'); }
  });
});

// ===== HERO ANIMATIONS =====
function animateHero() {
  gsap.set('.hero__title-line', { opacity: 0, y: 60 });
  gsap.set('.hero__subtitle', { opacity: 0, y: 30 });
  gsap.set('.hero__cta', { opacity: 0, y: 30 });
  gsap.set('.hero__kicker', { opacity: 0, y: 20 });
  gsap.set('.hero__scroll', { opacity: 0 });
  gsap.set('.hero__meta', { opacity: 0 });
  
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  tl.to('.hero__kicker', { opacity: 1, y: 0, duration: 0.8 }, 0.3)
    .to('.hero__title-line', { opacity: 1, y: 0, duration: 1.2, stagger: 0.2 }, 0.5)
    .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.8 }, 1)
    .to('.hero__cta', { opacity: 1, y: 0, duration: 0.8 }, 1.2)
    .to('.hero__meta', { opacity: 1, duration: 1 }, 1.4)
    .to('.hero__scroll', { opacity: 1, duration: 1 }, 1.6);
    
  gsap.from('.hero__video', { scale: 1.3, duration: 4, ease: 'power2.out' });
}

// ===== SECTION ANIMATIONS =====
function initSectionAnimations() {
  // Labels & titles
  gsap.utils.toArray('.section-label, .assembly__label').forEach(el => {
    gsap.from(el, { opacity: 0, x: -30, duration: 0.8, scrollTrigger: { trigger: el, start: 'top 85%' }});
  });
  
  gsap.utils.toArray('.section-title, .assembly__title').forEach(el => {
    gsap.from(el, { opacity: 0, y: 50, duration: 1, scrollTrigger: { trigger: el, start: 'top 85%' }});
  });
  
  // Assembly items
  gsap.utils.toArray('[data-assemble]').forEach((item, i) => {
    gsap.from(item, { opacity: 0, y: 60, rotateY: 10, duration: 0.8, delay: i * 0.15, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 85%' }});
  });
  
  // Service panels  
  gsap.utils.toArray('.service-panel').forEach((panel, i) => {
    gsap.from(panel, { opacity: 0, y: 50, duration: 0.8, delay: i * 0.12, scrollTrigger: { trigger: panel, start: 'top 85%' }});
  });
  
  // Case cards
  gsap.utils.toArray('.case-card').forEach((card, i) => {
    gsap.from(card, { opacity: 0, y: 80, scale: 0.95, duration: 0.8, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%' }});
  });
  
  // Process phases
  gsap.utils.toArray('.process-phase').forEach((phase, i) => {
    gsap.from(phase, { opacity: 0, x: 60, duration: 0.6, delay: i * 0.1, scrollTrigger: { trigger: phase, start: 'left 90%' }});
  });
  
  // Manifesto
  gsap.utils.toArray('[data-manifesto]').forEach(stmt => {
    gsap.from(stmt, { opacity: 0.15, duration: 0.6, scrollTrigger: { trigger: stmt, start: 'top 80%', toggleActions: 'play none none reverse' }});
  });
  
  // Metrics
  gsap.utils.toArray('.metric').forEach((metric, i) => {
    gsap.from(metric, { opacity: 0, y: 30, duration: 0.6, delay: i * 0.15, scrollTrigger: { trigger: metric, start: 'top 85%' }});
  });
  
  // Final frame
  gsap.from('.final-frame__content', { opacity: 0, y: 50, duration: 1, scrollTrigger: { trigger: '.final-frame', start: 'top 70%' }});
  
  // Counter animation
  gsap.utils.toArray('.metric__number').forEach(num => {
    const text = num.textContent;
    const number = parseInt(text);
    if (isNaN(number)) return;
    
    ScrollTrigger.create({
      trigger: num,
      start: 'top 85%',
      onEnter: () => {
        gsap.from(num, { textContent: 0, duration: 2, ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            num.textContent = Math.round(parseFloat(num.textContent));
            if (text.includes('+')) num.textContent += '+';
          }
        });
      },
      once: true
    });
  });
}

// ===== PARALLAX =====
function initParallax() {
  gsap.to('.hero__video', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }});
  
  gsap.utils.toArray('.assembly__visual').forEach(el => {
    gsap.to(el, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }});
  });
  
  gsap.utils.toArray('.case-card__media img, .case-card__media video').forEach(el => {
    gsap.to(el, { yPercent: 15, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }});
  });
}

// ===== FILM BURN ON SECTION CHANGE =====
function initFilmBurn() {
  const sectionIds = ['hero', 'assembly', 'services', 'work', 'process', 'about', 'proof', 'contact'];
  sectionIds.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section, start: 'top 70%',
      onEnter: () => {
        filmBurn.classList.add('active');
        sound.play('whoosh');
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
    const top = section.offsetTop, bottom = top + section.offsetHeight;
    dot.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
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
  const colors = {
    film: 'radial-gradient(circle at 30% 50%, rgba(59,231,213,0.08) 0%, transparent 50%)',
    motion: 'radial-gradient(circle at 50% 30%, rgba(124,108,255,0.08) 0%, transparent 50%)',
    '3d': 'radial-gradient(circle at 70% 50%, rgba(59,231,213,0.06) 0%, transparent 50%)',
    ai: 'radial-gradient(circle at 50% 70%, rgba(124,108,255,0.06) 0%, transparent 50%)'
  };
  panel.addEventListener('mouseenter', () => {
    if (serviceBg) serviceBg.style.background = colors[panel.dataset.service] || '';
  });
  panel.addEventListener('mouseleave', () => {
    if (serviceBg) serviceBg.style.background = '';
  });
});

// ===== SOUND ON INTERACTIONS =====
document.querySelectorAll('.btn, .nav__link, .service-panel, .case-card').forEach(el => {
  el.addEventListener('mouseenter', () => sound.play('tick'));
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    animateHero();
    initSectionAnimations();
    initParallax();
    initFilmBurn();
    updateSnapDots();
  }, 300);
});

console.log('%cFRAME//SHIFT v3', 'font-size: 20px; font-weight: bold; color: #3BE7D5;');
console.log('%cCinematic Signal — Full Hyper-Interactive Edition', 'font-size: 12px; color: #A8AFB8;');