/* =====================================================
   MUSIC.JS — Lecture / pause de la musique de fond
   ===================================================== */

'use strict';

const MusicController = (() => {
  const PLAY_ICON  = 'M10 8.5 L16 12 L10 15.5 Z';
  const PAUSE_ICON = 'M9 7.5h2v9H9zM13 7.5h2v9h-2z';

  let audio = null;
  let btn = null;
  let path = null;
  let initialized = false;

  function init() {
    if (initialized) return;          // évite la double initialisation
    initialized = true;

    audio = new Audio('music.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.7;

    btn  = document.getElementById('musicBtn');
    path = document.getElementById('musicPath');
    if (!btn) return;

    // Un bouton <button> déclenche déjà "click" avec Entrée / Espace
    btn.addEventListener('click', toggle);

    audio.addEventListener('play',  () => render(true));
    audio.addEventListener('pause', () => render(false));
  }

  function render(playing) {
    if (!btn) return;
    btn.classList.toggle('paused', !playing);
    btn.setAttribute('aria-label', playing ? 'Mettre la musique en pause' : 'Lire la musique');
    if (path) path.setAttribute('d', playing ? PAUSE_ICON : PLAY_ICON);
  }

  function play() {
    if (!audio) return;
    const p = audio.play();
    if (p && p.catch) p.catch(() => render(false)); // lecture bloquée par le navigateur
  }

  function pause() { if (audio) audio.pause(); }

  function toggle() {
    if (!audio) return;
    if (audio.paused) play(); else pause();
  }

  return { init, play, pause, toggle };
})();
