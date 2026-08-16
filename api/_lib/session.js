/* ============================================================
   SESSION — cookie admin signé (HMAC), sans dépendance JWT dédiée
   ============================================================ */
const crypto = require('crypto');

const COOKIE_NAME = 'zw_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8h

function sign(payload) {
  const secret = process.env.SESSION_SECRET;
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function createSessionCookie(email) {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${email}|${expires}`;
  const encodedPayload = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = sign(payload);
  const secure = process.env.VERCEL_ENV === 'development' ? '' : ' Secure;';
  return `${COOKIE_NAME}=${encodedPayload}.${signature}; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=${MAX_AGE_SECONDS}`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    out[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  });
  return out;
}

function getSessionEmail(req) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;
  const encodedPayload = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  let payload;
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return null;
  }

  const expected = sign(payload);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  const sep = payload.lastIndexOf('|');
  if (sep === -1) return null;
  const email = payload.slice(0, sep);
  const expires = Number(payload.slice(sep + 1));
  if (!email || !expires || Date.now() > expires) return null;

  return email;
}

module.exports = { createSessionCookie, clearSessionCookie, getSessionEmail, COOKIE_NAME };
