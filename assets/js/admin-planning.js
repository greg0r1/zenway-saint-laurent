/* ============================================================
   ADMIN-PLANNING — page « Planning ». Lecture seule pour l'instant.
   Les créneaux ne sont pas recopiés ici : la page lit directement
   assets/js/config-planning.js, la source que le site utilise, donc
   ce qui est affiché est toujours ce qui est en ligne.
   S'enregistre dans window.AdminModules, monté par assets/js/admin.js.
   ============================================================ */
(function registerPlanningPage() {
  let root = null;

  function icone(id, classe) {
    return `<svg class="ad-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function echapper(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function mount(container, page) {
    root = container;
    // PLANNING est un `const` de portée script : il ne vit pas sur window.
    const slots = (typeof PLANNING !== 'undefined' && Array.isArray(PLANNING)) ? PLANNING : [];

    page.setActions([]);
    page.setBadge(slots.length || null);

    root.innerHTML = `
      <p class="ad-lede">Les jours et horaires de séance affichés dans la section « Planning » du site,
        tels qu'ils sont en ligne à l'instant.</p>

      ${slots.length ? tableau(slots) : vide()}

      <div class="ad-note ad-note-warn">
        ${icone('i-info')}
        <div>
          <strong>Modification pas encore branchée sur cette page</strong>
          Pour changer un jour, un horaire ou un lieu, il faut aujourd'hui passer par le fichier
          <code>assets/js/config-planning.js</code>. Cette page lit ce fichier directement : ce qui est
          affiché ci-dessus est donc toujours ce qui est en ligne.
        </div>
      </div>
    `;
  }

  function tableau(slots) {
    return `
      <div class="ad-tablewrap">
        <table class="ad-table">
          <thead>
            <tr>
              <th scope="col" class="ad-col-date">Jour</th>
              <th scope="col">Horaire</th>
              <th scope="col">Lieu</th>
              <th scope="col">Mention</th>
            </tr>
          </thead>
          <tbody>
            ${slots.map((slot) => `
              <tr>
                <td class="ad-col-date"><b>${echapper(slot.day)}</b></td>
                <td>
                  <b>${echapper(slot.time)}</b>
                  ${slot.label ? `<small class="ad-sub">${echapper(slot.label)}</small>` : ''}
                </td>
                <td>${slot.place ? echapper(slot.place) : '<span class="ad-muet">—</span>'}</td>
                <td>${slot.note ? echapper(slot.note) : '<span class="ad-muet">—</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function vide() {
    return `
      <div class="ad-empty">
        ${icone('i-clock', 'ad-ico-xl')}
        <p class="ad-empty-title">Aucun créneau enregistré</p>
        <p>La section « Planning » du site affiche à la place un message invitant les visiteurs à vous
          contacter pour connaître les prochains horaires.</p>
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
    title: 'Planning',
    mount,
    unmount
  });
})();
