/* ============================================================
   ADMIN — coquille de la page /admin : connexion (via AdminAuth),
   onglets et montage des modules déclarés dans window.AdminModules
   (voir assets/js/admin-events.js pour un exemple de module).
   Pour ajouter une nouvelle section à l'admin plus tard : créer un
   nouveau fichier assets/js/admin-<nom>.js qui s'enregistre de la
   même façon, puis l'inclure dans admin/index.html avant admin.js.
   ============================================================ */
(function adminShell() {
  const loginView = document.getElementById('loginView');
  const dashboardView = document.getElementById('dashboardView');
  const dashboardHeader = document.getElementById('dashboardHeader');
  const whoEl = document.getElementById('who');
  const logoutBtn = document.getElementById('logoutBtn');
  const tabsEl = document.getElementById('adminTabs');
  const contentEl = document.getElementById('adminContent');

  const modules = window.AdminModules || [];
  let activeModule = null;

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
    renderTabs();
    activateModule(modules[0]);
  }

  function renderTabs() {
    tabsEl.hidden = modules.length <= 1;
    tabsEl.innerHTML = '';
    modules.forEach((mod) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'admin-tab';
      btn.textContent = mod.label;
      btn.dataset.moduleId = mod.id;
      btn.addEventListener('click', () => activateModule(mod));
      tabsEl.appendChild(btn);
    });
  }

  function activateModule(mod) {
    if (!mod) return;
    if (activeModule && activeModule.unmount) activeModule.unmount();
    activeModule = mod;
    Array.from(tabsEl.children).forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.moduleId === mod.id);
    });
    contentEl.innerHTML = '';
    mod.mount(contentEl);
  }

  logoutBtn.addEventListener('click', async () => {
    await AdminAuth.logout();
    showLogin();
    AdminAuth.initGoogleButton(showDashboard);
  });

  AdminAuth.checkSession().then((email) => {
    if (email) {
      showDashboard(email);
    } else {
      showLogin();
      AdminAuth.initGoogleButton(showDashboard);
    }
  });
})();
