/* ============================================================
   POST /api/events/image — admin uniquement
   Reçoit une image déjà redimensionnée et compressée côté client
   (assets/js/admin-events.js), l'envoie sur Vercel Blob et renvoie
   son URL publique. Le formulaire événement l'enregistre ensuite
   dans image_url via api/events/index.js ou api/events/[id].js —
   cette route ne touche jamais la base.
   ============================================================ */
const { put } = require('@vercel/blob');
const { getSessionEmail } = require('../_lib/session');
const { IMAGE_MAX_BYTES, IMAGE_MIME_TYPES } = require('../_lib/events');

module.exports = async (req, res) => {
  const email = getSessionEmail(req);
  if (!email) {
    res.status(401).json({ error: 'unauthenticated' });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const { image } = req.body || {};
  const correspondance = typeof image === 'string' && image.match(/^data:([\w/+.-]+);base64,(.+)$/);
  if (!correspondance || !IMAGE_MIME_TYPES.includes(correspondance[1])) {
    res.status(400).json({ error: 'invalid_image' });
    return;
  }

  const [, type, base64] = correspondance;
  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length > IMAGE_MAX_BYTES) {
    res.status(400).json({ error: 'image_too_large' });
    return;
  }

  const extension = type.split('/')[1];
  let blob;
  try {
    blob = await put(`evenements/${Date.now()}.${extension}`, buffer, {
      access: 'public',
      contentType: type,
      addRandomSuffix: true
    });
  } catch {
    res.status(500).json({ error: 'upload_failed' });
    return;
  }

  res.status(200).json({ url: blob.url });
};
