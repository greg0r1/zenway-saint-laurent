/* ============================================================
   CONFIG VIDÉOS — à adapter au fil des publications YouTube / Facebook
   1. HERO_VIDEO_ID : la vidéo de teasing YouTube affichée en haut de page
      (hero). Laisser vide ("") tant qu'aucun teaser YouTube n'est prêt.
      HERO_VIDEO_FB_URL : alternative à HERO_VIDEO_ID — colle ici l'URL
      complète d'une vidéo ou d'un Reel Facebook (ex: une publication de
      la page Zenway). Si rempli, il prend le pas sur HERO_VIDEO_ID.
   2. YT_CHANNEL_HANDLE / YT_API_KEY : la galerie "Vidéos" récupère
      automatiquement les derniers uploads de la chaîne via l'API YouTube
      Data v3. La clé API est restreinte par domaine référent dans Google
      Cloud Console (Identifiants → clé → Restrictions relatives aux
      applications) — c'est cette restriction qui la protège, pas le fait
      qu'elle soit en dur ici (un site statique sans backend ne peut pas
      la cacher du code source servi au navigateur).
   3. YT_VIDEOS_COUNT : nombre de vidéos affichées dans la galerie.
   ============================================================ */
const HERO_VIDEO_ID    = ""; // ex: "dQw4w9WgXcQ"
const HERO_VIDEO_FB_URL = "https://www.facebook.com/reel/380948047631379";
const YT_CHANNEL_HANDLE = "beatricemeunier-r2m";
const YT_CHANNEL_URL    = `https://www.youtube.com/@${YT_CHANNEL_HANDLE}`;
const YT_API_KEY        = "AIzaSyCzLih88Jl6hWSqLKzX5UEdx_8RF4_Qdgc";
const YT_VIDEOS_COUNT   = 6;

function youtubeEmbed(id){
  return `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="Vidéo Zenway" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>`;
}

function facebookEmbed(url){
  const src = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&mute=1`;
  return `<iframe src="${src}" title="Vidéo Zenway" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>`;
}

(function setupHeroVideo(){
  const wrap = document.getElementById('heroVideo');
  if (!wrap || !(HERO_VIDEO_ID || HERO_VIDEO_FB_URL)) return;
  const thumb = wrap.querySelector('.vthumb');

  if (HERO_VIDEO_FB_URL){
    thumb.classList.add('vthumb-fb');
    thumb.innerHTML = facebookEmbed(HERO_VIDEO_FB_URL);
    return;
  }

  thumb.style.backgroundImage = `url(https://img.youtube.com/vi/${HERO_VIDEO_ID}/hqdefault.jpg)`;
  thumb.innerHTML = '<button class="vplay" aria-label="Lire le teaser"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>';
  thumb.addEventListener('click', () => { thumb.innerHTML = youtubeEmbed(HERO_VIDEO_ID); }, { once: true });
})();

function renderVideosGrid(grid, videos){
  if (!videos.length){
    grid.innerHTML = '<p class="videos-empty">Les premières vidéos seront mises en ligne prochainement. Revenez bientôt.</p>';
    return;
  }

  grid.innerHTML = videos.map(v => `
    <article class="vcard">
      <div class="vthumb" style="background-image:url(https://img.youtube.com/vi/${v.id}/hqdefault.jpg)" data-id="${v.id}">
        <button class="vplay" aria-label="Lire la vidéo"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
      </div>
      <div class="vmeta"><h3>${v.title}</h3><p>${v.desc}</p></div>
    </article>
  `).join('');

  grid.querySelectorAll('.vthumb').forEach(thumb => {
    thumb.addEventListener('click', () => { thumb.innerHTML = youtubeEmbed(thumb.dataset.id); }, { once: true });
  });
}

async function fetchLatestYoutubeVideos(){
  const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${YT_CHANNEL_HANDLE}&key=${YT_API_KEY}`);
  const channelData = await channelRes.json();
  const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) return [];

  const itemsRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${YT_VIDEOS_COUNT}&key=${YT_API_KEY}`);
  const itemsData = await itemsRes.json();

  return (itemsData.items || []).map(item => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    desc: item.snippet.description?.split('\n')[0] || ''
  }));
}

(function setupVideosGallery(){
  const grid = document.getElementById('videosGrid');
  const ytLink = document.getElementById('ytChannelLink');
  if (ytLink) ytLink.href = YT_CHANNEL_URL;
  if (!grid) return;

  if (!YT_API_KEY){
    renderVideosGrid(grid, []);
    return;
  }

  fetchLatestYoutubeVideos()
    .then(videos => renderVideosGrid(grid, videos))
    .catch(() => renderVideosGrid(grid, []));
})();
