/* =====================================================
   TIMELINE.JS — Scene Timeline & Animation Sequencing
   ===================================================== */

'use strict';

const Timeline = (() => {

  let observers = [];
  let isInitialized = false;

  /* ---- Name Typewriter (letter-by-letter for calligraphy) ---- */
  function animateName(el) {
    const nameEl = el.querySelector('.name-inner');
    if (!nameEl) return;
    const name = nameEl.dataset.name || '';
    nameEl.innerHTML = '';

    [...name].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'name-char';
      span.textContent = char;
      span.style.animationDelay = `${i * 0.08 + 0.2}s`;
      nameEl.appendChild(span);
    });
  }

  /* ---- Typewriter Effect for eyebrow / subtitle text ---- */
  function typewriter(el, text, speed = 40, delay = 0) {
    el.textContent = '';
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.borderRight = '1px solid var(--color-gold)';
    el.style.animation = 'blinkCursor 0.8s step-end infinite';

    let i = 0;
    const tick = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed);
      } else {
        // Remove cursor after done
        setTimeout(() => {
          el.style.borderRight = 'none';
          el.style.animation = 'none';
        }, 1000);
      }
    };
    setTimeout(tick, delay);
  }

  /* ---- Staggered reveal for children ---- */
  function staggerReveal(parent, selector = '.reveal-text', baseDelay = 0) {
    const els = parent.querySelectorAll(selector);
    els.forEach((el, i) => {
      const elDelay = parseFloat(el.dataset.delay || 0) + baseDelay;
      setTimeout(() => {
        el.classList.add('visible');
      }, elDelay * 1000);
    });
  }

  /* ---- Scene 1: Intro sequence ---- */
  function playScene1() {
    const scene = document.getElementById('scene1');
    if (!scene) return;
    // Monogram and tagline animate via CSS
    // No JS needed; CSS handles via animation-fill-mode: both
  }

  /* ---- Scene 2: Botanical + text ---- */
  function playScene2(scene) {
    staggerReveal(scene, '.reveal-text', 0.2);

    // Animate botanical stems
    scene.querySelectorAll('.stem-path').forEach(path => {
      path.style.animationPlayState = 'running';
    });
  }

  /* ---- Scene 3: Names ---- */
  function playScene3(scene) {
    const names = scene.querySelectorAll('.name');
    names.forEach((name, idx) => {
      setTimeout(() => animateName(name), idx * 400 + 200);
    });
  }

  /* ---- Scene 4: Date ---- */
  function playScene4(scene) {
    staggerReveal(scene, '.reveal-text', 0);

    // Animate the line draw
    setTimeout(() => {
      scene.querySelectorAll('.animated-line').forEach(line => {
        line.style.animation = 'drawLine 1.5s cubic-bezier(0.19,1,0.22,1) 0.3s forwards';
      });
    }, 500);
  }

  /* ---- Scene 5: Venue ---- */
  function playScene5(scene) {
    staggerReveal(scene, '.reveal-text', 0);

    setTimeout(() => {
      scene.querySelectorAll('.animated-line').forEach(line => {
        line.style.animation = 'drawLine 1.5s cubic-bezier(0.19,1,0.22,1) 0.5s forwards';
      });
    }, 400);
  }

  /* ---- Scene 6: Countdown ---- */
  function playScene6(scene) {
    staggerReveal(scene, '.reveal-text', 0);
    // Countdown rings are animated by main.js updateCountdown()
  }

  /* ---- Scene 7: RSVP ---- */
  function playScene7(scene) {
    staggerReveal(scene, '.reveal-text', 0);
  }

  /* ---- Scene 8: Thank You ---- */
  function playScene8(scene) {
    staggerReveal(scene, '.reveal-text', 0.3);
    startHearts(scene);
  }

  /* ---- Floating hearts (Scene 8) ---- */
  function startHearts(scene) {
    const container = scene.querySelector('#heartsContainer') || document.getElementById('heartsContainer');
    if (!container) return;

    const HEART_SYMBOLS = ['❤', '♡', '❤', '♡', '✦', '❤'];
    let count = 0;
    const max = 20;

    function spawnHeart() {
      if (count >= max) return;
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
      heart.style.left = Math.random() * 90 + 5 + '%';
      heart.style.bottom = '5%';
      heart.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
      heart.style.animationDuration = (3 + Math.random() * 3) + 's';
      heart.style.animationDelay = Math.random() * 2 + 's';
      heart.style.opacity = '0';
      container.appendChild(heart);
      count++;

      // Clean up after animation
      heart.addEventListener('animationend', () => {
        heart.remove();
        count--;
      });
    }

    for (let i = 0; i < 8; i++) {
      setTimeout(spawnHeart, i * 300);
    }

    // Continuously spawn
    const interval = setInterval(() => {
      if (count < max) spawnHeart();
    }, 600);

    // Stop after 10s
    setTimeout(() => clearInterval(interval), 10000);
  }

  /* ---- Scene map ---- */
  const SCENE_HANDLERS = {
    scene1: playScene1,
    scene2: playScene2,
    scene3: playScene3,
    scene4: playScene4,
    scene5: playScene5,
    scene6: playScene6,
    scene7: playScene7,
    scene8: playScene8,
  };

  const PLAYED = new Set();

  /* ---- Intersection Observer ---- */
  function createObserver() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (!PLAYED.has(id)) {
            PLAYED.add(id);
            const handler = SCENE_HANDLERS[id];
            if (handler) handler(entry.target);
          }

          // Parallax
          applyParallax(entry.target, 0);
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -10% 0px'
    });

    document.querySelectorAll('.scene').forEach(s => io.observe(s));
    observers.push(io);
  }

  /* ---- Parallax ---- */
  function applyParallax(scene, scrollY) {
    const botanicals = scene.querySelectorAll('.botanical');
    botanicals.forEach((b, i) => {
      const direction = i % 2 === 0 ? 1 : -1;
      b.style.transform = `translateY(${scrollY * 0.05 * direction}px)` + (i % 2 !== 0 ? ' scaleX(-1)' : '');
    });
  }

  /* ---- Scroll parallax ---- */
  function initParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Update scroll progress bar
          const bar = document.getElementById('scrollBar');
          if (bar) {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.height = (scrollY / docH * 100) + '%';
          }

          // Botanicals parallax
          document.querySelectorAll('.botanical').forEach((b, i) => {
            const rect = b.closest('.scene').getBoundingClientRect();
            const offset = rect.top * 0.04 * (i % 2 === 0 ? 1 : -1);
            const scaleX = b.classList.contains('botanical--right') ? ' scaleX(-1)' : '';
            b.style.transform = `translateY(${offset}px)${scaleX}`;
          });

          // Blur orbs subtle parallax
          document.querySelectorAll('.blur-orb').forEach((orb, i) => {
            const speed = 0.02 * ((i % 3) + 1);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
          });

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---- Public init ---- */
  function init() {
    if (isInitialized) return;
    isInitialized = true;

    // Play scene 1 immediately
    playScene1();

    // Observer for rest
    if ('IntersectionObserver' in window) {
      createObserver();
    } else {
      // Fallback: play all
      document.querySelectorAll('.scene').forEach(s => {
        const handler = SCENE_HANDLERS[s.id];
        if (handler) handler(s);
      });
    }

    initParallax();
  }

  /* ---- Cleanup ---- */
  function destroy() {
    observers.forEach(o => o.disconnect());
    observers = [];
    isInitialized = false;
  }

  return { init, destroy, startHearts };

})();