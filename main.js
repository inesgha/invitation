/* =====================================================
   MAIN.JS — App Orchestrator
   Countdown, RSVP, Scroll, Ripple, Keyboard Nav
   ===================================================== */

'use strict';

/* ---- Wedding Date ---- */
const WEDDING_DATE = new Date('2025-09-13T17:00:00');

/* ---- DOM ready ---- */
function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/* ---- Countdown ---- */
function updateCountdown() {
  const now   = new Date();
  const diff  = WEDDING_DATE - now;

  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl) return;

  if (diff <= 0) {
    // Wedding day!
    ['days','hours','minutes','seconds'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '00';
    });
    updateRing('ringDays', 0, 365);
    updateRing('ringHours', 0, 24);
    updateRing('ringMinutes', 0, 60);
    updateRing('ringSeconds', 0, 60);
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  setCountValue(daysEl, d, 365);
  setCountValue(hoursEl, h, 24);
  setCountValue(minutesEl, m, 60);
  setCountValue(secondsEl, s, 60);

  updateRing('ringDays',    d, 365);
  updateRing('ringHours',   h, 24);
  updateRing('ringMinutes', m, 60);
  updateRing('ringSeconds', s, 60);
}

function setCountValue(el, val, max) {
  if (!el) return;
  const str = val.toString().padStart(2, '0');
  if (el.textContent !== str) {
    el.textContent = str;
    el.classList.remove('tick');
    void el.offsetWidth; // reflow
    el.classList.add('tick');
    // Remove after animation
    setTimeout(() => el.classList.remove('tick'), 300);
  }
}

function updateRing(id, value, max) {
  const ring = document.getElementById(id);
  if (!ring) return;
  const circumference = 2 * Math.PI * 34; // r=34
  const progress = value / max;
  const offset = circumference * (1 - progress);
  ring.style.strokeDashoffset = offset;
  ring.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.65,0,0.35,1)';
}

/* ---- Ripple Effect ---- */
function createRipple(btn, e) {
  const rippleEl = btn.querySelector('.rsvp-btn__ripple');
  if (!rippleEl) return;

  const rect = btn.getBoundingClientRect();
  const x = (e.clientX || rect.left + rect.width / 2) - rect.left;
  const y = (e.clientY || rect.top + rect.height / 2) - rect.top;

  rippleEl.style.left = x + 'px';
  rippleEl.style.top  = y + 'px';
  rippleEl.style.width = '0';
  rippleEl.style.height = '0';
  rippleEl.style.opacity = '0.5';
  rippleEl.style.transition = 'none';

  requestAnimationFrame(() => {
    rippleEl.style.transition = 'all 0.6s cubic-bezier(0.19,1,0.22,1)';
    rippleEl.style.width  = '300px';
    rippleEl.style.height = '300px';
    rippleEl.style.marginLeft = '-150px';
    rippleEl.style.marginTop  = '-150px';
    rippleEl.style.opacity = '0';
  });
}

/* ---- RSVP Form ---- */
function initRSVP() {
  const btn    = document.getElementById('rsvpBtn');
  const modal  = document.getElementById('rsvpModal');
  const close  = document.getElementById('modalClose');
  const overlay = document.getElementById('modalOverlay');

  if (!btn || !modal) return;

  btn.addEventListener('click', (e) => {
    createRipple(btn, e);

    const nameInput   = document.getElementById('rsvpName');
    const guestsInput = document.getElementById('rsvpGuests');

    const name   = nameInput?.value.trim();
    const guests = guestsInput?.value;

    if (!name) {
      shakeField(nameInput);
      return;
    }

    // Success
    setTimeout(() => {
      modal.hidden = false;
      modal.removeAttribute('hidden');
      modal.setAttribute('aria-hidden', 'false');

      // Particle burst
      if (typeof ParticleSystem !== 'undefined') {
        const rect = btn.getBoundingClientRect();
        ParticleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
      }

      // Focus modal
      setTimeout(() => close?.focus(), 100);
    }, 400);
  });

  // Close
  [close, overlay].forEach(el => {
    if (!el) return;
    el.addEventListener('click', () => closeModal(modal));
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal(modal);
  });
}

function closeModal(modal) {
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  // Return focus
  document.getElementById('rsvpBtn')?.focus();
}

function shakeField(input) {
  if (!input) return;
  input.style.animation = 'none';
  void input.offsetWidth;
  input.style.animation = 'shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97)';
  input.focus();
  setTimeout(() => { input.style.animation = ''; }, 500);
}

/* ---- Scroll CTA ---- */
function initScrollCTA() {
  const cta = document.getElementById('scrollCta');
  if (!cta) return;

  cta.addEventListener('click', () => {
    const scene2 = document.getElementById('scene2');
    if (scene2) {
      scene2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ---- Keyboard Navigation ---- */
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    const scenes = [...document.querySelectorAll('.scene')];
    const currentIdx = scenes.findIndex(s => {
      const rect = s.getBoundingClientRect();
      return rect.top <= 100 && rect.bottom > 100;
    });

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const next = scenes[currentIdx + 1];
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const prev = scenes[currentIdx - 1];
      if (prev) prev.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'Home') {
      scenes[0]?.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'End') {
      scenes[scenes.length - 1]?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/* ---- Cursor sparkle trail ---- */
function initCursorTrail() {
  // Skip on touch devices
  if ('ontouchstart' in window) return;

  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.85) { // throttle
      if (typeof ParticleSystem !== 'undefined') {
        ParticleSystem.burst(e.clientX, e.clientY, 1);
      }
    }
  }, { passive: true });
}

/* ---- Lazy reveal via IntersectionObserver (fallback enhancement) ---- */
function initLazyReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-text').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 1000);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // Observe all reveal targets that aren't inside a scene handler
  document.querySelectorAll('.reveal-text').forEach(el => io.observe(el));
}

/* ---- Shake animation (for form validation) ---- */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%  { transform: translateX(-8px); }
    40%  { transform: translateX(8px); }
    60%  { transform: translateX(-6px); }
    80%  { transform: translateX(6px); }
  }
  .tick {
    animation: countdownTick 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
`;
document.head.appendChild(shakeStyle);

/* ---- Performance: visibility API ---- */
function initVisibilityOptimize() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      ParticleSystem?.stop?.();
    } else {
      ParticleSystem?.start?.();
    }
  });
}

/* ---- Main Init ---- */
ready(() => {

  // 1. Timeline (scenes + observer + parallax)
  if (typeof Timeline !== 'undefined') Timeline.init();

  // 2. Music
  if (typeof MusicController !== 'undefined') MusicController.init();

  // 3. Countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. RSVP
  initRSVP();

  // 5. Scroll CTA
  initScrollCTA();

  // 6. Keyboard nav
  initKeyboardNav();

  // 7. Lazy reveal
  initLazyReveal();

  // 8. Cursor trail (desktop)
  initCursorTrail();

  // 9. Performance
  initVisibilityOptimize();

  // 10. Smooth scroll polyfill for older browsers
  if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
});