import { motion } from 'framer-motion';
import separator from '../assets/svg/separator.svg';
import { fadeUp, float, shimmer } from '../styles/motion';

function CoupleScene({ invitation }) {
  return (
    <motion.section className="grid min-h-full place-items-center px-6 text-center" initial="hidden" animate="visible" exit="exit" aria-labelledby="couple-title">
      <div className="relative z-10 max-w-4xl">
        <motion.p variants={fadeUp} className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-champagne sm:text-sm">Together with their families</motion.p>
        <motion.h2 id="couple-title" variants={shimmer} animate="animate" className="gold-text font-script text-7xl leading-[0.86] sm:text-9xl lg:text-[12rem]">
          {invitation.couple.bride}<br /><span className="font-display text-[0.32em] text-rose">&amp;</span><br />{invitation.couple.groom}
        </motion.h2>
        <motion.img variants={fadeUp} src={separator} alt="" className="mx-auto mt-8 w-72 opacity-80 sm:w-[34rem]" />
        <motion.p variants={float} animate="animate" className="mx-auto mt-7 max-w-lg font-display text-xl text-ivory/78 sm:text-2xl">request the honor of your presence as they begin forever.</motion.p>
      </div>
    </motion.section>
  );
}

export default CoupleScene;
