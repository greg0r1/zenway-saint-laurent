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
    // Les événements datés d'abord, du plus proche au plus lointain ;
    // ceux sans date ensuite, par ordre de saisie.
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('starts_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(200).json({ events: data });
    return;
  }

  if (req.method === 'POST') {
    const { title, description, tag, link_url, active, starts_at, archived } = req.body || {};
    if (!title || !link_url) {
      res.status(400).json({ error: 'missing_fields' });
      return;
    }

    // Un événement archivé n'est jamais l'événement affiché (contrainte
    // reprise en base, voir db/migrations/003_evenements_dates.sql).
    const enLigne = !!active && !archived;

    if (enLigne) {
      await supabase.from('events').update({ active: false }).eq('active', true);
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description: description || '',
        tag: tag || 'Prochain événement',
        link_url,
        starts_at: starts_at || null,
        archived: !!archived,
        active: enLigne
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
