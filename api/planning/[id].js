/* ============================================================
   /api/planning/[id] — admin uniquement
   PUT    : modifie un créneau (champs métier et/ou position)
   DELETE : supprime un créneau
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { getSessionEmail } = require('../_lib/session');
const { champTropLong } = require('../_lib/planning');

module.exports = async (req, res) => {
  const email = getSessionEmail(req);
  if (!email) {
    res.status(401).json({ error: 'unauthenticated' });
    return;
  }

  const { id } = req.query;
  const supabase = getSupabase();

  if (req.method === 'PUT') {
    const { day, time, label, place, note, position } = req.body || {};

    const tropLong = champTropLong({ day, time, label, place, note });
    if (tropLong) {
      res.status(400).json({ error: 'field_too_long', field: tropLong });
      return;
    }

    const updates = { updated_at: new Date().toISOString() };
    if (day !== undefined) updates.day = day;
    if (time !== undefined) updates.time = time;
    if (label !== undefined) updates.label = label || '';
    if (place !== undefined) updates.place = place || '';
    if (note !== undefined) updates.note = note || '';
    if (position !== undefined) updates.position = position;

    const { data, error } = await supabase
      .from('planning_slots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(200).json({ slot: data });
    return;
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('planning_slots').delete().eq('id', id);
    if (error) {
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(204).end();
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
