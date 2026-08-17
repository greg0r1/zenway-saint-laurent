/* ============================================================
   ÉVÉNEMENTS — limites partagées par api/events/index.js et
   api/events/[id].js. Un champ trop long casserait la mise en page
   des cartes et du bandeau sur le site public.
   ============================================================ */
const LIMITS = { title: 100, tag: 40, description: 500 };

// L'image est redimensionnée côté client avant l'envoi (voir
// admin-events.js) ; cette limite ne protège que contre un appel direct
// à l'API qui contournerait ce redimensionnement.
const IMAGE_MAX_BYTES = 4 * 1024 * 1024;
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Longueur maximale de la chaîne base64 correspondante. Le contrôle de
// taille doit tomber AVANT le décodage : la limite de corps de requête
// de la plateforme est bien plus haute que la nôtre (et a déjà changé
// d'une version à l'autre), or Buffer.from() allouerait tout ce qui
// arrive avant qu'on ait pu le refuser. Le base64 pèse 4/3 des octets,
// plus le remplissage.
const IMAGE_MAX_BASE64 = Math.ceil((IMAGE_MAX_BYTES * 4) / 3) + 4;

// Signatures de fichier des trois formats acceptés. Le type MIME du
// `data:` est déclaratif : rien n'oblige le client à dire la vérité.
// Vercel Blob resservirait le fichier avec le contentType annoncé, donc
// un contenu étranger étiqueté image/jpeg ne s'exécuterait pas — mais on
// ne fait pas dépendre la sûreté du site d'un seul rempart.
const SIGNATURES = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  'image/webp': (b) =>
    b.slice(0, 4).toString('ascii') === 'RIFF' && b.slice(8, 12).toString('ascii') === 'WEBP'
};

function signatureInvalide(type, buffer) {
  const controle = SIGNATURES[type];
  return !controle || buffer.length < 12 || !controle(buffer);
}

// L'URL d'image est enregistrée telle quelle puis servie en src aux
// visiteurs. La CSP img-src la bloquerait si elle pointait ailleurs,
// mais on la valide ici comme map_url l'est déjà dans _lib/infos.js :
// une seule origine possible, celle de notre store Blob.
const BLOB_HOTE = /(^|\.)public\.blob\.vercel-storage\.com$/;

function imageUrlInvalide(valeur) {
  // Vide vaut « pas d'image » : une chaîne d'espaces dit la même chose
  // qu'une chaîne vide, les deux se traitent donc pareil.
  if (valeur === undefined || valeur === null || !String(valeur).trim()) return null;
  if (typeof valeur !== 'string') return 'image_url';
  let url;
  try {
    url = new URL(valeur.trim());
  } catch {
    return 'image_url';
  }
  // Rien ne justifie un port sur un store Blob : le laisser passer
  // ouvrirait l'URL sur autre chose que le service attendu.
  return url.protocol === 'https:' && url.port === '' && BLOB_HOTE.test(url.hostname)
    ? null
    : 'image_url';
}

function champTropLong(payload) {
  if (typeof payload.title === 'string' && payload.title.length > LIMITS.title) return 'title';
  if (typeof payload.tag === 'string' && payload.tag.length > LIMITS.tag) return 'tag';
  if (typeof payload.description === 'string' && payload.description.length > LIMITS.description)
    return 'description';
  return null;
}

module.exports = {
  LIMITS,
  IMAGE_MAX_BYTES,
  IMAGE_MAX_BASE64,
  IMAGE_MIME_TYPES,
  champTropLong,
  signatureInvalide,
  imageUrlInvalide
};
