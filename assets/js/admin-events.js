/* ============================================================
   ADMIN-EVENTS — module de gestion des événements (bandeau + section
   événements du site public). S'enregistre dans window.AdminModules,
   monté par la coquille (assets/js/admin.js).
   ============================================================ */
(function registerEventsModule() {
  let eventsList, form, formTitle, cancelEditBtn;
  let editingId = null;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function mount(container) {
    editingId = null;
    container.innerHTML = `
      <div class="admin-card">
        <h2 id="formTitle">Ajouter un événement</h2>
        <form id="eventForm" class="admin-form">
          <label for="f-title">Titre</label>
          <input type="text" id="f-title" name="title" required>

          <label for="f-tag">Étiquette</label>
          <input type="text" id="f-tag" name="tag" value="Prochain événement">

          <label for="f-description">Description</label>
          <textarea id="f-description" name="description"></textarea>

          <label for="f-link">Lien (HelloAsso ou autre)</label>
          <input type="url" id="f-link" name="link_url" placeholder="https://www.helloasso.com/..." required>

          <div class="admin-check">
            <input type="checkbox" id="f-active" name="active">
            <label for="f-active">Afficher sur le site (bandeau + section événements)</label>
          </div>

          <div class="admin-actions">
            <button type="submit" class="admin-btn-primary">Enregistrer</button>
            <button type="button" id="cancelEditBtn" class="admin-btn-ghost" hidden>Annuler la modification</button>
          </div>
        </form>
      </div>

      <div class="admin-card">
        <h2>Événements existants</h2>
        <div class="admin-events-list" id="eventsList"></div>
      </div>
    `;

    eventsList = container.querySelector('#eventsList');
    form = container.querySelector('#eventForm');
    formTitle = container.querySelector('#formTitle');
    cancelEditBtn = container.querySelector('#cancelEditBtn');

    cancelEditBtn.addEventListener('click', resetForm);
    form.addEventListener('submit', handleSubmit);

    loadEvents();
  }

  function unmount() {
    editingId = null;
  }

  async function loadEvents() {
    eventsList.innerHTML = '<p class="admin-empty">Chargement…</p>';
    const res = await fetch('/api/events');
    if (!res.ok) {
      eventsList.innerHTML = '<p class="admin-empty">Impossible de charger les événements.</p>';
      return;
    }
    const { events } = await res.json();
    renderEvents(events);
  }

  function renderEvents(events) {
    if (!events || events.length === 0) {
      eventsList.innerHTML = '<p class="admin-empty">Aucun événement pour le moment.</p>';
      return;
    }
    eventsList.innerHTML = '';
    events.forEach((ev) => {
      const row = document.createElement('div');
      row.className = 'admin-event-row' + (ev.active ? ' is-active' : '');
      row.innerHTML = `
        <div>
          ${ev.active ? '<span class="admin-event-badge">Actif · affiché sur le site</span>' : ''}
          <h3>${escapeHtml(ev.title)}</h3>
          <p>${escapeHtml(ev.tag)}</p>
          <p>${escapeHtml(ev.description)}</p>
        </div>
        <div class="admin-event-buttons">
          <button type="button" data-action="edit">Modifier</button>
          <button type="button" data-action="delete">Supprimer</button>
        </div>
      `;
      row.querySelector('[data-action="edit"]').addEventListener('click', () => startEdit(ev));
      row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteEvent(ev.id));
      eventsList.appendChild(row);
    });
  }

  function startEdit(ev) {
    editingId = ev.id;
    formTitle.textContent = "Modifier l'événement";
    form.title.value = ev.title;
    form.tag.value = ev.tag;
    form.description.value = ev.description;
    form.link_url.value = ev.link_url;
    form.active.checked = ev.active;
    cancelEditBtn.hidden = false;
    form.scrollIntoView({ behavior: 'smooth' });
  }

  function resetForm() {
    editingId = null;
    formTitle.textContent = 'Ajouter un événement';
    form.reset();
    form.tag.value = 'Prochain événement';
    cancelEditBtn.hidden = true;
  }

  async function deleteEvent(id) {
    if (!confirm('Supprimer cet événement ?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (editingId === id) resetForm();
    loadEvents();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title: form.title.value.trim(),
      tag: form.tag.value.trim(),
      description: form.description.value.trim(),
      link_url: form.link_url.value.trim(),
      active: form.active.checked
    };
    if (!payload.title || !payload.link_url) return;

    const url = editingId ? `/api/events/${editingId}` : '/api/events';
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    resetForm();
    loadEvents();
  }

  window.AdminModules = window.AdminModules || [];
  window.AdminModules.push({
    id: 'events',
    label: 'Événements',
    mount,
    unmount
  });
})();
