import { motion } from 'framer-motion';
import { fadeUp, scaleUp, shimmer } from '../styles/motion';

function Hero({ invitation }) {
  return (
    <motion.section className="grid min-h-full place-items-center px-6 text-center" initial="hidden" animate="visible" exit="exit" aria-labelledby="hero-title">
      <div className="relative z-10 w-full max-w-3xl">
        <motion.div variants={scaleUp} className="mx-auto mb-8 grid h-36 w-36 grid-cols-[1fr_auto_1fr] items-center justify-items-center rounded-full border border-champagne/50 text-champagne shadow-gold sm:h-48 sm:w-48">
          <span className="font-display text-5xl sm:text-7xl">H</span>
          <span className="font-display text-3xl text-rose sm:text-5xl">&amp;</span>
          <span className="font-display text-5xl sm:text-7xl">H</span>
        </motion.div>
        <motion.p variants={fadeUp} className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-champagne sm:text-sm">A special invitation</motion.p>
        <motion.h1 id="hero-title" variants={fadeUp} className="font-script text-7xl leading-none text-champagne drop-shadow-[0_0_28px_rgba(217,164,65,.34)] sm:text-9xl lg:text-[11rem]">
          {invitation.couple.short}
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-xl font-display text-xl tracking-[0.08em] text-ivory/80 sm:text-3xl">{invitation.dateLabel}</motion.p>
        <motion.div variants={shimmer} animate="animate" className="gold-text mx-auto mt-8 h-px w-64 rounded-full" />
      </div>
    </motion.section>
  );
}

export default Hero;
