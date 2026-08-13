/* ============================================================
   ADMIN — connexion Google + CRUD des événements
   ============================================================ */
(function admin() {
  const loginView = document.getElementById('loginView');
  const dashboardView = document.getElementById('dashboardView');
  const dashboardHeader = document.getElementById('dashboardHeader');
  const whoEl = document.getElementById('who');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginError = document.getElementById('loginError');
  const eventsList = document.getElementById('eventsList');
  const form = document.getElementById('eventForm');
  const formTitle = document.getElementById('formTitle');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  let editingId = null;

  function showLogin() {
    loginView.hidden = false;
    dashboardView.hidden = true;
    dashboardHeader.hidden = true;
  }

  function showDashboard(email) {
    loginView.hidden = true;
    dashboardView.hidden = false;
    dashboardHeader.hidden = false;
    whoEl.textContent = email;
    loadEvents();
  }

  async function checkSession() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        showDashboard(data.email);
        return;
      }
    } catch { /* réseau indisponible : on retombe sur l'écran de connexion */ }
    showLogin();
    initGoogleButton();
  }

  function initGoogleButton() {
    if (!window.google || !window.google.accounts) return;
    google.accounts.id.initialize({
      client_id: CONFIG_ADMIN.googleClientId,
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(document.getElementById('gsiButton'), {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      locale: 'fr'
    });
  }

  async function handleCredentialResponse(response) {
    loginError.hidden = true;
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      if (!res.ok) {
        loginError.textContent = res.status === 403
          ? "Ce compte Google n'est pas autorisé à administrer le site."
          : 'Connexion impossible, réessayez.';
        loginError.hidden = false;
        return;
      }
      const data = await res.json();
      showDashboard(data.email);
    } catch {
      loginError.textContent = 'Connexion impossible, réessayez.';
      loginError.hidden = false;
    }
  }

  logoutBtn.addEventListener('click', async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    showLogin();
    initGoogleButton();
  });

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

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
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

  cancelEditBtn.addEventListener('click', resetForm);

  async function deleteEvent(id) {
    if (!confirm('Supprimer cet événement ?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (editingId === id) resetForm();
    loadEvents();
  }

  form.addEventListener('submit', async (e) => {
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
  });

  checkSession();
})();
