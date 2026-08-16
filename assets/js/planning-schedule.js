/* ============================================================
   PLANNING-SCHEDULE — section « Planning », alimentée par
   /api/planning/public (voir api/planning/public.js). Si la requête
   échoue, le contenu statique déjà présent dans index.html reste
   affiché tel quel — aucun changement visuel. Si elle réussit, la
   liste renvoyée (triée par l'admin) remplace ce contenu, y compris
   pour afficher le message d'attente si elle est vide.
   ============================================================ */
(function setupPlanning() {
  const list = document.getElementById('scheduleList');
  if (!list) return;

  // Échappe les guillemets et l'apostrophe en plus des chevrons, pour
  // rester sûr en position d'attribut (value="…", src="…") : sans cela,
  // un guillemet dans la donnée referme l'attribut et permet d'en
  // injecter un autre, un gestionnaire d'événement par exemple. Sans
  // effet en contenu textuel, où le parseur rend les entités telles quelles.
  function echapper(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function rendre(slots) {
    if (!slots.length) {
      list.innerHTML = `
        <div class="sheet slot">
          <p class="slot-label">Le planning détaillé sera bientôt publié ici.</p>
          <p class="slot-place">En attendant, contactez Béatrice pour connaître les prochains jours et horaires de séance.</p>
        </div>`;
      return;
    }

    list.innerHTML = slots.map((s) => `
      <div class="sheet slot">
        <p class="slot-day">${echapper(s.day)}</p>
        <p class="slot-time">${echapper(s.time)}</p>
        ${s.label ? `<p class="slot-label">${echapper(s.label)}</p>` : ''}
        ${s.place ? `<p class="slot-place">${echapper(s.place)}</p>` : ''}
        ${s.note ? `<p class="slot-start">${echapper(s.note)}</p>` : ''}
      </div>
    `).join('');
  }

  fetch('/api/planning/public')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data) return;
      rendre(data.slots || []);
    })
    .catch(() => { /* API indisponible : contenu statique par défaut conservé */ });
})();
