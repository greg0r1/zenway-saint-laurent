/* ============================================================
   GET /api/planning/public — les créneaux de séance, public
   Seule route Supabase du module Planning accessible depuis le site
   public : ne renvoie que les champs nécessaires à l'affichage de la
   section « Planning ». Triés par position croissante (ordre choisi
   dans l'admin), comme dans l'admin.
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { logErreur } = require('../_lib/log');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('planning_slots')
    .select('day, time, label, place, note')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    logErreur('planning.public', error);
    res.status(500).json({ error: 'server_error' });
    return;
  }

  res.status(200).json({ slots: data || [] });
};
