/* ============================================================
   CONFIG VIDÉOS — à adapter au fil des publications YouTube / Facebook
   1. HERO_VIDEO_FB_URL : URL complète d'une vidéo ou d'un Reel Facebook
      (ex: une publication de la page Zenway) affichée dans la section
      « Zenway en mouvement ». Laisser vide ("") pour masquer la carte.
   2. HERO_VIDEO_POSTER : miniature affichée sur la carte vidéo. Chemin
      d'une image locale — une image externe serait bloquée par la
      politique de sécurité (voir img-src dans vercel.json).
   3. YT_CHANNEL_HANDLE : la chaîne YouTube liée depuis « Voir toute la
      chaîne ».
   ============================================================ */
const HERO_VIDEO_FB_URL = "https://www.facebook.com/reel/380948047631379";
const HERO_VIDEO_POSTER = "assets/img/video/hero-poster.jpg";
const YT_CHANNEL_HANDLE = "beatricemeunier-r2m";
const YT_CHANNEL_URL    = `https://www.youtube.com/@${YT_CHANNEL_HANDLE}`;

(function setupVideosSection(){
  const card = document.getElementById('mainVideoCard');
  if (card){
    if (HERO_VIDEO_FB_URL){
      card.href = HERO_VIDEO_FB_URL;
      const img = card.querySelector('img');
      if (img && HERO_VIDEO_POSTER) img.src = HERO_VIDEO_POSTER;
    } else {
      card.style.display = 'none';
    }
  }

  const ytLink = document.getElementById('ytChannelLink');
  if (ytLink) ytLink.href = YT_CHANNEL_URL;
})();
