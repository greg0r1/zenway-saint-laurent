/* ============================================================
   POST /api/auth/logout — efface le cookie de session admin
   ============================================================ */
const { clearSessionCookie, getSessionEmail } = require('../_lib/session');
const { logAudit, logErreur } = require('../_lib/log');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  /* getSessionEmail vérifie la signature, donc lit SESSION_SECRET : mal
     réglé, il fait remonter une exception et la déconnexion devient
     impossible. On note la panne et on continue — la déconnexion doit
     aboutir quoi qu'il arrive, on perd seulement la ligne d'audit.
     clearSessionCookie, elle, ne signe rien : elle reste sûre. */
  let email = null;
  try {
    email = getSessionEmail(req);
  } catch (erreur) {
    logErreur('session.secret', erreur);
  }

  res.setHeader('Set-Cookie', clearSessionCookie());
  if (email) logAudit('auth.logout', email);
  res.status(200).json({ ok: true });
};
