/* ============================================================
   /api/events — admin uniquement
   GET  : liste tous les événements
   POST : crée un événement
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { getSessionEmail } = require('../_lib/session');

module.exports = async (req, res) => {
  const email = getSessionEmail(req);
  if (!email) {
    res.status(401).json({ error: 'unauthenticated' });
    return;
  }

  const supabase = getSupabase();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(200).json({ events: data });
    return;
  }

  if (req.method === 'POST') {
    const { title, description, tag, link_url, active } = req.body || {};
    if (!title || !link_url) {
      res.status(400).json({ error: 'missing_fields' });
      return;
    }

    if (active) {
      await supabase.from('events').update({ active: false }).eq('active', true);
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description: description || '',
        tag: tag || 'Prochain événement',
        link_url,
        active: !!active
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(201).json({ event: data });
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
