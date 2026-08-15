/* ============================================================
   EVENTS-BANNER — section « Événements à venir » et bandeau du haut,
   alimentés par /api/events/public (voir api/events/public.js). Tout
   événement non archivé et non expiré y est publié ; au plus un peut
   en plus être mis en avant dans le bandeau, qui mène alors à sa fiche
   dans la section. Si aucun événement, ou si l'API est indisponible,
   le contenu statique déjà présent dans index.html reste affiché tel
   quel — aucun changement visuel.
   ============================================================ */
(function setupEvents() {
  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  function echapper(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function dateLongue(iso) {
    if (!iso) return null;
    const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
  }

  function carte(event) {
    const date = dateLongue(event.starts_at);
    return `
      <article class="event-card sheet" id="evenement-${echapper(event.id)}">
        ${event.featured ? '<span class="event-card-badge">À la une</span>' : ''}
        ${event.image_url ? `
          <button type="button" class="event-card-image-btn" data-image="${echapper(event.image_url)}" data-titre="${echapper(event.title)}" aria-label="Agrandir l'image de « ${echapper(event.title)} »">
            <img class="event-card-image" src="${echapper(event.image_url)}" alt="" loading="lazy" decoding="async">
          </button>` : ''}
        <div class="event-card-body">
          <p class="event-card-tag">${echapper(event.tag || 'Événement')}</p>
          <h3>${echapper(event.title)}</h3>
          ${date ? `<p class="event-card-date">${echapper(date)}</p>` : ''}
          ${event.description ? `<p class="event-card-desc">${echapper(event.description)}</p>` : ''}
        </div>
      </article>
    `;
  }

  // Fenêtre modale partagée, sur le même principe que assets/js/practice-modals.js.
  // Les écouteurs de fermeture sont posés une seule fois (le dialog est un
  // nœud statique et persistant) : les reposer à chaque ouverture les
  // accumulerait, un seul se déclenchant selon la méthode de fermeture
  // utilisée, les autres restant accrochés indéfiniment.
  let declencheurImage = null;

  function initModaleImage() {
    const modal = document.getElementById('eventImageModal');
    const img = document.getElementById('eventImageModalImg');
    if (!modal || !img) return;

    modal.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });
    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
      img.src = '';
      if (declencheurImage) declencheurImage.focus();
      declencheurImage = null;
    });
  }
  initModaleImage();

  function ouvrirImage(url, titre, declencheur) {
    const modal = document.getElementById('eventImageModal');
    const img = document.getElementById('eventImageModalImg');
    if (!modal || !img) return;

    declencheurImage = declencheur || null;
    img.src = url;
    img.alt = titre || '';
    modal.setAttribute('aria-label', titre ? `Image de l'événement « ${titre} »` : "Image de l'événement");
    document.body.style.overflow = 'hidden';
    if (!modal.open) modal.showModal();
  }

  fetch('/api/events/public')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const events = (data && data.events) || [];
      if (!events.length) return;

      const grid = document.getElementById('eventsGrid');
      const vide = document.getElementById('eventsEmpty');
      if (grid) {
        grid.innerHTML = events.map(carte).join('');
        if (vide) vide.hidden = true;
        grid.querySelectorAll('.event-card-image-btn').forEach((btn) => {
          btn.addEventListener('click', () => ouvrirImage(btn.dataset.image, btn.dataset.titre, btn));
        });
      }

      const vedette = events.find((ev) => ev.featured);
      if (!vedette) return;

      const banner = document.getElementById('eventBanner');
      const bannerTag = document.getElementById('eventBannerTag');
      const bannerTitle = document.getElementById('eventBannerTitle');
      if (banner && bannerTag && bannerTitle) {
        bannerTag.textContent = vedette.tag || 'Prochain événement';
        bannerTitle.textContent = vedette.title;
        banner.href = `#evenement-${vedette.id}`;
        banner.hidden = false;
      }
    })
    .catch(() => { /* API indisponible : contenu statique par défaut conservé */ });
})();
