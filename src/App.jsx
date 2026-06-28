import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense, useMemo } from 'react';
import Hero from './components/Hero';
import Particles from './components/Particles';
import MusicPlayer from './components/MusicPlayer';
import { useScrollScenes } from './hooks/useScrollScenes';
import './styles/globals.css';

const IntroScene = lazy(() => import('./components/IntroScene'));
const CoupleScene = lazy(() => import('./components/CoupleScene'));
const DetailsScene = lazy(() => import('./components/DetailsScene'));
const Countdown = lazy(() => import('./components/Countdown'));
const RSVP = lazy(() => import('./components/RSVP'));
const FinalScene = lazy(() => import('./components/FinalScene'));

const invitation = {
  couple: {
    short: 'Hayfa & Hachem',
    bride: 'Salem klabi',
    groom: 'bachir ben njema'
  },
  dateLabel: '23 July 2026',
  timeLabel: "Four o'clock in the afternoon",
  targetDate: '2026-07-23T20:00:00+02:00',
  venue: {
    name: 'The Aurelia Conservatory',
    address: '35.410709, 11.003195 Ksour Essef',
    mapUrl: 'https://maps.app.goo.gl/e1Th2jAYKrtBodp78'
  }
};

function SceneFallback() {
  return <div className="grid min-h-full place-items-center font-display text-2xl text-champagne">Loading</div>;
}

function App() {
  const scenes = useMemo(() => [
    { label: 'Intro', node: <Hero invitation={invitation} /> },
    { label: 'Floral reveal', node: <IntroScene /> },
    { label: 'Couple names', node: <CoupleScene invitation={invitation} /> },
    { label: 'Date', node: <DetailsScene invitation={invitation} /> },
    { label: 'Venue', node: <DetailsScene invitation={invitation} mode="venue" /> },
    { label: 'Countdown', node: <Countdown targetDate={invitation.targetDate} /> },
    { label: 'RSVP', node: <RSVP /> },
    { label: 'Final', node: <FinalScene /> }
  ], []);

  const { activeScene, goToScene, isPaused, setIsPaused } = useScrollScenes(scenes.length, 5600);

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-ivory" aria-label="Luxury wedding invitation app">
      <Particles />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_30%_15%,rgba(217,164,65,.18),transparent_28rem),radial-gradient(circle_at_75%_78%,rgba(217,160,154,.2),transparent_26rem)]" />
      <div className="pointer-events-none fixed -inset-1/4 z-[1] animate-[spin_48s_linear_infinite] bg-[conic-gradient(from_20deg,transparent,rgba(255,244,211,.13),transparent_18%,transparent_30%,rgba(255,255,255,.09),transparent_48%)] opacity-25" />
      <div className="scene-shell relative z-10 mx-auto grid h-screen max-h-[1920px] min-h-screen w-full max-w-[1080px] place-items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={activeScene} className="absolute inset-0" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.035 }} transition={{ duration: 0.9, ease: 'easeInOut' }}>
            <Suspense fallback={<SceneFallback />}>{scenes[activeScene].node}</Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
      <nav className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 gap-2 sm:bottom-auto sm:left-auto sm:right-5 sm:top-1/2 sm:grid sm:translate-x-0 sm:-translate-y-1/2" aria-label="Invitation scenes">
        {scenes.map((scene, index) => (
          <button
            key={scene.label}
            type="button"
            onClick={() => goToScene(index)}
            className={'h-2.5 w-2.5 rounded-full border border-champagne/60 transition ' + (activeScene === index ? 'scale-150 bg-champagne shadow-gold' : 'bg-transparent hover:bg-champagne/30')}
            aria-label={'Go to ' + scene.label}
            aria-current={activeScene === index ? 'step' : undefined}
          />
        ))}
      </nav>
      <button
        type="button"
        onClick={() => setIsPaused((value) => !value)}
        className="fixed left-4 top-4 z-40 rounded-full border border-champagne/25 bg-ivory/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-champagne backdrop-blur-xl transition hover:bg-champagne/15"
        aria-label={isPaused ? 'Resume scene autoplay' : 'Pause scene autoplay'}
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <MusicPlayer />
    </main>
  );
}

export default App;
