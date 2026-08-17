/* ============================================================
   CONFIG VIDÉOS — à adapter au fil des publications YouTube / Facebook
   1. HERO_VIDEO_FB_URL : URL complète d'une vidéo ou d'un Reel Facebook
      (ex: une publication de la page Zenway) affichée dans la section
      « Zenway en mouvement ». Laisser vide ("") pour masquer la carte.
   2. HERO_VIDEO_POSTER : miniature affichée sur la carte vidéo. Chemin
      d'une image locale — une image externe serait bloquée par la
      politique de sécurité (voir img-src dans vercel.json).
   3. YT_CHANNEL_HANDLE / YT_API_KEY : la galerie récupère automatiquement
      les derniers uploads de la chaîne via l'API YouTube Data v3. La clé
      API est restreinte par domaine référent dans Google Cloud Console
      (Identifiants → clé → Restrictions relatives aux applications) —
      c'est cette restriction qui la protège, pas le fait qu'elle soit en
      dur ici (un site statique sans backend ne peut pas la cacher du
      code source servi au navigateur).
   4. YT_VIDEOS_COUNT : nombre de vidéos affichées dans la galerie.
   ============================================================ */
const HERO_VIDEO_FB_URL = 'https://www.facebook.com/reel/380948047631379';
const HERO_VIDEO_POSTER = 'assets/img/video/hero-poster.jpg';
const YT_CHANNEL_HANDLE = 'beatricemeunier-r2m';
const YT_CHANNEL_URL = `https://www.youtube.com/@${YT_CHANNEL_HANDLE}`;
const YT_API_KEY = 'AIzaSyCzLih88Jl6hWSqLKzX5UEdx_8RF4_Qdgc';
const YT_VIDEOS_COUNT = 6;

function youtubeEmbed(id) {
  return `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="Vidéo Zenway" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>`;
}

(function setupMainVideoCard() {
  const card = document.getElementById('mainVideoCard');
  if (!card) return;
  if (HERO_VIDEO_FB_URL) {
    card.href = HERO_VIDEO_FB_URL;
    const img = card.querySelector('img');
    if (img && HERO_VIDEO_POSTER) img.src = HERO_VIDEO_POSTER;
  } else {
    card.style.display = 'none';
  }
})();

function renderVideosGrid(grid, videos) {
  if (!videos.length) {
    grid.innerHTML =
      '<p class="videos-empty">Les premières vidéos seront mises en ligne prochainement. Revenez bientôt.</p>';
    return;
  }

  grid.innerHTML = videos
    .map(
      (v) => `
    <article class="vgrid-card">
      <div class="vthumb" style="background-image:url(https://img.youtube.com/vi/${v.id}/hqdefault.jpg)" data-id="${v.id}">
        <button class="vplay" aria-label="Lire la vidéo"></button>
      </div>
      <div class="vgrid-meta"><h3>${v.title}</h3><p>${v.desc}</p></div>
    </article>
  `
    )
    .join('');

  grid.querySelectorAll('.vthumb').forEach((thumb) => {
    thumb.addEventListener(
      'click',
      () => {
        thumb.innerHTML = youtubeEmbed(thumb.dataset.id);
      },
      { once: true }
    );
  });
}

async function fetchLatestYoutubeVideos() {
  const channelRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${YT_CHANNEL_HANDLE}&key=${YT_API_KEY}`
  );
  const channelData = await channelRes.json();
  const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) return [];

  const itemsRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${YT_VIDEOS_COUNT}&key=${YT_API_KEY}`
  );
  const itemsData = await itemsRes.json();

  return (itemsData.items || []).map((item) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    desc: item.snippet.description?.split('\n')[0] || ''
  }));
}

(function setupVideosGallery() {
  const grid = document.getElementById('videosGrid');
  const ytLink = document.getElementById('ytChannelLink');
  if (ytLink) ytLink.href = YT_CHANNEL_URL;
  if (!grid) return;

  if (!YT_API_KEY) {
    renderVideosGrid(grid, []);
    return;
  }

  fetchLatestYoutubeVideos()
    .then((videos) => renderVideosGrid(grid, videos))
    .catch(() => renderVideosGrid(grid, []));
})();
