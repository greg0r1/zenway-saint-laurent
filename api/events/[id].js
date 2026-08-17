/* ============================================================
   /api/events/[id] — admin uniquement
   PUT    : modifie un événement
   DELETE : supprime un événement
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { exigerAdmin } = require('../_lib/session');
const { champTropLong, imageUrlInvalide } = require('../_lib/events');
const { logAudit, logErreur } = require('../_lib/log');

module.exports = async (req, res) => {
  const email = exigerAdmin(req, res);
  if (!email) return;

  const { id } = req.query;
  const supabase = getSupabase();

  if (req.method === 'PUT') {
    const { title, description, tag, featured, starts_at, ends_at, archived, image_url } =
      req.body || {};

    const tropLong = champTropLong({ title, tag, description });
    if (tropLong) {
      res.status(400).json({ error: 'field_too_long', field: tropLong });
      return;
    }

    if (imageUrlInvalide(image_url)) {
      res.status(400).json({ error: 'invalid_url', field: 'image_url' });
      return;
    }

    // Archiver retire de la mise en avant : les deux états ne coexistent
    // pas (contrainte reprise en base, voir 004_evenements_bandeau.sql).
    const enAvant = archived ? false : featured;

    if (enAvant) {
      // L'index unique partiel events_un_seul_vedette (voir
      // 004_evenements_bandeau.sql) refuserait la modification qui suit
      // si cette dépublication échouait. Sans lire l'erreur ici, le
      // journal ne garderait que le symptôme (une violation 23505) et
      // jamais sa cause.
      const { error: erreurVedette } = await supabase
        .from('events')
        .update({ featured: false })
        .eq('featured', true)
        .neq('id', id);

      if (erreurVedette) {
        logErreur('events.demote', erreurVedette, email);
        res.status(500).json({ error: 'server_error' });
        return;
      }
    }

    const updates = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (tag !== undefined) updates.tag = tag;
    if (starts_at !== undefined) updates.starts_at = starts_at || null;
    if (ends_at !== undefined) updates.ends_at = ends_at || null;
    if (archived !== undefined) updates.archived = !!archived;
    if (enAvant !== undefined) updates.featured = !!enAvant;
    // La version validée, pas la brute : imageUrlInvalide contrôle
    // valeur.trim(), c'est donc elle qu'on enregistre.
    if (image_url !== undefined)
      updates.image_url = (image_url && String(image_url).trim()) || null;

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logErreur('events.update', error, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    logAudit('events.update', email, { id, champs: Object.keys(updates) });
    res.status(200).json({ event: data });
    return;
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) {
      logErreur('events.delete', error, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    // Suppression définitive et sans corbeille : c'est l'action dont la
    // trace compte le plus.
    logAudit('events.delete', email, { id });
    res.status(204).end();
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
