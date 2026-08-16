/* ============================================================
   POST /api/planning/order — admin uniquement
   Enregistre l'ordre complet des créneaux en une seule écriture
   atomique (fonction planning_set_order, voir
   db/migrations/007_planning_ordre.sql). Le corps porte la liste
   complète des identifiants dans l'ordre voulu ; un ordre partiel
   est refusé par la fonction elle-même.
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { getSessionEmail } = require('../_lib/session');

// Garde-fou sur un appel manifestement aberrant : le planning tient en
// quelques créneaux, jamais en plusieurs centaines.
const MAX_CRENEAUX = 200;

module.exports = async (req, res) => {
  const email = getSessionEmail(req);
  if (!email) {
    res.status(401).json({ error: 'unauthenticated' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const { ids } = req.body || {};
  if (!Array.isArray(ids) || !ids.length || ids.length > MAX_CRENEAUX) {
    res.status(400).json({ error: 'invalid_order' });
    return;
  }
  if (!ids.every((id) => typeof id === 'string' && id)) {
    res.status(400).json({ error: 'invalid_order' });
    return;
  }
  if (new Set(ids).size !== ids.length) {
    res.status(400).json({ error: 'duplicate_ids' });
    return;
  }

  const supabase = getSupabase();
  const { error } = await supabase.rpc('planning_set_order', { ids });

  if (error) {
    res.status(500).json({ error: 'server_error' });
    return;
  }

  res.status(204).end();
};
