/* ============================================================
   CONFIG PLANNING — à compléter avec les horaires réels
   Ajoute une ligne par créneau de séance. Exemple :
     { day: "Mardi", time: "18 h 30 – 19 h 45", label: "Séance Zenway · tous niveaux" },
   Tant que le tableau est vide, un message d'attente s'affiche
   avec une invitation à contacter Béatrice.
   ============================================================ */
const PLANNING = [
  { day: "Mardi", time: "17 h 45 – 18 h 45", label: "Séance Zenway · tous niveaux" },
];

(function setupPlanning(){
  const list = document.getElementById('scheduleList');
  if (!list) return;

  if (!PLANNING.length){
    list.innerHTML = `
      <div class="schedule-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
        <p>Le planning détaillé sera bientôt publié ici. En attendant, contactez Béatrice pour connaître les prochains jours et horaires de séance.</p>
      </div>`;
    return;
  }

  list.innerHTML = PLANNING.map(s => `
    <div class="schedule-item">
      <div class="schedule-day"><div class="d1">${s.day.slice(0,3)}</div><div class="d2">${s.day}</div></div>
      <div class="schedule-info">
        <div class="lab">${s.label}</div>
        <div class="time">${s.time}</div>
        <div class="loc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>KMCS · 357 chemin des Iscles</div>
      </div>
    </div>
  `).join('');
})();
