export const ease = [0.65, 0, 0.35, 1];

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease } },
  exit: { opacity: 0, transition: { duration: 0.75, ease } }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 38, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.15, ease } },
  exit: { opacity: 0, y: -24, filter: 'blur(8px)', transition: { duration: 0.75, ease } }
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.86, filter: 'blur(10px)' },
  visible: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 90, damping: 22 } },
  exit: { opacity: 0, scale: 1.05, filter: 'blur(8px)', transition: { duration: 0.75, ease } }
};

export const slowZoom = {
  hidden: { scale: 1 },
  visible: { scale: 1.08, transition: { duration: 7, ease } },
  exit: { opacity: 0, scale: 1.12, transition: { duration: 0.85, ease } }
};

export const float = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 5, ease: 'easeInOut', repeat: Infinity }
  }
};

export const shimmer = {
  animate: {
    backgroundPosition: ['-200% 50%', '200% 50%'],
    transition: { duration: 5, ease: 'linear', repeat: Infinity }
  }
};
