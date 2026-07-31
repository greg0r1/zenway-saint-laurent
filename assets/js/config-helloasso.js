/* ============================================================
   CONFIG HELLOASSO — à adapter une seule fois ici
   1. Crée le formulaire d'adhésion sur HelloAsso.
   2. Récupère le slug de l'asso et de la campagne dans l'URL :
      https://www.helloasso.com/associations/<org>/adhesions/<campaign>
   3. Renseigne org + campaign ci-dessous, puis passe ready: true.
   Tant que ready reste à false, les CTA d'inscription affichent un repli
   téléphone/e-mail au lieu d'un lien HelloAsso non confirmé (voir #inscription).
   ============================================================ */
const HELLOASSO = {
  org: "zenway-saint-laurent-du-var", // slug de l'association
  type: "adhesions",                  // "adhesions" | "evenements" | "boutiques"
  campaign: "adhesion-2026-2027",     // slug de la campagne
  ready: false                        // → true quand les slugs sont corrects
};

(function setupHelloAsso(){
  const base = `https://www.helloasso.com/associations/${HELLOASSO.org}/${HELLOASSO.type}/${HELLOASSO.campaign}`;

  // Par défaut (ready: false) : on garde le repli téléphone/e-mail déjà affiché
  // dans le HTML plutôt que de pointer les CTA vers un lien HelloAsso non confirmé.
  if (HELLOASSO.ready){
    document.querySelectorAll('[data-helloasso-link]').forEach(a => { a.href = base; });

    const onlineBtn = document.getElementById('haOnlineBtn');
    const fallbackBtn = document.getElementById('haFallbackBtn');
    const onlineNote = document.getElementById('haOnlineNote');
    const fallbackNote = document.getElementById('haFallbackNote');
    if (onlineBtn) onlineBtn.style.display = '';
    if (fallbackBtn) fallbackBtn.style.display = 'none';
    if (onlineNote) onlineNote.style.display = '';
    if (fallbackNote) fallbackNote.style.display = 'none';

    // Widget embarqué (optionnel) -> affiché seulement si ready
    const f = document.getElementById('haWidget');
    const ph = document.getElementById('haPlaceholder');
    if (f){
      f.src = base + '/widget';
      f.style.display = 'block';
      if (ph) ph.style.display = 'none';
    }
  }
})();
