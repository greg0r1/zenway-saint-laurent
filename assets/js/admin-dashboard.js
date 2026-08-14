/* ============================================================
   ADMIN-DASHBOARD — la première feuille de l'atelier : ce que le
   site publie en ce moment, d'un seul regard. Aucune donnée propre :
   elle lit le magasin des événements et la config du planning, et
   renvoie vers la feuille qui commande chaque chose.
   S'enregistre dans window.AdminModules, monté par assets/js/admin.js.
   ============================================================ */
(function registerDashboardModule() {
  let root = null;
  let sheet = null;
  let desabonner = null;

  function icone(id, classe) {
    return `<svg class="bo-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function echapper(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* L'unique ornement de l'atelier : les ondes du bain, tracées une fois
     en haut de cette feuille. Elles ne portent aucune information et
     restent sous le texte. */
  function ondes() {
    return `
      <svg class="bo-ondes" viewBox="0 0 320 160" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="248" cy="34" r="22" opacity="0.55" />
          <circle cx="248" cy="34" r="44" opacity="0.4" />
          <circle cx="248" cy="34" r="70" opacity="0.28" />
          <circle cx="248" cy="34" r="100" opacity="0.16" />
          <circle cx="248" cy="34" r="134" opacity="0.08" />
        </g>
        <path d="M248 22c7 5 7 13 0 18-7 5-7 13 0 18" fill="none" stroke="currentColor"
          stroke-width="1.5" stroke-linecap="round" opacity="0.5" />
      </svg>
    `;
  }

  function mount(container, api) {
    root = container;
    sheet = api;
    root.innerHTML = `${ondes()}<div data-slot="cartes"></div>`;
    desabonner = AdminStore.abonner(rendre);
    AdminStore.charger();
  }

  function unmount() {
    if (desabonner) desabonner();
    desabonner = null;
    root = null;
    sheet = null;
  }

  function creneaux() {
    // PLANNING est un `const` de portée script : il ne vit pas sur window.
    return (typeof PLANNING !== 'undefined' && Array.isArray(PLANNING)) ? PLANNING : [];
  }

  function rendre(snap) {
    if (!root) return;
    const cible = root.querySelector('[data-slot="cartes"]');
    const seances = creneaux();

    if (snap.statut === 'chargement' || snap.statut === 'attente') {
      cible.innerHTML = `
        <div class="bo-grid" aria-hidden="true">
          ${[0, 1, 2, 3].map(() => `
            <div class="bo-card bo-card-vide">
              <div class="bo-skeleton-bar" style="width:42%"></div>
              <div class="bo-skeleton-bar" style="width:78%;height:20px"></div>
              <div class="bo-skeleton-bar" style="width:58%"></div>
            </div>
          `).join('')}
        </div>
        <p class="visually-hidden" role="status">Lecture de l'état du site.</p>
      `;
      sheet.setState({ live: false, short: '…', text: 'Lecture de l’état du site en cours' });
      return;
    }

    if (snap.statut === 'erreur') {
      cible.innerHTML = `
        <div class="bo-alert" role="alert">
          ${icone('i-alert')}
          <div>
            L’état du site n’a pas pu être lu.
            <div class="bo-alert-actions">
              <button type="button" class="bo-btn bo-btn-line bo-btn-sm" data-action="retry">Réessayer</button>
            </div>
          </div>
        </div>
      `;
      cible.querySelector('[data-action="retry"]').addEventListener('click', () => AdminStore.charger());
      sheet.setState({ live: false, short: 'inconnu', text: 'État du site inconnu' });
      return;
    }

    const enLigne = snap.enLigne;
    const prochaine = seances[0] || null;

    sheet.setState(enLigne
      ? { live: true, short: '1 événement', text: `Le site annonce « ${enLigne.title} »` }
      : { live: false, short: 'rien à l’affiche', text: 'Le site n’annonce aucun événement en ce moment' });

    cible.innerHTML = `
      <div class="bo-grid">
        ${carteEvenement(enLigne)}
        ${carteSeance(prochaine)}
        ${carteReserve(snap)}
        ${carteSite()}
      </div>

      <div class="bo-block">
        <h3 class="bo-block-title">Que voulez-vous faire ?</h3>
        <div class="bo-quick">
          <button type="button" class="bo-quick-item" data-go="nouveau">
            ${icone('i-plus', 'bo-ico-lg')}
            <span><strong>Annoncer un événement</strong>Portes ouvertes, rencontre, séance exceptionnelle</span>
            ${icone('i-arrow')}
          </button>
          <a class="bo-quick-item" href="#sheet-events">
            ${icone('i-calendar', 'bo-ico-lg')}
            <span><strong>Gérer les événements</strong>Modifier, archiver, remettre en ligne</span>
            ${icone('i-arrow')}
          </a>
          <a class="bo-quick-item" href="#sheet-infos">
            ${icone('i-pin', 'bo-ico-lg')}
            <span><strong>Vérifier les infos pratiques</strong>Adresse, téléphone, prochain rendez-vous</span>
            ${icone('i-arrow')}
          </a>
        </div>
      </div>
    `;

    const nouveau = cible.querySelector('[data-go="nouveau"]');
    if (nouveau) {
      nouveau.addEventListener('click', () => {
        if (window.AdminEventsActions) window.AdminEventsActions.nouveau();
      });
    }
  }

  function carteEvenement(ev) {
    if (!ev) {
      return `
        <article class="bo-card">
          <p class="bo-card-label">${icone('i-eye-off')}À l'affiche</p>
          <p class="bo-card-value bo-card-value-muet">Rien en ce moment</p>
          <p class="bo-card-note">Le bandeau et la section « Événements à venir » sont masqués sur le site.</p>
        </article>
      `;
    }
    const quand = ev.starts_at ? AdminStore.quand(ev.starts_at) : null;
    return `
      <article class="bo-card bo-card-live">
        <p class="bo-card-label">${icone('i-eye')}À l'affiche</p>
        <p class="bo-card-value">${echapper(ev.title)}</p>
        <p class="bo-card-note">
          ${ev.starts_at
            ? `${echapper(AdminStore.dateLongue(ev.starts_at))} · ${echapper(quand)}`
            : 'Aucune date renseignée pour cet événement.'}
        </p>
      </article>
    `;
  }

  function carteSeance(slot) {
    if (!slot) {
      return `
        <article class="bo-card">
          <p class="bo-card-label">${icone('i-clock')}Prochaine séance</p>
          <p class="bo-card-value bo-card-value-muet">Aucun créneau</p>
          <p class="bo-card-note">Le site invite les visiteurs à vous contacter pour connaître les horaires.</p>
        </article>
      `;
    }
    return `
      <article class="bo-card">
        <p class="bo-card-label">${icone('i-clock')}Prochaine séance</p>
        <p class="bo-card-value">${echapper(slot.day)} ${echapper(slot.time)}</p>
        <p class="bo-card-note">${echapper(slot.place || slot.label || '')}</p>
      </article>
    `;
  }

  function carteReserve(snap) {
    const reserve = snap.courants.filter((ev) => !ev.active).length;
    const archives = snap.archives.length;
    return `
      <article class="bo-card">
        <p class="bo-card-label">${icone('i-layers')}En réserve</p>
        <p class="bo-card-value">${reserve} ${reserve > 1 ? 'événements prêts' : 'événement prêt'}</p>
        <p class="bo-card-note">
          ${archives
            ? `${archives} ${archives > 1 ? 'autres sont archivés et n\'apparaissent plus' : 'autre est archivé et n\'apparaît plus'} dans la liste courante.`
            : 'Aucun événement archivé.'}
        </p>
      </article>
    `;
  }

  function carteSite() {
    return `
      <article class="bo-card">
        <p class="bo-card-label">${icone('i-globe')}Le site public</p>
        <p class="bo-card-value">zenwaysaintlaurentduvar.fr</p>
        <p class="bo-card-note">
          <a class="bo-card-link" href="../index.html" target="_blank" rel="noopener">
            Ouvrir le site dans un nouvel onglet ${icone('i-external')}
          </a>
        </p>
      </article>
    `;
  }

  window.AdminModules = window.AdminModules || [];
  window.AdminModules.push({
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: 'i-home',
    summary: 'Ce que le site publie en ce moment, et par où commencer.',
    mount,
    unmount
  });
})();
