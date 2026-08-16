/* ============================================================
   ADMIN-DASHBOARD — page « Tableau de bord » : ce que le site
   publie en ce moment, ligne par ligne, avec le renvoi vers la
   page qui commande chaque chose. Aucune donnée propre : elle lit
   les magasins des événements et du planning.
   S'enregistre dans window.AdminModules, monté par assets/js/admin.js.
   ============================================================ */
(function registerDashboardPage() {
  let root = null;
  let page = null;
  let desabonner = null;
  let desabonnerPlanning = null;
  let dernierSnap = null;
  let dernierSnapPlanning = null;

  function icone(id, classe) {
    return `<svg class="ad-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function echapper(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function mount(container, api) {
    root = container;
    page = api;

    page.setActions([
      {
        label: 'Voir le site public',
        icone: 'i-external',
        style: 'ad-btn-line',
        onClick: () => window.open('../index.html', '_blank', 'noopener')
      }
    ]);

    root.innerHTML = `
      <p class="ad-lede">Ce que le site publie en ce moment. Chaque ligne renvoie à la page qui la commande.</p>
      <div data-slot="etat"></div>
      <section class="ad-box">
        <h2 class="ad-box-title">Que voulez-vous faire ?</h2>
        <div class="ad-rows">
          <button type="button" class="ad-row" data-go="nouveau">
            ${icone('i-plus', 'ad-ico-lg')}
            <span><strong>Annoncer un événement</strong>Portes ouvertes, rencontre, séance exceptionnelle</span>
            ${icone('i-arrow')}
          </button>
          <a class="ad-row" href="#/events">
            ${icone('i-calendar', 'ad-ico-lg')}
            <span><strong>Gérer les événements</strong>Modifier, archiver, remettre en ligne</span>
            ${icone('i-arrow')}
          </a>
          <a class="ad-row" href="#/infos">
            ${icone('i-pin', 'ad-ico-lg')}
            <span><strong>Vérifier les infos pratiques</strong>Adresse, téléphone, prochain rendez-vous</span>
            ${icone('i-arrow')}
          </a>
        </div>
      </section>
    `;

    root.querySelector('[data-go="nouveau"]').addEventListener('click', () => {
      if (window.AdminEventsActions) window.AdminEventsActions.nouveau();
    });

    desabonner = AdminStore.abonner(rendre);
    AdminStore.charger();
    desabonnerPlanning = AdminStore.abonnerPlanning((snap) => {
      dernierSnapPlanning = snap;
      rendre(dernierSnap);
    });
    AdminStore.chargerPlanning();
  }

  function unmount() {
    if (desabonner) desabonner();
    desabonner = null;
    if (desabonnerPlanning) desabonnerPlanning();
    desabonnerPlanning = null;
    root = null;
    page = null;
    dernierSnap = null;
    dernierSnapPlanning = null;
  }

  function rendre(snap) {
    dernierSnap = snap;
    if (!root || !snap) return;
    const cible = root.querySelector('[data-slot="etat"]');

    if (snap.statut === 'chargement' || snap.statut === 'attente') {
      cible.innerHTML = `
        <section class="ad-box">
          <h2 class="ad-box-title">État du site</h2>
          <div class="ad-skeleton" aria-hidden="true">
            ${[62, 48, 55].map((w) => `<div class="ad-skeleton-bar" style="width:${w}%"></div>`).join('')}
          </div>
          <p class="ad-sr" role="status">Lecture de l’état du site.</p>
        </section>
      `;
      return;
    }

    if (snap.statut === 'erreur') {
      cible.innerHTML = `
        <section class="ad-box">
          <h2 class="ad-box-title">État du site</h2>
          <div class="ad-alert" role="alert">
            ${icone('i-alert')}
            <div>
              L’état du site n’a pas pu être lu.
              <div class="ad-alert-actions">
                <button type="button" class="ad-btn ad-btn-line ad-btn-sm" data-action="retry">Réessayer</button>
              </div>
            </div>
          </div>
        </section>
      `;
      cible.querySelector('[data-action="retry"]').addEventListener('click', () => AdminStore.charger());
      return;
    }

    const vedette = snap.vedette;
    const seance = (dernierSnapPlanning && dernierSnapPlanning.slots[0]) || null;
    const publies = snap.enLigne.length;

    cible.innerHTML = `
      <section class="ad-box">
        <h2 class="ad-box-title">État du site</h2>
        <dl class="ad-facts">

          <div class="ad-fact">
            <dt>Mis en avant dans le bandeau</dt>
            <dd>
              ${vedette ? `
                <span class="ad-pill ad-pill-live">${icone('i-eye')}En avant</span>
                <b>${echapper(vedette.title)}</b>
                <small>${vedette.starts_at
                  ? `${echapper(AdminStore.dateLongue(vedette.starts_at))} · ${echapper(AdminStore.quand(vedette.starts_at))}`
                  : 'Aucune date renseignée'}</small>
              ` : `
                <span class="ad-pill">${icone('i-eye-off')}Rien en avant</span>
                <small>Le bandeau en haut du site est masqué. Les événements publiés restent visibles dans leur section.</small>
              `}
            </dd>
            <a class="ad-fact-go" href="#/events">Gérer${icone('i-arrow')}</a>
          </div>

          <div class="ad-fact">
            <dt>Prochaine séance</dt>
            <dd>
              ${seance ? `
                <b>${echapper(seance.day)} ${echapper(seance.time)}</b>
                <small>${echapper(seance.place || seance.label || '')}</small>
              ` : `
                <span class="ad-pill">Aucun créneau</span>
                <small>Le site invite les visiteurs à vous contacter pour connaître les horaires.</small>
              `}
            </dd>
            <a class="ad-fact-go" href="#/planning">Voir${icone('i-arrow')}</a>
          </div>

          <div class="ad-fact">
            <dt>Événements publiés</dt>
            <dd>
              <b>${publies} ${publies > 1 ? 'événements visibles sur le site' : 'événement visible sur le site'}</b>
              <small>${snap.archives.length
                ? `${snap.archives.length} ${snap.archives.length > 1 ? 'autres sont archivés' : 'autre est archivé'} et ${snap.archives.length > 1 ? 'n\'apparaissent' : 'n\'apparaît'} plus sur le site.`
                : 'Aucun événement archivé.'}</small>
            </dd>
            <a class="ad-fact-go" href="#/events">Gérer${icone('i-arrow')}</a>
          </div>

        </dl>
      </section>
    `;
  }

  window.AdminModules = window.AdminModules || [];
  window.AdminModules.push({
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: 'i-home',
    title: 'Tableau de bord',
    mount,
    unmount
  });
})();
