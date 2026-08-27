/* ============================================================
   ADMIN-PLANNING — page « Planning ». Tout créneau enregistré ici
   apparaît dans la section « Planning » du site, dans l'ordre choisi
   (« Monter » / « Descendre »).

   La page ne montre qu'une liste ; tout ce qui agit (consulter,
   modifier, réordonner, supprimer) se passe dans le panneau latéral
   partagé (assets/js/admin-panel.js). Les données viennent du magasin
   commun (assets/js/admin-store.js).
   S'enregistre dans window.AdminModules, monté par assets/js/admin.js.
   ============================================================ */
(function registerPlanningPage() {
  // day et time restent limités à 40/60 caractères côté serveur
  // (api/_lib/planning.js) : la marge est large, le jour vient d'une
  // liste fixe et l'horaire est composé, jamais tapé.
  const LIMITES = { label: 120, place: 160, note: 160 };

  const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  let root = null;
  let page = null;
  let desabonner = null;
  let dernierSnap = null;

  function icone(id, classe) {
    return `<svg class="ad-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  // La pastille du menu doit refléter le magasin dès qu'il est chargé, pas
  // seulement une fois la page « Planning » visitée : cet abonnement se
  // pose via `init` (une fois par session, voir assets/js/admin.js), pas
  // dans mount()/unmount(), qui ne vivent que pendant la visite.
  function init(api) {
    AdminStore.abonnerPlanning((snap) => {
      api.setBadge(snap.statut === 'pret' && snap.slots.length ? snap.slots.length : null);
    });
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

  // Liste d'options <option> pour le <select> du jour. La valeur en
  // cours d'édition est toujours proposée même absente de JOURS : une
  // valeur saisie avant l'introduction du <select> ne doit pas être
  // silencieusement remplacée à la prochaine ouverture du formulaire.
  function optionsJours(valeurActuelle) {
    const connue = JOURS.includes(valeurActuelle);
    const liste = valeurActuelle && !connue ? [valeurActuelle, ...JOURS] : JOURS;
    const vide = valeurActuelle
      ? ''
      : '<option value="" disabled selected>Choisir un jour</option>';
    return (
      vide +
      liste
        .map(
          (j) =>
            `<option value="${echapper(j)}"${j === valeurActuelle ? ' selected' : ''}>${echapper(j)}</option>`
        )
        .join('')
    );
  }

  // Relit un horaire déjà composé ("17 h 45 — 18 h 45") pour préremplir
  // les deux <input type="time"> à l'édition. Renvoie null si le texte
  // ne correspond pas au format attendu (créneau saisi en texte libre
  // avant l'introduction de ces champs) : le formulaire repart alors
  // vide plutôt que d'afficher une valeur fausse.
  function analyserHoraire(txt) {
    const m = String(txt || '')
      .trim()
      .match(/^(\d{1,2})\s*h\s*(\d{1,2})?\s*(?:[-–—]\s*(\d{1,2})\s*h\s*(\d{1,2})?)?$/i);
    if (!m) return null;
    const deux = (n) => String(n || 0).padStart(2, '0');
    return {
      debut: `${deux(m[1])}:${deux(m[2])}`,
      fin: m[3] ? `${deux(m[3])}:${deux(m[4])}` : ''
    };
  }

  // Formate une valeur d'<input type="time"> ("HH:MM") à la française :
  // les minutes disparaissent quand elles sont nulles ("18 h", pas "18 h 00").
  function formaterHeure(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
  }

  function composerHoraire(debut, fin) {
    if (!debut) return '';
    return fin ? `${formaterHeure(debut)} — ${formaterHeure(fin)}` : formaterHeure(debut);
  }

  /* ---------------------------------------------------------------
     Montage
     --------------------------------------------------------------- */

  function mount(container, api) {
    root = container;
    page = api;

    page.setActions([
      {
        label: 'Ajouter un créneau',
        icone: 'i-plus',
        style: 'ad-btn-primary',
        onClick: ouvrirNouveau
      }
    ]);

    root.innerHTML = `
      <p class="ad-lede">Les jours et horaires de séance affichés dans la section « Planning » du site,
        dans l'ordre où ils apparaissent ici.</p>
      <div data-slot="liste"></div>
    `;

    desabonner = AdminStore.abonnerPlanning((snap) => {
      dernierSnap = snap;
      rendre(snap);
    });
    AdminStore.chargerPlanning();
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

    if (snap.statut === 'chargement' || snap.statut === 'attente') {
      cible.innerHTML = `
        <div class="ad-skeleton" aria-hidden="true">
          ${[70, 54, 62].map((w) => `<div class="ad-skeleton-bar" style="width:${w}%"></div>`).join('')}
        </div>
        <p class="ad-sr" role="status">Chargement du planning.</p>
      `;
      return;
    }

    if (snap.statut === 'erreur') {
      cible.innerHTML = `
        <div class="ad-alert" role="alert">
          ${icone('i-alert')}
          <div>
            ${
              snap.erreur === 'session'
                ? 'Votre session a expiré. Rechargez la page pour vous reconnecter.'
                : 'Le planning n’a pas pu être chargé.'
            }
            <div class="ad-alert-actions">
              <button type="button" class="ad-btn ad-btn-line ad-btn-sm" data-action="retry">Réessayer</button>
            </div>
          </div>
        </div>
      `;
      cible
        .querySelector('[data-action="retry"]')
        .addEventListener('click', () => AdminStore.chargerPlanning());
      return;
    }

    if (!snap.slots.length) {
      cible.innerHTML = vide();
      const cta = cible.querySelector('[data-action="nouveau"]');
      if (cta) cta.addEventListener('click', ouvrirNouveau);
      return;
    }

    cible.innerHTML = `
      <div class="ad-tablewrap">
        <table class="ad-table ad-table-click">
          <thead>
            <tr>
              <th scope="col" class="ad-col-date">Jour</th>
              <th scope="col">Horaire</th>
              <th scope="col">Lieu</th>
              <th scope="col">Mention</th>
              <th scope="col" class="ad-col-go"><span class="ad-sr">Ouvrir la fiche</span></th>
            </tr>
          </thead>
          <tbody>${snap.slots.map(ligne).join('')}</tbody>
        </table>
      </div>
    `;

    cible.querySelectorAll('tbody tr').forEach((tr) => {
      const bouton = tr.querySelector('[data-open]');
      tr.addEventListener('click', (e) => {
        if (e.target.closest('a, button') && !e.target.closest('[data-open]')) return;
        bouton.click();
      });
    });
    cible.querySelectorAll('[data-open]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slot = dernierSnap.slots.find((item) => String(item.id) === btn.dataset.open);
        if (slot) ouvrirFiche(slot);
      });
    });
  }

  function ligne(slot) {
    return `
      <tr>
        <td class="ad-col-date"><b>${echapper(slot.day)}</b></td>
        <td>
          <button type="button" class="ad-cellbtn" data-open="${echapper(slot.id)}">${echapper(slot.time)}</button>
          ${slot.label ? `<small class="ad-sub">${echapper(slot.label)}</small>` : ''}
        </td>
        <td>${slot.place ? echapper(slot.place) : '<span class="ad-muet">—</span>'}</td>
        <td>${slot.note ? echapper(slot.note) : '<span class="ad-muet">—</span>'}</td>
        <td class="ad-col-go">${icone('i-arrow')}</td>
      </tr>
    `;
  }

  function vide() {
    return `
      <div class="ad-empty">
        ${icone('i-clock', 'ad-ico-xl')}
        <p class="ad-empty-title">Aucun créneau enregistré</p>
        <p>La section « Planning » du site affiche à la place un message invitant les visiteurs à vous
          contacter pour connaître les prochains horaires.</p>
        <button type="button" class="ad-btn ad-btn-primary ad-empty-cta" data-action="nouveau">
          ${icone('i-plus')}<span>Ajouter un créneau</span>
        </button>
      </div>
    `;
  }

  /* ---------------------------------------------------------------
     Panneau — consulter une fiche
     --------------------------------------------------------------- */

  function ouvrirFiche(slot) {
    const liste = (dernierSnap && dernierSnap.slots) || [];
    const index = liste.findIndex((s) => String(s.id) === String(slot.id));
    const premier = index <= 0;
    const dernier = index === -1 || index === liste.length - 1;

    const corps = document.createElement('div');
    corps.innerHTML = `
      <dl class="ad-facts ad-facts-tight">
        <div class="ad-fact">
          <dt>${icone('i-clock')}Jour</dt>
          <dd><b>${echapper(slot.day)}</b></dd>
        </div>
        <div class="ad-fact">
          <dt>${icone('i-clock')}Horaire</dt>
          <dd>${echapper(slot.time)}</dd>
        </div>
        <div class="ad-fact">
          <dt>${icone('i-text')}Mention</dt>
          <dd>${slot.label ? echapper(slot.label) : '<span class="ad-muet">Aucune</span>'}</dd>
        </div>
        <div class="ad-fact">
          <dt>${icone('i-pin')}Lieu</dt>
          <dd>${slot.place ? echapper(slot.place) : '<span class="ad-muet">Aucun</span>'}</dd>
        </div>
        <div class="ad-fact">
          <dt>${icone('i-info')}Note</dt>
          <dd>${slot.note ? echapper(slot.note) : '<span class="ad-muet">Aucune</span>'}</dd>
        </div>
      </dl>

      <h3 class="ad-box-title ad-box-title-sep">Actions</h3>
      <div class="ad-rows">
        ${
          !premier
            ? `
        <button type="button" class="ad-row" data-do="monter">
          ${icone('i-arrow-up', 'ad-ico-lg')}
          <span><strong>Monter</strong>Fait apparaître ce créneau avant le précédent dans la section « Planning ».</span>
          ${icone('i-arrow')}
        </button>`
            : ''
        }
        ${
          !dernier
            ? `
        <button type="button" class="ad-row" data-do="descendre">
          ${icone('i-arrow-down', 'ad-ico-lg')}
          <span><strong>Descendre</strong>Fait apparaître ce créneau après le suivant dans la section « Planning ».</span>
          ${icone('i-arrow')}
        </button>`
            : ''
        }
        <button type="button" class="ad-row ad-row-danger" data-do="supprimer">
          ${icone('i-trash', 'ad-ico-lg')}
          <span><strong>Supprimer définitivement</strong>Le créneau est effacé. Cette action ne peut pas être annulée.</span>
          ${icone('i-arrow')}
        </button>
      </div>
    `;

    AdminPanel.ouvrir({
      icone: 'i-clock',
      chapeau: 'Créneau',
      titre: `${slot.day} · ${slot.time}`,
      corps,
      actions: [
        {
          id: 'modifier',
          label: 'Modifier',
          icone: 'i-pencil',
          style: 'ad-btn-primary',
          onClick: () => ouvrirFormulaire(slot)
        },
        { id: 'fermer', label: 'Fermer', onClick: () => AdminPanel.fermer() }
      ]
    });

    corps.querySelectorAll('[data-do]').forEach((btn) => {
      btn.addEventListener('click', () => agir(btn.dataset.do, slot, btn));
    });
  }

  async function agir(quoi, slot, btn) {
    if (quoi === 'supprimer') {
      confirmerSuppression(slot);
      return;
    }
    if (quoi !== 'monter' && quoi !== 'descendre') return;

    btn.disabled = true;
    btn.classList.add('is-occupe');
    AdminPanel.cacherAlerte();
    try {
      await AdminStore.deplacerPlanning(slot.id, quoi === 'monter' ? 'haut' : 'bas');
    } catch {
      btn.disabled = false;
      btn.classList.remove('is-occupe');
      AdminPanel.alerte('Le déplacement n’a pas pu être enregistré. Réessayez dans un instant.');
      return;
    }
    AdminPanel.fermer();
    if (page)
      page.flash(
        quoi === 'monter' ? 'Créneau déplacé vers le haut.' : 'Créneau déplacé vers le bas.'
      );
  }

  function confirmerSuppression(slot) {
    const corps = document.createElement('div');
    corps.innerHTML = `
      <div class="ad-note ad-note-danger">
        ${icone('i-alert', 'ad-ico-lg')}
        <div>
          <strong>Cette suppression est définitive</strong>
          Le créneau « ${echapper(slot.day)} · ${echapper(slot.time)} » sera effacé et disparaîtra de la section
          « Planning » du site.
        </div>
      </div>
    `;

    AdminPanel.ouvrir({
      icone: 'i-trash',
      chapeau: 'Supprimer',
      titre: `${slot.day} · ${slot.time}`,
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
              await AdminStore.supprimerPlanning(slot.id);
            } catch {
              AdminPanel.occuper('supprimer', false);
              AdminPanel.alerte('La suppression a échoué. Réessayez dans un instant.');
              return;
            }
            AdminPanel.fermer();
            if (page) page.flash('Créneau supprimé.');
          }
        },
        { id: 'retour', label: 'Revenir à la fiche', onClick: () => ouvrirFiche(slot) }
      ]
    });
  }

  /* ---------------------------------------------------------------
     Panneau — créer et modifier
     --------------------------------------------------------------- */

  function ouvrirNouveau() {
    ouvrirFormulaire(null);
  }

  function ouvrirFormulaire(slot) {
    const modif = !!slot;
    const horaire = (slot && analyserHoraire(slot.time)) || { debut: '', fin: '' };

    const corps = document.createElement('div');
    corps.innerHTML = `
      <form novalidate>
        <div class="ad-field">
          <label for="pl-day">Jour</label>
          <select id="pl-day" required>${optionsJours(slot ? slot.day : '')}</select>
        </div>

        <div class="ad-field">
          <label for="pl-time-debut">Heure de début</label>
          <input type="time" id="pl-time-debut" required value="${echapper(horaire.debut)}">
        </div>

        <div class="ad-field">
          <label for="pl-time-fin">Heure de fin</label>
          <input type="time" id="pl-time-fin" value="${echapper(horaire.fin)}">
          <p class="ad-hint">Facultative : laissez vide pour un horaire sans heure de fin affichée.</p>
        </div>

        <div class="ad-field">
          <label for="pl-label">Mention</label>
          <input type="text" id="pl-label" maxlength="${LIMITES.label}" value="${echapper(slot ? slot.label : '')}" placeholder="Séance Zenway · tous niveaux">
          <p class="ad-hint" data-counter="pl-label"></p>
        </div>

        <div class="ad-field">
          <label for="pl-place">Lieu</label>
          <input type="text" id="pl-place" maxlength="${LIMITES.place}" value="${echapper(slot ? slot.place : '')}" placeholder="KMCS, 357 chemin des Iscles, Saint-Laurent-du-Var">
          <p class="ad-hint" data-counter="pl-place"></p>
        </div>

        <div class="ad-field">
          <label for="pl-note">Note</label>
          <input type="text" id="pl-note" maxlength="${LIMITES.note}" value="${echapper(slot ? slot.note : '')}" placeholder="Début des cours le mardi 8 septembre">
          <p class="ad-hint">Facultative : une mention affichée sous le créneau, par exemple une date de rentrée.</p>
          <p class="ad-hint" data-counter="pl-note"></p>
        </div>
      </form>
    `;

    const form = corps.querySelector('form');
    const champs = {
      day: corps.querySelector('#pl-day'),
      timeDebut: corps.querySelector('#pl-time-debut'),
      timeFin: corps.querySelector('#pl-time-fin'),
      label: corps.querySelector('#pl-label'),
      place: corps.querySelector('#pl-place'),
      note: corps.querySelector('#pl-note')
    };

    corps.querySelectorAll('[data-counter]').forEach((p) => {
      const champ = corps.querySelector(`#${p.dataset.counter}`);
      const maj = () => {
        p.textContent = `${champ.value.length}/${champ.maxLength}`;
      };
      champ.addEventListener('input', maj);
      maj();
    });

    async function enregistrer() {
      const payload = {
        day: champs.day.value,
        time: composerHoraire(champs.timeDebut.value, champs.timeFin.value),
        label: champs.label.value.trim(),
        place: champs.place.value.trim(),
        note: champs.note.value.trim()
      };

      if (!payload.day) {
        AdminPanel.alerte('Le jour est obligatoire.');
        champs.day.focus();
        return;
      }
      if (!champs.timeDebut.value) {
        AdminPanel.alerte('L’heure de début est obligatoire.');
        champs.timeDebut.focus();
        return;
      }

      AdminPanel.cacherAlerte();
      AdminPanel.occuper('enregistrer', true, 'Enregistrement…');

      try {
        await AdminStore.enregistrerPlanning(payload, modif ? slot.id : null);
      } catch {
        AdminPanel.occuper('enregistrer', false);
        AdminPanel.alerte(
          'L’enregistrement a échoué. Vos informations sont toujours là : réessayez.'
        );
        return;
      }
      AdminPanel.fermer();
      if (page) page.flash(modif ? 'Modifications enregistrées.' : 'Créneau enregistré.');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      enregistrer();
    });

    AdminPanel.ouvrir({
      icone: modif ? 'i-pencil' : 'i-plus',
      chapeau: modif ? 'Modifier' : 'Nouveau créneau',
      titre: modif ? `${slot.day} · ${slot.time}` : 'Ajouter un créneau',
      corps,
      actions: [
        {
          id: 'enregistrer',
          label: 'Enregistrer',
          icone: 'i-check',
          style: 'ad-btn-primary',
          onClick: enregistrer
        },
        {
          id: 'annuler',
          label: modif ? 'Revenir à la fiche' : 'Annuler',
          onClick: () => (modif ? ouvrirFiche(slot) : AdminPanel.fermer())
        }
      ]
    });
  }

  window.AdminModules = window.AdminModules || [];
  window.AdminModules.push({
    id: 'planning',
    label: 'Planning',
    icon: 'i-clock',
    title: 'Planning',
    init,
    mount,
    unmount
  });
})();
