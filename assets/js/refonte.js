/* ============================================================
   REFONTE — comportements de la page /refonte/ uniquement.
   Barre de navigation, menu mobile, révélation au défilement,
   puis les quatre contenus vivants : planning, événements,
   infos pratiques et vidéos. Chaque appel réseau échoue en
   silence : le contenu statique déjà présent dans la page reste
   affiché tel quel. Aucun fichier du site actuel n'est modifié.
   ============================================================ */
/* global YT_CHANNEL_HANDLE, YT_API_KEY */
(function refonte() {
  document.documentElement.classList.add('js');

  // Échappe aussi guillemets et apostrophe : ces valeurs finissent
  // parfois en position d'attribut, où un guillemet refermerait
  // l'attribut et permettrait d'en injecter un autre.
  function echapper(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------- Barre de navigation ---------- */
  const nav = document.getElementById('nav');
  const liens = document.getElementById('navLinks');
  const burger = document.getElementById('burger');

  if (nav) {
    const majEtat = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    majEtat();
    window.addEventListener('scroll', majEtat, { passive: true });
  }

  if (burger && liens) {
    const fermer = () => {
      liens.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
    };
    burger.addEventListener('click', () => {
      const ouvert = liens.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(ouvert));
      burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    liens.addEventListener('click', (e) => {
      if (e.target.closest('a')) fermer();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && liens.classList.contains('is-open')) {
        fermer();
        burger.focus();
      }
    });
  }

  /* ---------- Révélation au défilement ----------
     Un seul mouvement pour toute la page. Sans IntersectionObserver
     ou en mouvement réduit, tout reste simplement visible. */
  const aReveler = document.querySelectorAll('.r-reveal');
  if (
    aReveler.length &&
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    const obs = new IntersectionObserver(
      (entrees) => {
        entrees.forEach((entree, i) => {
          if (!entree.isIntersecting) return;
          entree.target.style.transitionDelay = `${Math.min(i, 4) * 90}ms`;
          entree.target.classList.add('is-in');
          obs.unobserve(entree.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    aReveler.forEach((el) => obs.observe(el));
  } else {
    aReveler.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Planning : /api/planning/public ----------
     La grille statique de la page est le repli. Si l'API répond,
     elle est reconstruite : une colonne par jour de la semaine,
     une ligne par horaire distinct, dans l'ordre voulu par l'admin. */
  const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  function normaliser(txt) {
    return String(txt || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function rendrePlanning(slots) {
    const table = document.getElementById('planningGrille');
    if (!table || !slots.length) return;

    // La semaine ouvrable est toujours affichée en entier : une case vide
    // dit « pas de séance ce jour-là », c'est une information. Le week-end
    // ne s'ajoute que si l'admin y a posé un créneau.
    const weekEnd = JOURS.slice(5).filter((j) =>
      slots.some((s) => normaliser(s.day).startsWith(normaliser(j)))
    );
    const colonnes = JOURS.slice(0, 5).concat(weekEnd);

    const horaires = [];
    slots.forEach((s) => {
      const t = String(s.time || '').trim();
      if (t && !horaires.includes(t)) horaires.push(t);
    });
    if (!horaires.length) return;

    const entete = `<tr><td></td>${colonnes
      .map((j) => `<th scope="col">${echapper(j)}</th>`)
      .join('')}</tr>`;

    const lignes = horaires
      .map((heure) => {
        const cellules = colonnes
          .map((jour) => {
            const slot = slots.find(
              (s) =>
                String(s.time || '').trim() === heure &&
                normaliser(s.day).startsWith(normaliser(jour))
            );
            if (!slot) return '<td></td>';
            return `<td><span class="r-creneau">
              <strong>${echapper(slot.label || 'Zenway')}</strong>
              ${slot.place ? `<span>${echapper(slot.place)}</span>` : ''}
            </span></td>`;
          })
          .join('');
        return `<tr><th scope="row">${echapper(heure)}</th>${cellules}</tr>`;
      })
      .join('');

    table.querySelector('thead').innerHTML = entete;
    table.querySelector('tbody').innerHTML = lignes;

    const notes = slots
      .map((s) => s.note)
      .filter(Boolean)
      .join(' ');
    const zoneNote = document.querySelector('.r-planning-note');
    if (zoneNote && notes) zoneNote.textContent = notes;
  }

  fetch('/api/planning/public')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data) rendrePlanning(data.slots || []);
    })
    .catch(() => {
      /* API indisponible : la grille statique reste affichée */
    });

  /* ---------- Événements : /api/events/public ---------- */
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

  function ligneEvenement(ev) {
    const date = dateLongue(ev.starts_at);
    return `
      <article class="r-evt">
        <span class="r-evt-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-calendrier"/></svg></span>
        <div>
          <h3>${date ? `<span class="r-evt-date">${echapper(date)}</span> · ` : ''}${echapper(ev.title)}</h3>
          ${ev.description ? `<p>${echapper(ev.description)}</p>` : ''}
          ${ev.featured ? '<span class="r-evt-tag">À la une</span>' : ''}
        </div>
      </article>`;
  }

  fetch('/api/events/public')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const events = (data && data.events) || [];
      if (!events.length) return;
      const liste = document.getElementById('eventsGrid');
      const vide = document.getElementById('eventsEmpty');
      if (!liste) return;
      liste.innerHTML = events.map(ligneEvenement).join('');
      if (vide) vide.hidden = true;
    })
    .catch(() => {
      /* API indisponible : l'état vide reste affiché */
    });

  /* ---------- Infos pratiques : /api/infos ----------
     Mêmes règles que assets/js/infos-pratiques.js : une fiche
     incomplète n'écrase pas le repli, et une valeur ne devient
     un href que si c'est bien une https. */
  const OBLIGATOIRES = ['address', 'map_url', 'parking', 'phone', 'email'];

  function urlSure(valeur) {
    return typeof valeur === 'string' && /^https:\/\/\S+$/i.test(valeur.trim());
  }

  fetch('/api/infos')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const infos = data && data.infos;
      if (!infos) return;
      const complete = OBLIGATOIRES.every((c) => typeof infos[c] === 'string' && infos[c].trim());
      if (!complete) return;

      document.querySelectorAll('[data-info-link="address"]').forEach((a) => {
        if (urlSure(infos.map_url)) a.href = infos.map_url.trim();
        a.innerHTML = echapper(infos.address).replace(/\n/g, '<br>');
      });
      document.querySelectorAll('[data-info-link="phone"]').forEach((a) => {
        a.href = `tel:${infos.phone.replace(/[^\d+]/g, '')}`;
        a.textContent = infos.phone;
      });
      document.querySelectorAll('[data-info-link="email"]').forEach((a) => {
        a.href = `mailto:${infos.email}`;
        a.textContent = infos.email;
      });
      const parking = document.querySelector('[data-info="parking"]');
      if (parking) parking.textContent = infos.parking;

      const prochain = document.querySelector('[data-info="next_session"]');
      const ligne = document.querySelector('[data-info-row="next_session"]');
      if (prochain && ligne) {
        if (infos.next_session) {
          prochain.textContent = infos.next_session;
          ligne.hidden = false;
        } else {
          ligne.hidden = true;
        }
      }
    })
    .catch(() => {
      /* API indisponible : le repli statique reste affiché */
    });

  /* ---------- Vidéos : YouTube Data API ----------
     La chaîne et la clé viennent de assets/js/config-videos.js, chargé
     juste avant : une seule copie de la clé dans le dépôt, sinon une
     rotation en oublierait la moitié. Cette page nomme sa grille
     `refonteVideos` pour que le rendu de config-videos.js, qui vise
     `videosGrid`, n'écrive pas son ancien balisage ici.
     La miniature ne devient une iframe qu'au clic : rien de tiers
     n'est chargé tant que le visiteur ne demande pas la lecture. */
  const YT_HANDLE = typeof YT_CHANNEL_HANDLE === 'string' ? YT_CHANNEL_HANDLE : '';
  const YT_KEY = typeof YT_API_KEY === 'string' ? YT_API_KEY : '';
  const YT_COUNT = 3;
  const grilleVideos = document.getElementById('refonteVideos');

  function messageVideos(texte) {
    if (grilleVideos) grilleVideos.innerHTML = `<p class="r-videos-vide">${texte}</p>`;
  }

  function rendreVideos(videos) {
    if (!grilleVideos) return;
    if (!videos.length) {
      messageVideos('Les premières vidéos seront mises en ligne prochainement. Revenez bientôt.');
      return;
    }

    grilleVideos.innerHTML = videos
      .map(
        (v) => `
      <article class="r-vcard">
        <button type="button" class="r-vthumb" data-id="${echapper(v.id)}"
          style="background-image:url(https://img.youtube.com/vi/${echapper(v.id)}/hqdefault.jpg)"
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

    grilleVideos.querySelectorAll('.r-vthumb').forEach((thumb) => {
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
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${YT_HANDLE}&key=${YT_KEY}`
    ).then((r) => r.json());
    const playlist = chaine.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!playlist) return [];

    const items = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist}&maxResults=${YT_COUNT}&key=${YT_KEY}`
    ).then((r) => r.json());

    return (items.items || []).map((item) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      date: dateLongue(item.snippet.publishedAt) || ''
    }));
  }

  if (grilleVideos && (!YT_KEY || !YT_HANDLE)) {
    rendreVideos([]);
  } else if (grilleVideos) {
    dernieresVideos()
      .then(rendreVideos)
      .catch(() => rendreVideos([]));
  }
})();
