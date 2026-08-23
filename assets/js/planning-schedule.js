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

  function rendrePlanning(slots) {
    if (!slots.length) return;
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
