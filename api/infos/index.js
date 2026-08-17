/* ============================================================
   /api/infos
   GET : lit la fiche « Infos pratiques » (une seule ligne) — public,
         aucune session requise. Contrairement aux événements et au
         planning, cette table ne contient aucune donnée « pas encore
         publiée » : ce que l'admin voit est déjà ce que le site
         public affiche, donc pas de route /public séparée.
         (Aussi une contrainte pratique : le plan Hobby de Vercel
         limite à 12 fonctions serverless par déploiement.)
   PUT : modifie les champs de la fiche existante — admin uniquement.
   Aucun POST/DELETE : la seule ligne possible vient de la migration
   (voir db/migrations/008_infos_pratiques.sql et le seed associé
   dans db/README.md).
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { exigerAdmin } = require('../_lib/session');
const { champTropLong, champObligatoireInvalide, urlInvalide } = require('../_lib/infos');
const { logAudit, logErreur } = require('../_lib/log');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('infos_pratiques')
      .select('address, map_url, parking, phone, email, next_session')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      logErreur('infos.read', error);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(200).json({ infos: data || null });
    return;
  }

  if (req.method === 'PUT') {
    // Le garde passe avant tout le reste, client de base de données
    // compris : une requête non authentifiée ne doit rien déclencher.
    const email = exigerAdmin(req, res);
    if (!email) return;

    const supabase = getSupabase();
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

    const urlFautive = urlInvalide(payload);
    if (urlFautive) {
      res.status(400).json({ error: 'invalid_url', field: urlFautive });
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
      logErreur('infos.update.read', erreurLecture, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    if (!existante) {
      logErreur('infos.update', new Error('aucune fiche infos_pratiques en base'), email);
      res.status(500).json({
        error: 'no_row',
        message: 'Aucune fiche « Infos pratiques » en base. Jouez la migration 008 et son seed.'
      });
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
      logErreur('infos.update', error, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    logAudit('infos.update', email, { champs: Object.keys(updates) });
    res.status(200).json({ infos: data });
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
