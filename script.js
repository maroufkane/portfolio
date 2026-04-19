/* ═══════════════════════════════════════════
   Marouf Kane – Portfolio Animations
   Clean, alive, editorial micro-interactions
═══════════════════════════════════════════ */

/* ── 1. Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── 2. Reveal on scroll (staggered per-section) ── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const idx = el.dataset.index ? parseInt(el.dataset.index) : 0;
      // Stagger siblings within same parent section
      const section = el.closest('section, footer');
      if (section) {
        const siblings = Array.from(section.querySelectorAll('.reveal'));
        const order = siblings.indexOf(el);
        setTimeout(() => el.classList.add('visible'), order * 100);
      } else {
        el.classList.add('visible');
      }
      revealObs.unobserve(el);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObs.observe(el));

/* ── 3. Hero title — split characters and animate in ── */
function splitHeroTitle() {
  const titleLines = document.querySelectorAll('.hero-title .line');
  titleLines.forEach((line, lineIdx) => {
    const text = line.textContent;
    line.textContent = '';
    line.style.display = 'inline-flex';
    line.style.overflow = 'hidden';

    [...text].forEach((char, charIdx) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'char';
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        transform: translateY(100%);
        animation: charReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        animation-delay: ${0.6 + lineIdx * 0.15 + charIdx * 0.035}s;
      `;
      line.appendChild(span);
    });
  });
}

/* ── 4. Hero staggered entrance ── */
function animateHeroEntrance() {
  // Badge
  const badge = document.querySelector('.hero-badge');
  if (badge) {
    badge.style.cssText = 'opacity:0; transform:translateY(14px); transition: opacity 0.6s ease, transform 0.6s ease;';
    setTimeout(() => {
      badge.style.opacity = '1';
      badge.style.transform = 'none';
    }, 300);
  }

  // Title chars
  splitHeroTitle();

  // Subtitle
  const subtitle = document.querySelector('.hero-subtitle');
  if (subtitle) {
    subtitle.style.cssText = 'opacity:0; transform:translateY(12px); transition: opacity 0.5s ease, transform 0.5s ease;';
    setTimeout(() => { subtitle.style.opacity = '1'; subtitle.style.transform = 'none'; }, 1200);
  }

  // CTA buttons
  const cta = document.querySelector('.hero-cta');
  if (cta) {
    cta.style.cssText = 'opacity:0; transform:translateY(10px); transition: opacity 0.5s ease, transform 0.5s ease;';
    setTimeout(() => { cta.style.opacity = '1'; cta.style.transform = 'none'; }, 1400);
  }

  // Meta
  const meta = document.querySelector('.hero-meta');
  if (meta) {
    meta.style.cssText = 'opacity:0; transition: opacity 0.6s ease;';
    setTimeout(() => { meta.style.opacity = '1'; }, 1600);
  }

  // Scroll hint
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    scrollHint.style.cssText = 'opacity:0; transition: opacity 0.8s ease;';
    setTimeout(() => { scrollHint.style.opacity = '1'; }, 2000);
  }
}

/* ── 5. Counter animation for stat numbers ── */
function animateCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.textContent);
        if (isNaN(target)) return;
        el.textContent = '0';
        let current = 0;
        const duration = 1200;
        const start = performance.now();
        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out expo
          const eased = 1 - Math.pow(1 - progress, 4);
          current = Math.round(eased * target);
          el.textContent = current;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  statNumbers.forEach(el => counterObs.observe(el));
}

/* ── 6. Language bars animation ── */
const langObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      langObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.lang-item').forEach(el => langObs.observe(el));

/* ── 7. Smooth active nav link ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });
sections.forEach(s => navObs.observe(s));

/* ── 8. Hamburger (mobile) ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinksEl.style.display === 'flex';
  navLinksEl.style.display = open ? 'none' : 'flex';
});
navLinksEl.addEventListener('click', e => {
  if (e.target.tagName === 'A') navLinksEl.style.display = '';
});

/* ── 9. Magnetic hover on buttons ── */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-contact, .btn-outline');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => btn.style.transition = '', 350);
    });
  });
}

/* ── 10. Tilt on hover for stat cards, skill groups, engage & edu cards ── */
function initTiltCards() {
  const cards = document.querySelectorAll('.stat-card, .skill-group, .engage-card, .edu-card, .cert-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s';
      setTimeout(() => card.style.transition = 'background 0.2s', 500);
    });
  });
}

/* ── 11. Smooth parallax for section headers ── */
function initParallax() {
  const headers = document.querySelectorAll('.section-header h2');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        headers.forEach(h => {
          const rect = h.getBoundingClientRect();
          const viewH = window.innerHeight;
          if (rect.top < viewH && rect.bottom > 0) {
            const progress = (viewH - rect.top) / (viewH + rect.height);
            const offset = (progress - 0.5) * -12;
            h.style.transform = `translateY(${offset}px)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── 12. Cursor follower dot ── */
function initCursorDot() {
  // Only on non-touch devices
  if ('ontouchstart' in window) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let mx = -100, my = -100, dx = -100, dy = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Grow on interactive elements
  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('a, button, .stat-card, .skill-group, .timeline-card, .edu-card, .engage-card, .cert-card');
    if (el) dot.classList.add('cursor-dot--active');
  });
  document.addEventListener('mouseout', (e) => {
    const el = e.target.closest('a, button, .stat-card, .skill-group, .timeline-card, .edu-card, .engage-card, .cert-card');
    if (el) dot.classList.remove('cursor-dot--active');
  });

  function moveDot() {
    dx += (mx - dx) * 0.12;
    dy += (my - dy) * 0.12;
    dot.style.transform = `translate(${dx}px, ${dy}px)`;
    requestAnimationFrame(moveDot);
  }
  moveDot();
}

/* ── 13. Timeline card stagger reveal ── */
function initTimelineStagger() {
  const items = document.querySelectorAll('.timeline-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target.querySelector('.timeline-card');
        if (card) {
          card.style.animation = 'slideInCard 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });
  items.forEach(el => obs.observe(el));
}

/* ── 14. Smooth scroll speed line animation ── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    bar.style.transform = `scaleX(${progress})`;
  }, { passive: true });
}

/* ── 15. Secure email obfuscation ── */
function initSecureEmails() {
  const emailLinks = document.querySelectorAll('.secure-email');
  emailLinks.forEach(link => {
    const user = link.getAttribute('data-contact');
    const domain = link.getAttribute('data-domain');
    if (!user || !domain) return;
    
    const realEmail = user + '@' + domain;
    
    // Fill the visual text
    const textSpan = link.querySelector('.email-text');
    if (textSpan) textSpan.textContent = realEmail;

    // Set href only on interaction (avoids static scrapers)
    const setHref = () => link.setAttribute('href', 'mailto:' + realEmail);
    link.addEventListener('mouseenter', setHref, { once: true });
    link.addEventListener('touchstart', setHref, { once: true });
  });
}

/* ══════════════════════════════
   INIT
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Remove reveal class from hero children (hero has its own entrance)
  document.querySelectorAll('#hero .reveal').forEach(el => {
    el.classList.remove('reveal');
  });

  animateHeroEntrance();
  animateCounters();
  initMagneticButtons();
  initTiltCards();
  initParallax();
  initCursorDot();
  initTimelineStagger();
  initScrollProgress();
  initSecureEmails();
});
