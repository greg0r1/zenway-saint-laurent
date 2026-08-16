/* ============================================================
   ADMIN-INFOS — page « Infos pratiques ». Lecture seule pour
   l'instant. Les valeurs ne sont pas recopiées ici : la page va les
   lire dans le site publié lui-même (section « Infos pratiques » de
   index.html), elle affiche donc toujours la vérité du moment.
   S'enregistre dans window.AdminModules, monté par assets/js/admin.js.
   ============================================================ */
(function registerInfosPage() {
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
  let page = null;

  function icone(id, classe) {
    return `<svg class="ad-ico${classe ? ' ' + classe : ''}" aria-hidden="true"><use href="#${id}" /></svg>`;
  }

  function iconePour(label) {
    const hit = ICONES.find(([re]) => re.test(label));
    return hit ? hit[1] : 'i-info';
  }

  // Échappe les guillemets et l'apostrophe en plus des chevrons, pour
  // rester sûr en position d'attribut (value="…", src="…") : sans cela,
  // un guillemet dans la donnée referme l'attribut et permet d'en
  // injecter un autre, un gestionnaire d'événement par exemple. Sans
  // effet en contenu textuel, où le parseur rend les entités telles quelles.
  function echapper(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function mount(container, api) {
    root = container;
    page = api;
    page.setActions([]);
    charger();
  }

  function unmount() {
    root = null;
    page = null;
  }

  async function charger() {
    squelette();
    let html;
    try {
      const res = await fetch(SOURCE, { cache: 'no-store' });
      if (!res.ok) throw new Error('fetch_failed');
      html = await res.text();
    } catch {
      erreur();
      return;
    }
    if (!root) return;

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const lignes = Array.from(doc.querySelectorAll('#infos .info-list > div'))
      .map((bloc) => {
        const dt = bloc.querySelector('dt');
        const dd = bloc.querySelector('dd');
        if (!dt || !dd) return null;
        const lien = dd.querySelector('a');
        // Un <br> ne laisse aucune trace dans textContent : sans ce
        // remplacement, « …des Iscles » et « 06700 » se collent.
        const plat = document.createElement('div');
        plat.innerHTML = dd.innerHTML.replace(/<br\s*\/?>/gi, ' ');
        return {
          label: dt.textContent.trim(),
          value: plat.textContent.replace(/\s+/g, ' ').trim(),
          href: lien ? lien.getAttribute('href') : null
        };
      })
      .filter(Boolean);

    rendre(lignes);
  }

  function squelette() {
    root.innerHTML = `
      <div class="ad-skeleton" aria-hidden="true">
        ${[54, 42, 60, 48].map((w) => `<div class="ad-skeleton-bar" style="width:${w}%"></div>`).join('')}
      </div>
      <p class="ad-sr" role="status">Lecture des infos pratiques du site.</p>
    `;
  }

  function erreur() {
    if (!root) return;
    root.innerHTML = `
      <div class="ad-alert" role="alert">
        ${icone('i-alert')}
        <div>
          Les infos pratiques n’ont pas pu être lues sur le site.
          <div class="ad-alert-actions">
            <button type="button" class="ad-btn ad-btn-line ad-btn-sm" data-action="retry">Réessayer</button>
          </div>
        </div>
      </div>
    `;
    root.querySelector('[data-action="retry"]').addEventListener('click', charger);
  }

  function rendre(lignes) {
    if (page) page.setBadge(lignes.length || null);

    if (!lignes.length) {
      root.innerHTML = `
        <div class="ad-empty">
          ${icone('i-info', 'ad-ico-xl')}
          <p class="ad-empty-title">Rien à afficher</p>
          <p>La section « Infos pratiques » du site ne contient aucune ligne lisible.
            Vérifiez le fichier <code>index.html</code>.</p>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <p class="ad-lede">Adresse, téléphone, e-mail et prochain rendez-vous, lus à l'instant dans la section
        « Infos pratiques » du site publié.</p>

      <section class="ad-box">
        <h2 class="ad-box-title">Ce que le site affiche en ce moment</h2>
        <dl class="ad-facts">
          ${lignes.map((ligne) => `
            <div class="ad-fact">
              <dt>${icone(iconePour(ligne.label))}${echapper(ligne.label)}</dt>
              <dd>
                <b>${echapper(ligne.value)}</b>
                ${ligne.href ? `<small>${echapper(ligne.href)}</small>` : ''}
              </dd>
            </div>
          `).join('')}
        </dl>
      </section>

      <div class="ad-note ad-note-warn">
        ${icone('i-info')}
        <div>
          <strong>Modification pas encore branchée sur cette page</strong>
          Adresse, téléphone, e-mail et prochain rendez-vous sont aujourd'hui écrits dans
          <code>index.html</code>, section « Infos pratiques ». Cette page les relit à chaque
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
    title: 'Infos pratiques',
    mount,
    unmount
  });
})();
