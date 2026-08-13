/* ============================================================
   POST /api/auth/logout — efface le cookie de session admin
   ============================================================ */
const { clearSessionCookie } = require('../_lib/session');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  res.setHeader('Set-Cookie', clearSessionCookie());
  res.status(200).json({ ok: true });
};
