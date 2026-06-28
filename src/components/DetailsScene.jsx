import { motion } from 'framer-motion';
import calendarIcon from '../assets/svg/calendar.svg';
import pinIcon from '../assets/svg/pin.svg';
import { fadeUp, scaleUp } from '../styles/motion';

function DetailCard({ icon, eyebrow, title, children, action }) {
  return (
    <motion.article variants={scaleUp} className="glass-panel mx-auto w-full max-w-xl rounded-3xl px-7 py-9 text-center sm:px-12 sm:py-12">
      <img src={icon} alt="" className="mx-auto mb-5 h-14 w-14 drop-shadow-[0_0_18px_rgba(217,164,65,.42)]" />
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-champagne">{eyebrow}</p>
      <h2 className="font-display text-4xl font-semibold leading-tight text-ivory sm:text-6xl">{title}</h2>
      <div className="mx-auto my-6 h-px w-48 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="font-display text-xl leading-relaxed text-ivory/80 sm:text-2xl">{children}</div>
      {action}
    </motion.article>
  );
}

function DetailsScene({ invitation, mode = 'date' }) {
  const isVenue = mode === 'venue';

  return (
    <motion.section className="grid min-h-full place-items-center px-6" initial="hidden" animate="visible" exit="exit" aria-labelledby={isVenue ? 'venue-title' : 'details-title'}>
      {isVenue ? (
        <DetailCard icon={pinIcon} eyebrow="Ceremony and reception" title={invitation.venue.name}>
          <p>{invitation.venue.address}</p>
          <a className="mt-7 inline-flex rounded-full border border-champagne/30 bg-champagne/10 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-champagne transition hover:bg-champagne/20" href={invitation.venue.mapUrl} target="_blank" rel="noreferrer">Open map</a>
        </DetailCard>
      ) : (
        <DetailCard icon={calendarIcon} eyebrow="Save the date" title={invitation.dateLabel}>
          <p>{invitation.timeLabel}</p>
        </DetailCard>
      )}
    </motion.section>
  );
}

export default DetailsScene;
