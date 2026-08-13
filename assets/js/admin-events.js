/* ============================================================
   ADMIN-EVENTS — feuille « Événements ». Commande le bandeau haut
   du site et la section « Événements à venir ». Un seul événement
   peut être en ligne à la fois : l'API retire le précédent.
   S'enregistre dans window.AdminModules, monté par assets/js/admin.js.
   ============================================================ */
(function registerEventsModule() {
  const TAG_DEFAUT = 'Prochain événement';

  let root = null;
  let sheet = null;
  let listEl = null;
  let form = null;
  let fields = null;
  let formTitleEl = null;
  let cancelBtn = null;
  let submitBtn = null;
  let formAlertEl = null;
  let editingId = null;
  let events = [];

  function icon(id) {
    return `<svg class="bo-ico" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function mount(container, api) {
    root = container;
    sheet = api;
    editingId = null;
    events = [];

    root.innerHTML = `
      <div class="bo-block">
        <h3 class="bo-block-title" id="ev-form-title">Ajouter un événement</h3>
        <p class="bo-block-note">Renseignez ce que verront les visiteurs, puis choisissez de l'afficher tout de suite ou de le garder de côté.</p>

        <form id="ev-form" novalidate>
          <div class="bo-field">
            <label for="ev-title">Titre</label>
            <input type="text" id="ev-title" required>
            <p class="bo-hint">Le titre s'affiche en gros dans le bandeau, par exemple « Portes ouvertes du 27 juin ».</p>
          </div>

          <div class="bo-field">
            <label for="ev-tag">Étiquette</label>
            <input type="text" id="ev-tag" value="${TAG_DEFAUT}">
            <p class="bo-hint">La petite mention placée au-dessus du titre.</p>
          </div>

          <div class="bo-field">
            <label for="ev-description">Description</label>
            <textarea id="ev-description"></textarea>
            <p class="bo-hint">Deux ou trois phrases : ce qui se passe, quand, et où.</p>
          </div>

          <div class="bo-field">
            <label for="ev-link">Lien d'inscription</label>
            <input type="url" id="ev-link" placeholder="https://www.helloasso.com/..." required>
            <p class="bo-hint">La page HelloAsso, ou toute autre adresse vers laquelle envoyer les visiteurs.</p>
          </div>

          <div class="bo-switch">
            <input type="checkbox" id="ev-active">
            <div>
              <label for="ev-active">Afficher cet événement sur le site</label>
              <p class="bo-hint">Un seul événement peut être en ligne à la fois : afficher celui-ci retire automatiquement le précédent.</p>
            </div>
          </div>

          <div class="bo-alert" id="ev-form-alert" role="alert" hidden></div>

          <div class="bo-actions">
            <button type="submit" class="bo-btn bo-btn-primary" id="ev-submit">
              ${icon('i-check')}<span>Enregistrer</span>
            </button>
            <button type="button" class="bo-btn bo-btn-line" id="ev-cancel" hidden>Annuler la modification</button>
          </div>
        </form>
      </div>

      <div class="bo-block">
        <h3 class="bo-block-title">Événements enregistrés</h3>
        <p class="bo-block-note">Tout ce qui est enregistré ici, en ligne ou non. Rien n'apparaît sur le site tant qu'un événement n'est pas affiché.</p>
        <div id="ev-list"></div>
      </div>
    `;

    listEl = root.querySelector('#ev-list');
    form = root.querySelector('#ev-form');
    formTitleEl = root.querySelector('#ev-form-title');
    cancelBtn = root.querySelector('#ev-cancel');
    submitBtn = root.querySelector('#ev-submit');
    formAlertEl = root.querySelector('#ev-form-alert');
    fields = {
      title: root.querySelector('#ev-title'),
      tag: root.querySelector('#ev-tag'),
      description: root.querySelector('#ev-description'),
      link: root.querySelector('#ev-link'),
      active: root.querySelector('#ev-active')
    };

    cancelBtn.addEventListener('click', resetForm);
    form.addEventListener('submit', handleSubmit);
    listEl.addEventListener('click', handleListClick);

    loadEvents();
  }

  function unmount() {
    editingId = null;
    events = [];
    root = null;
    sheet = null;
  }

  /* ---------- État de la feuille ---------- */

  function refreshState() {
    const live = events.find((ev) => ev.active);
    if (live) {
      sheet.setState({ live: true, short: 'Un événement en ligne', text: `En ligne sur le site : ${live.title}` });
    } else {
      sheet.setState({ live: false, short: 'Rien d’affiché', text: 'Aucun événement affiché — le bandeau et la section sont masqués' });
    }
  }

  /* ---------- Chargement et rendu de la liste ---------- */

  async function loadEvents() {
    renderSkeleton();
    let res;
    try {
      res = await fetch('/api/events');
    } catch {
      renderListError('Le serveur est injoignable. Vérifiez votre connexion.');
      return;
    }
    if (res.status === 401) {
      renderListError('Votre session a expiré. Rechargez la page pour vous reconnecter.');
      return;
    }
    if (!res.ok) {
      renderListError('Les événements n’ont pas pu être chargés.');
      return;
    }
    const data = await res.json();
    events = data.events || [];
    renderEvents();
    refreshState();
  }

  function renderSkeleton() {
    listEl.innerHTML = `
      <div class="bo-skeleton" aria-hidden="true">
        ${[68, 52, 60].map((w) => `
          <div class="bo-skeleton-row">
            <div class="bo-skeleton-bar" style="width:${w}%"></div>
            <div class="bo-skeleton-bar" style="width:${w - 20}%"></div>
          </div>
        `).join('')}
      </div>
      <p class="visually-hidden" role="status">Chargement des événements.</p>
    `;
  }

  function renderListError(message) {
    listEl.innerHTML = `
      <div class="bo-alert" role="alert">
        ${icon('i-alert')}
        <div>
          ${escapeHtml(message)}
          <div class="bo-alert-actions">
            <button type="button" class="bo-btn bo-btn-line bo-btn-sm" data-action="retry">Réessayer</button>
          </div>
        </div>
      </div>
    `;
    sheet.setState({ live: false, short: 'État inconnu', text: 'État inconnu — les événements n’ont pas pu être lus' });
  }

  function renderEvents() {
    if (!events.length) {
      listEl.innerHTML = `
        <div class="bo-empty">
          ${icon('i-calendar')}
          <p class="bo-empty-title">Aucun événement enregistré</p>
          <p>Le bandeau en haut du site et la section « Événements à venir » restent masqués tant qu'aucun événement n'est affiché. Créez-en un avec le formulaire ci-dessus.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = `<div class="bo-list">${events.map(renderRow).join('')}</div>`;
  }

  function renderRow(ev) {
    return `
      <article class="bo-item${ev.active ? ' bo-item-live' : ''}" data-id="${escapeHtml(ev.id)}">
        <div class="bo-item-body">
          ${ev.active ? `<span class="bo-item-badge">${icon('i-eye')}En ligne sur le site</span>` : ''}
          <h4 class="bo-item-title">${escapeHtml(ev.title)}</h4>
          ${ev.tag ? `<p class="bo-item-tag">Étiquette : ${escapeHtml(ev.tag)}</p>` : ''}
          ${ev.description ? `<p class="bo-item-text">${escapeHtml(ev.description)}</p>` : ''}
          ${ev.link_url ? `
            <a class="bo-item-link" href="${escapeHtml(ev.link_url)}" target="_blank" rel="noopener">
              ${icon('i-external')}${escapeHtml(ev.link_url)}
            </a>` : ''}
        </div>
        <div class="bo-item-tools" data-tools>
          <button type="button" class="bo-btn bo-btn-line bo-btn-sm" data-action="${ev.active ? 'unpublish' : 'publish'}">
            ${icon(ev.active ? 'i-eye-off' : 'i-eye')}<span>${ev.active ? 'Retirer du site' : 'Mettre en ligne'}</span>
          </button>
          <button type="button" class="bo-btn bo-btn-line bo-btn-sm" data-action="edit">
            ${icon('i-pencil')}<span>Modifier</span>
          </button>
          <button type="button" class="bo-btn bo-btn-danger bo-btn-sm" data-action="delete">
            ${icon('i-trash')}<span>Supprimer</span>
          </button>
        </div>
      </article>
    `;
  }

  /* ---------- Actions sur une ligne ---------- */

  function handleListClick(e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'retry') {
      loadEvents();
      return;
    }

    const row = btn.closest('.bo-item');
    if (!row) return;
    const ev = events.find((item) => String(item.id) === row.dataset.id);
    if (!ev) return;

    if (action === 'edit') startEdit(ev);
    if (action === 'publish') setPublished(ev, true, btn);
    if (action === 'unpublish') setPublished(ev, false, btn);
    if (action === 'delete') askDelete(row, ev);
    if (action === 'delete-cancel') renderEvents();
    if (action === 'delete-confirm') deleteEvent(ev, btn);
  }

  /* La suppression se confirme dans la ligne elle-même : pas de fenêtre
     système qui arrache l'utilisateur à sa page. */
  function askDelete(row, ev) {
    const tools = row.querySelector('[data-tools]');
    tools.innerHTML = `
      <div class="bo-confirm">
        <p>Supprimer « ${escapeHtml(ev.title)} » définitivement ?</p>
        <div class="bo-confirm-row">
          <button type="button" class="bo-btn bo-btn-solid-danger bo-btn-sm" data-action="delete-confirm">Supprimer</button>
          <button type="button" class="bo-btn bo-btn-line bo-btn-sm" data-action="delete-cancel">Annuler</button>
        </div>
      </div>
    `;
    tools.querySelector('[data-action="delete-confirm"]').focus();
  }

  async function deleteEvent(ev, btn) {
    working(btn, true, 'Suppression…');
    try {
      const res = await fetch(`/api/events/${ev.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete_failed');
    } catch {
      working(btn, false);
      renderEvents();
      showFormAlert('L’événement n’a pas pu être supprimé. Réessayez dans un instant.');
      return;
    }
    if (editingId === ev.id) resetForm();
    await loadEvents();
    sheet.flash('Événement supprimé.');
  }

  async function setPublished(ev, active, btn) {
    working(btn, true, active ? 'Mise en ligne…' : 'Retrait…');
    try {
      const res = await fetch(`/api/events/${ev.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      if (!res.ok) throw new Error('publish_failed');
    } catch {
      working(btn, false);
      showFormAlert('La modification n’a pas pu être enregistrée. Réessayez dans un instant.');
      return;
    }
    await loadEvents();
    sheet.flash(active
      ? 'Événement mis en ligne. Il apparaît maintenant sur le site.'
      : 'Événement retiré du site.');
  }

  /* ---------- Formulaire ---------- */

  function startEdit(ev) {
    editingId = ev.id;
    formTitleEl.textContent = "Modifier l'événement";
    fields.title.value = ev.title || '';
    fields.tag.value = ev.tag || '';
    fields.description.value = ev.description || '';
    fields.link.value = ev.link_url || '';
    fields.active.checked = !!ev.active;
    cancelBtn.hidden = false;
    submitBtn.querySelector('span').textContent = 'Enregistrer les modifications';
    hideFormAlert();
    form.scrollIntoView({ block: 'center' });
    fields.title.focus();
  }

  function resetForm() {
    editingId = null;
    formTitleEl.textContent = 'Ajouter un événement';
    form.reset();
    fields.tag.value = TAG_DEFAUT;
    cancelBtn.hidden = true;
    submitBtn.querySelector('span').textContent = 'Enregistrer';
    hideFormAlert();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    hideFormAlert();

    const payload = {
      title: fields.title.value.trim(),
      tag: fields.tag.value.trim(),
      description: fields.description.value.trim(),
      link_url: fields.link.value.trim(),
      active: fields.active.checked
    };

    if (!payload.title) {
      showFormAlert('Le titre est obligatoire : c’est lui qui s’affiche dans le bandeau.');
      fields.title.focus();
      return;
    }
    if (!payload.link_url) {
      showFormAlert('Le lien d’inscription est obligatoire : le bandeau doit mener quelque part.');
      fields.link.focus();
      return;
    }
    if (!/^https?:\/\//i.test(payload.link_url)) {
      showFormAlert('Le lien doit commencer par https:// pour être valide.');
      fields.link.focus();
      return;
    }

    working(submitBtn, true, 'Enregistrement…');
    const wasEditing = editingId;
    try {
      const res = await fetch(wasEditing ? `/api/events/${wasEditing}` : '/api/events', {
        method: wasEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('save_failed');
    } catch {
      working(submitBtn, false);
      showFormAlert('L’enregistrement a échoué. Vos informations sont toujours dans le formulaire : réessayez.');
      return;
    }

    working(submitBtn, false);
    resetForm();
    await loadEvents();
    sheet.flash(wasEditing ? 'Modifications enregistrées.' : 'Événement enregistré.');
  }

  function showFormAlert(message) {
    formAlertEl.innerHTML = `${icon('i-alert')}<div>${escapeHtml(message)}</div>`;
    formAlertEl.hidden = false;
  }

  function hideFormAlert() {
    formAlertEl.hidden = true;
    formAlertEl.innerHTML = '';
  }

  /* Un bouton qui travaille garde sa place : sa roue remplace son icône
     et son libellé dit ce qui se passe. */
  function working(btn, on, label) {
    if (!btn) return;
    const mark = btn.querySelector('.bo-ico, .bo-spin');
    const text = btn.querySelector('span:not(.bo-spin)');

    if (on) {
      btn.disabled = true;
      btn.dataset.restore = text ? text.textContent : '';
      if (mark) {
        // L'icône est mise de côté : au retour, le bouton doit la
        // retrouver, pas garder sa roue.
        btn.dataset.restoreIcon = mark.outerHTML;
        const spin = document.createElement('span');
        spin.className = 'bo-spin';
        mark.replaceWith(spin);
      }
      if (text && label) text.textContent = label;
      return;
    }

    btn.disabled = false;
    if (text && btn.dataset.restore) text.textContent = btn.dataset.restore;
    if (mark && btn.dataset.restoreIcon) {
      mark.outerHTML = btn.dataset.restoreIcon;
    }
    delete btn.dataset.restore;
    delete btn.dataset.restoreIcon;
  }

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
