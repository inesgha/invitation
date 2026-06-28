import { motion } from 'framer-motion';
import floralCorner from '../assets/svg/floral-corner.svg';
import { fadeUp, slowZoom } from '../styles/motion';

function IntroScene() {
  return (
    <motion.section className="relative grid min-h-full place-items-center overflow-hidden px-6 text-center" initial="hidden" animate="visible" exit="exit" aria-label="Floral reveal">
      <motion.div variants={slowZoom} className="absolute inset-0" aria-hidden="true">
        <img src={floralCorner} alt="" className="absolute left-2 top-2 w-56 origin-top-left sm:w-80" />
        <img src={floralCorner} alt="" className="absolute right-2 top-2 w-56 origin-top-right -scale-x-100 sm:w-80" />
        <img src={floralCorner} alt="" className="absolute bottom-2 left-2 w-56 origin-bottom-left -scale-y-100 sm:w-80" />
        <img src={floralCorner} alt="" className="absolute bottom-2 right-2 w-56 origin-bottom-right scale-[-1] sm:w-80" />
      </motion.div>
      <motion.div variants={fadeUp} className="relative z-10">
        <div className="luxury-ring mx-auto mb-8 h-72 w-72 rounded-full sm:h-96 sm:w-96" />
        <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 font-script text-5xl text-champagne drop-shadow-[0_0_28px_rgba(217,164,65,.36)] sm:text-7xl">A love story in bloom</p>
      </motion.div>
    </motion.section>
  );
}

export default IntroScene;
