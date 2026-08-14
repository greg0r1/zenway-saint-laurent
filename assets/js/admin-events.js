/* ============================================================
   ADMIN-EVENTS — feuille « Événements ». Commande le bandeau haut du
   site et la section « Événements à venir ». Un seul événement peut
   être en ligne à la fois : l'API retire le précédent.

   La feuille ne montre que des cartes ; tout ce qui agit (consulter,
   modifier, mettre en ligne, archiver, supprimer) se passe dans le
   panneau latéral partagé (assets/js/admin-panel.js). Les données
   viennent du magasin commun (assets/js/admin-store.js).
   ============================================================ */
(function registerEventsModule() {
  const TAG_DEFAUT = 'Prochain événement';

  let root = null;
  let sheet = null;
  let desabonner = null;
  let vue = 'cours';        // cours | archives
  let dernierSnap = null;

  function icone(id, classe) {
    return `<svg class="bo-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function echapper(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /* ---------------------------------------------------------------
     Montage
     --------------------------------------------------------------- */

  function mount(container, api) {
    root = container;
    sheet = api;
    vue = 'cours';

    root.innerHTML = `
      <div class="bo-toolbar">
        <button type="button" class="bo-btn bo-btn-primary" data-action="nouveau">
          ${icone('i-plus')}<span>Ajouter un événement</span>
        </button>
        <div class="bo-segmented" role="tablist" aria-label="Filtrer les événements">
          <button type="button" role="tab" class="bo-seg" data-vue="cours" aria-selected="true">
            En cours <span class="bo-seg-n" data-n="cours">0</span>
          </button>
          <button type="button" role="tab" class="bo-seg" data-vue="archives" aria-selected="false">
            Archives <span class="bo-seg-n" data-n="archives">0</span>
          </button>
        </div>
      </div>
      <div data-slot="liste"></div>
    `;

    root.querySelector('[data-action="nouveau"]').addEventListener('click', ouvrirNouveau);
    root.querySelectorAll('[data-vue]').forEach((btn) => {
      btn.addEventListener('click', () => {
        vue = btn.dataset.vue;
        rendre(dernierSnap);
      });
    });

    desabonner = AdminStore.abonner((snap) => {
      dernierSnap = snap;
      rendre(snap);
    });
    AdminStore.charger();
  }

  function unmount() {
    if (desabonner) desabonner();
    desabonner = null;
    root = null;
    sheet = null;
    dernierSnap = null;
  }

  /* ---------------------------------------------------------------
     Rendu de la feuille
     --------------------------------------------------------------- */

  function rendre(snap) {
    if (!root || !snap) return;
    const cible = root.querySelector('[data-slot="liste"]');

    root.querySelector('[data-n="cours"]').textContent = snap.courants.length;
    root.querySelector('[data-n="archives"]').textContent = snap.archives.length;
    root.querySelectorAll('[data-vue]').forEach((btn) => {
      btn.setAttribute('aria-selected', String(btn.dataset.vue === vue));
    });

    if (snap.statut === 'chargement' || snap.statut === 'attente') {
      cible.innerHTML = `
        <div class="bo-grid" aria-hidden="true">
          ${[0, 1, 2].map(() => `
            <div class="bo-card bo-card-vide">
              <div class="bo-skeleton-bar" style="width:34%"></div>
              <div class="bo-skeleton-bar" style="width:82%;height:20px"></div>
              <div class="bo-skeleton-bar" style="width:64%"></div>
            </div>
          `).join('')}
        </div>
        <p class="visually-hidden" role="status">Chargement des événements.</p>
      `;
      sheet.setState({ live: false, short: '…', text: 'Lecture des événements en cours' });
      return;
    }

    if (snap.statut === 'erreur') {
      cible.innerHTML = `
        <div class="bo-alert" role="alert">
          ${icone('i-alert')}
          <div>
            ${snap.erreur === 'session'
              ? 'Votre session a expiré. Rechargez la page pour vous reconnecter.'
              : 'Les événements n’ont pas pu être chargés.'}
            <div class="bo-alert-actions">
              <button type="button" class="bo-btn bo-btn-line bo-btn-sm" data-action="retry">Réessayer</button>
            </div>
          </div>
        </div>
      `;
      cible.querySelector('[data-action="retry"]').addEventListener('click', () => AdminStore.charger());
      sheet.setState({ live: false, short: 'inconnu', text: 'État inconnu — les événements n’ont pas pu être lus' });
      return;
    }

    sheet.setState(snap.enLigne
      ? { live: true, short: 'en ligne', text: `En ligne sur le site : ${snap.enLigne.title}` }
      : { live: false, short: 'rien à l’affiche', text: 'Aucun événement affiché — le bandeau et la section sont masqués' });

    cible.innerHTML = vue === 'archives' ? rendreArchives(snap) : rendreCours(snap);
    brancherCartes(cible);
  }

  function rendreCours(snap) {
    const enLigne = snap.enLigne;
    const reserve = snap.courants.filter((ev) => !ev.active);

    if (!snap.courants.length) {
      return `
        <div class="bo-empty">
          ${icone('i-calendar', 'bo-ico-xl')}
          <p class="bo-empty-title">Aucun événement en cours</p>
          <p>Le bandeau en haut du site et la section « Événements à venir » restent masqués tant qu'aucun événement n'est affiché.</p>
          <button type="button" class="bo-btn bo-btn-primary bo-empty-cta" data-action="nouveau-vide">
            ${icone('i-plus')}<span>Ajouter un événement</span>
          </button>
        </div>
      `;
    }

    return `
      ${enLigne ? `
        <div class="bo-block">
          <h3 class="bo-block-title">À l'affiche sur le site</h3>
          <p class="bo-block-note">Le seul événement visible par les visiteurs en ce moment.</p>
          ${carteHero(enLigne)}
        </div>` : `
        <div class="bo-block">
          <div class="bo-notice">
            ${icone('i-eye-off')}
            <div>
              <strong>Aucun événement à l'affiche</strong>
              Le bandeau et la section « Événements à venir » sont masqués sur le site. Ouvrez une fiche ci-dessous pour la mettre en ligne.
            </div>
          </div>
        </div>`}

      ${reserve.length ? `
        <div class="bo-block">
          <h3 class="bo-block-title">En réserve</h3>
          <p class="bo-block-note">Enregistrés mais pas encore affichés. Aucun n'apparaît sur le site.</p>
          <div class="bo-grid">${reserve.map(carte).join('')}</div>
        </div>` : ''}
    `;
  }

  function rendreArchives(snap) {
    if (!snap.archives.length) {
      return `
        <div class="bo-empty">
          ${icone('i-archive', 'bo-ico-xl')}
          <p class="bo-empty-title">Aucune archive</p>
          <p>Les événements passés que vous archivez viendront se ranger ici. Ils restent consultables et peuvent être remis en réserve à tout moment.</p>
        </div>
      `;
    }
    return `
      <div class="bo-block">
        <h3 class="bo-block-title">Événements archivés</h3>
        <p class="bo-block-note">Rangés, jamais affichés sur le site. Rien n'est perdu : vous pouvez les rouvrir ou les remettre en réserve.</p>
        <div class="bo-grid">${snap.archives.map((ev) => carte(ev, true)).join('')}</div>
      </div>
    `;
  }

  /* ---------------------------------------------------------------
     Cartes
     --------------------------------------------------------------- */

  function pastille(ev) {
    const d = ev.starts_at ? AdminStore.dateCourte(ev.starts_at) : null;
    if (!d) {
      return `<span class="bo-date bo-date-vide" aria-hidden="true">${icone('i-calendar')}</span>`;
    }
    return `
      <span class="bo-date" aria-hidden="true">
        <b>${d.jour}</b><i>${d.mois}</i>
      </span>
    `;
  }

  function carteHero(ev) {
    const passe = ev.starts_at && AdminStore.estPasse(ev.starts_at);
    return `
      <button type="button" class="bo-hero" data-id="${echapper(ev.id)}">
        ${pastille(ev)}
        <span class="bo-hero-body">
          <span class="bo-badge">${icone('i-eye')}En ligne sur le site</span>
          <span class="bo-hero-title">${echapper(ev.title)}</span>
          <span class="bo-hero-meta">
            ${ev.starts_at
              ? `${echapper(AdminStore.dateLongue(ev.starts_at))} · ${echapper(AdminStore.quand(ev.starts_at))}`
              : 'Aucune date renseignée'}
          </span>
          ${ev.description ? `<span class="bo-hero-text">${echapper(ev.description)}</span>` : ''}
          ${passe ? `<span class="bo-warn">${icone('i-alert')}Cet événement est passé et reste affiché sur le site.</span>` : ''}
        </span>
        <span class="bo-hero-go">${icone('i-arrow')}</span>
      </button>
    `;
  }

  function carte(ev, archive) {
    return `
      <button type="button" class="bo-card bo-card-clic${archive ? ' bo-card-range' : ''}" data-id="${echapper(ev.id)}">
        <span class="bo-card-top">
          ${pastille(ev)}
          ${ev.tag ? `<span class="bo-card-tag">${echapper(ev.tag)}</span>` : ''}
        </span>
        <span class="bo-card-title">${echapper(ev.title)}</span>
        ${ev.description ? `<span class="bo-card-text">${echapper(ev.description)}</span>` : ''}
        <span class="bo-card-foot">
          ${ev.starts_at ? echapper(AdminStore.quand(ev.starts_at)) : 'Sans date'}
          ${icone('i-arrow')}
        </span>
      </button>
    `;
  }

  function brancherCartes(cible) {
    cible.querySelectorAll('[data-id]').forEach((el) => {
      el.addEventListener('click', () => {
        const ev = dernierSnap.events.find((item) => String(item.id) === el.dataset.id);
        if (ev) ouvrirFiche(ev);
      });
    });
    const vide = cible.querySelector('[data-action="nouveau-vide"]');
    if (vide) vide.addEventListener('click', ouvrirNouveau);
  }

  /* ---------------------------------------------------------------
     Panneau — consulter une fiche
     --------------------------------------------------------------- */

  function ouvrirFiche(ev) {
    const corps = document.createElement('div');
    const enLigne = ev.active;
    const passe = ev.starts_at && AdminStore.estPasse(ev.starts_at);

    corps.innerHTML = `
      <div class="bo-state${enLigne ? ' bo-state-live' : ''}">
        ${icone(enLigne ? 'i-eye' : 'i-eye-off')}
        ${enLigne ? 'Affiché sur le site' : (ev.archived ? 'Archivé' : 'En réserve, non affiché')}
      </div>

      ${passe && enLigne ? `
        <div class="bo-notice bo-notice-warn">
          ${icone('i-alert')}
          <div><strong>Événement passé</strong>Il est toujours annoncé sur le site. Pensez à le retirer ou à l'archiver.</div>
        </div>` : ''}

      <dl class="bo-values">
        <div class="bo-value">
          <dt>${icone('i-calendar')}Date</dt>
          <dd>${ev.starts_at
            ? `${echapper(AdminStore.dateLongue(ev.starts_at))}<small>${echapper(AdminStore.quand(ev.starts_at))}</small>`
            : '<span class="bo-muet">Non précisée</span>'}</dd>
        </div>
        <div class="bo-value">
          <dt>${icone('i-tag')}Étiquette</dt>
          <dd>${ev.tag ? echapper(ev.tag) : '<span class="bo-muet">Aucune</span>'}</dd>
        </div>
        <div class="bo-value">
          <dt>${icone('i-text')}Description</dt>
          <dd>${ev.description ? echapper(ev.description) : '<span class="bo-muet">Aucune</span>'}</dd>
        </div>
        <div class="bo-value">
          <dt>${icone('i-external')}Lien</dt>
          <dd><a class="bo-item-link" href="${echapper(ev.link_url)}" target="_blank" rel="noopener">${echapper(ev.link_url)}</a></dd>
        </div>
      </dl>

      <div class="bo-block">
        <h3 class="bo-block-title">Actions</h3>
        <div class="bo-rows" data-slot="actions-secondaires">
          ${ev.archived ? `
            <button type="button" class="bo-row" data-do="desarchiver">
              ${icone('i-layers', 'bo-ico-lg')}
              <span><strong>Remettre en réserve</strong>La fiche revient dans la liste courante, sans être affichée.</span>
              ${icone('i-arrow')}
            </button>` : `
            <button type="button" class="bo-row" data-do="${enLigne ? 'retirer' : 'publier'}">
              ${icone(enLigne ? 'i-eye-off' : 'i-eye', 'bo-ico-lg')}
              <span><strong>${enLigne ? 'Retirer du site' : 'Mettre en ligne'}</strong>${enLigne
                ? 'Le bandeau et la section « Événements à venir » disparaissent du site.'
                : 'Cet événement remplacera celui actuellement affiché, s’il y en a un.'}</span>
              ${icone('i-arrow')}
            </button>
            <button type="button" class="bo-row" data-do="archiver">
              ${icone('i-archive', 'bo-ico-lg')}
              <span><strong>Archiver</strong>La fiche est rangée dans les archives et retirée du site.</span>
              ${icone('i-arrow')}
            </button>`}
          <button type="button" class="bo-row bo-row-danger" data-do="supprimer">
            ${icone('i-trash', 'bo-ico-lg')}
            <span><strong>Supprimer définitivement</strong>La fiche est effacée. Cette action ne peut pas être annulée.</span>
            ${icone('i-arrow')}
          </button>
        </div>
      </div>
    `;

    AdminPanel.ouvrir({
      icone: 'i-calendar',
      chapeau: ev.tag || 'Événement',
      titre: ev.title,
      corps,
      actions: [
        {
          id: 'modifier',
          label: 'Modifier',
          icone: 'i-pencil',
          style: 'bo-btn-primary',
          onClick: () => ouvrirFormulaire(ev)
        },
        { id: 'fermer', label: 'Fermer', onClick: () => AdminPanel.fermer() }
      ]
    });

    corps.querySelectorAll('[data-do]').forEach((btn) => {
      btn.addEventListener('click', () => agir(btn.dataset.do, ev, btn));
    });
  }

  async function agir(quoi, ev, btn) {
    if (quoi === 'supprimer') {
      confirmerSuppression(ev);
      return;
    }

    const champs = {
      publier: { active: true },
      retirer: { active: false },
      archiver: { archived: true, active: false },
      desarchiver: { archived: false }
    }[quoi];
    if (!champs) return;

    const messages = {
      publier: 'Événement mis en ligne. Il apparaît maintenant sur le site.',
      retirer: 'Événement retiré du site.',
      archiver: 'Événement archivé.',
      desarchiver: 'Événement remis en réserve.'
    };

    btn.disabled = true;
    btn.classList.add('is-occupe');
    AdminPanel.cacherAlerte();
    try {
      await AdminStore.modifier(ev.id, champs);
    } catch {
      btn.disabled = false;
      btn.classList.remove('is-occupe');
      AdminPanel.alerte('La modification n’a pas pu être enregistrée. Réessayez dans un instant.');
      return;
    }
    AdminPanel.fermer();
    if (sheet) sheet.flash(messages[quoi]);
  }

  function confirmerSuppression(ev) {
    const corps = document.createElement('div');
    corps.innerHTML = `
      <div class="bo-notice bo-notice-danger">
        ${icone('i-alert', 'bo-ico-lg')}
        <div>
          <strong>Cette suppression est définitive</strong>
          La fiche « ${echapper(ev.title)} » sera effacée de la base. Si vous souhaitez seulement
          la retirer du site, préférez « Archiver » : elle restera consultable.
        </div>
      </div>
    `;

    AdminPanel.ouvrir({
      icone: 'i-trash',
      chapeau: 'Supprimer',
      titre: ev.title,
      corps,
      actions: [
        {
          id: 'supprimer',
          label: 'Supprimer définitivement',
          icone: 'i-trash',
          style: 'bo-btn-danger-solid',
          onClick: async () => {
            AdminPanel.cacherAlerte();
            AdminPanel.occuper('supprimer', true, 'Suppression…');
            try {
              await AdminStore.supprimer(ev.id);
            } catch {
              AdminPanel.occuper('supprimer', false);
              AdminPanel.alerte('La suppression a échoué. Réessayez dans un instant.');
              return;
            }
            AdminPanel.fermer();
            if (sheet) sheet.flash('Événement supprimé.');
          }
        },
        { id: 'retour', label: 'Revenir à la fiche', onClick: () => ouvrirFiche(ev) }
      ]
    });
  }

  /* ---------------------------------------------------------------
     Panneau — créer et modifier
     --------------------------------------------------------------- */

  function ouvrirNouveau() {
    ouvrirFormulaire(null);
  }

  function ouvrirFormulaire(ev) {
    const modif = !!ev;
    const corps = document.createElement('div');
    corps.innerHTML = `
      <form class="bo-form" novalidate>
        <div class="bo-field">
          <label for="ev-title">Titre</label>
          <input type="text" id="ev-title" required value="${echapper(ev ? ev.title : '')}">
          <p class="bo-hint">S'affiche en gros dans le bandeau, par exemple « Portes ouvertes du 27 juin ».</p>
        </div>

        <div class="bo-field">
          <label for="ev-date">Date de l'événement</label>
          <input type="date" id="ev-date" value="${ev && ev.starts_at ? echapper(String(ev.starts_at).slice(0, 10)) : ''}">
          <p class="bo-hint">Facultative. Elle sert à classer les fiches et à repérer les événements passés.</p>
        </div>

        <div class="bo-field">
          <label for="ev-tag">Étiquette</label>
          <input type="text" id="ev-tag" value="${echapper(ev ? ev.tag : TAG_DEFAUT)}">
          <p class="bo-hint">La petite mention placée au-dessus du titre.</p>
        </div>

        <div class="bo-field">
          <label for="ev-description">Description</label>
          <textarea id="ev-description">${echapper(ev ? ev.description : '')}</textarea>
          <p class="bo-hint">Deux ou trois phrases : ce qui se passe, quand, et où.</p>
        </div>

        <div class="bo-field">
          <label for="ev-link">Lien d'inscription</label>
          <input type="url" id="ev-link" required placeholder="https://www.helloasso.com/..." value="${echapper(ev ? ev.link_url : '')}">
          <p class="bo-hint">La page HelloAsso, ou toute autre adresse vers laquelle envoyer les visiteurs.</p>
        </div>

        <div class="bo-switch">
          <input type="checkbox" id="ev-active" ${ev && ev.active ? 'checked' : ''}>
          <div>
            <label for="ev-active">Afficher cet événement sur le site</label>
            <p class="bo-hint">Un seul événement peut être en ligne à la fois : afficher celui-ci retire automatiquement le précédent.</p>
          </div>
        </div>
      </form>
    `;

    const form = corps.querySelector('form');
    const champs = {
      title: corps.querySelector('#ev-title'),
      date: corps.querySelector('#ev-date'),
      tag: corps.querySelector('#ev-tag'),
      description: corps.querySelector('#ev-description'),
      link: corps.querySelector('#ev-link'),
      active: corps.querySelector('#ev-active')
    };

    async function enregistrer() {
      const payload = {
        title: champs.title.value.trim(),
        tag: champs.tag.value.trim(),
        description: champs.description.value.trim(),
        link_url: champs.link.value.trim(),
        starts_at: champs.date.value || null,
        active: champs.active.checked
      };
      if (modif) payload.archived = !!ev.archived && !payload.active;

      if (!payload.title) {
        AdminPanel.alerte('Le titre est obligatoire : c’est lui qui s’affiche dans le bandeau.');
        champs.title.focus();
        return;
      }
      if (!payload.link_url) {
        AdminPanel.alerte('Le lien d’inscription est obligatoire : le bandeau doit mener quelque part.');
        champs.link.focus();
        return;
      }
      if (!/^https?:\/\//i.test(payload.link_url)) {
        AdminPanel.alerte('Le lien doit commencer par https:// pour être valide.');
        champs.link.focus();
        return;
      }

      AdminPanel.cacherAlerte();
      AdminPanel.occuper('enregistrer', true, 'Enregistrement…');
      try {
        await AdminStore.enregistrer(payload, modif ? ev.id : null);
      } catch {
        AdminPanel.occuper('enregistrer', false);
        AdminPanel.alerte('L’enregistrement a échoué. Vos informations sont toujours là : réessayez.');
        return;
      }
      AdminPanel.fermer();
      if (sheet) sheet.flash(modif ? 'Modifications enregistrées.' : 'Événement enregistré.');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      enregistrer();
    });

    AdminPanel.ouvrir({
      icone: modif ? 'i-pencil' : 'i-plus',
      chapeau: modif ? 'Modifier' : 'Nouvel événement',
      titre: modif ? ev.title : 'Ajouter un événement',
      corps,
      actions: [
        { id: 'enregistrer', label: 'Enregistrer', icone: 'i-check', style: 'bo-btn-primary', onClick: enregistrer },
        {
          id: 'annuler',
          label: modif ? 'Revenir à la fiche' : 'Annuler',
          onClick: () => (modif ? ouvrirFiche(ev) : AdminPanel.fermer())
        }
      ]
    });
  }

  // Le tableau de bord ouvre le formulaire sans connaître ce module.
  window.AdminEventsActions = { nouveau: ouvrirNouveau };

  window.AdminModules = window.AdminModules || [];
  window.AdminModules.push({
    id: 'events',
    label: 'Événements',
    icon: 'i-calendar',
    summary: 'Commande le bandeau en haut du site et la section « Événements à venir ». Un seul événement est visible à la fois.',
    mount,
    unmount
  });
})();
