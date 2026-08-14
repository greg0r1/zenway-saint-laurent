/* ============================================================
   ADMIN-INFOS — feuille « Infos pratiques ». Lecture seule pour
   l'instant. Les valeurs ne sont pas recopiées ici : la feuille va
   les lire dans le site publié lui-même (section « Infos pratiques »
   de index.html), elle affiche donc toujours la vérité du moment.
   S'enregistre dans window.AdminModules, monté par assets/js/admin.js.
   ============================================================ */
(function registerInfosModule() {
  const SOURCE = '../index.html';

  // Une icône par libellé reconnu ; les autres retombent sur l'icône neutre.
  const ICONES = [
    [/lieu|adresse|salle/i, 'i-pin'],
    [/parking|stationnement/i, 'i-pin'],
    [/t[ée]l[ée]phone/i, 'i-phone'],
    [/mail|courriel/i, 'i-mail'],
    [/rendez-vous|s[ée]ance|horaire|date/i, 'i-calendar']
  ];

  let root = null;
  let sheet = null;

  function icon(id, classe) {
    return `<svg class="bo-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function iconFor(label) {
    const hit = ICONES.find(([re]) => re.test(label));
    return hit ? hit[1] : 'i-info';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function mount(container, api) {
    root = container;
    sheet = api;
    load();
  }

  function unmount() {
    root = null;
    sheet = null;
  }

  async function load() {
    renderSkeleton();
    let html;
    try {
      const res = await fetch(SOURCE, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch_failed');
      html = await res.text();
    } catch {
      renderError();
      return;
    }
    if (!root) return;

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const rows = Array.from(doc.querySelectorAll('#infos .info-list > div'))
      .map((block) => {
        const dt = block.querySelector('dt');
        const dd = block.querySelector('dd');
        if (!dt || !dd) return null;
        const link = dd.querySelector('a');
        // Un <br> ne laisse aucune trace dans textContent : sans ce
        // remplacement, « …des Iscles » et « 06700 » se collent.
        const flat = document.createElement('div');
        flat.innerHTML = dd.innerHTML.replace(/<br\s*\/?>/gi, ' ');
        return {
          label: dt.textContent.trim(),
          value: flat.textContent.replace(/\s+/g, ' ').trim(),
          href: link ? link.getAttribute('href') : null
        };
      })
      .filter(Boolean);

    render(rows);
  }

  function renderSkeleton() {
    sheet.setState({ live: false, short: 'Lecture…', text: 'Lecture du site en cours…' });
    root.innerHTML = `
      <div class="bo-skeleton" aria-hidden="true">
        ${[54, 42, 60, 48].map((w) => `
          <div class="bo-skeleton-row">
            <div class="bo-skeleton-bar" style="width:${w}%"></div>
          </div>
        `).join('')}
      </div>
      <p class="visually-hidden" role="status">Lecture des infos pratiques du site.</p>
    `;
  }

  function renderError() {
    if (!root) return;
    sheet.setState({ live: false, short: 'État inconnu', text: 'État inconnu — le site n’a pas pu être lu' });
    root.innerHTML = `
      <div class="bo-alert" role="alert">
        ${icon('i-alert')}
        <div>
          Les infos pratiques n’ont pas pu être lues sur le site.
          <div class="bo-alert-actions">
            <button type="button" class="bo-btn bo-btn-line bo-btn-sm" data-action="retry">Réessayer</button>
          </div>
        </div>
      </div>
    `;
    root.querySelector('[data-action="retry"]').addEventListener('click', load);
  }

  function render(rows) {
    if (!rows.length) {
      sheet.setState({ live: false, short: 'Rien trouvé', text: 'Aucune info pratique trouvée sur le site' });
      root.innerHTML = `
        <div class="bo-empty">
          ${icon('i-info', 'bo-ico-xl')}
          <p class="bo-empty-title">Rien à afficher</p>
          <p>La section « Infos pratiques » du site ne contient aucune ligne lisible. Vérifiez le fichier <code>index.html</code>.</p>
        </div>
      `;
      return;
    }

    sheet.setState({ live: true, short: `${rows.length} informations en ligne`, text: `${rows.length} informations publiées sur le site` });

    root.innerHTML = `
      <div class="bo-block">
        <h3 class="bo-block-title">Ce que le site affiche en ce moment</h3>
        <p class="bo-block-note">Lu à l'instant dans la section « Infos pratiques » du site publié.</p>
        <dl class="bo-values">
          ${rows.map((row) => `
            <div class="bo-value">
              <dt>${icon(iconFor(row.label))}${escapeHtml(row.label)}</dt>
              <dd>
                ${escapeHtml(row.value)}
                ${row.href ? `<small>${escapeHtml(row.href)}</small>` : ''}
              </dd>
            </div>
          `).join('')}
        </dl>
      </div>

      <div class="bo-pending">
        ${icon('i-info')}
        <div>
          <strong>Modification pas encore branchée sur cette page</strong>
          Adresse, téléphone, e-mail et prochain rendez-vous sont aujourd'hui écrits dans
          <code>index.html</code>, section « Infos pratiques ». Cette feuille les relit à chaque
          ouverture : ce qui est affiché ci-dessus est donc toujours ce qui est en ligne.
        </div>
      </div>
    `;
  }

  window.AdminModules = window.AdminModules || [];
  window.AdminModules.push({
    id: 'infos',
    label: 'Infos pratiques',
    icon: 'i-pin',
    summary: 'Adresse, téléphone, e-mail et prochain rendez-vous, tels qu’ils apparaissent en bas du site.',
    mount,
    unmount
  });
})();
