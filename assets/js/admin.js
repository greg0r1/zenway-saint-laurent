/* ============================================================
   ADMIN — la coquille de l'atelier : connexion (via AdminAuth),
   puis une feuille par module déclaré dans window.AdminModules,
   toutes montées ensemble sur une seule page. La réglette de
   gauche est un sommaire de cette page, jamais un routeur.

   Contrat d'un module (voir assets/js/admin-events.js) :
     {
       id:      'events',                  // identifiant et ancre
       label:   'Événements',              // libellé du sommaire
       icon:    'i-calendar',              // symbole du jeu d'icônes
       summary: 'Ce que cette feuille…',   // une phrase, ce qu'elle commande
       mount(container, sheet),            // remplit le corps de la feuille
       unmount()                           // libère ce qui doit l'être
     }
   L'objet `sheet` passé à mount expose :
     sheet.setState({ text, live })  — l'état de publication, en toutes lettres
     sheet.flash(message)            — une confirmation discrète, qui s'efface
   ============================================================ */
(function adminShell() {
  const body = document.body;
  const loginView = document.getElementById('loginView');
  const dashboardView = document.getElementById('dashboardView');
  const whoEl = document.getElementById('who');
  const logoutBtn = document.getElementById('logoutBtn');
  const railEl = document.getElementById('adminRail');
  const sheetsEl = document.getElementById('bo-sheets');

  const modules = window.AdminModules || [];
  const sheets = [];
  let mounted = false;
  let spyTicking = false;

  function icon(id, extraClass) {
    return `<svg class="bo-ico${extraClass ? ' ' + extraClass : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function showLogin() {
    teardown();
    loginView.hidden = false;
    dashboardView.hidden = true;
    body.classList.remove('is-ready');
  }

  function showDashboard(email) {
    loginView.hidden = true;
    dashboardView.hidden = false;
    whoEl.textContent = email || '';
    whoEl.title = email || '';
    build();
    // Le mouvement d'arrivée ne se joue qu'une fois, après le montage.
    requestAnimationFrame(() => body.classList.add('is-ready'));
  }

  function build() {
    if (mounted) return;
    mounted = true;

    railEl.innerHTML = '';
    sheetsEl.innerHTML = '';

    modules.forEach((mod) => {
      const link = document.createElement('a');
      link.className = 'bo-rail-item';
      link.href = `#sheet-${mod.id}`;
      link.innerHTML = `
        ${icon(mod.icon || 'i-info')}
        <span class="bo-rail-text">
          <span class="bo-rail-label">${mod.label}</span>
          <span class="bo-rail-state" data-slot="rail-state"></span>
        </span>
      `;
      railEl.appendChild(link);

      const sheet = document.createElement('section');
      sheet.className = 'bo-sheet';
      sheet.id = `sheet-${mod.id}`;
      sheet.setAttribute('aria-labelledby', `title-${mod.id}`);
      sheet.innerHTML = `
        <div class="bo-sheet-head">
          <h2 class="bo-sheet-title" id="title-${mod.id}">${icon(mod.icon || 'i-info', 'bo-ico-lg')}${mod.label}</h2>
          ${mod.summary ? `<p class="bo-sheet-say">${mod.summary}</p>` : ''}
          <div class="bo-sheet-state" data-slot="state" role="status"></div>
        </div>
        <div data-slot="body"></div>
      `;
      sheetsEl.appendChild(sheet);

      const stateSlot = sheet.querySelector('[data-slot="state"]');
      const bodySlot = sheet.querySelector('[data-slot="body"]');

      const railState = link.querySelector('[data-slot="rail-state"]');

      const api = {
        element: sheet,
        /* L'état va au même moment sur la feuille (en toutes lettres) et
           sur la réglette (en abrégé) : le sommaire dit alors ce que le
           site publie sans qu'on ait à faire défiler les feuilles. */
        setState({ text, short, live }) {
          railState.textContent = short || '';
          railState.classList.toggle('is-live', !!live);
          if (!text) {
            stateSlot.innerHTML = '';
            return;
          }
          stateSlot.innerHTML =
            `<span class="bo-state${live ? ' bo-state-live' : ''}">` +
            icon(live ? 'i-eye' : 'i-eye-off') +
            `${text}</span>`;
        },
        flash(message) {
          const existing = bodySlot.querySelector('.bo-flash');
          if (existing) existing.remove();
          const el = document.createElement('p');
          el.className = 'bo-flash';
          el.setAttribute('role', 'status');
          el.innerHTML = `${icon('i-check')}${message}`;
          bodySlot.appendChild(el);
          setTimeout(() => el.remove(), 6000);
        }
      };

      sheets.push({ mod, link, sheet });
      mod.mount(bodySlot, api);
    });

    railEl.addEventListener('click', onRailClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    spy();
  }

  function teardown() {
    if (!mounted) return;
    mounted = false;
    railEl.removeEventListener('click', onRailClick);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    sheets.forEach(({ mod }) => {
      if (mod.unmount) mod.unmount();
    });
    sheets.length = 0;
    railEl.innerHTML = '';
    sheetsEl.innerHTML = '';
  }

  function onRailClick(e) {
    const link = e.target.closest('.bo-rail-item');
    if (link) mark(link);
  }

  function onScroll() {
    if (spyTicking) return;
    spyTicking = true;
    requestAnimationFrame(() => {
      spyTicking = false;
      spy();
    });
  }

  /* La feuille « lue » est la dernière dont le haut est passé sous la
     barre : c'est celle que l'œil a en face de lui. */
  function spy() {
    if (!sheets.length) return;
    const line = 140;
    let current = sheets[0];
    sheets.forEach((entry) => {
      if (entry.sheet.getBoundingClientRect().top <= line) current = entry;
    });
    mark(current.link);
  }

  function mark(link) {
    sheets.forEach((entry) => {
      const on = entry.link === link;
      if (on) {
        entry.link.setAttribute('aria-current', 'true');
      } else {
        entry.link.removeAttribute('aria-current');
      }
    });
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
