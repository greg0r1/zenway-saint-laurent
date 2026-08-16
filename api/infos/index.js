/* ============================================================
   /api/infos — admin uniquement
   GET : lit la fiche « Infos pratiques » (une seule ligne)
   PUT : modifie les champs de la fiche existante
   Aucun POST/DELETE : la seule ligne possible vient de la migration
   (voir db/migrations/008_infos_pratiques.sql et le seed associé
   dans db/README.md).
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { getSessionEmail } = require('../_lib/session');
const { champTropLong, champObligatoireInvalide } = require('../_lib/infos');

module.exports = async (req, res) => {
  const email = getSessionEmail(req);
  if (!email) {
    res.status(401).json({ error: 'unauthenticated' });
    return;
  }

  const supabase = getSupabase();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('infos_pratiques')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(200).json({ infos: data });
    return;
  }

  if (req.method === 'PUT') {
    const { address, map_url, parking, phone, email: contactEmail, next_session } = req.body || {};
    const payload = { address, map_url, parking, phone, email: contactEmail, next_session };

    const vide = champObligatoireInvalide(payload);
    if (vide) {
      res.status(400).json({ error: 'missing_fields', field: vide });
      return;
    }

    const tropLong = champTropLong(payload);
    if (tropLong) {
      res.status(400).json({ error: 'field_too_long', field: tropLong });
      return;
    }

    // Fiche unique : l'id n'est pas fourni par le client, on va le
    // chercher côté serveur avant de modifier.
    const { data: existante, error: erreurLecture } = await supabase
      .from('infos_pratiques')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (erreurLecture) {
      res.status(500).json({ error: 'server_error' });
      return;
    }
    if (!existante) {
      res.status(500).json({ error: 'no_row', message: 'Aucune fiche « Infos pratiques » en base. Jouez la migration 008 et son seed.' });
      return;
    }

    // Après validation, un champ obligatoire encore présent est
    // forcément une chaîne non vide ; null ou absent vaut « inchangé ».
    const updates = { updated_at: new Date().toISOString() };
    if (typeof address === 'string') updates.address = address.trim();
    if (typeof map_url === 'string') updates.map_url = map_url.trim();
    if (typeof parking === 'string') updates.parking = parking.trim();
    if (typeof phone === 'string') updates.phone = phone.trim();
    if (typeof contactEmail === 'string') updates.email = contactEmail.trim();
    if (next_session !== undefined) updates.next_session = next_session || '';

    const { data, error } = await supabase
      .from('infos_pratiques')
      .update(updates)
      .eq('id', existante.id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(200).json({ infos: data });
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
