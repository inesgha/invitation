import { useCallback, useEffect, useMemo, useState } from 'react';

export function useScrollScenes(totalScenes, interval = 5600) {
  const [activeScene, setActiveScene] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const goToScene = useCallback((index) => {
    setActiveScene(((index % totalScenes) + totalScenes) % totalScenes);
    setIsPaused(true);
  }, [totalScenes]);

  useEffect(() => {
    if (isPaused) return undefined;
    const timer = window.setInterval(() => {
      setActiveScene((scene) => (scene + 1) % totalScenes);
    }, prefersReducedMotion ? interval * 2 : interval);

    return () => window.clearInterval(timer);
  }, [interval, isPaused, prefersReducedMotion, totalScenes]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') goToScene(activeScene + 1);
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') goToScene(activeScene - 1);
      if (event.key === ' ') setIsPaused((value) => !value);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeScene, goToScene]);

  return { activeScene, goToScene, isPaused, setIsPaused };
}
