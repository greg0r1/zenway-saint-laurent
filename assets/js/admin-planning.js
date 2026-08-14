/* ============================================================
   ADMIN-PLANNING — feuille « Planning des séances ». Lecture seule
   pour l'instant : les créneaux sont lus dans leur source de vérité,
   assets/js/config-planning.js, chargé juste avant ce fichier. Aucune
   valeur n'est recopiée ici, la feuille ne peut donc pas dériver.
   S'enregistre dans window.AdminModules, monté par assets/js/admin.js.
   ============================================================ */
(function registerPlanningModule() {
  let root = null;

  function icon(id, classe) {
    return `<svg class="bo-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function mount(container, sheet) {
    root = container;
    // PLANNING est un `const` de portée script : il ne vit pas sur window.
    const slots = (typeof PLANNING !== 'undefined' && Array.isArray(PLANNING)) ? PLANNING : [];

    const n = slots.length;
    sheet.setState(n
      ? { live: true, short: `${n} créneau${n > 1 ? 'x' : ''} en ligne`, text: `${n} créneau${n > 1 ? 'x' : ''} publié${n > 1 ? 's' : ''} sur le site` }
      : { live: false, short: 'Aucun créneau', text: 'Aucun créneau publié — le site affiche un message d’attente' });

    root.innerHTML = `
      <div class="bo-block">
        <h3 class="bo-block-title">Créneaux affichés aujourd'hui</h3>
        <p class="bo-block-note">Ce que voient les visiteurs dans la section « Planning » du site, à l'instant.</p>
        ${slots.length ? renderSlots(slots) : renderEmpty()}
      </div>

      <div class="bo-pending">
        ${icon('i-info')}
        <div>
          <strong>Modification pas encore branchée sur cette page</strong>
          Pour changer un jour, un horaire ou un lieu, il faut aujourd'hui passer par le fichier
          <code>assets/js/config-planning.js</code>. Cette feuille lit ce fichier directement : ce qui est
          affiché ci-dessus est donc toujours ce qui est en ligne.
        </div>
      </div>
    `;
  }

  function renderSlots(slots) {
    return `<div class="bo-grid">${slots.map((slot) => `
      <article class="bo-card">
        <p class="bo-card-label">${icon('i-clock')}${escapeHtml(slot.day)}</p>
        <p class="bo-card-value">${escapeHtml(slot.time)}</p>
        ${slot.label ? `<p class="bo-card-note">${escapeHtml(slot.label)}</p>` : ''}
        <dl class="bo-values">
          ${slot.place ? `
            <div class="bo-value">
              <dt>${icon('i-pin')}Lieu</dt>
              <dd>${escapeHtml(slot.place)}</dd>
            </div>` : ''}
          ${slot.note ? `
            <div class="bo-value">
              <dt>${icon('i-calendar')}Mention</dt>
              <dd>${escapeHtml(slot.note)}</dd>
            </div>` : ''}
        </dl>
      </article>
    `).join('')}</div>`;
  }

  function renderEmpty() {
    return `
      <div class="bo-empty">
        ${icon('i-clock', 'bo-ico-xl')}
        <p class="bo-empty-title">Aucun créneau enregistré</p>
        <p>La section « Planning » du site affiche à la place un message invitant les visiteurs à vous contacter pour connaître les prochains horaires.</p>
      </div>
    `;
  }

  function unmount() {
    root = null;
  }

  window.AdminModules = window.AdminModules || [];
  window.AdminModules.push({
    id: 'planning',
    label: 'Planning',
    icon: 'i-clock',
    summary: 'Les jours et horaires de séance affichés dans la section « Planning » du site.',
    mount,
    unmount
  });
})();
