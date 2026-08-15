/* ============================================================
   GET /api/events/public — les événements publiés, public
   Seule route Supabase accessible depuis le site public : ne renvoie
   que les champs nécessaires à l'affichage (section « Événements » +
   bandeau). Un événement est publié tant qu'il n'est pas archivé et
   que sa date de fin de parution, si renseignée, n'est pas dépassée.
   Au plus un événement porte `featured: true` (mise en avant dans le
   bandeau) — c'est ce même tableau qui alimente les deux.
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const supabase = getSupabase();
  const aujourdhui = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('events')
    .select('id, title, description, tag, starts_at, featured')
    .eq('archived', false)
    .or(`ends_at.is.null,ends_at.gte.${aujourdhui}`)
    .order('starts_at', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json({ error: 'server_error' });
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
  res.status(200).json({ events: data || [] });
};
