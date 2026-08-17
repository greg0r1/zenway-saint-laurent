/* ============================================================
   SESSION — cookie admin signé (HMAC), sans dépendance JWT dédiée
   ============================================================ */
const crypto = require('crypto');
const { logRefus } = require('./log');

const COOKIE_NAME = 'zw_admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8h

// Plancher d'entropie du secret de signature. Sans ce contrôle, un
// SESSION_SECRET vide ou trop court passerait sans bruit : createHmac
// l'accepte, et la signature devient devinable. Le format du payload
// (`email|expiration`) étant connu, un secret faible suffirait à forger
// une session admin complète sans jamais passer par Google.
const SECRET_MIN_LENGTH = 32;

function secretSession() {
  const secret = process.env.SESSION_SECRET;
  if (typeof secret !== 'string' || secret.length < SECRET_MIN_LENGTH) {
    throw new Error(
      `SESSION_SECRET absent ou trop court (${SECRET_MIN_LENGTH} caractères minimum). ` +
      'Générez-en un avec : openssl rand -base64 48'
    );
  }
  return secret;
}

function sign(payload) {
  return crypto.createHmac('sha256', secretSession()).update(payload).digest('base64url');
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

function emailsAutorises() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/* Garde d'entrée des routes admin. Renvoie l'e-mail, ou null après
   avoir répondu 401 — l'appelant n'a plus qu'à sortir.

   La whitelist est relue à chaque requête, et pas seulement à la
   connexion : sans cela, un cookie signé reste valable 8 h, et retirer
   un e-mail de ADMIN_EMAILS (départ, compte Google compromis) ne
   coupait l'accès qu'à l'expiration. Le coût est nul, la variable
   d'environnement est déjà en mémoire. */
function exigerAdmin(req, res) {
  const email = getSessionEmail(req);
  if (!email) {
    res.status(401).json({ error: 'unauthenticated' });
    return null;
  }
  if (!emailsAutorises().includes(email.toLowerCase())) {
    // Cookie valide mais e-mail retiré de la whitelist entre-temps :
    // c'est une révocation qui s'applique, pas une panne.
    logRefus('revoked_admin', { email });
    res.setHeader('Set-Cookie', clearSessionCookie());
    res.status(401).json({ error: 'unauthenticated' });
    return null;
  }
  return email;
}

module.exports = {
  createSessionCookie,
  clearSessionCookie,
  getSessionEmail,
  exigerAdmin,
  emailsAutorises,
  COOKIE_NAME
};
