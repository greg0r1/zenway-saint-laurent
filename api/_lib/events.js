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

function champTropLong(payload) {
  if (typeof payload.title === 'string' && payload.title.length > LIMITS.title) return 'title';
  if (typeof payload.tag === 'string' && payload.tag.length > LIMITS.tag) return 'tag';
  if (typeof payload.description === 'string' && payload.description.length > LIMITS.description) return 'description';
  return null;
}

module.exports = { LIMITS, IMAGE_MAX_BYTES, IMAGE_MIME_TYPES, champTropLong };
