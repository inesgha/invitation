/* =====================================================
   CONFIG.JS — Toutes les informations de l'invitation
   ➜ Modifiez UNIQUEMENT ce fichier pour changer les infos.
     Le jour de la semaine, le compte à rebours et le
     fichier calendrier se mettent à jour automatiquement.
   ===================================================== */

'use strict';

const INVITATION = {
  // Mariés
  bride: 'Hayfa',
  groom: 'Hachem',

  // Familles (affichées dans la 2e scène)
  families: ['Salem Klabi', 'Bachir Ben Njima'],

  // Date & heures (format AAAA-MM-JJ et HH:MM, heure de Tunisie)
  // ⚠️ DATE À CONFIRMER — remplacez par la vraie date du mariage
  date: '2027-07-17',
  ceremonyTime: '17:00',
  receptionTime: '20:00',
  endTime: '23:59',

  // Date limite de confirmation (AAAA-MM-JJ)
  rsvpDeadline: '2027-07-01',

  // Lieu
  venueName: 'Maison du marié',
  venueAddress: ['Route de Sfax', 'Ksour Essef, Mahdia'],
  // Lien Google Maps (collez le lien exact du lieu si vous l'avez)
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ksour+Essef+Mahdia+Tunisie',
  venueNote: "Navette disponible depuis l'Hôtel El Mouradi",

  // Numéro WhatsApp qui reçoit les confirmations
  // Format international SANS « + » ni espaces. Ex : '21698123456'
  // Laissé vide : l'invité choisit lui-même le contact WhatsApp.
  whatsapp: '',
};
