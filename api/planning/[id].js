/* ============================================================
   /api/planning/[id] — admin uniquement
   PUT    : modifie les champs d'un créneau
   DELETE : supprime un créneau
   L'ordre ne se règle pas ici : il passe par api/planning/order.js,
   qui réécrit toutes les positions en une seule écriture atomique.
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { exigerAdmin } = require('../_lib/session');
const { champTropLong, champObligatoireInvalide } = require('../_lib/planning');
const { logAudit, logErreur } = require('../_lib/log');

module.exports = async (req, res) => {
  const email = exigerAdmin(req, res);
  if (!email) return;

  const { id } = req.query;
  const supabase = getSupabase();

  if (req.method === 'PUT') {
    const { day, time, label, place, note } = req.body || {};

    const vide = champObligatoireInvalide({ day, time }, false);
    if (vide) {
      res.status(400).json({ error: 'missing_fields', field: vide });
      return;
    }

    const tropLong = champTropLong({ day, time, label, place, note });
    if (tropLong) {
      res.status(400).json({ error: 'field_too_long', field: tropLong });
      return;
    }

    // Après validation, un champ obligatoire encore présent est
    // forcément une chaîne non vide ; null ou absent vaut « inchangé ».
    const updates = { updated_at: new Date().toISOString() };
    if (typeof day === 'string') updates.day = day.trim();
    if (typeof time === 'string') updates.time = time.trim();
    if (label !== undefined) updates.label = label || '';
    if (place !== undefined) updates.place = place || '';
    if (note !== undefined) updates.note = note || '';

    const { data, error } = await supabase
      .from('planning_slots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logErreur('planning.update', error, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    logAudit('planning.update', email, { id, champs: Object.keys(updates) });
    res.status(200).json({ slot: data });
    return;
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('planning_slots').delete().eq('id', id);
    if (error) {
      logErreur('planning.delete', error, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    logAudit('planning.delete', email, { id });
    res.status(204).end();
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
