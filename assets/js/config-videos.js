/* ============================================================
   CONFIG VIDÉOS — à adapter au fil des publications YouTube
   1. FEATURED_VIDEO : une vidéo de présentation, à part de la chaîne
      YouTube (ex: un Reel Facebook) — ce n'est pas une séance filmée,
      donc elle ne se mêle pas à la galerie. Elle a son propre bloc,
      au-dessus, et ouvre sa source dans un nouvel onglet plutôt que de
      s'intégrer sur place. Laisser href vide ("") pour la masquer.
   2. YT_CHANNEL_HANDLE / YT_API_KEY : la galerie récupère automatiquement
      les derniers uploads de la chaîne via l'API YouTube Data v3. La clé
      API est restreinte par domaine référent dans Google Cloud Console
      (Identifiants → clé → Restrictions relatives aux applications) —
      c'est cette restriction qui la protège, pas le fait qu'elle soit en
      dur ici (un site statique sans backend ne peut pas la cacher du
      code source servi au navigateur).
   3. YT_VIDEOS_COUNT : nombre de vidéos affichées dans la galerie.
   ============================================================ */
const FEATURED_VIDEO = {
  href: 'https://www.facebook.com/reel/380948047631379',
  poster: 'assets/img/video/hero-poster.jpg',
  title: 'La séance en vidéo : présentation Zenway'
};
const YT_CHANNEL_HANDLE = 'beatricemeunier-r2m';
const YT_CHANNEL_URL = `https://www.youtube.com/@${YT_CHANNEL_HANDLE}`;
const YT_API_KEY = 'AIzaSyCzLih88Jl6hWSqLKzX5UEdx_8RF4_Qdgc';
const YT_VIDEOS_COUNT = 3;

(function videos() {
  function echapper(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const MOIS = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre'
  ];

  function dateLongue(iso) {
    if (!iso) return null;
    const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
  }

  const lienChaine = document.getElementById('ytChannelLink');
  if (lienChaine) lienChaine.href = YT_CHANNEL_URL;

  const grille = document.getElementById('videosGrid');
  const vedette = document.getElementById('videoVedette');

  function messageVideos(texte) {
    if (grille) grille.innerHTML = `<p class="r-videos-vide">${texte}</p>`;
  }

  // Vidéo de présentation : un bloc à part, avant la grille. Elle ne
  // vient pas de la chaîne et ne s'intègre pas sur place (Facebook ne
  // s'embarque pas comme une iframe YouTube) — l'étiquette et le lien
  // sortant le disent, pour ne pas laisser croire à une séance filmée
  // parmi les autres.
  function rendreVedette() {
    if (!vedette) return;
    if (!FEATURED_VIDEO.href) {
      vedette.innerHTML = '';
      return;
    }
    const v = FEATURED_VIDEO;
    vedette.innerHTML = `
      <a class="r-vedette-thumb" href="${echapper(v.href)}" target="_blank" rel="noopener"
        style="background-image:url(${echapper(v.poster)})"
        aria-label="Voir « ${echapper(v.title)} » sur Facebook, dans un nouvel onglet">
        <span class="r-vedette-tag"><svg aria-hidden="true" viewBox="0 0 24 24"><use href="#i-facebook"/></svg>Vidéo de présentation</span>
        <span class="r-vplay" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-lecture"/></svg></span>
        <h3 class="r-vedette-titre">${echapper(v.title)}</h3>
      </a>`;
  }
  rendreVedette();

  // mqdefault plutôt que hqdefault : hqdefault est un 4:3 dans lequel
  // YouTube incruste des bandes noires pour une vidéo 16:9. Elles font
  // partie de l'image, aucun cadrage CSS ne les enlève. mqdefault est
  // nativement en 16:9, existe toujours, et remplit la carte proprement.
  // La miniature ne devient une iframe qu'au clic : rien de tiers n'est
  // chargé tant que le visiteur ne demande pas la lecture.
  function rendreVideos(liste) {
    if (!grille) return;
    if (!liste.length) {
      messageVideos('Les premières vidéos seront mises en ligne prochainement. Revenez bientôt.');
      return;
    }

    grille.innerHTML = liste
      .map(
        (v) => `
      <article class="r-vcard">
        <button type="button" class="r-vthumb" data-id="${echapper(v.id)}"
          style="background-image:url(https://img.youtube.com/vi/${echapper(v.id)}/mqdefault.jpg)"
          aria-label="Lire la vidéo « ${echapper(v.title)} »">
          <span class="r-vplay" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-lecture"/></svg></span>
        </button>
        <div class="r-vmeta">
          <h3>${echapper(v.title)}</h3>
          <p><svg aria-hidden="true" viewBox="0 0 24 24"><use href="#i-calendrier"/></svg>${echapper(v.date)}</p>
        </div>
      </article>`
      )
      .join('');

    grille.querySelectorAll('.r-vthumb').forEach((thumb) => {
      thumb.addEventListener(
        'click',
        () => {
          const id = thumb.dataset.id;
          thumb.outerHTML = `<div class="r-vthumb"><iframe src="https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="Vidéo Zenway" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe></div>`;
        },
        { once: true }
      );
    });
  }

  async function dernieresVideos() {
    const chaine = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${YT_CHANNEL_HANDLE}&key=${YT_API_KEY}`
    ).then((r) => r.json());
    const playlist = chaine.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!playlist) return [];

    const items = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist}&maxResults=${YT_VIDEOS_COUNT}&key=${YT_API_KEY}`
    ).then((r) => r.json());

    return (items.items || []).map((item) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      date: dateLongue(item.snippet.publishedAt) || ''
    }));
  }

  if (grille && (!YT_API_KEY || !YT_CHANNEL_HANDLE)) {
    rendreVideos([]);
  } else if (grille) {
    dernieresVideos()
      .then(rendreVideos)
      .catch(() => rendreVideos([]));
  }
})();
