/* =====================================================
   PARTICLES.JS — Canvas Particle System
   Golden sparkles, floating petals, light rays
   ===================================================== */

'use strict';

const ParticleSystem = (() => {

  let canvas, ctx, W, H, RAF;
  let particles = [];
  let petals    = [];
  let lastTime  = 0;
  let isRunning = false;

  /* ---- Config ---- */
  const CFG = {
    sparkles: {
      count:        80,
      minSize:      0.5,
      maxSize:      2.5,
      minSpeed:     0.1,
      maxSpeed:     0.5,
      minLife:      60,
      maxLife:      180,
      colors: [
        'rgba(201,169,110,',
        'rgba(232,213,176,',
        'rgba(245,237,218,',
        'rgba(196,149,106,',
        'rgba(232,196,184,'
      ]
    },
    petals: {
      count:    18,
      minSize:  4,
      maxSize:  10,
      minSpeed: 0.4,
      maxSpeed: 1.0,
      colors: [
        '#E8C4B8',
        '#D4A090',
        '#C9A96E',
        '#E8D5B0',
        '#F0E0D8'
      ]
    }
  };

  /* ---- Helpers ---- */
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max));
  const pick = arr => arr[randInt(0, arr.length)];

  /* ---- Sparkle Particle ---- */
  class Sparkle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x     = rand(0, W);
      this.y     = initial ? rand(0, H) : rand(-10, 20);
      this.size  = rand(CFG.sparkles.minSize, CFG.sparkles.maxSize);
      this.vx    = rand(-0.3, 0.3);
      this.vy    = rand(CFG.sparkles.minSpeed, CFG.sparkles.maxSpeed) * (Math.random() > 0.5 ? 1 : -1);
      this.life  = 0;
      this.maxLife = randInt(CFG.sparkles.minLife, CFG.sparkles.maxLife);
      this.color = pick(CFG.sparkles.colors);
      this.twinkleSpeed = rand(0.02, 0.08);
      this.twinklePhase = rand(0, Math.PI * 2);
      this.drift = rand(-0.2, 0.2);
    }

    update() {
      this.life++;
      this.x  += this.vx + Math.sin(this.life * this.twinkleSpeed) * this.drift;
      this.y  += this.vy;
      this.twinklePhase += this.twinkleSpeed;

      if (this.life >= this.maxLife || this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) {
        this.reset();
      }
    }

    draw() {
      const progress = this.life / this.maxLife;
      const alpha = progress < 0.2
        ? progress / 0.2
        : progress > 0.8
          ? 1 - (progress - 0.8) / 0.2
          : 1;

      const twinkle = (Math.sin(this.twinklePhase) + 1) * 0.5;
      const finalAlpha = alpha * (0.4 + twinkle * 0.6);
      const size = this.size * (0.7 + twinkle * 0.3);

      ctx.save();
      ctx.globalAlpha = finalAlpha;

      // Outer glow
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size * 3);
      grd.addColorStop(0, this.color + '0.9)');
      grd.addColorStop(0.3, this.color + '0.3)');
      grd.addColorStop(1, this.color + '0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(this.x, this.y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = this.color + '1)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Cross sparkle
      if (size > 1.5) {
        ctx.strokeStyle = this.color + (finalAlpha * 0.7) + ')';
        ctx.lineWidth = 0.5;
        const len = size * 4 * twinkle;
        ctx.beginPath();
        ctx.moveTo(this.x - len, this.y);
        ctx.lineTo(this.x + len, this.y);
        ctx.moveTo(this.x, this.y - len);
        ctx.lineTo(this.x, this.y + len);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  /* ---- Petal ---- */
  class Petal {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x      = rand(-20, W + 20);
      this.y      = initial ? rand(-50, H) : rand(-60, -10);
      this.w      = rand(CFG.petals.minSize, CFG.petals.maxSize);
      this.h      = this.w * rand(1.2, 2);
      this.rot    = rand(0, Math.PI * 2);
      this.rotV   = rand(-0.03, 0.03);
      this.vx     = rand(-0.5, 0.5);
      this.vy     = rand(CFG.petals.minSpeed, CFG.petals.maxSpeed);
      this.sway   = rand(0, Math.PI * 2);
      this.swayS  = rand(0.005, 0.02);
      this.swayA  = rand(0.5, 2);
      this.color  = pick(CFG.petals.colors);
      this.opacity = rand(0.3, 0.7);
    }

    update() {
      this.sway += this.swayS;
      this.x += this.vx + Math.sin(this.sway) * this.swayA;
      this.y += this.vy;
      this.rot += this.rotV;

      if (this.y > H + 30 || this.x < -60 || this.x > W + 60) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);

      ctx.beginPath();
      ctx.ellipse(0, 0, this.w * 0.5, this.h * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();

      // Subtle highlight
      ctx.beginPath();
      ctx.ellipse(-this.w * 0.1, -this.h * 0.15, this.w * 0.2, this.h * 0.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fill();

      ctx.restore();
    }
  }

  /* ---- Light Ray ---- */
  function drawLightRays() {
    const cx = W * 0.5;
    const cy = H * 0.3;
    const t  = Date.now() * 0.0003;

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + t * 0.1;
      const len   = rand(100, 300);
      const alpha = 0.012 + Math.sin(t + i) * 0.005;

      const grd = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      grd.addColorStop(0, `rgba(201,169,110,${alpha})`);
      grd.addColorStop(1, 'rgba(201,169,110,0)');

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = grd;
      ctx.lineWidth = rand(1, 4);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ---- Init ---- */
  function init() {
    canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resize();

    // Create particles
    for (let i = 0; i < CFG.sparkles.count; i++) {
      particles.push(new Sparkle());
    }
    for (let i = 0; i < CFG.petals.count; i++) {
      petals.push(new Petal());
    }

    window.addEventListener('resize', resize);
    start();
  }

  /* ---- Resize ---- */
  function resize() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);
  }

  /* ---- Render Loop ---- */
  function render(timestamp) {
    if (!isRunning) return;

    const dt = Math.min(timestamp - lastTime, 32); // cap at ~30fps delta
    lastTime = timestamp;

    ctx.clearRect(0, 0, W, H);

    // Light rays (subtle)
    drawLightRays();

    // Update and draw petals
    for (const petal of petals) {
      petal.update();
      petal.draw();
    }

    // Update and draw sparkles
    for (const p of particles) {
      p.update();
      p.draw();
    }

    RAF = requestAnimationFrame(render);
  }

  /* ---- Start / Stop ---- */
  function start() {
    if (isRunning) return;
    isRunning = true;
    lastTime = performance.now();
    RAF = requestAnimationFrame(render);
  }

  function stop() {
    isRunning = false;
    if (RAF) { cancelAnimationFrame(RAF); RAF = null; }
  }

  /* ---- Burst effect (for RSVP confirm) ---- */
  function burst(x, y, count = 20) {
    if (!ctx) return;
    const colors = ['rgba(201,169,110,', 'rgba(232,213,176,', 'rgba(232,196,184,'];
    for (let i = 0; i < count; i++) {
      const p = new Sparkle();
      p.x = x;
      p.y = y;
      p.vx = rand(-3, 3);
      p.vy = rand(-4, -1);
      p.maxLife = randInt(40, 80);
      p.size = rand(1, 3);
      p.color = pick(colors);
      particles.push(p);
    }
    // Clean up extra
    setTimeout(() => { particles.splice(CFG.sparkles.count); }, 3000);
  }

  /* ---- Public API ---- */
  return { init, start, stop, burst };

})();

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ParticleSystem.init);
} else {
  ParticleSystem.init();
}