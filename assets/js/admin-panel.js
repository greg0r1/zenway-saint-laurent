/* ============================================================
   ADMIN-PANEL — le panneau latéral de l'atelier.
   Un seul panneau pour toute l'admin : voir un élément, le modifier,
   confirmer une suppression. Bâti sur <dialog> natif, qui apporte le
   piège à focus, la fermeture par Échap et le voile de fond sans
   qu'on ait à les réécrire.

   AdminPanel.ouvrir({ titre, chapeau, icone, corps, actions, surFermeture })
     corps   : un élément DOM (le panneau ne fabrique pas le contenu)
     actions : [{ id, label, icone, style, onClick, occupe }]
   AdminPanel.fermer()          — referme et rend le focus
   AdminPanel.occuper(id, bool) — met une action en attente
   AdminPanel.alerte(message)   — un message d'erreur dans le pied
   ============================================================ */
const AdminPanel = (function adminPanel() {
  let dialogue, titreEl, chapeauEl, icoEl, corpsEl, piedEl, alerteEl, fermerBtn;
  let actionsCourantes = [];
  let surFermeture = null;
  let enFermeture = false;

  function icone(id, classe) {
    return `<svg class="bo-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function monter() {
    if (dialogue) return;
    dialogue = document.createElement('dialog');
    dialogue.className = 'bo-panel';
    dialogue.setAttribute('aria-labelledby', 'bo-panel-title');
    dialogue.innerHTML = `
      <form method="dialog" class="bo-panel-shell">
        <header class="bo-panel-head">
          <div class="bo-panel-ident">
            <span class="bo-panel-ico" data-slot="icone"></span>
            <div>
              <p class="bo-panel-chapeau" data-slot="chapeau"></p>
              <h2 class="bo-panel-title" id="bo-panel-title" data-slot="titre"></h2>
            </div>
          </div>
          <button type="button" class="bo-panel-close" data-close aria-label="Fermer le panneau">
            ${icone('i-close')}
          </button>
        </header>
        <div class="bo-panel-body" data-slot="corps" tabindex="-1"></div>
        <footer class="bo-panel-foot">
          <div class="bo-alert" data-slot="alerte" role="alert" hidden></div>
          <div class="bo-panel-actions" data-slot="actions"></div>
        </footer>
      </form>
    `;
    document.body.appendChild(dialogue);

    titreEl = dialogue.querySelector('[data-slot="titre"]');
    chapeauEl = dialogue.querySelector('[data-slot="chapeau"]');
    icoEl = dialogue.querySelector('[data-slot="icone"]');
    corpsEl = dialogue.querySelector('[data-slot="corps"]');
    piedEl = dialogue.querySelector('[data-slot="actions"]');
    alerteEl = dialogue.querySelector('[data-slot="alerte"]');
    fermerBtn = dialogue.querySelector('[data-close]');

    fermerBtn.addEventListener('click', fermer);

    // Échap : <dialog> ferme de lui-même, on intercepte pour jouer la
    // sortie plutôt que de voir le panneau disparaître d'un coup.
    dialogue.addEventListener('cancel', (e) => {
      e.preventDefault();
      fermer();
    });

    // Un clic sur le voile ferme aussi : le panneau n'est pas une impasse.
    dialogue.addEventListener('mousedown', (e) => {
      if (e.target === dialogue) fermer();
    });

    dialogue.addEventListener('close', () => {
      const rappel = surFermeture;
      surFermeture = null;
      actionsCourantes = [];
      corpsEl.innerHTML = '';
      piedEl.innerHTML = '';
      cacherAlerte();
      document.body.classList.remove('bo-panel-ouvert');
      if (rappel) rappel();
    });
  }

  function ouvrir(config) {
    monter();
    enFermeture = false;
    dialogue.classList.remove('is-closing');

    titreEl.textContent = config.titre || '';
    chapeauEl.textContent = config.chapeau || '';
    chapeauEl.hidden = !config.chapeau;
    icoEl.innerHTML = config.icone ? icone(config.icone, 'bo-ico-lg') : '';
    icoEl.hidden = !config.icone;

    corpsEl.innerHTML = '';
    if (config.corps) corpsEl.appendChild(config.corps);
    corpsEl.scrollTop = 0;

    actionsCourantes = config.actions || [];
    rendreActions();
    cacherAlerte();

    surFermeture = config.surFermeture || null;

    if (!dialogue.open) dialogue.showModal();
    document.body.classList.add('bo-panel-ouvert');

    // Le premier champ du formulaire prend la main ; à défaut, le corps.
    const premier = corpsEl.querySelector('input, textarea, select, button, a[href]');
    (premier || corpsEl).focus({ preventScroll: true });
  }

  function rendreActions() {
    piedEl.innerHTML = '';
    actionsCourantes.forEach((action) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `bo-btn ${action.style || 'bo-btn-line'}`;
      btn.dataset.action = action.id;
      btn.innerHTML = `${action.icone ? icone(action.icone) : ''}<span>${action.label}</span>`;
      btn.addEventListener('click', () => action.onClick && action.onClick(btn));
      piedEl.appendChild(btn);
    });
    piedEl.hidden = actionsCourantes.length === 0;
  }

  /* Une action en cours : son libellé le dit, et tout le pied se verrouille
     pour qu'aucune seconde requête ne parte pendant la première. */
  function occuper(id, actif, label) {
    if (!piedEl) return;
    const btn = piedEl.querySelector(`[data-action="${id}"]`);
    Array.from(piedEl.children).forEach((b) => {
      b.disabled = actif;
    });
    if (!btn) return;
    const texte = btn.querySelector('span:not(.bo-spin)');
    const marque = btn.querySelector('.bo-ico, .bo-spin');
    if (actif) {
      if (texte) {
        btn.dataset.restore = texte.textContent;
        if (label) texte.textContent = label;
      }
      if (marque && !btn.dataset.restoreIcon) {
        btn.dataset.restoreIcon = marque.outerHTML;
        const roue = document.createElement('span');
        roue.className = 'bo-spin';
        marque.replaceWith(roue);
      }
      return;
    }
    if (texte && btn.dataset.restore) texte.textContent = btn.dataset.restore;
    if (marque && btn.dataset.restoreIcon) marque.outerHTML = btn.dataset.restoreIcon;
    delete btn.dataset.restore;
    delete btn.dataset.restoreIcon;
  }

  function alerte(message) {
    if (!alerteEl) return;
    alerteEl.innerHTML = `${icone('i-alert')}<div>${message}</div>`;
    alerteEl.hidden = false;
  }

  function cacherAlerte() {
    if (!alerteEl) return;
    alerteEl.hidden = true;
    alerteEl.innerHTML = '';
  }

  function fermer() {
    if (!dialogue || !dialogue.open || enFermeture) return;
    enFermeture = true;
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduit) {
      dialogue.close();
      return;
    }
    dialogue.classList.add('is-closing');
    dialogue.addEventListener('animationend', function fin() {
      dialogue.removeEventListener('animationend', fin);
      dialogue.classList.remove('is-closing');
      dialogue.close();
    }, { once: true });
  }

  function estOuvert() {
    return !!(dialogue && dialogue.open);
  }

  return { ouvrir, fermer, occuper, alerte, cacherAlerte, estOuvert };
})();
