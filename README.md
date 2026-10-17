# 💍 Hayfa & Hachem — Invitation de mariage

Invitation de mariage en ligne, élégante et animée, pensée d'abord pour le téléphone.
Thème noir et or, calligraphie, fleurs animées, musique de fond et confirmation de présence par WhatsApp.

Le site est **100 % statique** (HTML, CSS, JavaScript) : il n'y a ni serveur, ni base de données, ni installation.

---

## ✨ Fonctionnalités

| Écran | Contenu |
|---|---|
| **Ouverture** | Sceau doré et bouton « Ouvrir l'invitation » (lance la musique) |
| **1. Introduction** | Monogramme H & H, « Save the date » et la date |
| **2. Les familles** | Noms des familles, cadre floral animé |
| **3. Les mariés** | Noms écrits à la plume, effet doré scintillant |
| **4. La date** | Jour, date, horaires et bouton **Ajouter au calendrier** (.ics) |
| **5. Le lieu** | Adresse et bouton **Voir l'itinéraire** (Google Maps) |
| **6. Compte à rebours** | Jours, heures, minutes et secondes avec anneaux animés |
| **7. RSVP** | Formulaire (nom, présence, nombre de personnes, mot) envoyé par **WhatsApp** |
| **8. Merci** | Message de remerciement et cœurs flottants |

Et aussi :

- Musique de fond avec bouton lecture/pause
- Particules dorées et pétales qui tombent
- Barre de progression du défilement
- Aperçu soigné quand le lien est partagé (WhatsApp, Facebook…)
- Responsive : téléphone, tablette et ordinateur
- Accessibilité : navigation au clavier et respect du réglage « réduire les animations »

---

## 📁 Structure du projet

```
invitation/
├── index.html        # Structure de la page (toutes les scènes)
├── config.js         # ⭐ Toutes les informations à modifier (date, lieu, WhatsApp…)
├── style.css         # Design : couleurs, polices, mise en page, composants
├── animations.css    # Toutes les animations (keyframes)
├── responsive.css    # Adaptation aux différentes tailles d'écran
├── main.js           # Logique : contenu, ouverture, compte à rebours, calendrier, RSVP
├── timeline.js       # Déclenchement des animations au défilement, parallaxe
├── particles.js      # Particules dorées et pétales (canvas)
├── music.js          # Lecture / pause de la musique
├── music.mp3         # Musique de fond
└── README.md
```

---

## ⚙️ Personnaliser l'invitation

**Tout se modifie dans un seul fichier : `config.js`.**
Le jour de la semaine, le compte à rebours, la date limite et le fichier calendrier se mettent à jour automatiquement.

```js
const INVITATION = {
  bride: 'Hayfa',
  groom: 'Hachem',
  families: ['Salem Klabi', 'Bachir Ben Njima'],

  date: '2027-07-17',        // AAAA-MM-JJ
  ceremonyTime: '17:00',     // HH:MM
  receptionTime: '20:00',
  endTime: '23:59',
  rsvpDeadline: '2027-07-01',

  venueName: 'Maison du marié',
  venueAddress: ['Route de Sfax', 'Ksour Essef, Mahdia'],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ksour+Essef+Mahdia+Tunisie',
  venueNote: "Navette disponible depuis l'Hôtel El Mouradi",  // '' pour masquer

  whatsapp: '',              // ex : '21698123456' (sans + ni espaces)
};
```

### ✅ À faire avant d'envoyer l'invitation

- [ ] Mettre la **vraie date** du mariage (`date`)
- [ ] Mettre la **date limite** de réponse (`rsvpDeadline`)
- [ ] Ajouter le **numéro WhatsApp** qui recevra les réponses (`whatsapp`)
- [ ] Coller le **lien Google Maps exact** du lieu (`mapsUrl`)
- [ ] Vérifier ou supprimer la phrase sur la **navette** (`venueNote`)

> 💡 Pour obtenir le lien Google Maps : ouvrez le lieu dans Google Maps, puis **Partager → Copier le lien**.

### Changer la musique

Remplacez `music.mp3` par un autre fichier portant **le même nom**.
Conseil : un MP3 à 128 kbps pèse environ 4 à 5 Mo, ce qui garde un chargement rapide sur mobile.

### Changer les couleurs

Les couleurs sont définies au début de `style.css`, dans le bloc `:root` :

```css
--color-gold:       #C9A96E;   /* or principal */
--color-gold-light: #E8D5B0;   /* or clair */
--color-black:      #0a0704;   /* fond */
```

---

## 💬 Comment fonctionne le RSVP

1. L'invité remplit le formulaire et appuie sur **Envoyer ma réponse**.
2. Une fenêtre de remerciement s'affiche avec le bouton **Envoyer sur WhatsApp**.
3. WhatsApp s'ouvre avec un message déjà rédigé, par exemple :

```
Bonjour Hayfa & Hachem 🤍
Je confirme ma présence à votre mariage.

👤 Nom : Sami Ben Ali
👥 Nombre de personnes : 2
💬 Message : Félicitations !
```

4. L'invité n'a plus qu'à appuyer sur « Envoyer ».

> Si `whatsapp` est vide, WhatsApp demande à l'invité de choisir lui-même le contact.

---

## 🖥️ Voir le site sur son ordinateur

Comme la musique et le calendrier ont besoin d'un vrai serveur, lancez un petit serveur local dans le dossier :

```bash
# Avec Python
python -m http.server 8000

# ou avec Node.js
npx serve .
```

Puis ouvrez <http://localhost:8000> dans le navigateur.

> Avec VS Code, l'extension **Live Server** fait la même chose en un clic.

---

## 🚀 Mettre en ligne avec GitHub Pages (gratuit)

1. Envoyez les fichiers sur GitHub :
   ```bash
   git add .
   git commit -m "Invitation finale"
   git push
   ```
2. Sur GitHub, ouvrez le dépôt → **Settings** → **Pages**.
3. Dans **Branch**, choisissez `main` et le dossier `/ (root)`, puis **Save**.
4. Après une ou deux minutes, l'invitation est en ligne à l'adresse :
   `https://<votre-nom-utilisateur>.github.io/invitation/`

Il ne reste qu'à partager ce lien sur WhatsApp ! 🎉

---

## 🌐 Compatibilité

Testé sur Chrome, Safari, Firefox et Edge, en version mobile et ordinateur (iPhone et Android).

> Sur téléphone, les navigateurs bloquent la musique tant que l'invité n'a pas touché l'écran.
> C'est pour cela que l'invitation commence par le bouton **« Ouvrir l'invitation »**.

---

## 🛠️ Technologies

- HTML5, CSS3 et JavaScript, sans framework ni dépendance
- Canvas 2D pour les particules
- SVG pour les ornements et les fleurs
- Polices Google Fonts : *Great Vibes*, *Cormorant Garamond* et *Poppins*

---

Fait avec 🤍 pour Hayfa & Hachem.
