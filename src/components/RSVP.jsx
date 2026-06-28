import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, scaleUp } from '../styles/motion';

function RSVP() {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('joyfully accepts');
  const [message, setMessage] = useState('');
  const [ripples, setRipples] = useState([]);

  const submit = (event) => {
    event.preventDefault();
    const cleanName = name.trim();
    setMessage(cleanName ? cleanName + ', your response has been received.' : 'Your response has been received.');
  };

  const ripple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const id = window.crypto?.randomUUID?.() || String(Date.now());
    setRipples((items) => [...items, { id, x: event.clientX - rect.left, y: event.clientY - rect.top }]);
    window.setTimeout(() => setRipples((items) => items.filter((item) => item.id !== id)), 720);
  };

  return (
    <motion.section className="grid min-h-full place-items-center px-6" initial="hidden" animate="visible" exit="exit" aria-labelledby="rsvp-title">
      <motion.form variants={scaleUp} onSubmit={submit} className="glass-panel w-full max-w-xl rounded-3xl px-7 py-9 text-center sm:px-12 sm:py-12">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-champagne">Kindly reply by 1 July</p>
        <h2 id="rsvp-title" className="font-display text-4xl font-semibold leading-tight text-ivory sm:text-6xl">Will you celebrate with us?</h2>
        <div className="mt-8 grid gap-4 text-left">
          <label className="text-sm font-medium uppercase tracking-[0.18em] text-champagne/90" htmlFor="guestName">Name</label>
          <input id="guestName" value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-champagne/20 bg-ink/35 px-5 py-4 text-ivory placeholder:text-ivory/40 backdrop-blur-xl" placeholder="Your name" />
          <label className="text-sm font-medium uppercase tracking-[0.18em] text-champagne/90" htmlFor="attendance">Attendance</label>
          <select id="attendance" value={attendance} onChange={(event) => setAttendance(event.target.value)} className="rounded-2xl border border-champagne/20 bg-ink/35 px-5 py-4 text-ivory backdrop-blur-xl">
            <option>joyfully accepts</option>
            <option>regretfully declines</option>
          </select>
        </div>
        <motion.button variants={fadeUp} type="submit" onClick={ripple} className="relative mt-8 min-h-14 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#fff3c6] via-gold to-[#bd7f2e] px-7 text-sm font-bold uppercase tracking-[0.28em] text-ink shadow-gold transition hover:scale-[1.02] hover:shadow-[0_0_58px_rgba(217,164,65,.48)]">
          <span className="relative z-10">RSVP</span>
          {ripples.map((item) => <span key={item.id} className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-[ping_.7s_ease-out] rounded-full bg-white/70" style={{ left: item.x, top: item.y }} />)}
        </motion.button>
        <p className="mt-5 min-h-7 font-display text-xl text-champagne" role="status" aria-live="polite">{message || (attendance === 'joyfully accepts' ? 'We cannot wait to welcome you.' : 'Your presence will be missed.')}</p>
      </motion.form>
    </motion.section>
  );
}

export default memo(RSVP);
