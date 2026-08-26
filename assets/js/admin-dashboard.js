/* ============================================================
   ADMIN-DASHBOARD — page « Tableau de bord » : ce que le site
   publie en ce moment, carte par carte, avec le renvoi vers la
   page qui commande chaque chose. Aucune donnée propre : elle lit
   les trois magasins (événements, planning, infos pratiques).

   La grille reprend celle de la maquette épinglée : trois cartes de
   résumé en haut, le tableau des séances et les actions au milieu,
   deux cartes de rappel et l'illustration en bas. Chaque carte se
   remplit à l'arrivée de son magasin, indépendamment des autres.

   S'enregistre dans window.AdminModules, monté par assets/js/admin.js.
   ============================================================ */
(function registerDashboardPage() {
  let root = null;
  let page = null;
  let desabonner = null;
  let desabonnerPlanning = null;
  let desabonnerInfos = null;

  function icone(id, classe) {
    return `<svg class="ad-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

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

  function squelette(largeurs) {
    return `
      <div class="ad-skeleton" aria-hidden="true">
        ${largeurs.map((w) => `<div class="ad-skeleton-bar" style="width:${w}%"></div>`).join('')}
      </div>
      <p class="ad-sr" role="status">Lecture en cours.</p>
    `;
  }

  function panne(message, action) {
    return `
      <div class="ad-alert" role="alert">
        ${icone('i-alert')}
        <div>
          ${message}
          <div class="ad-alert-actions">
            <button type="button" class="ad-btn ad-btn-line ad-btn-sm" data-action="${action}">Réessayer</button>
          </div>
        </div>
      </div>
    `;
  }

  function slot(nom) {
    return root ? root.querySelector(`[data-slot="${nom}"]`) : null;
  }

  /* ---------------------------------------------------------------
     Montage
     --------------------------------------------------------------- */

  function mount(container, api) {
    root = container;
    page = api;

    // La déconnexion vit dans l'en-tête de la coquille, et « Voir le site
    // public » dans le pied de la barre latérale : le tableau de bord
    // n'a pas d'action propre en haut à droite.
    page.setActions([]);

    // Pas de phrase d'ouverture ici, contrairement aux autres pages : sur le
    // tableau de bord, ce sont les cartes elles-mêmes qui disent ce que le
    // site publie — c'est la forme de la maquette, et elle sert la règle
    // « chaque page déclare ce qu'elle commande » mieux qu'un chapeau.
    root.innerHTML = `
      <div class="ad-dash">

        <section class="ad-box ad-stat ad-dash-4">
          ${feuille()}
          <h2 class="ad-box-title">Événements publiés</h2>
          <div data-slot="compte"></div>
        </section>

        <section class="ad-box ad-dash-4">
          <div class="ad-card-head">
            <h2 class="ad-box-title">Événements à venir</h2>
            <a class="ad-card-go" href="#/events">Voir tout${icone('i-arrow')}</a>
          </div>
          <div data-slot="avenir"></div>
        </section>

        <section class="ad-box ad-figure ad-dash-4">
          <div class="ad-card-head">
            <h2 class="ad-box-title">Prochaine séance</h2>
            <a class="ad-card-go" href="#/planning">Planning${icone('i-arrow')}</a>
          </div>
          <div data-slot="prochaine"></div>
          ${onde()}
        </section>

        <section class="ad-box ad-dash-7">
          <div class="ad-card-head">
            <h2 class="ad-box-title">Séances de la semaine</h2>
            <a class="ad-card-go" href="#/planning">Gérer${icone('i-arrow')}</a>
          </div>
          <div data-slot="seances"></div>
        </section>

        <section class="ad-box ad-dash-5">
          <h2 class="ad-box-title">Que voulez-vous faire ?</h2>
          <div class="ad-acts">
            <div class="ad-act">
              ${icone('i-plus', 'ad-ico-lg')}
              <div class="ad-act-body">
                <b>Annoncer un événement</b>
                <small>Portes ouvertes, rencontre, séance exceptionnelle</small>
              </div>
              <button type="button" class="ad-btn ad-btn-primary ad-btn-sm" data-go="nouveau">Ajouter</button>
            </div>
            <div class="ad-act">
              ${icone('i-clock', 'ad-ico-lg')}
              <div class="ad-act-body">
                <b>Corriger un horaire</b>
                <small>Jour, heure et lieu des séances</small>
              </div>
              <a class="ad-btn ad-btn-soft ad-btn-sm" href="#/planning">Ouvrir</a>
            </div>
            <div class="ad-act">
              ${icone('i-pin', 'ad-ico-lg')}
              <div class="ad-act-body">
                <b>Vérifier les infos pratiques</b>
                <small>Adresse, parking, téléphone, e-mail</small>
              </div>
              <a class="ad-btn ad-btn-soft ad-btn-sm" href="#/infos">Ouvrir</a>
            </div>
          </div>
        </section>

        <section class="ad-box ad-dash-5">
          <div class="ad-card-head">
            <h2 class="ad-box-title">Bandeau d'annonce</h2>
            <a class="ad-btn ad-btn-primary ad-btn-sm" href="#/events">Gérer</a>
          </div>
          <div data-slot="bandeau"></div>
        </section>

        <section class="ad-box ad-dash-4">
          <div class="ad-card-head">
            <h2 class="ad-box-title">Infos pratiques</h2>
            <a class="ad-btn ad-btn-primary ad-btn-sm" href="#/infos">Modifier</a>
          </div>
          <div data-slot="infos"></div>
        </section>

        <aside class="ad-dash-illus ad-dash-3">
          <img
            src="../assets/img/admin/illustration-tableau-de-bord.webp"
            alt=""
            width="927"
            height="627"
            loading="lazy"
          />
        </aside>

      </div>
    `;

    root.querySelector('[data-go="nouveau"]').addEventListener('click', () => {
      if (window.AdminEventsActions) window.AdminEventsActions.nouveau();
    });

    desabonner = AdminStore.abonner(rendreEvents);
    AdminStore.charger();
    desabonnerPlanning = AdminStore.abonnerPlanning(rendrePlanning);
    AdminStore.chargerPlanning();
    desabonnerInfos = AdminStore.abonnerInfos(rendreInfos);
    AdminStore.chargerInfos();
  }

  function unmount() {
    if (desabonner) desabonner();
    desabonner = null;
    if (desabonnerPlanning) desabonnerPlanning();
    desabonnerPlanning = null;
    if (desabonnerInfos) desabonnerInfos();
    desabonnerInfos = null;
    root = null;
    page = null;
  }

  /* ---------------------------------------------------------------
     Ornements — dessinés ici, dans la grammaire au trait du site
     --------------------------------------------------------------- */

  /* Le filigrane de la carte teintée : deux feuilles, comme celles des
     bandes du site public, mais pleines et très pâles. */
  function feuille() {
    return `
      <svg class="ad-stat-leaf" viewBox="0 0 160 160" aria-hidden="true" focusable="false">
        <path d="M96 14c34 30 40 82 4 128-40-42-38-94-4-128Z" />
        <path d="M38 62c34 8 56 40 58 84-40 2-64-30-58-84Z" opacity=".6" />
      </svg>
    `;
  }

  /* La courbe du pied de la carte « Prochaine séance » : une onde, la
     même figure que la coupure des bandes du site public. */
  function onde() {
    return `
      <svg class="ad-wave" viewBox="0 0 400 64" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path
          d="M0 46C34 46 44 26 76 26s44 16 76 12 46-24 78-22 44 18 76 16 62-12 94-16v48H0Z"
          fill="var(--ad-accent-field)"
        />
        <path
          d="M0 46C34 46 44 26 76 26s44 16 76 12 46-24 78-22 44 18 76 16 62-12 94-16"
          fill="none"
          stroke="var(--ad-accent)"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>
    `;
  }

  /* ---------------------------------------------------------------
     Les cartes qui lisent le magasin des événements
     --------------------------------------------------------------- */

  function rendreEvents(snap) {
    if (!root || !snap) return;
    const compte = slot('compte');
    const avenir = slot('avenir');
    const bandeau = slot('bandeau');

    if (snap.statut === 'chargement' || snap.statut === 'attente') {
      compte.innerHTML = squelette([46, 70]);
      avenir.innerHTML = squelette([80, 64, 72]);
      bandeau.innerHTML = squelette([70, 52]);
      return;
    }

    if (snap.statut === 'erreur') {
      const message = 'Les événements n’ont pas pu être lus.';
      compte.innerHTML = panne(message, 'retry-events');
      avenir.innerHTML = panne(message, 'retry-events');
      bandeau.innerHTML = panne(message, 'retry-events');
      root.querySelectorAll('[data-action="retry-events"]').forEach((btn) => {
        btn.addEventListener('click', () => AdminStore.charger());
      });
      return;
    }

    // --- Le compte, dans la carte teintée
    const publies = snap.enLigne.length;
    compte.innerHTML = `
      <div class="ad-stat-n">${publies}</div>
      <p class="ad-stat-sub">${
        publies
          ? `${publies > 1 ? 'visibles' : 'visible'} dans la section « Événements à venir » du site.`
          : 'La section « Événements à venir » du site reste vide.'
      }</p>
      <button type="button" class="ad-btn ad-btn-primary ad-btn-sm" data-go="nouveau">
        ${icone('i-plus')}<span>Annoncer un événement</span>
      </button>
    `;
    compte.querySelector('[data-go="nouveau"]').addEventListener('click', () => {
      if (window.AdminEventsActions) window.AdminEventsActions.nouveau();
    });

    // --- Les trois prochains, en liste
    const prochains = snap.enLigne
      .filter((ev) => ev.starts_at && !AdminStore.estPasse(ev.starts_at))
      .sort((a, b) => String(a.starts_at).localeCompare(String(b.starts_at)))
      .slice(0, 3);

    avenir.innerHTML = prochains.length
      ? `<ul class="ad-list">${prochains
          .map(
            (ev) => `
              <li>
                <span class="ad-dot"></span>
                <span class="ad-list-label">${echapper(ev.title)}</span>
                <span class="ad-list-meta">${echapper(AdminStore.quand(ev.starts_at))}</span>
              </li>
            `
          )
          .join('')}</ul>`
      : `
        <div class="ad-empty">
          <div class="ad-empty-title">Aucune date à venir</div>
          <p>Les événements publiés sans date restent visibles, mais le site ne peut pas annoncer quand ils ont lieu.</p>
        </div>
      `;

    // --- Le bandeau d'annonce
    const vedette = snap.vedette;
    bandeau.innerHTML = vedette
      ? `
        <ul class="ad-list">
          <li>
            <span class="ad-pill ad-pill-live">${icone('i-eye')}En avant</span>
            <span class="ad-list-label">${echapper(vedette.title)}</span>
          </li>
          <li>
            <span class="ad-dot"></span>
            <span class="ad-list-label">${
              vedette.starts_at
                ? echapper(AdminStore.dateLongue(vedette.starts_at))
                : 'Aucune date renseignée'
            }</span>
            <span class="ad-list-meta">${
              vedette.starts_at ? echapper(AdminStore.quand(vedette.starts_at)) : ''
            }</span>
          </li>
        </ul>
      `
      : `
        <ul class="ad-list">
          <li>
            <span class="ad-pill">${icone('i-eye-off')}Rien en avant</span>
            <span class="ad-list-label">Le bandeau du site est masqué</span>
          </li>
          <li>
            <span class="ad-dot"></span>
            <span class="ad-list-label">Les événements publiés restent visibles dans leur section.</span>
          </li>
        </ul>
      `;
  }

  /* ---------------------------------------------------------------
     Les cartes qui lisent le magasin du planning
     --------------------------------------------------------------- */

  function rendrePlanning(snap) {
    if (!root || !snap) return;
    const prochaine = slot('prochaine');
    const seances = slot('seances');

    if (snap.statut === 'chargement' || snap.statut === 'attente') {
      prochaine.innerHTML = squelette([58, 76]);
      seances.innerHTML = squelette([90, 74, 82]);
      return;
    }

    if (snap.statut === 'erreur') {
      const message = 'Le planning n’a pas pu être lu.';
      prochaine.innerHTML = panne(message, 'retry-planning');
      seances.innerHTML = panne(message, 'retry-planning');
      root.querySelectorAll('[data-action="retry-planning"]').forEach((btn) => {
        btn.addEventListener('click', () => AdminStore.chargerPlanning());
      });
      return;
    }

    const premier = snap.slots[0] || null;
    prochaine.innerHTML = premier
      ? `
        <div class="ad-figure-n">${echapper(premier.day)} ${echapper(premier.time)}</div>
        <p class="ad-figure-sub">${echapper(premier.place || premier.label || 'Lieu non précisé')}</p>
      `
      : `
        <div class="ad-figure-n">Aucun créneau</div>
        <p class="ad-figure-sub">Le site invite les visiteurs à vous contacter pour connaître les horaires.</p>
      `;

    seances.innerHTML = snap.slots.length
      ? `
        <div class="ad-tablewrap">
          <table class="ad-table">
            <thead>
              <tr>
                <th scope="col">Jour</th>
                <th scope="col">Horaire</th>
                <th scope="col">Lieu</th>
                <th scope="col" class="ad-col-btn">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${snap.slots
                .map(
                  (slotItem) => `
                    <tr>
                      <td><b>${echapper(slotItem.day)}</b></td>
                      <td>${echapper(slotItem.time)}</td>
                      <td>${echapper(slotItem.place || slotItem.label || '—')}</td>
                      <td class="ad-col-btn">
                        <a class="ad-btn ad-btn-primary ad-btn-sm" href="#/planning">Gérer</a>
                      </td>
                    </tr>
                  `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `
      : `
        <div class="ad-empty">
          <div class="ad-empty-title">Aucun créneau enregistré</div>
          <p>La section « Planning » du site invite les visiteurs à vous contacter pour connaître les horaires.</p>
          <div class="ad-empty-cta">
            <a class="ad-btn ad-btn-primary ad-btn-sm" href="#/planning">Ajouter un créneau</a>
          </div>
        </div>
      `;
  }

  /* ---------------------------------------------------------------
     La carte qui lit le magasin des infos pratiques
     --------------------------------------------------------------- */

  function rendreInfos(snap) {
    if (!root || !snap) return;
    const cible = slot('infos');

    if (snap.statut === 'chargement' || snap.statut === 'attente') {
      cible.innerHTML = squelette([84, 60, 72]);
      return;
    }

    if (snap.statut === 'erreur') {
      cible.innerHTML = panne('Les infos pratiques n’ont pas pu être lues.', 'retry-infos');
      cible
        .querySelector('[data-action="retry-infos"]')
        .addEventListener('click', () => AdminStore.chargerInfos());
      return;
    }

    if (!snap.infos) {
      cible.innerHTML = `
        <div class="ad-empty">
          <div class="ad-empty-title">Aucune fiche en base</div>
          <p>Le site affiche en attendant le contenu écrit dans <code>index.html</code>.</p>
        </div>
      `;
      return;
    }

    const i = snap.infos;
    // La ligne d'adresse peut porter un retour à la ligne (rue / ville) :
    // la carte n'en garde que la première, la fiche complète est sur la page.
    const adresse = String(i.address || '').split('\n')[0];

    cible.innerHTML = `
      <ul class="ad-list">
        <li>
          <span class="ad-dot"></span>
          <span class="ad-list-label">${echapper(adresse || '—')}</span>
        </li>
        <li>
          <span class="ad-dot"></span>
          <span class="ad-list-label">${echapper(i.phone || '—')}</span>
        </li>
        <li>
          <span class="ad-dot"></span>
          <span class="ad-list-label">${echapper(i.email || '—')}</span>
        </li>
      </ul>
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
