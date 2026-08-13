/* ============================================================
   GET /api/auth/me — session admin active ?
   ============================================================ */
const { getSessionEmail } = require('../_lib/session');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const email = getSessionEmail(req);
  if (!email) {
    res.status(401).json({ authenticated: false });
    return;
  }

  res.status(200).json({ authenticated: true, email });
};
