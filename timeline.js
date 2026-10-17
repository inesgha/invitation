/* =====================================================
   TIMELINE.JS — Séquençage des scènes & animations
   ===================================================== */

'use strict';

const Timeline = (() => {

  let observers = [];
  let isInitialized = false;
  const PLAYED = new Set();

  /* ---- Révélation décalée des éléments ---- */
  function staggerReveal(parent, selector = '.reveal-text', baseDelay = 0) {
    parent.querySelectorAll(selector).forEach((el) => {
      const elDelay = parseFloat(el.dataset.delay || 0) + baseDelay;
      setTimeout(() => el.classList.add('visible'), elDelay * 1000);
    });
  }

  function drawLines(scene, delay) {
    setTimeout(() => {
      scene.querySelectorAll('.animated-line').forEach(line => line.classList.add('drawn'));
    }, delay);
  }

  /* ---- Scènes ---- */
  function playScene2(scene) { staggerReveal(scene); }

  function playScene3(scene) {
    // Effet « écriture à la plume » : les noms se dévoilent de gauche à droite
    scene.querySelectorAll('.name').forEach((name, idx) => {
      setTimeout(() => name.classList.add('written'), idx * 700 + 200);
    });
    const sep = scene.querySelector('.names-separator');
    if (sep) setTimeout(() => sep.classList.add('visible'), 500);
  }

  function playScene4(scene) { staggerReveal(scene); drawLines(scene, 800); }
  function playScene5(scene) { staggerReveal(scene); drawLines(scene, 800); }
  function playScene6(scene) { staggerReveal(scene); }
  function playScene7(scene) { staggerReveal(scene); }
  function playScene8(scene) { staggerReveal(scene, '.reveal-text', 0.3); startHearts(scene); }

  /* ---- Cœurs flottants (scène 8) ---- */
  function startHearts(scene) {
    const container = scene.querySelector('#heartsContainer');
    if (!container) return;

    const SYMBOLS = ['❤', '♡', '✦', '❤', '♡'];
    let count = 0;
    const max = 18;

    function spawnHeart() {
      if (count >= max) return;
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      heart.style.left = Math.random() * 90 + 5 + '%';
      heart.style.bottom = '5%';
      heart.style.fontSize = (0.8 + Math.random() * 1.1) + 'rem';
      heart.style.animationDuration = (3 + Math.random() * 3) + 's';
      heart.style.animationDelay = Math.random() * 1.5 + 's';
      heart.style.animationIterationCount = '1';
      container.appendChild(heart);
      count++;
      heart.addEventListener('animationend', () => { heart.remove(); count--; });
    }

    for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 300);
    const interval = setInterval(spawnHeart, 700);
    setTimeout(() => clearInterval(interval), 12000);
  }

  const SCENE_HANDLERS = {
    scene2: playScene2,
    scene3: playScene3,
    scene4: playScene4,
    scene5: playScene5,
    scene6: playScene6,
    scene7: playScene7,
    scene8: playScene8,
  };

  function play(scene) {
    if (PLAYED.has(scene.id)) return;
    PLAYED.add(scene.id);
    const handler = SCENE_HANDLERS[scene.id];
    if (handler) handler(scene);
  }

  /* ---- Intersection Observer ---- */
  function createObserver() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          play(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('.scene').forEach(s => io.observe(s));
    observers.push(io);
  }

  /* ---- Parallaxe & barre de progression ---- */
  function initParallax() {
    const bar = document.getElementById('scrollBar');
    const botanicals = [...document.querySelectorAll('.botanical')];
    const orbs = [...document.querySelectorAll('.blur-orb')];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    function update() {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (bar && docH > 0) bar.style.transform = `scaleY(${Math.min(scrollY / docH, 1)})`;

      if (!reduced) {
        botanicals.forEach((b, i) => {
          const rect = b.closest('.scene').getBoundingClientRect();
          b.style.transform = `translateY(${rect.top * 0.04 * (i % 2 === 0 ? 1 : -1)}px)`;
        });
        orbs.forEach((orb, i) => {
          const rect = orb.closest('.scene').getBoundingClientRect();
          orb.style.translate = `0 ${rect.top * -0.03 * ((i % 3) + 1)}px`;
        });
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  function init() {
    if (isInitialized) return;
    isInitialized = true;

    if ('IntersectionObserver' in window) {
      createObserver();
    } else {
      document.querySelectorAll('.scene').forEach(play);
    }
    initParallax();
  }

  function destroy() {
    observers.forEach(o => o.disconnect());
    observers = [];
    isInitialized = false;
  }

  return { init, destroy, startHearts };
})();
