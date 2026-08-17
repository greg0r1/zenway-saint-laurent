/* ============================================================
   POST /api/auth/logout — efface le cookie de session admin
   ============================================================ */
const { clearSessionCookie, getSessionEmail } = require('../_lib/session');
const { logAudit } = require('../_lib/log');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const email = getSessionEmail(req);
  res.setHeader('Set-Cookie', clearSessionCookie());
  if (email) logAudit('auth.logout', email);
  res.status(200).json({ ok: true });
};
