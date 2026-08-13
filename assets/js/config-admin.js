/* ============================================================
   CONFIG ADMIN — identifiant client Google (non secret, public par nature)
   1. Dans Google Cloud Console → APIs & Services → Identifiants,
      crée un « ID client OAuth » de type « Application Web ».
   2. Ajoute l'URL du site (ex: https://www.zenwaysaintlaurentduvar.fr et
      les URLs de preview Vercel utilisées) en « Origines JavaScript autorisées ».
   3. Colle l'ID client ci-dessous.
   ============================================================ */
const CONFIG_ADMIN = {
  googleClientId: "REMPLACER_PAR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
};
