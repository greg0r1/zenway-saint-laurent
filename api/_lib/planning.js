/* ============================================================
   PLANNING — limites de longueur des champs, partagées par
   api/planning/index.js et api/planning/[id].js. Un champ trop long
   casserait la mise en page de la carte « Planning » du site public.
   ============================================================ */
const LIMITS = { day: 40, time: 60, label: 120, place: 160, note: 160 };

function champTropLong(payload) {
  if (typeof payload.day === 'string' && payload.day.length > LIMITS.day) return 'day';
  if (typeof payload.time === 'string' && payload.time.length > LIMITS.time) return 'time';
  if (typeof payload.label === 'string' && payload.label.length > LIMITS.label) return 'label';
  if (typeof payload.place === 'string' && payload.place.length > LIMITS.place) return 'place';
  if (typeof payload.note === 'string' && payload.note.length > LIMITS.note) return 'note';
  return null;
}

module.exports = { LIMITS, champTropLong };
