/* ============================================================
   /api/events — admin uniquement
   GET  : liste tous les événements
   POST : crée un événement
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { getSessionEmail } = require('../_lib/session');
const { champTropLong } = require('../_lib/events');

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
    const { title, description, tag, featured, starts_at, ends_at, archived, image_url } = req.body || {};
    if (!title) {
      res.status(400).json({ error: 'missing_fields' });
      return;
    }
    const tropLong = champTropLong({ title, tag, description });
    if (tropLong) {
      res.status(400).json({ error: 'field_too_long', field: tropLong });
      return;
    }

    // Un événement archivé n'est jamais l'événement mis en avant
    // (contrainte reprise en base, voir 004_evenements_bandeau.sql).
    const enAvant = !!featured && !archived;

    if (enAvant) {
      await supabase.from('events').update({ featured: false }).eq('featured', true);
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description: description || '',
        tag: tag || 'Prochain événement',
        starts_at: starts_at || null,
        ends_at: ends_at || null,
        archived: !!archived,
        featured: enAvant,
        image_url: image_url || null
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
