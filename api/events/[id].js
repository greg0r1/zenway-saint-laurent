/* ============================================================
   /api/events/[id] — admin uniquement
   PUT    : modifie un événement
   DELETE : supprime un événement
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { getSessionEmail } = require('../_lib/session');

module.exports = async (req, res) => {
  const email = getSessionEmail(req);
  if (!email) {
    res.status(401).json({ error: 'unauthenticated' });
    return;
  }

  const { id } = req.query;
  const supabase = getSupabase();

  if (req.method === 'PUT') {
    const { title, description, tag, link_url, active } = req.body || {};

    if (active) {
      await supabase.from('events').update({ active: false }).eq('active', true).neq('id', id);
    }

    const updates = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (tag !== undefined) updates.tag = tag;
    if (link_url !== undefined) updates.link_url = link_url;
    if (active !== undefined) updates.active = !!active;

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(200).json({ event: data });
    return;
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(204).end();
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
