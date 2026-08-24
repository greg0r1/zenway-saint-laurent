/* ============================================================
   CONFIG HELLOASSO — à adapter une seule fois ici
   1. Crée le formulaire d'adhésion sur HelloAsso.
   2. Récupère le slug de l'asso et de la campagne dans l'URL :
      https://www.helloasso.com/associations/<org>/adhesions/<campaign>
   3. Renseigne org + campaign ci-dessous, puis passe ready: true.
   Tant que ready reste à false, le CTA d'inscription affiche un repli
   téléphone/e-mail au lieu d'un lien HelloAsso non confirmé (voir #inscription).
   ============================================================ */
const HELLOASSO = {
  org: 'zenway-st-laurent-du-var', // slug de l'association
  type: 'adhesions', // "adhesions" | "evenements" | "boutiques"
  campaign: 'zenway-st-laurent-du-var', // slug de la campagne
  ready: true // → true quand les slugs sont corrects
};

(function setupHelloAsso() {
  const base = `https://www.helloasso.com/associations/${HELLOASSO.org}/${HELLOASSO.type}/${HELLOASSO.campaign}`;

  // L'inscription en ligne est l'état écrit dans le HTML : rien à
  // rétablir ici quand `ready` est vrai, sans quoi le repli
  // téléphone/e-mail clignoterait à chaque chargement le temps que ce
  // script s'exécute. C'est la branche `else` qui bascule vers le repli.
  if (HELLOASSO.ready) {
    document.querySelectorAll('[data-helloasso-link]').forEach((a) => {
      a.href = base;
    });

    // Widget embarqué (optionnel) -> affiché seulement si ready. Un
    // loader s'affiche pendant le chargement de l'iframe ; si elle ne
    // charge pas dans le délai imparti (ou en erreur réseau), le bloc
    // widget disparaît et il ne reste que le bouton HelloAsso.
    const wrap = document.getElementById('haWidgetWrap');
    const f = document.getElementById('haWidget');
    const ph = document.getElementById('haPlaceholder');
    if (f && wrap) {
      if (ph) {
        ph.textContent = 'Chargement du formulaire d’adhésion...';
        ph.classList.add('ha-widget-loading');
      }

      let loaded = false;
      const giveUp = () => {
        if (!loaded) wrap.style.display = 'none';
      };
      const timeout = setTimeout(giveUp, 8000);
      const requestedAt = Date.now();

      f.addEventListener('load', () => {
        // Une page d'erreur ou une frame refusée (mauvais slug, embarquement
        // bloqué) se charge quasi instantanément, contrairement au vrai
        // formulaire : on l'assimile à un échec plutôt que d'afficher une
        // iframe cassée à la place du repli.
        if (Date.now() - requestedAt < 350) {
          clearTimeout(timeout);
          giveUp();
          return;
        }
        loaded = true;
        clearTimeout(timeout);
        f.style.display = 'block';
        if (ph) ph.style.display = 'none';
      });
      f.addEventListener('error', () => {
        clearTimeout(timeout);
        giveUp();
      });

      f.src = base + '/widget';
    }
  } else {
    // Slugs non confirmés : on retire le chemin HelloAsso plutôt que de
    // pointer le CTA vers un lien incertain, et on montre le repli
    // téléphone/e-mail à sa place.
    const onlineBtn = document.getElementById('haOnlineBtn');
    const fallbackBtn = document.getElementById('haFallbackBtn');
    const onlineNote = document.getElementById('haOnlineNote');
    const fallbackNote = document.getElementById('haFallbackNote');
    if (onlineBtn) onlineBtn.style.display = 'none';
    if (fallbackBtn) fallbackBtn.style.display = '';
    if (onlineNote) onlineNote.style.display = 'none';
    if (fallbackNote) fallbackNote.style.display = '';

    const wrap = document.getElementById('haWidgetWrap');
    if (wrap) wrap.style.display = 'none';
  }
})();
