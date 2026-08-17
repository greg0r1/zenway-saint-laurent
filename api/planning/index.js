/* ============================================================
   /api/planning — admin uniquement
   GET  : liste tous les créneaux, triés par position
   POST : crée un créneau, ajouté en fin de liste
   ============================================================ */
const { getSupabase } = require('../_lib/supabase');
const { getSessionEmail } = require('../_lib/session');
const { champTropLong, champObligatoireInvalide } = require('../_lib/planning');
const { logAudit, logErreur } = require('../_lib/log');

module.exports = async (req, res) => {
  const email = getSessionEmail(req);
  if (!email) {
    res.status(401).json({ error: 'unauthenticated' });
    return;
  }

  const supabase = getSupabase();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('planning_slots')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      logErreur('planning.list', error, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    res.status(200).json({ slots: data });
    return;
  }

  if (req.method === 'POST') {
    const { day, time, label, place, note } = req.body || {};
    const manquant = champObligatoireInvalide({ day, time }, true);
    if (manquant) {
      res.status(400).json({ error: 'missing_fields', field: manquant });
      return;
    }
    const tropLong = champTropLong({ day, time, label, place, note });
    if (tropLong) {
      res.status(400).json({ error: 'field_too_long', field: tropLong });
      return;
    }

    // Un nouveau créneau se range en fin de liste : sous la position la
    // plus haute déjà utilisée, jamais choisie par le client.
    const { data: dernier, error: erreurDernier } = await supabase
      .from('planning_slots')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (erreurDernier) {
      logErreur('planning.create.position', erreurDernier, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }

    const { data, error } = await supabase
      .from('planning_slots')
      .insert({
        day: day.trim(),
        time: time.trim(),
        label: label || '',
        place: place || '',
        note: note || '',
        position: (dernier ? dernier.position : 0) + 1
      })
      .select()
      .single();

    if (error) {
      logErreur('planning.create', error, email);
      res.status(500).json({ error: 'server_error' });
      return;
    }
    logAudit('planning.create', email, { id: data.id, day: data.day, time: data.time });
    res.status(201).json({ slot: data });
    return;
  }

  res.status(405).json({ error: 'method_not_allowed' });
};
