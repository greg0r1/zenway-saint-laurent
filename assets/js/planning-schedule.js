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

  function rendrePlanning(slots) {
    const table = document.getElementById('planningGrille');
    if (!table || !slots.length) return;

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

    const entete = `<tr><td></td>${colonnes
      .map((j) => `<th scope="col">${echapper(j)}</th>`)
      .join('')}</tr>`;

    const lignes = horaires
      .map((heure) => {
        const cellules = colonnes
          .map((jour) => {
            const slot = slots.find(
              (s) =>
                String(s.time || '').trim() === heure &&
                normaliser(s.day).startsWith(normaliser(jour))
            );
            if (!slot) return '<td></td>';
            return `<td><span class="r-creneau">
              <strong>${echapper(slot.label || 'Zenway')}</strong>
              ${slot.place ? `<span>${echapper(slot.place)}</span>` : ''}
            </span></td>`;
          })
          .join('');
        return `<tr><th scope="row">${echapper(heure)}</th>${cellules}</tr>`;
      })
      .join('');

    table.querySelector('thead').innerHTML = entete;
    table.querySelector('tbody').innerHTML = lignes;

    const notes = slots
      .map((s) => s.note)
      .filter(Boolean)
      .join(' ');
    const zoneNote = document.querySelector('.r-planning-note');
    if (zoneNote && notes) zoneNote.textContent = notes;
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
