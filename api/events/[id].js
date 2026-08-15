/* ============================================================
   /api/events/[id] — admin uniquement
   PUT    : modifie un événement
   DELETE : supprime un événement
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

  const { id } = req.query;
  const supabase = getSupabase();

  if (req.method === 'PUT') {
    const { title, description, tag, featured, starts_at, ends_at, archived, image_url } = req.body || {};

    const tropLong = champTropLong({ title, tag, description });
    if (tropLong) {
      res.status(400).json({ error: 'field_too_long', field: tropLong });
      return;
    }

    // Archiver retire de la mise en avant : les deux états ne coexistent
    // pas (contrainte reprise en base, voir 004_evenements_bandeau.sql).
    const enAvant = archived ? false : featured;

    if (enAvant) {
      await supabase.from('events').update({ featured: false }).eq('featured', true).neq('id', id);
    }

    const updates = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (tag !== undefined) updates.tag = tag;
    if (starts_at !== undefined) updates.starts_at = starts_at || null;
    if (ends_at !== undefined) updates.ends_at = ends_at || null;
    if (archived !== undefined) updates.archived = !!archived;
    if (enAvant !== undefined) updates.featured = !!enAvant;
    if (image_url !== undefined) updates.image_url = image_url || null;

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
