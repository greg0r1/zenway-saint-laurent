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
  venue_name: 100,
  venue_url: 300
};

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

/* map_url et venue_url sont les seuls champs dont la valeur devient une
   URL sur le site public (l'attribut href des liens « Lieu » et
   « Adresse »). Sans contrôle du schéma, un compte admin compromis
   pourrait y placer un `javascript:` servi à tous les visiteurs. La CSP
   le neutraliserait sans doute, mais on ne fait pas dépendre la sûreté
   du site d'un seul rempart : on n'accepte ici que https. venue_url est
   facultatif (contrairement à map_url, obligatoire — voir
   champObligatoireInvalide) : une chaîne vide n'est donc pas fautive ici.  */
const CHAMPS_URL = ['map_url', 'venue_url'];

function urlInvalide(payload) {
  for (const champ of CHAMPS_URL) {
    const valeur = payload[champ];
    if (valeur === undefined || valeur === null) continue;
    if (typeof valeur !== 'string') return champ;
    const propre = valeur.trim();
    if (!propre) continue;
    if (!/^https:\/\/\S+$/i.test(propre)) return champ;
  }
  return null;
}

module.exports = { LIMITS, champTropLong, champObligatoireInvalide, urlInvalide };
