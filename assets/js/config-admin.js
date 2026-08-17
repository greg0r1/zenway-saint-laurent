/* ============================================================
   CONFIG ADMIN — identifiant client Google (non secret, public par nature)
   1. Dans Google Cloud Console → APIs & Services → Identifiants,
      crée un « ID client OAuth » de type « Application Web ».
   2. Ajoute l'URL du site (ex: https://www.zenwaysaintlaurentduvar.fr et
      les URLs de preview Vercel utilisées) en « Origines JavaScript autorisées ».
   3. Colle l'ID client ci-dessous.
   ============================================================ */
const CONFIG_ADMIN = {
  googleClientId: '903399244650-81vijq3djfk70pon6vgs3ln0t2cqtkpu.apps.googleusercontent.com'
};
