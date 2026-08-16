/* ============================================================
   ADMIN-EVENTS — page « Événements ». Tout événement publié ici
   (non archivé, et non expiré si une date de fin est renseignée)
   apparaît dans la section « Événements à venir » du site. Un seul
   peut en plus être mis en avant dans le bandeau du haut : l'API
   retire le précédent.

   « Archivé » est un état calculé (AdminStore.estArchive), pas une
   simple lecture du drapeau `archived` : un événement dont la fin de
   parution est dépassée y bascule tout seul, sans action de l'admin.

   La page ne montre qu'une liste ; tout ce qui agit (consulter,
   modifier, mettre en avant, archiver, supprimer) se passe dans le
   panneau latéral partagé (assets/js/admin-panel.js). Les données
   viennent du magasin commun (assets/js/admin-store.js).
   ============================================================ */
(function registerEventsPage() {
  const TAG_DEFAUT = 'Prochain événement';
  const LIMITES = { title: 100, tag: 40, description: 500 };

  // Redimensionnement/compression client, avant l'envoi à /api/events/image :
  // l'image n'alourdit jamais le chargement des cartes sur le site.
  const IMAGE_MAX_SOURCE_BYTES = 15 * 1024 * 1024;
  const IMAGE_MAX_DIMENSION = 1600;
  const IMAGE_JPEG_QUALITY = 0.85;

  let root = null;
  let page = null;
  let desabonner = null;
  let vue = 'cours';        // cours | archives
  let dernierSnap = null;

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

  /* ---------------------------------------------------------------
     Image — redimensionnement client, puis envoi à /api/events/image
     --------------------------------------------------------------- */

  function redimensionnerImage(file) {
    return new Promise((resolve, reject) => {
      const lecteur = new FileReader();
      lecteur.onerror = () => reject(new Error('lecture_echouee'));
      lecteur.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('image_invalide'));
        img.onload = () => {
          const ratio = Math.min(1, IMAGE_MAX_DIMENSION / Math.max(img.width, img.height));
          const largeur = Math.round(img.width * ratio);
          const hauteur = Math.round(img.height * ratio);
          const toile = document.createElement('canvas');
          toile.width = largeur;
          toile.height = hauteur;
          toile.getContext('2d').drawImage(img, 0, 0, largeur, hauteur);
          resolve(toile.toDataURL('image/jpeg', IMAGE_JPEG_QUALITY));
        };
        img.src = lecteur.result;
      };
      lecteur.readAsDataURL(file);
    });
  }

  async function televerserImage(dataUrl) {
    const res = await fetch('/api/events/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl })
    });
    if (!res.ok) throw new Error('upload_failed');
    return res.json();
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
      <p class="ad-lede">Tout événement publié ici apparaît dans la section « Événements à venir » du site. Un seul
        peut en plus être mis en avant dans le bandeau du haut.</p>

      <div class="ad-tabs" role="tablist" aria-label="Filtrer les événements">
        <button type="button" role="tab" class="ad-tab" data-vue="cours" aria-selected="true">
          Publiés <span class="ad-tab-n" data-n="cours">0</span>
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

    root.querySelector('[data-n="cours"]').textContent = snap.enLigne.length;
    root.querySelector('[data-n="archives"]').textContent = snap.archives.length;
    root.querySelectorAll('[data-vue]').forEach((btn) => {
      btn.setAttribute('aria-selected', String(btn.dataset.vue === vue));
    });

    if (page) page.setBadge(snap.statut === 'pret' ? snap.enLigne.length : null);

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

    const liste = vue === 'archives' ? snap.archives : snap.enLigne;

    if (!liste.length) {
      cible.innerHTML = vue === 'archives' ? videArchives() : videCours();
      const cta = cible.querySelector('[data-action="nouveau"]');
      if (cta) cta.addEventListener('click', ouvrirNouveau);
      return;
    }

    cible.innerHTML = `
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
    const archive = AdminStore.estArchive(ev);
    const passe = ev.starts_at && AdminStore.estPasse(ev.starts_at);
    return `
      <tr${ev.featured ? ' class="is-live"' : ''}>
        <td class="ad-col-date">
          ${ev.starts_at
            ? `<span class="ad-date"><b>${echapper(AdminStore.dateLongue(ev.starts_at).replace(/^\w+ /, ''))}</b>
               <small>${echapper(AdminStore.quand(ev.starts_at))}</small></span>`
            : '<span class="ad-date ad-muet">Sans date</span>'}
        </td>
        <td>
          <div class="ad-table-row">
            ${ev.image_url ? `<img class="ad-table-thumb" src="${echapper(ev.image_url)}" alt="">` : ''}
            <div>
              <button type="button" class="ad-cellbtn" data-open="${echapper(ev.id)}">${echapper(ev.title)}</button>
              ${ev.tag ? `<span class="ad-tag">${echapper(ev.tag)}</span>` : ''}
            </div>
          </div>
        </td>
        <td class="ad-col-etat">
          ${archive
            ? `<span class="ad-pill">${icone('i-archive')}Archivé</span>`
            : ev.featured
              ? `<span class="ad-pill ad-pill-live">${icone('i-eye')}Mis en avant</span>`
              : `<span class="ad-pill">${icone('i-eye')}Publié</span>`}
          ${passe && !archive ? `<span class="ad-warn">${icone('i-alert')}Événement passé</span>` : ''}
        </td>
        <td class="ad-col-go">${icone('i-arrow')}</td>
      </tr>
    `;
  }

  function videCours() {
    return `
      <div class="ad-empty">
        ${icone('i-calendar', 'ad-ico-xl')}
        <p class="ad-empty-title">Aucun événement publié</p>
        <p>La section « Événements à venir » du site reste vide tant qu'aucun événement n'est publié ici.</p>
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
        <p>Les événements que vous archivez, ou dont la fin de parution est dépassée, viendront se ranger ici. Ils restent consultables et peuvent être remis en ligne à tout moment.</p>
      </div>
    `;
  }

  /* ---------------------------------------------------------------
     Panneau — consulter une fiche
     --------------------------------------------------------------- */

  function ouvrirFiche(ev) {
    const corps = document.createElement('div');
    // `expire` et `archiveManuel` distinguent laquelle des deux causes
    // d'archivage (voir AdminStore.estArchive) est en jeu : la note et les
    // actions plus bas doivent le savoir, pas seulement si la fiche est
    // archivée — d'où `archive` calculé séparément via le magasin.
    const expire = ev.ends_at && AdminStore.estPasse(ev.ends_at);
    const archiveManuel = !!ev.archived;
    const archive = AdminStore.estArchive(ev);
    const archiveParDateSeule = !archiveManuel && !!expire;
    const passe = ev.starts_at && AdminStore.estPasse(ev.starts_at);

    corps.innerHTML = `
      ${ev.image_url ? `<img class="ad-panel-image" src="${echapper(ev.image_url)}" alt="">` : ''}
      <p class="ad-panel-state">
        ${archive
          ? `<span class="ad-pill">${icone('i-archive')}Archivé</span>`
          : ev.featured
            ? `<span class="ad-pill ad-pill-live">${icone('i-eye')}Mis en avant dans le bandeau</span>`
            : `<span class="ad-pill">${icone('i-eye')}Publié sur le site</span>`}
      </p>

      ${passe && !archive ? `
        <div class="ad-note ad-note-warn">
          ${icone('i-alert')}
          <div><strong>Événement passé</strong>Il reste publié sur le site. Pensez à le retirer du bandeau ou à l'archiver.</div>
        </div>` : ''}

      ${archiveParDateSeule ? `
        <div class="ad-note ad-note-warn">
          ${icone('i-alert')}
          <div><strong>Fin de parution dépassée</strong>Il n'apparaît plus sur le site et a basculé dans les archives. Repoussez ou effacez la date de fin pour le remettre en ligne.</div>
        </div>` : ''}

      <dl class="ad-facts ad-facts-tight">
        <div class="ad-fact">
          <dt>${icone('i-calendar')}Date</dt>
          <dd>${ev.starts_at
            ? `<b>${echapper(AdminStore.dateLongue(ev.starts_at))}</b><small>${echapper(AdminStore.quand(ev.starts_at))}</small>`
            : '<span class="ad-muet">Non précisée</span>'}</dd>
        </div>
        <div class="ad-fact">
          <dt>${icone('i-calendar')}Fin de parution</dt>
          <dd>${ev.ends_at
            ? `<b>${echapper(AdminStore.dateLongue(ev.ends_at))}</b>`
            : '<span class="ad-muet">Aucune : reste publié indéfiniment</span>'}</dd>
        </div>
        <div class="ad-fact">
          <dt>${icone('i-tag')}Étiquette</dt>
          <dd>${ev.tag ? echapper(ev.tag) : '<span class="ad-muet">Aucune</span>'}</dd>
        </div>
        <div class="ad-fact">
          <dt>${icone('i-text')}Description</dt>
          <dd>${ev.description ? echapper(ev.description) : '<span class="ad-muet">Aucune</span>'}</dd>
        </div>
      </dl>

      <h3 class="ad-box-title ad-box-title-sep">Actions</h3>
      <div class="ad-rows">
        ${archiveManuel ? `
          <button type="button" class="ad-row" data-do="desarchiver">
            ${icone('i-layers', 'ad-ico-lg')}
            <span><strong>Désarchiver</strong>${expire
              ? 'La fin de parution est aussi dépassée : modifiez-la pour remettre la fiche en ligne.'
              : 'La fiche revient dans la section « Événements à venir » du site.'}</span>
            ${icone('i-arrow')}
          </button>` : `
          ${archiveParDateSeule ? '' : `
          <button type="button" class="ad-row" data-do="${ev.featured ? 'retirerBandeau' : 'mettreEnAvant'}">
            ${icone(ev.featured ? 'i-eye-off' : 'i-eye', 'ad-ico-lg')}
            <span><strong>${ev.featured ? 'Retirer du bandeau' : 'Mettre en avant dans le bandeau'}</strong>${ev.featured
              ? 'L’événement reste publié sur le site ; seul le bandeau du haut disparaît.'
              : 'Remplace l’événement actuellement en avant, s’il y en a un. Celui-ci reste de toute façon visible dans la section.'}</span>
            ${icone('i-arrow')}
          </button>`}
          <button type="button" class="ad-row" data-do="archiver">
            ${icone('i-archive', 'ad-ico-lg')}
            <span><strong>Archiver</strong>${archiveParDateSeule
              ? 'Verrouille son retrait du site : elle ne reviendra pas en ligne même si vous repoussez la date de fin plus tard.'
              : 'La fiche est rangée dans les archives et retirée du site.'}</span>
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
      mettreEnAvant: { featured: true },
      retirerBandeau: { featured: false },
      archiver: { archived: true, featured: false },
      desarchiver: { archived: false }
    }[quoi];
    if (!champs) return;

    // Désarchiver ne lève que le drapeau manuel : si la date de fin de
    // parution est elle aussi dépassée, la fiche reste hors ligne — le
    // message ne doit pas prétendre le contraire (voir AdminStore.estArchive).
    const encoreExpire = quoi === 'desarchiver' && ev.ends_at && AdminStore.estPasse(ev.ends_at);
    const messages = {
      mettreEnAvant: 'Événement mis en avant dans le bandeau.',
      retirerBandeau: 'Événement retiré du bandeau. Il reste publié sur le site.',
      archiver: 'Événement archivé.',
      desarchiver: encoreExpire
        ? 'Archivage manuel retiré. La fin de parution reste dépassée : modifiez-la pour remettre la fiche en ligne.'
        : 'Événement remis en ligne.'
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
    let imageUrl = ev && ev.image_url ? ev.image_url : null;
    let imagePendingDataUrl = null;
    let imageRetiree = false;

    const corps = document.createElement('div');
    corps.innerHTML = `
      <form novalidate>
        <div class="ad-field">
          <label for="ev-title">Titre</label>
          <input type="text" id="ev-title" required maxlength="${LIMITES.title}" value="${echapper(ev ? ev.title : '')}">
          <p class="ad-hint">S'affiche en gros dans le bandeau, par exemple « Portes ouvertes du 27 juin ».</p>
          <p class="ad-hint" data-counter="ev-title"></p>
        </div>

        <div class="ad-field">
          <label>Image</label>
          <input type="file" id="ev-image-input" accept="image/jpeg,image/png,image/webp" hidden>
          <div data-slot="image"></div>
          <p class="ad-hint">Facultative. Redimensionnée et compressée automatiquement au chargement (1600 px maximum, JPEG).</p>
        </div>

        <div class="ad-field">
          <label for="ev-date">Date de l'événement</label>
          <input type="date" id="ev-date" value="${ev && ev.starts_at ? echapper(String(ev.starts_at).slice(0, 10)) : ''}">
          <p class="ad-hint">Facultative. Elle sert à classer les fiches et à repérer les événements passés.</p>
        </div>

        <div class="ad-field">
          <label for="ev-end">Date de fin de parution</label>
          <input type="date" id="ev-end" value="${ev && ev.ends_at ? echapper(String(ev.ends_at).slice(0, 10)) : ''}">
          <p class="ad-hint">Facultative. Passé cette date, l'événement disparaît du site et bascule automatiquement dans les archives.</p>
        </div>

        <div class="ad-field">
          <label for="ev-tag">Étiquette</label>
          <input type="text" id="ev-tag" maxlength="${LIMITES.tag}" value="${echapper(ev ? ev.tag : TAG_DEFAUT)}">
          <p class="ad-hint">La petite mention placée au-dessus du titre.</p>
          <p class="ad-hint" data-counter="ev-tag"></p>
        </div>

        <div class="ad-field">
          <label for="ev-description">Description</label>
          <textarea id="ev-description" maxlength="${LIMITES.description}">${echapper(ev ? ev.description : '')}</textarea>
          <p class="ad-hint">Deux ou trois phrases : ce qui se passe, quand, et où.</p>
          <p class="ad-hint" data-counter="ev-description"></p>
        </div>

        <div class="ad-switch">
          <input type="checkbox" id="ev-featured" ${ev && ev.featured ? 'checked' : ''}>
          <div>
            <label for="ev-featured">Mettre en avant dans le bandeau</label>
            <p class="ad-hint">Un seul événement à la fois : cocher celui-ci retire automatiquement le précédent.
              Cet événement reste de toute façon visible dans la section « Événements à venir » du site, coché ou non.</p>
          </div>
        </div>
      </form>
    `;

    const form = corps.querySelector('form');
    const champs = {
      title: corps.querySelector('#ev-title'),
      date: corps.querySelector('#ev-date'),
      end: corps.querySelector('#ev-end'),
      tag: corps.querySelector('#ev-tag'),
      description: corps.querySelector('#ev-description'),
      featured: corps.querySelector('#ev-featured')
    };

    // Compteurs de caractères, mis à jour à la frappe.
    corps.querySelectorAll('[data-counter]').forEach((p) => {
      const champ = corps.querySelector(`#${p.dataset.counter}`);
      const maj = () => { p.textContent = `${champ.value.length}/${champ.maxLength}`; };
      champ.addEventListener('input', maj);
      maj();
    });

    // Champ image : aperçu (existant, ou fichier tout juste redimensionné)
    // et changer/retirer, ou dépôt si aucune image n'est encore choisie.
    const fichierInput = corps.querySelector('#ev-image-input');

    function rendreImage() {
      const slot = corps.querySelector('[data-slot="image"]');
      const affichee = imagePendingDataUrl || (imageRetiree ? null : imageUrl);
      slot.innerHTML = affichee ? `
        <div class="ad-image-preview-wrap">
          <img class="ad-image-preview" src="${echapper(affichee)}" alt="">
          <div class="ad-image-actions">
            <button type="button" class="ad-btn ad-btn-line ad-btn-sm" data-img="changer">Changer l’image</button>
            <button type="button" class="ad-btn ad-btn-line ad-btn-sm" data-img="retirer">Retirer l’image</button>
          </div>
        </div>
      ` : `
        <label class="ad-image-drop" for="ev-image-input">
          ${icone('i-image', 'ad-ico-xl')}
          <span>Ajouter une image</span>
        </label>
      `;
      const changer = slot.querySelector('[data-img="changer"]');
      if (changer) changer.addEventListener('click', () => fichierInput.click());
      const retirer = slot.querySelector('[data-img="retirer"]');
      if (retirer) retirer.addEventListener('click', () => {
        imagePendingDataUrl = null;
        imageRetiree = true;
        fichierInput.value = '';
        rendreImage();
      });
    }
    rendreImage();

    fichierInput.addEventListener('change', async () => {
      const fichier = fichierInput.files && fichierInput.files[0];
      if (!fichier) return;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(fichier.type)) {
        AdminPanel.alerte('Format d’image non pris en charge : utilisez un JPEG, un PNG ou un WebP.');
        fichierInput.value = '';
        return;
      }
      if (fichier.size > IMAGE_MAX_SOURCE_BYTES) {
        AdminPanel.alerte('Cette image est trop lourde (15 Mo maximum avant redimensionnement).');
        fichierInput.value = '';
        return;
      }
      try {
        imagePendingDataUrl = await redimensionnerImage(fichier);
        imageRetiree = false;
        rendreImage();
      } catch {
        AdminPanel.alerte('Cette image n’a pas pu être lue. Essayez un autre fichier.');
        fichierInput.value = '';
      }
    });

    async function enregistrer() {
      const payload = {
        title: champs.title.value.trim(),
        tag: champs.tag.value.trim(),
        description: champs.description.value.trim(),
        starts_at: champs.date.value || null,
        ends_at: champs.end.value || null,
        featured: champs.featured.checked
      };
      if (modif) payload.archived = !!ev.archived && !payload.featured;

      if (!payload.title) {
        AdminPanel.alerte('Le titre est obligatoire : c’est lui qui identifie l’événement.');
        champs.title.focus();
        return;
      }

      AdminPanel.cacherAlerte();
      AdminPanel.occuper('enregistrer', true, imagePendingDataUrl ? 'Envoi de l’image…' : 'Enregistrement…');

      if (imagePendingDataUrl) {
        try {
          const televersee = await televerserImage(imagePendingDataUrl);
          // Une fois envoyée, l'image devient l'état validé : un nouvel essai
          // après un échec de sauvegarde ne doit pas la retéléverser.
          imageUrl = televersee.url;
          imagePendingDataUrl = null;
        } catch {
          AdminPanel.occuper('enregistrer', false);
          AdminPanel.alerte('L’image n’a pas pu être envoyée. Réessayez, ou enregistrez sans image.');
          return;
        }
      }
      payload.image_url = imageRetiree ? null : imageUrl;

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
