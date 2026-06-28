import { motion } from 'framer-motion';
import floralCorner from '../assets/svg/floral-corner.svg';
import { fadeUp, shimmer } from '../styles/motion';

function FinalScene() {
  const petals = Array.from({ length: 18 }, (_, index) => ({
    left: String(8 + ((index * 13) % 84)) + '%',
    delay: String((index % 9) * 0.55) + 's',
    duration: String(9 + (index % 5)) + 's'
  }));

  return (
    <motion.section className="relative grid min-h-full place-items-center overflow-hidden px-6 text-center" initial="hidden" animate="visible" exit="exit" aria-labelledby="thanks-title">
      <img src={floralCorner} alt="" className="absolute top-8 w-72 rotate-45 opacity-55 sm:w-[34rem]" />
      {petals.map((petal, index) => <span key={index} className="petal animate-petalFall" style={{ left: petal.left, animationDelay: petal.delay, animationDuration: petal.duration }} />)}
      <div className="relative z-10 max-w-3xl">
        <motion.p variants={fadeUp} className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-champagne sm:text-sm">With love and gratitude</motion.p>
        <motion.h2 id="thanks-title" variants={shimmer} animate="animate" className="gold-text font-script text-8xl leading-none sm:text-[11rem]">Thank You</motion.h2>
        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-lg font-display text-2xl leading-relaxed text-ivory/80">Your presence is the most beautiful gift.</motion.p>
      </div>
    </motion.section>
  );
}

export default FinalScene;
