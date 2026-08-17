/* ============================================================
   INFOS PRATIQUES — règles de validation des champs, partagées par
   api/infos/index.js, pour que la lecture et la modification de la
   fiche obéissent aux mêmes contraintes.
   ============================================================ */
const LIMITS = {
  address: 200,
  map_url: 300,
  parking: 120,
  phone: 30,
  email: 120,
  next_session: 120
};

// next_session est facultatif : une valeur vide fait disparaître la
// ligne « Prochain rendez-vous » côté site public plutôt que d'y
// afficher un texte creux.
const OBLIGATOIRES = ['address', 'map_url', 'parking', 'phone', 'email'];

function champTropLong(payload) {
  for (const champ of Object.keys(LIMITS)) {
    const valeur = payload[champ];
    if (typeof valeur === 'string' && valeur.length > LIMITS[champ]) return champ;
  }
  return null;
}

/* Renvoie le premier champ obligatoire fautif, ou null. La fiche
   n'est jamais créée depuis l'API (une seule ligne, posée par la
   migration/seed) : un champ absent lors d'une modification signifie
   « inchangé », mais fourni, il ne peut être ni vide ni réduit à des
   espaces — sinon un PUT viderait la fiche, ce que la contrainte
   `not null` de Postgres ne rattrape pas. */
function champObligatoireInvalide(payload) {
  for (const champ of OBLIGATOIRES) {
    const valeur = payload[champ];
    if (valeur === undefined || valeur === null) continue;
    if (typeof valeur !== 'string' || !valeur.trim()) return champ;
  }
  return null;
}

/* map_url est le seul champ dont la valeur devient une URL sur le site
   public (l'attribut href du lien « Lieu »). Sans contrôle du schéma,
   un compte admin compromis pourrait y placer un `javascript:` servi à
   tous les visiteurs. La CSP le neutraliserait sans doute, mais on ne
   fait pas dépendre la sûreté du site d'un seul rempart : on n'accepte
   ici que https. */
function urlInvalide(payload) {
  const valeur = payload.map_url;
  if (valeur === undefined || valeur === null) return null;
  if (typeof valeur !== 'string') return 'map_url';
  return /^https:\/\/\S+$/i.test(valeur.trim()) ? null : 'map_url';
}

module.exports = { LIMITS, champTropLong, champObligatoireInvalide, urlInvalide };
