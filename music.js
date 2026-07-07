/* =====================================================
   MUSIC.JS — Background Music Controller
   Web Audio API ambient tone + visual feedback
   ===================================================== */

'use strict';

const MusicController = (() => {

  let audioCtx = null;
  let masterGain = null;
  let isPlaying = false;
  let isInitialized = false;
  let oscillators = [];
  let lfos = [];
  let ambientInterval = null;

  /* ---- Musical notes (pentatonic scale — always pleasant) ---- */
  const NOTES = {
    C4:  261.63,
    D4:  293.66,
    E4:  329.63,
    G4:  392.00,
    A4:  440.00,
    C5:  523.25,
    D5:  587.33,
    E5:  659.25,
    G5:  783.99,
    A5:  880.00,
    G3:  196.00,
    A3:  220.00,
    C3:  130.81,
    D3:  146.83
  };

  /* ---- Chord layers ---- */
  const CHORD_1 = [NOTES.C3, NOTES.G3, NOTES.E4, NOTES.G4, NOTES.C5];
  const CHORD_2 = [NOTES.A3, NOTES.E4, NOTES.A4, NOTES.C5, NOTES.E5];
  const CHORD_3 = [NOTES.G3, NOTES.D4, NOTES.G4, NOTES.B4 || 493.88, NOTES.D5];

  /* ---- Init Audio Context ---- */
  function initAudio() {
    if (isInitialized) return true;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
      isInitialized = true;
      return true;
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
      return false;
    }
  }

  /* ---- Create a soft pad oscillator ---- */
  function createPad(freq, gainVal, type = 'sine', detuneVal = 0) {
    if (!audioCtx) return null;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.detune.setValueAtTime(detuneVal, audioCtx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);
    filter.Q.setValueAtTime(0.5, audioCtx.currentTime);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(gainVal, audioCtx.currentTime + 3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc.start();

    return { osc, gain, filter };
  }

  /* ---- Create LFO tremolo ---- */
  function createLFO(target, rate, depth) {
    if (!audioCtx) return null;
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(rate, audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(depth, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(target);
    lfo.start();
    return { lfo, lfoGain };
  }

  /* ---- Play the ambient wedding score ---- */
  function startAmbient() {
    if (!audioCtx || !isInitialized) return;

    // Bass drone
    const bass = createPad(NOTES.C3, 0.04, 'sine');
    if (bass) oscillators.push(bass);

    const bass2 = createPad(NOTES.G3, 0.03, 'sine', -3);
    if (bass2) oscillators.push(bass2);

    // Mid pads (soft triangle waves)
    CHORD_1.forEach((freq, i) => {
      const pad = createPad(freq, 0.02, 'triangle', i % 2 === 0 ? 5 : -5);
      if (pad) {
        oscillators.push(pad);
        // Slow tremolo on each pad
        const lfo = createLFO(pad.gain.gain, 0.15 + i * 0.03, 0.005);
        if (lfo) lfos.push(lfo);
      }
    });

    // High shimmer (very soft)
    CHORD_2.slice(2).forEach((freq, i) => {
      const pad = createPad(freq, 0.008, 'sine', i % 2 === 0 ? 10 : -10);
      if (pad) {
        oscillators.push(pad);
        const lfo = createLFO(pad.gain.gain, 0.3 + i * 0.05, 0.003);
        if (lfo) lfos.push(lfo);
      }
    });

    // Fade in master
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 4);

    // Slowly evolve harmony
    ambientInterval = setInterval(() => {
      evolveHarmony();
    }, 8000);
  }

  /* ---- Evolve harmony over time ---- */
  function evolveHarmony() {
    if (!audioCtx || oscillators.length === 0) return;
    const t = audioCtx.currentTime;
    const chords = [CHORD_1, CHORD_2, CHORD_3];
    const chord = chords[Math.floor(Math.random() * chords.length)];

    // Gently shift some oscillator frequencies
    oscillators.slice(2, 7).forEach((osc, i) => {
      if (osc && osc.osc && i < chord.length) {
        osc.osc.frequency.exponentialRampToValueAtTime(chord[i], t + 6);
      }
    });

    // Gentle volume swell
    const vol = 0.12 + Math.random() * 0.08;
    masterGain.gain.linearRampToValueAtTime(vol, t + 6);
  }

  /* ---- Stop all oscillators ---- */
  function stopAmbient() {
    if (!audioCtx) return;
    const t = audioCtx.currentTime;

    masterGain.gain.cancelScheduledValues(t);
    masterGain.gain.setValueAtTime(masterGain.gain.value, t);
    masterGain.gain.linearRampToValueAtTime(0, t + 2);

    clearInterval(ambientInterval);

    setTimeout(() => {
      oscillators.forEach(({ osc }) => {
        try { osc.stop(); } catch (_) {}
      });
      lfos.forEach(({ lfo }) => {
        try { lfo.stop(); } catch (_) {}
      });
      oscillators = [];
      lfos = [];
    }, 2200);
  }

  /* ---- Toggle ---- */
  function toggle() {
    if (!isInitialized) {
      if (!initAudio()) return;
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (isPlaying) {
      stopAmbient();
      isPlaying = false;
      updateUI(false);
    } else {
      startAmbient();
      isPlaying = true;
      updateUI(true);
    }
  }

  /* ---- Update button UI ---- */
  function updateUI(playing) {
    const btn  = document.getElementById('musicBtn');
    const path = document.getElementById('musicPath');
    if (!btn) return;

    if (playing) {
      btn.classList.remove('paused');
      btn.setAttribute('aria-label', 'Mettre la musique en pause');
      if (path) {
        // Pause icon
        path.setAttribute('d', 'M8 6h2v12H8zM14 6h2v12h-2z');
      }
    } else {
      btn.classList.add('paused');
      btn.setAttribute('aria-label', 'Lire la musique');
      if (path) {
        // Play icon
        path.setAttribute('d', 'M10 8.5 L16 12 L10 15.5 Z');
      }
    }
  }

  /* ---- Init ---- */
  function init() {
    const btn = document.getElementById('musicBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      toggle();
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    // Auto-play on first user interaction anywhere
    let autoPlayed = false;
    const autoPlay = () => {
      if (!autoPlayed && !isPlaying) {
        autoPlayed = true;
        // Small delay for better UX
        setTimeout(() => {
          if (!isPlaying) toggle();
        }, 1500);
      }
      document.removeEventListener('click', autoPlay);
      document.removeEventListener('touchstart', autoPlay);
      document.removeEventListener('keydown', autoPlay);
    };

    document.addEventListener('click', autoPlay, { once: true, passive: true });
    document.addEventListener('touchstart', autoPlay, { once: true, passive: true });
  }

  return { init, toggle, isPlaying: () => isPlaying };

})();