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
      .select('address, map_url, parking, phone, email, venue_name, venue_url')
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
    const {
      address,
      map_url,
      parking,
      phone,
      email: contactEmail,
      venue_name,
      venue_url
    } = req.body || {};
    const payload = {
      address,
      map_url,
      parking,
      phone,
      email: contactEmail,
      venue_name,
      venue_url
    };

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
    // chercher côté serveur avant de modifier. venue_name et venue_url
    // sont aussi lus ici : un champ absent du corps de la requête vaut
    // « inchangé » (voir plus bas), il faut donc la valeur déjà en base
    // pour juger si le résultat final reste cohérent.
    const { data: existante, error: erreurLecture } = await supabase
      .from('infos_pratiques')
      .select('id, venue_name, venue_url')
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

    // venue_name et venue_url sont facultatifs, mais toujours ensemble :
    // l'un sans l'autre laisserait un nom affiché sans lien, ou un lien
    // enregistré que le site public n'utilise jamais (voir
    // assets/js/infos-pratiques.js, qui ne bascule que si les deux sont
    // renseignés). On juge le résultat final, pas seulement ce que ce
    // PUT envoie, puisqu'un champ absent du corps vaut « inchangé ».
    const venueNomFinal = typeof venue_name === 'string' ? venue_name.trim() : existante.venue_name;
    const venueUrlFinal = typeof venue_url === 'string' ? venue_url.trim() : existante.venue_url;
    if (Boolean(venueNomFinal) !== Boolean(venueUrlFinal)) {
      res.status(400).json({
        error: 'venue_incomplete',
        field: venueNomFinal ? 'venue_url' : 'venue_name'
      });
      return;
    }

    // Après validation, un champ obligatoire encore présent est
    // forcément une chaîne non vide ; null ou absent vaut « inchangé ».
    // venue_name et venue_url sont facultatifs : une chaîne vide est ici
    // une valeur valide (elle efface le lieu partenaire affiché).
    const updates = { updated_at: new Date().toISOString() };
    if (typeof address === 'string') updates.address = address.trim();
    if (typeof map_url === 'string') updates.map_url = map_url.trim();
    if (typeof parking === 'string') updates.parking = parking.trim();
    if (typeof phone === 'string') updates.phone = phone.trim();
    if (typeof contactEmail === 'string') updates.email = contactEmail.trim();
    if (typeof venue_name === 'string') updates.venue_name = venue_name.trim();
    if (typeof venue_url === 'string') updates.venue_url = venue_url.trim();

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
