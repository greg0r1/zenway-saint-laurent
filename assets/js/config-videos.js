/* ============================================================
   CONFIG VIDÉOS — à adapter au fil des publications YouTube
   1. Récupère l'identifiant dans l'URL de la vidéo YouTube :
      https://www.youtube.com/watch?v=XXXXXXXXXXX  → l'id est XXXXXXXXXXX
      https://youtu.be/XXXXXXXXXXX                  → l'id est XXXXXXXXXXX
   2. HERO_VIDEO_ID : la vidéo de teasing affichée en haut de page (hero).
      Laisser vide ("") tant qu'aucun teaser n'est prêt.
   3. VIDEOS : la galerie de la section "Vidéos". Ajoute une ligne par
      vidéo. Tant que le tableau est vide, un message d'attente s'affiche.
   4. YT_CHANNEL_URL : à corriger une fois la chaîne YouTube de
      l'association créée (compte de marque dédié).
   ============================================================ */
const HERO_VIDEO_ID  = ""; // ex: "dQw4w9WgXcQ"
const YT_CHANNEL_URL = "#"; // ex: "https://www.youtube.com/@ZenwaySaintLaurentDuVar"

const VIDEOS = [
  // { id: "dQw4w9WgXcQ", title: "Présentation Zenway", desc: "Le concept en images." },
];

function youtubeEmbed(id){
  return `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="Vidéo Zenway" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>`;
}

(function setupHeroVideo(){
  const wrap = document.getElementById('heroVideo');
  if (!wrap || !HERO_VIDEO_ID) return;
  const thumb = wrap.querySelector('.vthumb');
  thumb.style.backgroundImage = `url(https://img.youtube.com/vi/${HERO_VIDEO_ID}/hqdefault.jpg)`;
  thumb.innerHTML = '<button class="vplay" aria-label="Lire le teaser"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>';
  thumb.addEventListener('click', () => { thumb.innerHTML = youtubeEmbed(HERO_VIDEO_ID); }, { once: true });
})();

(function setupVideosGallery(){
  const grid = document.getElementById('videosGrid');
  const ytLink = document.getElementById('ytChannelLink');
  if (ytLink) ytLink.href = YT_CHANNEL_URL;
  if (!grid) return;

  if (!VIDEOS.length){
    grid.innerHTML = '<p class="videos-empty">Les premières vidéos seront mises en ligne après les portes ouvertes du 27 juin. Revenez bientôt.</p>';
    return;
  }

  grid.innerHTML = VIDEOS.map(v => `
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
})();
