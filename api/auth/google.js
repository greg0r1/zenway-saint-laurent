/* ============================================================
   POST /api/auth/google — vérifie le token Google, whitelist, pose le cookie
   ============================================================ */
const { verifyGoogleToken } = require('../_lib/google');
const { createSessionCookie, emailsAutorises } = require('../_lib/session');
const { logAudit, logRefus } = require('../_lib/log');

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

  let payload;
  try {
    payload = await verifyGoogleToken(credential);
  } catch (erreur) {
    logRefus('invalid_token', { message: erreur && erreur.message });
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

  res.setHeader('Set-Cookie', createSessionCookie(payload.email));
  logAudit('auth.login', payload.email);
  res.status(200).json({ email: payload.email });
};
