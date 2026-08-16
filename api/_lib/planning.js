/* ============================================================
   PLANNING — règles de validation des champs, partagées par
   api/planning/index.js et api/planning/[id].js, pour que créer et
   modifier un créneau obéissent exactement aux mêmes contraintes.
   ============================================================ */
const LIMITS = { day: 40, time: 60, label: 120, place: 160, note: 160 };

// Le jour et l'horaire portent l'identité du créneau : la carte du site
// public n'a plus de sens sans eux.
const OBLIGATOIRES = ['day', 'time'];

function champTropLong(payload) {
  if (typeof payload.day === 'string' && payload.day.length > LIMITS.day) return 'day';
  if (typeof payload.time === 'string' && payload.time.length > LIMITS.time) return 'time';
  if (typeof payload.label === 'string' && payload.label.length > LIMITS.label) return 'label';
  if (typeof payload.place === 'string' && payload.place.length > LIMITS.place) return 'place';
  if (typeof payload.note === 'string' && payload.note.length > LIMITS.note) return 'note';
  return null;
}

/* Renvoie le premier champ obligatoire fautif, ou null.
   `creation` distingue les deux routes : à la création le champ doit
   être présent, alors qu'à la modification un champ absent signifie
   « inchangé ». Fourni, en revanche, il ne peut être ni vide ni
   réduit à des espaces — sinon un PUT viderait le créneau, ce que la
   contrainte `not null` de Postgres ne rattrape pas. */
function champObligatoireInvalide(payload, creation) {
  for (const champ of OBLIGATOIRES) {
    const valeur = payload[champ];
    if (valeur === undefined || valeur === null) {
      if (creation) return champ;
      continue;
    }
    if (typeof valeur !== 'string' || !valeur.trim()) return champ;
  }
  return null;
}

module.exports = { LIMITS, champTropLong, champObligatoireInvalide };
