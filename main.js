/* =====================================================
   MAIN.JS — Orchestration de l'invitation
   Contenu, ouverture, compte à rebours, calendrier, RSVP
   ===================================================== */

'use strict';

const CFG = (typeof INVITATION !== 'undefined') ? INVITATION : {};

const MONTHS   = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const WEEKDAYS = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const pad = n => String(n).padStart(2, '0');

function parseDate(dateStr, timeStr = '00:00') {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm]  = timeStr.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm);
}

const WEDDING_DATE = parseDate(CFG.date || '2027-07-17', CFG.ceremonyTime || '17:00');

function formatTime(t) { const [h, m] = t.split(':'); return `${Number(h)}h${m}`; }
function formatLongDate(dateStr) {
  const d = parseDate(dateStr);
  const day = d.getDate() === 1 ? '1er' : d.getDate();
  return `${day} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* ---- Remplit la page à partir de config.js ---- */
function bindContent() {
  const d = WEDDING_DATE;
  const values = {
    bride: CFG.bride,
    groom: CFG.groom,
    brideInitial: CFG.bride?.[0],
    groomInitial: CFG.groom?.[0],
    initials: CFG.bride && CFG.groom ? `${CFG.bride[0]}&${CFG.groom[0]}` : null,
    initialsSpaced: CFG.bride && CFG.groom ? `${CFG.bride[0]} & ${CFG.groom[0]}` : null,
    family0: CFG.families?.[0],
    family1: CFG.families?.[1],
    weekday: WEEKDAYS[d.getDay()],
    day: pad(d.getDate()),
    monthName: cap(MONTHS[d.getMonth()]),
    year: d.getFullYear(),
    dateShort: `${pad(d.getDate())} · ${pad(d.getMonth() + 1)} · ${d.getFullYear()}`,
    ceremonyTime: CFG.ceremonyTime && formatTime(CFG.ceremonyTime),
    receptionTime: CFG.receptionTime && formatTime(CFG.receptionTime),
    rsvpDeadline: CFG.rsvpDeadline && formatLongDate(CFG.rsvpDeadline),
    venueName: CFG.venueName,
    venueNote: CFG.venueNote,
  };

  Object.entries(values).forEach(([key, val]) => {
    if (val === undefined || val === null || val === '') return;
    document.querySelectorAll(`[data-bind="${key}"]`).forEach(el => { el.textContent = val; });
  });

  // Adresse sur plusieurs lignes
  if (Array.isArray(CFG.venueAddress)) {
    document.querySelectorAll('[data-bind="venueAddress"]').forEach(el => {
      el.textContent = '';
      CFG.venueAddress.forEach((line, i) => {
        if (i) el.appendChild(document.createElement('br'));
        el.appendChild(document.createTextNode(line));
      });
    });
  }
  if (!CFG.venueNote) document.querySelector('[data-bind="venueNote"]')?.remove();

  const maps = document.getElementById('mapsLink');
  if (maps) {
    if (CFG.mapsUrl) maps.href = CFG.mapsUrl; else maps.remove();
  }

  if (CFG.bride && CFG.groom) {
    document.title = `${CFG.bride} & ${CFG.groom} — Invitation de mariage`;
  }
}

/* ---- Écran d'ouverture ---- */
function initOpener() {
  const opener = document.getElementById('opener');
  const btn    = document.getElementById('openerBtn');
  if (!opener || !btn) { document.body.classList.remove('is-locked'); return; }

  setTimeout(() => btn.focus({ preventScroll: true }), 600);

  btn.addEventListener('click', () => {
    // Le clic autorise le navigateur à lancer la musique
    if (typeof MusicController !== 'undefined') MusicController.play();

    opener.classList.add('is-open');
    document.body.classList.remove('is-locked');
    document.body.classList.add('is-ready');

    if (typeof ParticleSystem !== 'undefined') {
      ParticleSystem.burst(window.innerWidth / 2, window.innerHeight / 2, 40);
    }
    setTimeout(() => { opener.hidden = true; }, 1200);
  });
}

/* ---- Compte à rebours ---- */
const RING_C = 2 * Math.PI * 34;
let countdownTimer = null;

function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  const ids = ['days', 'hours', 'minutes', 'seconds'];
  if (!document.getElementById('days')) return;

  if (diff <= 0) {
    ids.forEach(id => { document.getElementById(id).textContent = '00'; });
    ['ringDays','ringHours','ringMinutes','ringSeconds'].forEach(id => updateRing(id, 0, 1));
    const done = document.getElementById('countdownDone');
    if (done) done.hidden = false;
    clearInterval(countdownTimer);
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  setCountValue('days', d);
  setCountValue('hours', h);
  setCountValue('minutes', m);
  setCountValue('seconds', s);

  updateRing('ringDays',    Math.min(d, 365), 365);
  updateRing('ringHours',   h, 24);
  updateRing('ringMinutes', m, 60);
  updateRing('ringSeconds', s, 60);
}

function setCountValue(id, val) {
  const el = document.getElementById(id);
  const str = pad(val);
  if (el && el.textContent !== str) {
    el.textContent = str;
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
  }
}

function updateRing(id, value, max) {
  const ring = document.getElementById(id);
  if (!ring) return;
  ring.style.strokeDasharray = RING_C;
  ring.style.strokeDashoffset = RING_C * (1 - value / max);
}

/* ---- Ajouter au calendrier (.ics) ---- */
function initCalendar() {
  const btn = document.getElementById('calendarBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const [y, mo, da] = (CFG.date || '2027-07-17').split('-');
    const t = s => s.replace(':', '') + '00';
    const start = `${y}${mo}${da}T${t(CFG.ceremonyTime || '17:00')}`;
    const end   = `${y}${mo}${da}T${t(CFG.endTime || '23:59')}`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const esc = s => String(s || '').replace(/([,;\\])/g, '\\$1');
    const location = [CFG.venueName, ...(CFG.venueAddress || [])].filter(Boolean).join(', ');

    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitation//FR', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:mariage-${y}${mo}${da}@invitation`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${esc(`Mariage de ${CFG.bride} & ${CFG.groom}`)}`,
      `LOCATION:${esc(location)}`,
      `DESCRIPTION:${esc(`Cérémonie à ${formatTime(CFG.ceremonyTime || '17:00')} · Réception à ${formatTime(CFG.receptionTime || '20:00')}`)}`,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Mariage demain !', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mariage-${(CFG.bride || 'H').toLowerCase()}-${(CFG.groom || 'H').toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
}

/* ---- Effet d'onde sur les boutons ---- */
function createRipple(btn, e) {
  const rippleEl = btn.querySelector('.rsvp-btn__ripple');
  if (!rippleEl) return;
  const rect = btn.getBoundingClientRect();
  const x = (e && e.clientX ? e.clientX : rect.left + rect.width / 2) - rect.left;
  const y = (e && e.clientY ? e.clientY : rect.top + rect.height / 2) - rect.top;

  rippleEl.style.transition = 'none';
  rippleEl.style.left = x + 'px';
  rippleEl.style.top  = y + 'px';
  rippleEl.style.width = rippleEl.style.height = '0';
  rippleEl.style.opacity = '0.5';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    rippleEl.style.transition = 'all 0.6s cubic-bezier(0.19,1,0.22,1)';
    rippleEl.style.width = rippleEl.style.height = '320px';
    rippleEl.style.opacity = '0';
  }));
}

/* ---- RSVP → WhatsApp ---- */
function initRSVP() {
  const form    = document.getElementById('rsvpForm');
  const btn     = document.getElementById('rsvpBtn');
  const modal   = document.getElementById('rsvpModal');
  const close   = document.getElementById('modalClose');
  const overlay = document.getElementById('modalOverlay');
  const msgEl   = document.getElementById('modalMessage');
  const waLink  = document.getElementById('modalWa');
  const guestsField = document.getElementById('guestsField');
  const nameInput   = document.getElementById('rsvpName');
  const nameError   = document.getElementById('nameError');
  if (!form || !modal) return;

  // Masquer « nombre de personnes » si l'invité ne vient pas
  form.querySelectorAll('input[name="attending"]').forEach(r => {
    r.addEventListener('change', () => {
      const yes = form.attending.value === 'yes';
      guestsField.classList.toggle('is-hidden', !yes);
      btn.querySelector('.rsvp-btn__text').textContent = 'Envoyer ma réponse';
    });
  });

  nameInput.addEventListener('input', () => {
    nameError.hidden = true;
    nameInput.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    createRipple(btn, null);

    const name = nameInput.value.trim();
    if (!name) {
      nameError.hidden = false;
      nameInput.setAttribute('aria-invalid', 'true');
      shakeField(nameInput);
      return;
    }

    const attending = form.attending.value === 'yes';
    const guests = form.guests.value;
    const note = form.message.value.trim();
    const couple = `${CFG.bride} & ${CFG.groom}`;

    let text = attending
      ? `Bonjour ${couple} 🤍\nJe confirme ma présence à votre mariage.\n\n👤 Nom : ${name}\n👥 Nombre de personnes : ${guests}`
      : `Bonjour ${couple} 🤍\nMalheureusement je ne pourrai pas être présent(e) à votre mariage.\n\n👤 Nom : ${name}`;
    if (note) text += `\n💬 Message : ${note}`;

    const number = String(CFG.whatsapp || '').replace(/\D/g, '');
    const waUrl = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

    msgEl.innerHTML = attending
      ? 'Nous avons hâte de vous voir&nbsp;!<br/>Appuyez ci-dessous pour envoyer votre réponse.'
      : 'Merci de nous prévenir,<br/>vous serez dans nos pensées.';
    waLink.href = waUrl;

    openModal(modal, waLink);
    if (attending && typeof ParticleSystem !== 'undefined') {
      const rect = btn.getBoundingClientRect();
      ParticleSystem.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
    }

  });

  [close, overlay].forEach(el => el && el.addEventListener('click', () => closeModal(modal)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal(modal);
  });
}

function openModal(modal, focusEl) {
  modal.hidden = false;
  setTimeout(() => focusEl?.focus(), 100);
}

function closeModal(modal) {
  modal.hidden = true;
  document.getElementById('rsvpBtn')?.focus();
}

function shakeField(input) {
  input.classList.remove('shake');
  void input.offsetWidth;
  input.classList.add('shake');
  input.focus();
}

/* ---- Bouton « Découvrir » ---- */
function initScrollCTA() {
  document.getElementById('scrollCta')?.addEventListener('click', () => {
    document.getElementById('scene2')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* ---- Navigation clavier (hors champs de formulaire) ---- */
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (['input', 'textarea', 'select', 'button'].includes(tag)) return;
    if (document.body.classList.contains('is-locked')) return;

    const scenes = [...document.querySelectorAll('.scene')];
    const idx = scenes.findIndex(s => {
      const r = s.getBoundingClientRect();
      return r.top <= 100 && r.bottom > 100;
    });

    let target = null;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') target = scenes[idx + 1];
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') target = scenes[idx - 1];
    else if (e.key === 'Home') target = scenes[0];
    else if (e.key === 'End') target = scenes[scenes.length - 1];

    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
}

/* ---- Traînée scintillante du curseur (ordinateur uniquement) ---- */
function initCursorTrail() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.88 && typeof ParticleSystem !== 'undefined') {
      ParticleSystem.burst(e.clientX, e.clientY, 1);
    }
  }, { passive: true });
}

/* ---- Pause des animations quand l'onglet est caché ---- */
function initVisibilityOptimize() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.addEventListener('visibilitychange', () => {
    if (typeof ParticleSystem === 'undefined') return;
    if (document.hidden) ParticleSystem.stop(); else ParticleSystem.start();
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  bindContent();
  if (typeof MusicController !== 'undefined') MusicController.init();
  initOpener();
  if (typeof Timeline !== 'undefined') Timeline.init();

  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);

  initCalendar();
  initRSVP();
  initScrollCTA();
  initKeyboardNav();
  initCursorTrail();
  initVisibilityOptimize();
});
