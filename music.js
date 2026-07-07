'use strict';

const MusicController = (() => {
  let audio = null;
  let isPlaying = false;

  function init() {
    audio = new Audio('music.mp3'); // chemin vers ton fichier
    audio.loop = true; // la musique tourne en boucle

    const btn = document.getElementById('musicBtn');
    const path = document.getElementById('musicPath');

    if (!btn) return;

    btn.addEventListener('click', toggle);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  }

  function toggle() {
    const btn = document.getElementById('musicBtn');
    const path = document.getElementById('musicPath');

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      btn.setAttribute('aria-label', 'Lire la musique');
      if (path) path.setAttribute('d', 'M10 8.5 L16 12 L10 15.5 Z'); // Play icon
    } else {
      audio.play();
      isPlaying = true;
      btn.setAttribute('aria-label', 'Mettre la musique en pause');
      if (path) path.setAttribute('d', 'M8 6h2v12H8zM14 6h2v12h-2z'); // Pause icon
    }
  }

  return { init };
})();

// Initialisation après chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  MusicController.init();
});
