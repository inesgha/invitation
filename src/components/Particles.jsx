import { memo, useEffect, useRef } from 'react';

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let rafId = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = reducedMotion.matches ? 42 : Math.min(170, Math.floor((width * height) / 9000));
      particles = Array.from({ length: count }, () => ({
        x: random(0, width),
        y: random(0, height),
        radius: random(0.7, 2.5),
        alpha: random(0.18, 0.86),
        speed: random(0.08, 0.42),
        drift: random(-0.16, 0.16),
        phase: random(0, Math.PI * 2)
      }));
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift + Math.sin(time * 0.001 + particle.phase) * 0.08;

        if (particle.y < -24) {
          particle.y = height + 24;
          particle.x = random(0, width);
        }

        const pulse = (Math.sin(time * 0.002 + particle.phase) + 1) * 0.5;
        const alpha = particle.alpha * (0.42 + pulse * 0.58);
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 6);
        gradient.addColorStop(0, 'rgba(255, 246, 204, ' + alpha + ')');
        gradient.addColorStop(0.35, 'rgba(217, 164, 65, ' + alpha * 0.55 + ')');
        gradient.addColorStop(1, 'rgba(217, 164, 65, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 6, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = window.requestAnimationFrame(draw);
    };

    resize();
    rafId = window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize, { passive: true });
    reducedMotion.addEventListener('change', resize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      reducedMotion.removeEventListener('change', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}

export default memo(Particles);
