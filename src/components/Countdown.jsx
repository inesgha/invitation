import { memo } from 'react';
import { motion } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import { fadeUp, scaleUp } from '../styles/motion';

function TimeRing({ value, label, delay = 0 }) {
  return (
    <motion.div variants={scaleUp} transition={{ delay }} className="relative grid aspect-square place-items-center rounded-full border border-champagne/30 bg-ivory/10 shadow-luxury backdrop-blur-xl">
      <div className="absolute inset-2 rounded-full border border-ivory/10" />
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_140deg,rgba(217,164,65,.12),rgba(246,226,182,.75),rgba(217,160,154,.26),rgba(217,164,65,.12))] opacity-70 [mask:radial-gradient(circle,transparent_59%,#000_61%)]" />
      <div className="relative z-10">
        <span className="block font-display text-4xl font-bold leading-none text-champagne sm:text-6xl">{String(value).padStart(label === 'Days' ? 3 : 2, '0')}</span>
        <small className="mt-2 block text-[0.62rem] uppercase tracking-[0.22em] text-ivory/70 sm:text-xs">{label}</small>
      </div>
    </motion.div>
  );
}

function Countdown({ targetDate }) {
  const time = useCountdown(targetDate);

  return (
    <motion.section className="grid min-h-full place-items-center px-6 text-center" initial="hidden" animate="visible" exit="exit" aria-labelledby="countdown-title">
      <div className="relative z-10 w-full max-w-4xl">
        <motion.p variants={fadeUp} className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-champagne sm:text-sm">Until we begin forever</motion.p>
        <motion.h2 id="countdown-title" variants={fadeUp} className="font-display text-5xl font-semibold text-ivory sm:text-7xl">Countdown</motion.h2>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          <TimeRing value={time.days} label="Days" />
          <TimeRing value={time.hours} label="Hours" delay={0.05} />
          <TimeRing value={time.minutes} label="Minutes" delay={0.1} />
          <TimeRing value={time.seconds} label="Seconds" delay={0.15} />
        </div>
      </div>
    </motion.section>
  );
}

export default memo(Countdown);
