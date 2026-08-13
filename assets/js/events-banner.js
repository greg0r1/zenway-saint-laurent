/* ============================================================
   EVENTS-BANNER — bandeau + section « événements », alimentés par
   /api/events/active (voir api/events/active.js). Si aucun événement
   actif, ou si l'API est indisponible, le contenu statique déjà présent
   dans index.html reste affiché tel quel — aucun changement visuel.
   ============================================================ */
(function setupEvents() {
  fetch('/api/events/active')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const event = data && data.event;
      if (!event) return;

      const banner = document.getElementById('eventBanner');
      const bannerTag = document.getElementById('eventBannerTag');
      const bannerTitle = document.getElementById('eventBannerTitle');
      if (banner && bannerTag && bannerTitle) {
        bannerTag.textContent = event.tag || 'Prochain événement';
        bannerTitle.textContent = event.title;
        banner.href = event.link_url;
        banner.hidden = false;
      }

      const asideTag = document.getElementById('eventAsideTag');
      const asideTitle = document.getElementById('eventAsideTitle');
      const asideDesc = document.getElementById('eventAsideDesc');
      const asideLink = document.getElementById('eventAsideLink');
      if (asideTag && asideTitle && asideDesc && asideLink) {
        asideTag.textContent = event.tag || 'Prochain événement';
        asideTitle.textContent = event.title;
        asideDesc.textContent = event.description || '';
        asideLink.textContent = "S'inscrire à l'événement";
        asideLink.href = event.link_url;
        asideLink.target = '_blank';
        asideLink.rel = 'noopener';
      }
    })
    .catch(() => { /* API indisponible : contenu statique par défaut conservé */ });
})();
