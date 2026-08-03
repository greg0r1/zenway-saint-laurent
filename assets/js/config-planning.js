/* ============================================================
   CONFIG PLANNING — à compléter avec les horaires réels
   Ajoute une ligne par créneau de séance. Exemple :
     { day: "Mardi", time: "18 h 30 – 19 h 45", label: "Séance Zenway · tous niveaux", place: "KMCS, 357 chemin des Iscles, Saint-Laurent-du-Var", note: "Début des cours le 8 septembre" },
   Les champs "place" et "note" sont optionnels.
   Tant que le tableau est vide, un message d'attente s'affiche.
   ============================================================ */
const PLANNING = [
  { day: "Mardi", time: "17 h 45 — 18 h 45", label: "Séance Zenway · tous niveaux", place: "KMCS, 357 chemin des Iscles, Saint-Laurent-du-Var", note: "Début des cours le mardi 8 septembre" },
];

(function setupPlanning(){
  const list = document.getElementById('scheduleList');
  if (!list) return;

  if (!PLANNING.length){
    list.innerHTML = `
      <div class="sheet slot">
        <p class="slot-label">Le planning détaillé sera bientôt publié ici.</p>
        <p class="slot-place">En attendant, contactez Béatrice pour connaître les prochains jours et horaires de séance.</p>
      </div>`;
    return;
  }

  list.innerHTML = PLANNING.map(s => `
    <div class="sheet slot">
      <p class="slot-day">${s.day}</p>
      <p class="slot-time">${s.time}</p>
      <p class="slot-label">${s.label}</p>
      ${s.place ? `<p class="slot-place">${s.place}</p>` : ''}
      ${s.note ? `<p class="slot-start">${s.note}</p>` : ''}
    </div>
  `).join('');
})();
