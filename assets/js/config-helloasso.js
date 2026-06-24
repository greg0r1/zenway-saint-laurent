/* ============================================================
   CONFIG HELLOASSO — à adapter une seule fois ici
   1. Crée le formulaire d'adhésion sur HelloAsso.
   2. Récupère le slug de l'asso et de la campagne dans l'URL :
      https://www.helloasso.com/associations/<org>/adhesions/<campaign>
   3. Renseigne org + campaign ci-dessous, puis passe ready: true.
   ============================================================ */
const HELLOASSO = {
  org: "zenway-saint-laurent-du-var", // slug de l'association
  type: "adhesions",                  // "adhesions" | "evenements" | "boutiques"
  campaign: "adhesion-2026-2027",     // slug de la campagne
  ready: false                        // → true quand les slugs sont corrects
};

(function setupHelloAsso(){
  const base = `https://www.helloasso.com/associations/${HELLOASSO.org}/${HELLOASSO.type}/${HELLOASSO.campaign}`;
  // Tous les liens "S'inscrire" -> page HelloAsso hébergée (voie la plus robuste)
  document.querySelectorAll('[data-helloasso-link]').forEach(a => { a.href = base; });
  // Widget embarqué (optionnel) -> affiché seulement si ready
  if (HELLOASSO.ready){
    const f = document.getElementById('haWidget');
    const ph = document.getElementById('haPlaceholder');
    f.src = base + '/widget';
    f.style.display = 'block';
    if (ph) ph.style.display = 'none';
  }
})();
