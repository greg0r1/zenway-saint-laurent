/* ============================================================
   ÉVÉNEMENTS — limites partagées par api/events/index.js et
   api/events/[id].js. Un champ trop long casserait la mise en page
   des cartes et du bandeau sur le site public.
   ============================================================ */
const LIMITS = { title: 100, tag: 40, description: 500 };

function champTropLong(payload) {
  if (typeof payload.title === 'string' && payload.title.length > LIMITS.title) return 'title';
  if (typeof payload.tag === 'string' && payload.tag.length > LIMITS.tag) return 'tag';
  if (typeof payload.description === 'string' && payload.description.length > LIMITS.description) return 'description';
  return null;
}

module.exports = { LIMITS, champTropLong };
