/* ============================================================
   GET /api/auth/me — session admin active ?
   ============================================================ */
const { exigerAdmin } = require('../_lib/session');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  // Même garde que les routes de données : sans cela, l'admin
  // continuerait d'afficher sa console à un e-mail révoqué, qui se
  // heurterait ensuite à un 401 sur chaque action.
  const email = exigerAdmin(req, res);
  if (!email) return;

  res.status(200).json({ authenticated: true, email });
};
