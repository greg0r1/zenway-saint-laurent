/* ============================================================
   GET /api/infos/public — la fiche « Infos pratiques », publique
   Seule route Supabase du module Infos pratiques accessible depuis
   le site public : ne renvoie que les champs nécessaires à
   l'affichage de la section « Infos pratiques ». `infos` vaut null
   tant que la migration/seed n'a pas été jouée — le site garde alors
   le contenu statique déjà présent dans index.html.
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('infos_pratiques')
    .select('address, map_url, parking, phone, email, next_session')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: 'server_error' });
    return;
  }

  res.status(200).json({ infos: data || null });
};
