/* ============================================================
   POST /api/auth/google — vérifie le token Google, whitelist, pose le cookie
   ============================================================ */
const { verifyGoogleToken } = require('../_lib/google');
const { createSessionCookie, emailsAutorises } = require('../_lib/session');
const { logAudit, logErreur, logRefus } = require('../_lib/log');

// Un ID token Google est un JWT : trois segments séparés par des points,
// et jamais bien long. Ce filtre ne remplace pas la vérification
// cryptographique qui suit — il écarte seulement, avant elle, ce qui n'a
// aucune chance d'en être un. La route est publique : sans lui,
// n'importe qui fait écrire une ligne de journal avec un corps
// arbitraire.
const CREDENTIAL_MAX_LENGTH = 4096;

function credentialMalforme(valeur) {
  if (typeof valeur !== 'string') return true;
  if (valeur.length > CREDENTIAL_MAX_LENGTH) return true;
  return valeur.split('.').length !== 3;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const credential = req.body && req.body.credential;
  if (!credential) {
    res.status(400).json({ error: 'missing_credential' });
    return;
  }

  if (credentialMalforme(credential)) {
    // Rien de la valeur reçue n'est repris : c'est précisément ce qu'on
    // ne veut pas voir arriver dans le journal. Même code d'erreur que
    // le credential absent, pour ne pas ajouter un cas au front.
    logRefus('malformed_credential', {});
    res.status(400).json({ error: 'missing_credential' });
    return;
  }

  let payload;
  try {
    payload = await verifyGoogleToken(credential);
  } catch (erreur) {
    /* Seulement le type de l'exception, jamais son message : c'est le
       message de google-auth-library qui est dangereux, pas le fait de
       journaliser. Il recopie le jeton entier (« Wrong number of
       segments in token: … ») ou la charge utile décodée (« Token used
       too late … » suivi du JSON : e-mail, nom, photo). Le journal
       deviendrait un dépôt d'identifiants et de données personnelles. */
    logRefus('invalid_token', { type: erreur && erreur.name });
    res.status(401).json({ error: 'invalid_token' });
    return;
  }

  if (!payload || !payload.email || !payload.email_verified) {
    logRefus('unverified_email', { email: payload && payload.email });
    res.status(401).json({ error: 'unverified_email' });
    return;
  }

  // Même source de vérité que le garde des routes admin (exigerAdmin),
  // pour que la connexion et chaque requête suivante lisent la whitelist
  // exactement de la même façon.
  if (!emailsAutorises().includes(payload.email.toLowerCase())) {
    // Un compte Google valide mais hors whitelist : c'est le signal
    // qu'on veut voir remonter, pas une simple erreur de saisie.
    logRefus('not_authorized', { email: payload.email });
    res.status(403).json({ error: 'not_authorized' });
    return;
  }

  // createSessionCookie signe, donc lit SESSION_SECRET, qui peut manquer
  // ou être trop court sur un environnement. Sans ce filet, l'exception
  // remonte en FUNCTION_INVOCATION_FAILED : une 500 au corps HTML, hors
  // du contrat { error } du projet, et sans trace dans le journal.
  let cookie;
  try {
    cookie = createSessionCookie(payload.email);
  } catch (erreur) {
    logErreur('session.secret', erreur, payload.email);
    res.status(500).json({ error: 'server_error' });
    return;
  }

  res.setHeader('Set-Cookie', cookie);
  logAudit('auth.login', payload.email);
  res.status(200).json({ email: payload.email });
};
