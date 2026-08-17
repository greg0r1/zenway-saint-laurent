/* ============================================================
   ADMIN — la coquille de la console : connexion (via AdminAuth),
   barre latérale de navigation, et une seule page montée à la fois.
   L'adresse porte la page courante (#/evenements), donc le bouton
   Précédent du navigateur et un lien direct fonctionnent.

   Contrat d'une page (voir assets/js/admin-events.js) :
     {
       id:    'events',                 // identifiant et fragment d'URL
       label: 'Événements',             // libellé du menu
       icon:  'i-calendar',             // symbole du jeu d'icônes
       title: 'Événements',             // titre affiché en haut (défaut : label)
       mount(container, page),          // remplit la zone de travail
       unmount()                        // libère ce qui doit l'être
     }
   L'objet `page` passé à mount expose :
     page.setBadge(texte)     — la pastille du menu (null pour l'effacer)
     page.setActions([...])   — les boutons d'action en haut à droite
     page.flash(message)      — une confirmation discrète, qui s'efface
     page.go(id)              — aller à une autre page
   ============================================================ */
(function adminShell() {
  const body = document.body;
  const loginView = document.getElementById('loginView');
  const appView = document.getElementById('appView');
  const whoEl = document.getElementById('who');
  const logoutBtn = document.getElementById('logoutBtn');
  const themeBtn = document.getElementById('themeBtn');
  const navEl = document.getElementById('adNav');
  const pageEl = document.getElementById('ad-page');
  const titleEl = document.getElementById('pageTitle');
  const actionsEl = document.getElementById('pageActions');
  const sideEl = document.getElementById('adSide');
  const scrimEl = document.getElementById('navScrim');
  const navOpen = document.getElementById('navOpen');
  const navClose = document.getElementById('navClose');

  const pages = window.AdminModules || [];
  const links = new Map();

  let built = false;
  let courante = null; // la page montée
  let flashTimer = null;

  function icone(id, classe) {
    return `<svg class="ad-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  /* ---------------------------------------------------------------
     Connexion / déconnexion
     --------------------------------------------------------------- */

  function montrerConnexion() {
    demonter();
    loginView.hidden = false;
    appView.hidden = true;
  }

  function montrerConsole(email) {
    loginView.hidden = true;
    appView.hidden = false;
    whoEl.textContent = email || '';
    whoEl.title = email || '';
    construire();
    router();
  }

  /* ---------------------------------------------------------------
     Menu latéral
     --------------------------------------------------------------- */

  function construire() {
    if (built) return;
    built = true;

    navEl.innerHTML = '';
    pages.forEach((mod) => {
      const a = document.createElement('a');
      a.className = 'ad-nav-item';
      a.href = `#/${mod.id}`;
      a.innerHTML = `
        ${icone(mod.icon || 'i-info')}
        <span class="ad-nav-label">${mod.label}</span>
        <span class="ad-nav-badge" data-slot="badge" hidden></span>
      `;
      navEl.appendChild(a);
      links.set(mod.id, a);
    });

    navEl.addEventListener('click', (e) => {
      if (e.target.closest('.ad-nav-item')) fermerMenu();
    });

    window.addEventListener('hashchange', router);
  }

  function demonter() {
    if (courante && courante.unmount) courante.unmount();
    courante = null;
    pageEl.innerHTML = '';
    actionsEl.innerHTML = '';
  }

  /* ---------------------------------------------------------------
     Navigation entre les pages
     --------------------------------------------------------------- */

  function idDemande() {
    const brut = (location.hash || '').replace(/^#\/?/, '').trim();
    return pages.some((m) => m.id === brut) ? brut : pages[0] && pages[0].id;
  }

  function router() {
    const id = idDemande();
    if (!id) return;
    const mod = pages.find((m) => m.id === id);
    if (!mod || (courante && courante.id === id)) {
      marquer(id);
      return;
    }

    if (courante && courante.unmount) courante.unmount();
    courante = mod;

    pageEl.innerHTML = '';
    actionsEl.innerHTML = '';
    titleEl.textContent = mod.title || mod.label;
    document.title = `${mod.title || mod.label} · Administration Zenway`;
    marquer(id);

    mod.mount(pageEl, api(mod));

    // Une nouvelle page commence en haut, comme dans n'importe quelle
    // application : on ne garde pas le défilement de la précédente.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function marquer(id) {
    links.forEach((a, key) => {
      if (key === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  /* ---------------------------------------------------------------
     Ce que chaque page reçoit
     --------------------------------------------------------------- */

  function api(mod) {
    const lien = links.get(mod.id);
    const badge = lien ? lien.querySelector('[data-slot="badge"]') : null;

    return {
      element: pageEl,

      /* La pastille du menu ne porte qu'un compte : l'état complet
         s'écrit en toutes lettres sur la page elle-même. */
      setBadge(texte) {
        if (!badge) return;
        const v = texte == null ? '' : String(texte);
        badge.textContent = v;
        badge.hidden = v === '';
      },

      setActions(actions) {
        actionsEl.innerHTML = '';
        (actions || []).forEach((action) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `ad-btn ${action.style || 'ad-btn-line'}`;
          btn.innerHTML = `${action.icone ? icone(action.icone) : ''}<span>${action.label}</span>`;
          btn.addEventListener('click', () => action.onClick && action.onClick(btn));
          actionsEl.appendChild(btn);
        });
      },

      flash(message) {
        const existant = document.querySelector('.ad-flash');
        if (existant) existant.remove();
        if (flashTimer) clearTimeout(flashTimer);

        const el = document.createElement('div');
        el.className = 'ad-flash';
        el.setAttribute('role', 'status');
        el.innerHTML = `${icone('i-check')}<span>${message}</span>`;
        document.body.appendChild(el);
        flashTimer = setTimeout(() => el.remove(), 5000);
      },

      go(id) {
        location.hash = `#/${id}`;
      }
    };
  }

  /* ---------------------------------------------------------------
     Menu mobile — hors écran, ouvert par le bouton de l'en-tête
     --------------------------------------------------------------- */

  function ouvrirMenu() {
    sideEl.classList.add('is-open');
    scrimEl.hidden = false;
    navOpen.setAttribute('aria-expanded', 'true');
    body.classList.add('ad-nav-ouvert');
    const premier = navEl.querySelector('.ad-nav-item');
    if (premier) premier.focus({ preventScroll: true });
  }

  function fermerMenu() {
    if (!sideEl.classList.contains('is-open')) return;
    sideEl.classList.remove('is-open');
    scrimEl.hidden = true;
    navOpen.setAttribute('aria-expanded', 'false');
    body.classList.remove('ad-nav-ouvert');
  }

  navOpen.addEventListener('click', ouvrirMenu);
  navClose.addEventListener('click', () => {
    fermerMenu();
    navOpen.focus({ preventScroll: true });
  });
  scrimEl.addEventListener('click', fermerMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    // Le panneau latéral gère sa propre touche Échap : on ne ferme le
    // menu que s'il est seul ouvert.
    if (window.AdminPanel && AdminPanel.estOuvert()) return;
    fermerMenu();
  });

  // Repassé en grand écran, le menu redevient la colonne fixe : on nettoie
  // l'état « ouvert » pour qu'il ne survive pas au changement de largeur.
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
    if (e.matches) fermerMenu();
  });

  /* ---------------------------------------------------------------
     Thème
     --------------------------------------------------------------- */

  /* Le bouton annonce ce vers quoi il emmène, jamais l'état actuel :
     l'icône lune veut dire « passer en sombre ». */
  function refletTheme(actif) {
    if (!themeBtn) return;
    const versSombre = actif !== 'sombre';
    themeBtn.innerHTML = icone(versSombre ? 'i-moon' : 'i-sun');
    themeBtn.setAttribute(
      'aria-label',
      versSombre ? 'Passer en thème sombre' : 'Passer en thème clair'
    );
    themeBtn.title = themeBtn.getAttribute('aria-label');
  }

  if (themeBtn) {
    refletTheme(AdminTheme.actuel().actif);
    AdminTheme.surChangement(refletTheme);
    themeBtn.addEventListener('click', () => AdminTheme.basculer());
  }

  /* ---------------------------------------------------------------
     Démarrage
     --------------------------------------------------------------- */

  logoutBtn.addEventListener('click', async () => {
    if (window.AdminPanel && AdminPanel.estOuvert()) AdminPanel.fermer();
    fermerMenu();
    await AdminAuth.logout();
    if (window.AdminStore) AdminStore.reinitialiser();
    montrerConnexion();
    AdminAuth.initGoogleButton(montrerConsole);
  });

  AdminAuth.checkSession().then((email) => {
    if (email) {
      montrerConsole(email);
    } else {
      montrerConnexion();
      AdminAuth.initGoogleButton(montrerConsole);
    }
  });
})();
