/* ============================================================
   ADMIN-INFOS — page « Infos pratiques ». Fiche unique (pas une
   liste) : adresse, parking, téléphone, e-mail et prochain
   rendez-vous, affichés dans la section « Infos pratiques » du site
   public. Modifiable depuis un seul panneau d'édition.

   Les données viennent du magasin commun (assets/js/admin-store.js),
   modifiées via le panneau latéral partagé (assets/js/admin-panel.js).
   S'enregistre dans window.AdminModules, monté par assets/js/admin.js.
   ============================================================ */
(function registerInfosPage() {
  const LIMITES = { address: 200, map_url: 300, parking: 120, phone: 30, email: 120, next_session: 120 };

  let root = null;
  let page = null;
  let desabonner = null;
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

  function echapperMultiligne(str) {
    return echapper(str).replace(/\n/g, '<br>');
  }

  /* ---------------------------------------------------------------
     Montage
     --------------------------------------------------------------- */

  function mount(container, api) {
    root = container;
    page = api;

    // Le bouton n'est posé qu'une fois la fiche connue (voir rendre) :
    // proposer « Modifier » alors qu'aucune ligne n'existe en base mène à
    // un formulaire dont l'enregistrement ne peut qu'échouer.
    page.setActions([]);

    root.innerHTML = `
      <p class="ad-lede">Adresse, parking, téléphone, e-mail et prochain rendez-vous, affichés dans la
        section « Infos pratiques » du site.</p>
      <div data-slot="fiche"></div>
    `;

    desabonner = AdminStore.abonnerInfos((snap) => {
      dernierSnap = snap;
      rendre(snap);
    });
    AdminStore.chargerInfos();
  }

  function unmount() {
    if (desabonner) desabonner();
    desabonner = null;
    root = null;
    page = null;
    dernierSnap = null;
  }

  /* ---------------------------------------------------------------
     Rendu de la fiche
     --------------------------------------------------------------- */

  function rendre(snap) {
    if (!root || !snap) return;
    const cible = root.querySelector('[data-slot="fiche"]');

    // Il n'y a quelque chose à modifier que si une fiche existe vraiment.
    if (page) {
      page.setActions(snap.statut === 'pret' && snap.infos
        ? [{ label: 'Modifier les infos', icone: 'i-pencil', style: 'ad-btn-primary', onClick: ouvrirFormulaire }]
        : []);
    }

    if (snap.statut === 'chargement' || snap.statut === 'attente') {
      cible.innerHTML = `
        <div class="ad-skeleton" aria-hidden="true">
          ${[54, 42, 60, 48, 36].map((w) => `<div class="ad-skeleton-bar" style="width:${w}%"></div>`).join('')}
        </div>
        <p class="ad-sr" role="status">Chargement des infos pratiques.</p>
      `;
      return;
    }

    if (snap.statut === 'erreur') {
      cible.innerHTML = `
        <div class="ad-alert" role="alert">
          ${icone('i-alert')}
          <div>
            Les infos pratiques n’ont pas pu être chargées.
            <div class="ad-alert-actions">
              <button type="button" class="ad-btn ad-btn-line ad-btn-sm" data-action="retry">Réessayer</button>
            </div>
          </div>
        </div>
      `;
      cible.querySelector('[data-action="retry"]').addEventListener('click', () => AdminStore.chargerInfos());
      return;
    }

    if (!snap.infos) {
      cible.innerHTML = `
        <div class="ad-empty">
          ${icone('i-pin', 'ad-ico-xl')}
          <p class="ad-empty-title">Aucune fiche en base</p>
          <p>La migration <code>008_infos_pratiques.sql</code> et son seed n'ont pas encore été joués sur
            Supabase. Le site public affiche en attendant le contenu écrit dans <code>index.html</code>.</p>
        </div>
      `;
      return;
    }

    const i = snap.infos;
    cible.innerHTML = `
      <section class="ad-box">
        <h2 class="ad-box-title">Ce que le site affiche</h2>
        <dl class="ad-facts">
          <div class="ad-fact">
            <dt>${icone('i-pin')}Lieu</dt>
            <dd>
              <b>${echapperMultiligne(i.address)}</b>
              ${i.map_url ? `<small>${echapper(i.map_url)}</small>` : ''}
            </dd>
          </div>
          <div class="ad-fact">
            <dt>${icone('i-pin')}Parking</dt>
            <dd><b>${echapper(i.parking)}</b></dd>
          </div>
          <div class="ad-fact">
            <dt>${icone('i-phone')}Téléphone</dt>
            <dd><b>${echapper(i.phone)}</b></dd>
          </div>
          <div class="ad-fact">
            <dt>${icone('i-mail')}E-mail</dt>
            <dd><b>${echapper(i.email)}</b></dd>
          </div>
          <div class="ad-fact">
            <dt>${icone('i-calendar')}Prochain rendez-vous</dt>
            <dd>${i.next_session ? `<b>${echapper(i.next_session)}</b>` : '<span class="ad-muet">Aucun — la ligne est masquée sur le site</span>'}</dd>
          </div>
        </dl>
      </section>

      <div class="ad-note">
        ${icone('i-info')}
        <div>
          Ces valeurs sont lues par le site public via <code>/api/infos</code> : toute
          modification enregistrée ici y apparaît dès le prochain chargement de la page.
        </div>
      </div>
    `;
  }

  /* ---------------------------------------------------------------
     Panneau — modifier
     --------------------------------------------------------------- */

  function ouvrirFormulaire() {
    const i = (dernierSnap && dernierSnap.infos) || {
      address: '', map_url: '', parking: '', phone: '', email: '', next_session: ''
    };

    const corps = document.createElement('div');
    corps.innerHTML = `
      <form novalidate>
        <div class="ad-field">
          <label for="in-address">Adresse</label>
          <textarea id="in-address" rows="2" maxlength="${LIMITES.address}" placeholder="KMCS, 357 chemin des Iscles
06700 Saint-Laurent-du-Var">${echapper(i.address)}</textarea>
          <p class="ad-hint">Un retour à la ligne sépare la rue de la ville, comme sur le site.</p>
          <p class="ad-hint" data-counter="in-address"></p>
        </div>

        <div class="ad-field">
          <label for="in-map">Lien vers la carte</label>
          <input type="url" id="in-map" maxlength="${LIMITES.map_url}" value="${echapper(i.map_url)}" placeholder="https://maps.app.goo.gl/...">
          <p class="ad-hint">Le lien cliquable derrière l'adresse, pas la carte affichée à côté (fixe).</p>
        </div>

        <div class="ad-field">
          <label for="in-parking">Parking</label>
          <input type="text" id="in-parking" maxlength="${LIMITES.parking}" value="${echapper(i.parking)}" placeholder="Stationnement gratuit sur place">
          <p class="ad-hint" data-counter="in-parking"></p>
        </div>

        <div class="ad-field">
          <label for="in-phone">Téléphone</label>
          <input type="tel" id="in-phone" maxlength="${LIMITES.phone}" value="${echapper(i.phone)}" placeholder="06 66 05 66 49">
        </div>

        <div class="ad-field">
          <label for="in-email">E-mail</label>
          <input type="email" id="in-email" maxlength="${LIMITES.email}" value="${echapper(i.email)}" placeholder="contact@zenwaysaintlaurentduvar.fr">
        </div>

        <div class="ad-field">
          <label for="in-next">Prochain rendez-vous</label>
          <input type="text" id="in-next" maxlength="${LIMITES.next_session}" value="${echapper(i.next_session)}" placeholder="Mardi 8 septembre, 17 h 45 – 18 h 45">
          <p class="ad-hint">Facultatif : laissez vide pour masquer cette ligne sur le site.</p>
          <p class="ad-hint" data-counter="in-next"></p>
        </div>
      </form>
    `;

    const form = corps.querySelector('form');
    const champs = {
      address: corps.querySelector('#in-address'),
      mapUrl: corps.querySelector('#in-map'),
      parking: corps.querySelector('#in-parking'),
      phone: corps.querySelector('#in-phone'),
      email: corps.querySelector('#in-email'),
      nextSession: corps.querySelector('#in-next')
    };

    corps.querySelectorAll('[data-counter]').forEach((p) => {
      const champ = corps.querySelector(`#${p.dataset.counter}`);
      const maj = () => { p.textContent = `${champ.value.length}/${champ.maxLength}`; };
      champ.addEventListener('input', maj);
      maj();
    });

    async function enregistrer() {
      const payload = {
        address: champs.address.value.trim(),
        map_url: champs.mapUrl.value.trim(),
        parking: champs.parking.value.trim(),
        phone: champs.phone.value.trim(),
        email: champs.email.value.trim(),
        next_session: champs.nextSession.value.trim()
      };

      if (!payload.address) {
        AdminPanel.alerte('L’adresse est obligatoire.');
        champs.address.focus();
        return;
      }
      if (!payload.map_url) {
        AdminPanel.alerte('Le lien vers la carte est obligatoire.');
        champs.mapUrl.focus();
        return;
      }
      // Même règle que le serveur (api/_lib/infos.js), dite ici en clair
      // plutôt que renvoyée comme un refus générique après l'envoi.
      if (!/^https:\/\/\S+$/i.test(payload.map_url)) {
        AdminPanel.alerte('Le lien vers la carte doit commencer par https:// — copiez-le depuis Google Maps.');
        champs.mapUrl.focus();
        return;
      }
      if (!payload.parking) {
        AdminPanel.alerte('Le parking est obligatoire.');
        champs.parking.focus();
        return;
      }
      if (!payload.phone) {
        AdminPanel.alerte('Le téléphone est obligatoire.');
        champs.phone.focus();
        return;
      }
      if (!payload.email) {
        AdminPanel.alerte('L’e-mail est obligatoire.');
        champs.email.focus();
        return;
      }

      AdminPanel.cacherAlerte();
      AdminPanel.occuper('enregistrer', true, 'Enregistrement…');

      try {
        await AdminStore.enregistrerInfos(payload);
      } catch {
        AdminPanel.occuper('enregistrer', false);
        AdminPanel.alerte('L’enregistrement a échoué. Vos informations sont toujours là : réessayez.');
        return;
      }
      AdminPanel.fermer();
      if (page) page.flash('Infos pratiques mises à jour.');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      enregistrer();
    });

    AdminPanel.ouvrir({
      icone: 'i-pencil',
      chapeau: 'Infos pratiques',
      titre: 'Modifier les infos',
      corps,
      actions: [
        { id: 'enregistrer', label: 'Enregistrer', icone: 'i-check', style: 'ad-btn-primary', onClick: enregistrer },
        { id: 'annuler', label: 'Annuler', onClick: () => AdminPanel.fermer() }
      ]
    });
  }

  window.AdminModules = window.AdminModules || [];
  window.AdminModules.push({
    id: 'infos',
    label: 'Infos pratiques',
    icon: 'i-pin',
    title: 'Infos pratiques',
    mount,
    unmount
  });
})();
