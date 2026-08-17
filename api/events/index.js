/* ============================================================
   /api/events — admin uniquement
   GET  : liste tous les événements
   POST : crée un événement
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { exigerAdmin } = require('../_lib/session');
const { champTropLong, imageUrlInvalide } = require('../_lib/events');
const { logAudit, logErreur } = require('../_lib/log');

module.exports = async (req, res) => {
  const email = exigerAdmin(req, res);
  if (!email) return;

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
      logErreur('events.list', error, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(200).json({ events: data });
    return;
  }

  if (req.method === 'POST') {
    const { title, description, tag, featured, starts_at, ends_at, archived, image_url } =
      req.body || {};
    if (!title) {
      res.status(400).json({ error: 'missing_fields' });
      return;
    }
    const tropLong = champTropLong({ title, tag, description });
    if (tropLong) {
      res.status(400).json({ error: 'field_too_long', field: tropLong });
      return;
    }

    if (imageUrlInvalide(image_url)) {
      res.status(400).json({ error: 'invalid_url', field: 'image_url' });
      return;
    }

    // Un événement archivé n'est jamais l'événement mis en avant
    // (contrainte reprise en base, voir 004_evenements_bandeau.sql).
    const enAvant = !!featured && !archived;

    if (enAvant) {
      // L'index unique partiel events_un_seul_vedette (voir
      // 004_evenements_bandeau.sql) refuserait l'insertion qui suit si
      // cette dépublication échouait. Sans lire l'erreur ici, le journal
      // ne garderait que le symptôme (une violation 23505) et jamais sa
      // cause.
      const { error: erreurVedette } = await supabase
        .from('events')
        .update({ featured: false })
        .eq('featured', true);

      if (erreurVedette) {
        logErreur('events.demote', erreurVedette, email);
        res.status(500).json({ error: 'server_error' });
        return;
      }
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
        // La version validée, pas la brute : imageUrlInvalide contrôle
        // valeur.trim(), c'est donc elle qu'on enregistre.
        image_url: (image_url && String(image_url).trim()) || null
      })
      .select()
      .single();

    if (error) {
      logErreur('events.create', error, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    logAudit('events.create', email, { id: data.id, titre: data.title, featured: data.featured });
    res.status(201).json({ event: data });
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
