/* ============================================================
   ADMIN-EVENTS — page « Événements ». Commande le bandeau haut du
   site et la section « Événements à venir ». Un seul événement peut
   être en ligne à la fois : l'API retire le précédent.

   La page ne montre qu'une liste ; tout ce qui agit (consulter,
   modifier, mettre en ligne, archiver, supprimer) se passe dans le
   panneau latéral partagé (assets/js/admin-panel.js). Les données
   viennent du magasin commun (assets/js/admin-store.js).
   ============================================================ */
(function registerEventsPage() {
  const TAG_DEFAUT = 'Prochain événement';

  let root = null;
  let page = null;
  let desabonner = null;
  let vue = 'cours';        // cours | archives
  let dernierSnap = null;

  function icone(id, classe) {
    return `<svg class="ad-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
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
    page = api;
    vue = 'cours';

    page.setActions([
      { label: 'Ajouter un événement', icone: 'i-plus', style: 'ad-btn-primary', onClick: ouvrirNouveau }
    ]);

    root.innerHTML = `
      <p class="ad-lede">Un seul événement est visible sur le site à la fois. Les autres restent enregistrés ici,
        en réserve ou en archives, sans jamais apparaître aux visiteurs.</p>

      <div class="ad-tabs" role="tablist" aria-label="Filtrer les événements">
        <button type="button" role="tab" class="ad-tab" data-vue="cours" aria-selected="true">
          En cours <span class="ad-tab-n" data-n="cours">0</span>
        </button>
        <button type="button" role="tab" class="ad-tab" data-vue="archives" aria-selected="false">
          Archives <span class="ad-tab-n" data-n="archives">0</span>
        </button>
      </div>

      <div data-slot="liste"></div>
    `;

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
    page = null;
    dernierSnap = null;
  }

  /* ---------------------------------------------------------------
     Rendu de la liste
     --------------------------------------------------------------- */

  function rendre(snap) {
    if (!root || !snap) return;
    const cible = root.querySelector('[data-slot="liste"]');

    root.querySelector('[data-n="cours"]').textContent = snap.courants.length;
    root.querySelector('[data-n="archives"]').textContent = snap.archives.length;
    root.querySelectorAll('[data-vue]').forEach((btn) => {
      btn.setAttribute('aria-selected', String(btn.dataset.vue === vue));
    });

    if (page) page.setBadge(snap.statut === 'pret' ? snap.courants.length : null);

    if (snap.statut === 'chargement' || snap.statut === 'attente') {
      cible.innerHTML = `
        <div class="ad-skeleton" aria-hidden="true">
          ${[70, 54, 62].map((w) => `<div class="ad-skeleton-bar" style="width:${w}%"></div>`).join('')}
        </div>
        <p class="ad-sr" role="status">Chargement des événements.</p>
      `;
      return;
    }

    if (snap.statut === 'erreur') {
      cible.innerHTML = `
        <div class="ad-alert" role="alert">
          ${icone('i-alert')}
          <div>
            ${snap.erreur === 'session'
              ? 'Votre session a expiré. Rechargez la page pour vous reconnecter.'
              : 'Les événements n’ont pas pu être chargés.'}
            <div class="ad-alert-actions">
              <button type="button" class="ad-btn ad-btn-line ad-btn-sm" data-action="retry">Réessayer</button>
            </div>
          </div>
        </div>
      `;
      cible.querySelector('[data-action="retry"]').addEventListener('click', () => AdminStore.charger());
      return;
    }

    const liste = vue === 'archives' ? snap.archives : snap.courants;

    if (!liste.length) {
      cible.innerHTML = vue === 'archives' ? videArchives() : videCours();
      const cta = cible.querySelector('[data-action="nouveau"]');
      if (cta) cta.addEventListener('click', ouvrirNouveau);
      return;
    }

    cible.innerHTML = `
      ${vue === 'cours' && !snap.enLigne ? `
        <div class="ad-note">
          ${icone('i-eye-off')}
          <div><strong>Aucun événement à l'affiche</strong>
            Le bandeau et la section « Événements à venir » sont masqués sur le site. Ouvrez une fiche pour la mettre en ligne.</div>
        </div>` : ''}

      <div class="ad-tablewrap">
        <table class="ad-table">
          <thead>
            <tr>
              <th scope="col" class="ad-col-date">Date</th>
              <th scope="col">Événement</th>
              <th scope="col" class="ad-col-etat">État</th>
              <th scope="col" class="ad-col-go"><span class="ad-sr">Ouvrir la fiche</span></th>
            </tr>
          </thead>
          <tbody>${liste.map(ligne).join('')}</tbody>
        </table>
      </div>
    `;

    cible.querySelectorAll('tbody tr').forEach((tr) => {
      const bouton = tr.querySelector('[data-open]');
      tr.addEventListener('click', (e) => {
        // Un lien ou un bouton dans la ligne garde son propre rôle.
        if (e.target.closest('a, button') && !e.target.closest('[data-open]')) return;
        bouton.click();
      });
    });
    cible.querySelectorAll('[data-open]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const ev = dernierSnap.events.find((item) => String(item.id) === btn.dataset.open);
        if (ev) ouvrirFiche(ev);
      });
    });
  }

  function ligne(ev) {
    const passe = ev.starts_at && AdminStore.estPasse(ev.starts_at);
    return `
      <tr${ev.active ? ' class="is-live"' : ''}>
        <td class="ad-col-date">
          ${ev.starts_at
            ? `<span class="ad-date"><b>${echapper(AdminStore.dateLongue(ev.starts_at).replace(/^\w+ /, ''))}</b>
               <small>${echapper(AdminStore.quand(ev.starts_at))}</small></span>`
            : '<span class="ad-date ad-muet">Sans date</span>'}
        </td>
        <td>
          <button type="button" class="ad-cellbtn" data-open="${echapper(ev.id)}">${echapper(ev.title)}</button>
          ${ev.tag ? `<span class="ad-tag">${echapper(ev.tag)}</span>` : ''}
        </td>
        <td class="ad-col-etat">
          ${ev.active
            ? `<span class="ad-pill ad-pill-live">${icone('i-eye')}En ligne</span>`
            : ev.archived
              ? `<span class="ad-pill">${icone('i-archive')}Archivé</span>`
              : `<span class="ad-pill">${icone('i-eye-off')}En réserve</span>`}
          ${passe && ev.active ? `<span class="ad-warn">${icone('i-alert')}Événement passé</span>` : ''}
        </td>
        <td class="ad-col-go">${icone('i-arrow')}</td>
      </tr>
    `;
  }

  function videCours() {
    return `
      <div class="ad-empty">
        ${icone('i-calendar', 'ad-ico-xl')}
        <p class="ad-empty-title">Aucun événement en cours</p>
        <p>Le bandeau en haut du site et la section « Événements à venir » restent masqués tant qu'aucun événement n'est affiché.</p>
        <button type="button" class="ad-btn ad-btn-primary ad-empty-cta" data-action="nouveau">
          ${icone('i-plus')}<span>Ajouter un événement</span>
        </button>
      </div>
    `;
  }

  function videArchives() {
    return `
      <div class="ad-empty">
        ${icone('i-archive', 'ad-ico-xl')}
        <p class="ad-empty-title">Aucune archive</p>
        <p>Les événements passés que vous archivez viendront se ranger ici. Ils restent consultables et peuvent être remis en réserve à tout moment.</p>
      </div>
    `;
  }

  /* ---------------------------------------------------------------
     Panneau — consulter une fiche
     --------------------------------------------------------------- */

  function ouvrirFiche(ev) {
    const corps = document.createElement('div');
    const enLigne = ev.active;
    const passe = ev.starts_at && AdminStore.estPasse(ev.starts_at);

    corps.innerHTML = `
      <p class="ad-panel-state">
        ${enLigne
          ? `<span class="ad-pill ad-pill-live">${icone('i-eye')}Affiché sur le site</span>`
          : ev.archived
            ? `<span class="ad-pill">${icone('i-archive')}Archivé</span>`
            : `<span class="ad-pill">${icone('i-eye-off')}En réserve, non affiché</span>`}
      </p>

      ${passe && enLigne ? `
        <div class="ad-note ad-note-warn">
          ${icone('i-alert')}
          <div><strong>Événement passé</strong>Il est toujours annoncé sur le site. Pensez à le retirer ou à l'archiver.</div>
        </div>` : ''}

      <dl class="ad-facts ad-facts-tight">
        <div class="ad-fact">
          <dt>${icone('i-calendar')}Date</dt>
          <dd>${ev.starts_at
            ? `<b>${echapper(AdminStore.dateLongue(ev.starts_at))}</b><small>${echapper(AdminStore.quand(ev.starts_at))}</small>`
            : '<span class="ad-muet">Non précisée</span>'}</dd>
        </div>
        <div class="ad-fact">
          <dt>${icone('i-tag')}Étiquette</dt>
          <dd>${ev.tag ? echapper(ev.tag) : '<span class="ad-muet">Aucune</span>'}</dd>
        </div>
        <div class="ad-fact">
          <dt>${icone('i-text')}Description</dt>
          <dd>${ev.description ? echapper(ev.description) : '<span class="ad-muet">Aucune</span>'}</dd>
        </div>
        <div class="ad-fact">
          <dt>${icone('i-external')}Lien</dt>
          <dd><a class="ad-extlink" href="${echapper(ev.link_url)}" target="_blank" rel="noopener">${echapper(ev.link_url)}</a></dd>
        </div>
      </dl>

      <h3 class="ad-box-title ad-box-title-sep">Actions</h3>
      <div class="ad-rows">
        ${ev.archived ? `
          <button type="button" class="ad-row" data-do="desarchiver">
            ${icone('i-layers', 'ad-ico-lg')}
            <span><strong>Remettre en réserve</strong>La fiche revient dans la liste courante, sans être affichée.</span>
            ${icone('i-arrow')}
          </button>` : `
          <button type="button" class="ad-row" data-do="${enLigne ? 'retirer' : 'publier'}">
            ${icone(enLigne ? 'i-eye-off' : 'i-eye', 'ad-ico-lg')}
            <span><strong>${enLigne ? 'Retirer du site' : 'Mettre en ligne'}</strong>${enLigne
              ? 'Le bandeau et la section « Événements à venir » disparaissent du site.'
              : 'Cet événement remplacera celui actuellement affiché, s’il y en a un.'}</span>
            ${icone('i-arrow')}
          </button>
          <button type="button" class="ad-row" data-do="archiver">
            ${icone('i-archive', 'ad-ico-lg')}
            <span><strong>Archiver</strong>La fiche est rangée dans les archives et retirée du site.</span>
            ${icone('i-arrow')}
          </button>`}
        <button type="button" class="ad-row ad-row-danger" data-do="supprimer">
          ${icone('i-trash', 'ad-ico-lg')}
          <span><strong>Supprimer définitivement</strong>La fiche est effacée. Cette action ne peut pas être annulée.</span>
          ${icone('i-arrow')}
        </button>
      </div>
    `;

    AdminPanel.ouvrir({
      icone: 'i-calendar',
      chapeau: ev.tag || 'Événement',
      titre: ev.title,
      corps,
      actions: [
        { id: 'modifier', label: 'Modifier', icone: 'i-pencil', style: 'ad-btn-primary', onClick: () => ouvrirFormulaire(ev) },
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
    if (page) page.flash(messages[quoi]);
  }

  function confirmerSuppression(ev) {
    const corps = document.createElement('div');
    corps.innerHTML = `
      <div class="ad-note ad-note-danger">
        ${icone('i-alert', 'ad-ico-lg')}
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
          style: 'ad-btn-danger',
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
            if (page) page.flash('Événement supprimé.');
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
      <form novalidate>
        <div class="ad-field">
          <label for="ev-title">Titre</label>
          <input type="text" id="ev-title" required value="${echapper(ev ? ev.title : '')}">
          <p class="ad-hint">S'affiche en gros dans le bandeau, par exemple « Portes ouvertes du 27 juin ».</p>
        </div>

        <div class="ad-field">
          <label for="ev-date">Date de l'événement</label>
          <input type="date" id="ev-date" value="${ev && ev.starts_at ? echapper(String(ev.starts_at).slice(0, 10)) : ''}">
          <p class="ad-hint">Facultative. Elle sert à classer les fiches et à repérer les événements passés.</p>
        </div>

        <div class="ad-field">
          <label for="ev-tag">Étiquette</label>
          <input type="text" id="ev-tag" value="${echapper(ev ? ev.tag : TAG_DEFAUT)}">
          <p class="ad-hint">La petite mention placée au-dessus du titre.</p>
        </div>

        <div class="ad-field">
          <label for="ev-description">Description</label>
          <textarea id="ev-description">${echapper(ev ? ev.description : '')}</textarea>
          <p class="ad-hint">Deux ou trois phrases : ce qui se passe, quand, et où.</p>
        </div>

        <div class="ad-field">
          <label for="ev-link">Lien d'inscription</label>
          <input type="url" id="ev-link" required placeholder="https://www.helloasso.com/..." value="${echapper(ev ? ev.link_url : '')}">
          <p class="ad-hint">La page HelloAsso, ou toute autre adresse vers laquelle envoyer les visiteurs.</p>
        </div>

        <div class="ad-switch">
          <input type="checkbox" id="ev-active" ${ev && ev.active ? 'checked' : ''}>
          <div>
            <label for="ev-active">Afficher cet événement sur le site</label>
            <p class="ad-hint">Un seul événement peut être en ligne à la fois : afficher celui-ci retire automatiquement le précédent.</p>
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
      if (page) page.flash(modif ? 'Modifications enregistrées.' : 'Événement enregistré.');
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
        { id: 'enregistrer', label: 'Enregistrer', icone: 'i-check', style: 'ad-btn-primary', onClick: enregistrer },
        {
          id: 'annuler',
          label: modif ? 'Revenir à la fiche' : 'Annuler',
          onClick: () => (modif ? ouvrirFiche(ev) : AdminPanel.fermer())
        }
      ]
    });
  }

  // Le tableau de bord ouvre le formulaire sans connaître cette page.
  window.AdminEventsActions = { nouveau: ouvrirNouveau };

  window.AdminModules = window.AdminModules || [];
  window.AdminModules.push({
    id: 'events',
    label: 'Événements',
    icon: 'i-calendar',
    title: 'Événements',
    mount,
    unmount
  });
})();
