/* ============================================================
   ÉVÉNEMENTS — liste, bandeau d'annonce, agrandissement d'image et
   « Prochain rendez-vous » (section « Infos pratiques »), tous
   alimentés par /api/events/public (module « Événements » de l'admin).
   « Prochain rendez-vous » n'est pas une valeur saisie à la main : ce
   fichier la calcule pour ne jamais désynchroniser d'avec la liste
   des événements.
   ============================================================ */
(function evenements() {
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

  const MOIS = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre'
  ];

  function dateLongue(iso) {
    if (!iso) return null;
    const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
  }

  // L'ancre porte l'identifiant de l'événement : c'est elle que vise le
  // bandeau d'annonce, qui n'a pas d'autre moyen de désigner la fiche.
  function ligneEvenement(ev) {
    const date = dateLongue(ev.starts_at);
    const image = ev.image_url
      ? `<button type="button" class="r-evt-image" data-image="${echapper(ev.image_url)}" data-titre="${echapper(ev.title)}">
          <img src="${echapper(ev.image_url)}" alt="" loading="lazy" decoding="async">
          <span class="r-vh">Agrandir l'image de l'événement « ${echapper(ev.title)} »</span>
        </button>`
      : '';
    return `
      <article class="r-evt" id="evenement-${echapper(ev.id)}">
        <span class="r-evt-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-calendrier"/></svg></span>
        <div>
          <h3>${date ? `<span class="r-evt-date">${echapper(date)}</span> · ` : ''}${echapper(ev.title)}</h3>
          ${ev.description ? `<p>${echapper(ev.description)}</p>` : ''}
          ${image}
          ${ev.featured ? '<span class="r-evt-tag">À la une</span>' : ''}
        </div>
      </article>`;
  }

  /* ---------- Agrandissement de l'image ----------
     Les écouteurs de fermeture sont posés une seule fois : le dialog est
     un nœud statique et persistant, les reposer à chaque ouverture les
     accumulerait. */
  let declencheur = null;

  const modale = document.getElementById('eventImageModal');
  const zoneImage = document.getElementById('eventImageModalZone');

  if (modale && zoneImage) {
    modale.querySelector('.r-modal-close')?.addEventListener('click', () => modale.close());
    modale.addEventListener('click', (e) => {
      if (e.target === modale) modale.close();
    });
    modale.addEventListener('close', () => {
      document.documentElement.classList.remove('r-noscroll');
      zoneImage.innerHTML = '';
      if (declencheur) declencheur.focus();
      declencheur = null;
    });
  }

  function ouvrirImage(url, titre, bouton) {
    if (!modale || !zoneImage) return;
    declencheur = bouton || null;
    zoneImage.innerHTML = `<img src="${echapper(url)}" alt="${echapper(titre || '')}">`;
    modale.setAttribute(
      'aria-label',
      titre ? `Image de l'événement « ${titre} »` : "Image de l'événement"
    );
    document.documentElement.classList.add('r-noscroll');
    if (!modale.open) modale.showModal();
  }

  fetch('/api/events/public')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const events = (data && data.events) || [];

      if (events.length) {
        const liste = document.getElementById('eventsGrid');
        const vide = document.getElementById('eventsEmpty');
        if (liste) {
          liste.innerHTML = events.map(ligneEvenement).join('');
          if (vide) vide.hidden = true;
          liste.querySelectorAll('.r-evt-image').forEach((btn) => {
            btn.addEventListener('click', () => ouvrirImage(btn.dataset.image, btn.dataset.titre, btn));
          });
        }
      }

      // Le bandeau n'annonce que l'événement mis en avant depuis l'admin,
      // et reste masqué s'il n'y en a aucun.
      const vedette = events.find((ev) => ev.featured);
      if (vedette) {
        const bandeau = document.getElementById('eventBanner');
        const tag = document.getElementById('eventBannerTag');
        const titre = document.getElementById('eventBannerTitle');
        if (bandeau && tag && titre) {
          tag.textContent = vedette.tag || 'Prochain événement';
          titre.textContent = vedette.title;
          bandeau.href = `#evenement-${vedette.id}`;
          bandeau.hidden = false;
          document.documentElement.classList.add('a-bandeau');
        }
      }

      // « Prochain rendez-vous » (section « Infos pratiques ») : le premier
      // événement dont la date n'est pas déjà passée, dans cette même liste
      // déjà triée par date croissante (voir api/events/public.js) — pas de
      // second appel réseau, pas de second tri. Comparaison en chaînes
      // AAAA-MM-JJ, valide pour l'ordre comme pour l'égalité.
      const aujourdhui = new Date().toISOString().slice(0, 10);
      const prochain = events.find((ev) => ev.starts_at && ev.starts_at.slice(0, 10) >= aujourdhui);
      const ligneProchain = document.querySelector('[data-info-row="next_session"]');
      const cibleProchain = document.querySelector('[data-info="next_session"]');
      if (ligneProchain && cibleProchain) {
        if (prochain) {
          const date = dateLongue(prochain.starts_at);
          cibleProchain.textContent = date ? `${date} · ${prochain.title}` : prochain.title;
          ligneProchain.hidden = false;
        } else {
          ligneProchain.hidden = true;
        }
      }
    })
    .catch(() => {
      /* API indisponible : l'état vide reste affiché */
    });
})();
