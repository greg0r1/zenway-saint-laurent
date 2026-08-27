/* ============================================================
   PLANNING — grille des séances, alimentée par /api/planning/public
   (module « Planning » de l'admin)
   ============================================================ */
(function planningschedule() {
  // Échappe aussi guillemets et apostrophe : ces valeurs finissent
  // parfois en position d'attribut, où un guillemet refermerait
  // l'attribut et permettrait d'en injecter un autre.
  function echapper(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------- Planning : /api/planning/public ----------
     La grille statique de la page est le repli. Si l'API répond,
     elle est reconstruite : une colonne par jour de la semaine,
     une ligne par horaire distinct, dans l'ordre voulu par l'admin. */
  const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  function normaliser(txt) {
    return String(txt || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  /* Sous 760 px, la grille laisse la place à une liste (voir
     responsive.css) : une entrée par créneau, dans l'ordre de la semaine.
     Les deux formes sont écrites ici à partir des mêmes données ; le CSS
     seul décide laquelle est affichée. */
  function rendreListe(slots) {
    const liste = document.getElementById('planningListe');
    if (!liste) return;

    const rang = (s) => {
      const i = JOURS.findIndex((j) => normaliser(s.day).startsWith(normaliser(j)));
      return i === -1 ? JOURS.length : i;
    };

    liste.innerHTML = slots
      .slice()
      .sort((a, b) => rang(a) - rang(b))
      .map((slot) => {
        const jour = String(slot.day || '').trim();
        const heure = String(slot.time || '').trim();
        return `<li class="r-seance">
          ${jour ? `<p class="r-seance-jour">${echapper(jour)}</p>` : ''}
          ${heure ? `<p class="r-seance-heure">${echapper(heure)}</p>` : ''}
          <p class="r-seance-lieu">
            <strong>${echapper(slot.label || 'Zenway')}</strong>
            ${slot.place ? `<span>${echapper(slot.place)}</span>` : ''}
          </p>
        </li>`;
      })
      .join('');
  }

  function rendreNote(slots) {
    const notes = slots
      .map((s) => s.note)
      .filter(Boolean)
      .map(echapper);
    const zoneNote = document.querySelector('.r-planning-note');
    // Une ligne par note : `innerHTML` (contenu déjà échappé ci-dessus)
    // plutôt que `textContent`, sinon le repli statique perd son <br />
    // dès qu'un créneau porte une note, et plusieurs notes se
    // retrouveraient collées en une seule ligne.
    if (zoneNote && notes.length) zoneNote.innerHTML = notes.join('<br />');
  }

  // Extrait le nombre de minutes depuis minuit d'un horaire composé par
  // l'admin ("17 h 45 — 18 h 45", voir admin-planning.js:analyserHoraire) :
  // sert uniquement à trier les lignes de la grille chronologiquement,
  // jamais à valider ou reformater le texte affiché.
  function minutesDebut(heure) {
    const m = String(heure || '').match(/^(\d{1,2})\s*h\s*(\d{1,2})?/i);
    return m ? Number(m[1]) * 60 + Number(m[2] || 0) : Number.MAX_SAFE_INTEGER;
  }

  // Aucun créneau : plutôt que de laisser affichés la grille et la note
  // statiques d'index.html — qui deviendraient un horaire périmé sans que
  // rien ne le signale — on l'écrit en toutes lettres, comme le faisait
  // l'ancienne version de cette page.
  function rendreVide() {
    const liste = document.getElementById('planningListe');
    if (liste) liste.innerHTML = '';
    const table = document.getElementById('planningGrille');
    if (table) {
      table.querySelector('thead').innerHTML = '';
      table.querySelector('tbody').innerHTML = '';
    }
    const zoneNote = document.querySelector('.r-planning-note');
    if (zoneNote) {
      zoneNote.innerHTML =
        'Le planning détaillé sera bientôt publié ici.<br />En attendant, contactez Béatrice pour connaître les prochains jours et horaires de séance.';
    }
  }

  function rendrePlanning(slots) {
    if (!slots.length) {
      rendreVide();
      return;
    }
    rendreListe(slots);
    rendreNote(slots);

    const table = document.getElementById('planningGrille');
    if (!table) return;

    // La semaine ouvrable est toujours affichée en entier : une case vide
    // dit « pas de séance ce jour-là », c'est une information. Le week-end
    // ne s'ajoute que si l'admin y a posé un créneau.
    const weekEnd = JOURS.slice(5).filter((j) =>
      slots.some((s) => normaliser(s.day).startsWith(normaliser(j)))
    );
    const colonnes = JOURS.slice(0, 5).concat(weekEnd);

    const horaires = [];
    slots.forEach((s) => {
      const t = String(s.time || '').trim();
      if (t && !horaires.includes(t)) horaires.push(t);
    });
    if (!horaires.length) return;
    horaires.sort((a, b) => minutesDebut(a) - minutesDebut(b));

    const entete = `<tr><td></td>${colonnes
      .map((j) => `<th scope="col">${echapper(j)}</th>`)
      .join('')}</tr>`;

    const lignes = horaires
      .map((heure) => {
        const cellules = colonnes
          .map((jour) => {
            // `filter`, pas `find` : deux créneaux au même jour et à la
            // même heure (deux salles, par exemple) doivent tous les deux
            // apparaître, comme le fait déjà la liste mobile juste au-dessus.
            const memesCreneaux = slots.filter(
              (s) =>
                String(s.time || '').trim() === heure &&
                normaliser(s.day).startsWith(normaliser(jour))
            );
            if (!memesCreneaux.length) return '<td></td>';
            return `<td>${memesCreneaux
              .map(
                (slot) => `<span class="r-creneau">
              <strong>${echapper(slot.label || 'Zenway')}</strong>
              ${slot.place ? `<span>${echapper(slot.place)}</span>` : ''}
            </span>`
              )
              .join('')}</td>`;
          })
          .join('');
        return `<tr><th scope="row">${echapper(heure)}</th>${cellules}</tr>`;
      })
      .join('');

    table.querySelector('thead').innerHTML = entete;
    table.querySelector('tbody').innerHTML = lignes;
  }

  fetch('/api/planning/public')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data) rendrePlanning(data.slots || []);
    })
    .catch(() => {
      /* API indisponible : la grille statique reste affichée */
    });
})();
