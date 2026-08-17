/* ============================================================
   LOG — journal des accès admin et des erreurs serveur.
   Les fonctions serverless n'ont pas d'autre mémoire que la sortie
   standard : ce qui n'est pas écrit ici n'existe pas. Sans ces
   lignes, une suppression d'événement, une session forgée ou une
   panne Supabase ne laissent aucune trace consultable après coup.
   Sortie en JSON sur une seule ligne, pour rester lisible dans les
   Runtime Logs de Vercel et filtrable par `niveau` ou `action`.
   Rien de ce qui est écrit ici ne revient au client : les réponses
   d'erreur restent volontairement génériques (`server_error`).
   ============================================================ */

/* Trace une action qui modifie l'état du site : qui, quoi, sur quoi.
   À appeler après le succès de l'écriture, jamais avant. */
function logAudit(action, email, details = {}) {
  console.log(
    JSON.stringify({
      niveau: 'audit',
      action,
      email,
      ...details,
      at: new Date().toISOString()
    })
  );
}

/* Trace une erreur serveur. `erreur` est l'objet renvoyé par Supabase
   ou l'exception attrapée ; on n'en garde que le message et le code,
   jamais l'objet entier (il peut porter la requête et ses valeurs). */
function logErreur(contexte, erreur, email = null) {
  console.error(
    JSON.stringify({
      niveau: 'erreur',
      contexte,
      email,
      message: erreur && erreur.message ? erreur.message : String(erreur),
      code: erreur && erreur.code ? erreur.code : null,
      at: new Date().toISOString()
    })
  );
}

/* Trace une tentative d'accès refusée. Séparé de logErreur : ce n'est
   pas une panne mais un signal de sécurité, qu'on veut pouvoir
   compter à part (une rafale de `not_authorized` n'a pas la même
   signification qu'une rafale de 500). */
function logRefus(motif, details = {}) {
  console.warn(
    JSON.stringify({
      niveau: 'refus',
      motif,
      ...details,
      at: new Date().toISOString()
    })
  );
}

module.exports = { logAudit, logErreur, logRefus };
