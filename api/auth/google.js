/* ============================================================
   POST /api/auth/google — vérifie le token Google, whitelist, pose le cookie
   ============================================================ */
const { verifyGoogleToken } = require('../_lib/google');
const { createSessionCookie } = require('../_lib/session');

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
  } catch {
    res.status(401).json({ error: 'invalid_token' });
    return;
  }

  if (!payload || !payload.email || !payload.email_verified) {
    res.status(401).json({ error: 'unverified_email' });
    return;
  }

  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.includes(payload.email.toLowerCase())) {
    res.status(403).json({ error: 'not_authorized' });
    return;
  }

  res.setHeader('Set-Cookie', createSessionCookie(payload.email));
  res.status(200).json({ email: payload.email });
};
