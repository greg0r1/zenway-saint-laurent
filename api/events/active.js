/* ============================================================
   GET /api/events/active — l'événement actif (ou null), public
   Seule route Supabase accessible depuis le site public : ne renvoie
   que les champs nécessaires à l'affichage (bandeau + section événements).
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('events')
    .select('title, description, tag, link_url, starts_at')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: 'server_error' });
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
  res.status(200).json({ event: data || null });
};
