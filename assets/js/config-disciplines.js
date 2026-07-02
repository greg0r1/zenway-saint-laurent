/* ============================================================
   CONFIG-DISCIPLINES — contenu détaillé des 4 pratiques
   (modale ouverte depuis une card ou un lien « en savoir plus »)
   ============================================================ */
const DISCIPLINES = {
  taichi: {
    title: 'Tai-chi chuan',
    img: 'assets/img/discipline-taichi-hero.jpg',
    imgWebp: 'assets/img/discipline-taichi-hero.webp',
    alt: 'Pratiquant de Tai-chi chuan seul dans un parc au lever du jour',
    origines: `Né en Chine, le tai-chi chuan puise ses racines dans les arts martiaux internes, façonnés au fil des
      siècles autour de la philosophie taoïste et du principe du yin et du yang. Contrairement aux arts martiaux
      fondés sur la force, il cultive la souplesse, l'enracinement et la circulation de l'énergie interne, le qi.
      Plusieurs grandes familles historiques (Chen, Yang, Wu...) ont développé leur propre style, mais toutes
      partagent la même recherche : des mouvements lents, continus, enchaînés comme un seul souffle.`,
    originesImg: 'assets/img/discipline-taichi-origines.jpg',
    originesImgWebp: 'assets/img/discipline-taichi-origines.webp',
    originesAlt: 'Pratiquant en étirement matinal en extérieur',
    aujourdhui: `Longtemps pratiqué en Chine dans les parcs dès l'aube, le tai-chi chuan s'est largement diffusé à
      travers le monde au cours du XXe siècle. Il est aujourd'hui enseigné sur tous les continents, souvent
      recommandé par des professionnels de santé pour accompagner le vieillissement en douceur, et pratiqué aussi
      bien par des débutants que par des sportifs en quête d'un travail plus interne.`,
    aujourdhuiImg: 'assets/img/discipline-taichi-aujourdhui.jpg',
    aujourdhuiImgWebp: 'assets/img/discipline-taichi-aujourdhui.webp',
    aujourdhuiAlt: 'Pratiquante en mouvement fluide face à la mer',
    distingue: [
      'Des mouvements lents, fluides et continus, sans à-coups ni impact sur les articulations.',
      'Un ancrage fort dans le sol, qui développe équilibre et stabilité.',
      'Une coordination fine entre le geste, la respiration et la concentration.',
      "Accessible à tout âge, y compris aux personnes peu habituées à l'activité physique."
    ],
    bienfaits: [
      "Amélioration de l'équilibre et prévention des chutes, en particulier chez les personnes âgées.",
      'Renforcement musculaire en douceur, sans contrainte pour les articulations.',
      'Apaisement du mental grâce à la lenteur du geste et à la concentration qu\'il demande.',
      "Meilleure conscience du corps dans l'espace."
    ]
  },
  yoga: {
    title: 'Yoga',
    img: 'assets/img/discipline-yoga-hero.jpg',
    imgWebp: 'assets/img/discipline-yoga-hero.webp',
    alt: 'Pratiquante en posture de yoga dans un intérieur lumineux entouré de plantes',
    origines: `Le yoga trouve ses origines en Inde, où ses fondements remontent à plusieurs millénaires, notamment à
      travers les textes du Yoga Sutra de Patanjali. Bien plus qu'une pratique physique, le yoga traditionnel
      associe posture (asana), respiration (pranayama) et méditation dans une même quête d'unité entre le corps et
      l'esprit — le mot « yoga » signifiant littéralement « relier ».`,
    originesImg: 'assets/img/discipline-yoga-origines.jpg',
    originesImgWebp: 'assets/img/discipline-yoga-origines.webp',
    originesAlt: 'Pratiquante en posture de yoga au sol, intérieur épuré',
    aujourdhui: `Le yoga est aujourd'hui l'une des pratiques corps-esprit les plus répandues au monde, présente dans
      la quasi-totalité des pays. Il fait même l'objet d'une Journée internationale, célébrée chaque 21 juin. De
      nombreuses écoles se sont développées au fil du temps (hatha, vinyasa, yin...), chacune mettant l'accent sur
      un aspect différent : le mouvement, la respiration ou l'immobilité.`,
    aujourdhuiImg: 'assets/img/discipline-yoga-aujourdhui.jpg',
    aujourdhuiImgWebp: 'assets/img/discipline-yoga-aujourdhui.webp',
    aujourdhuiAlt: 'Pratiquante en posture de yoga dans un parc, lumière naturelle',
    distingue: [
      'Un travail approfondi sur la respiration consciente, au cœur de chaque posture.',
      'Une grande variété de postures, statiques ou dynamiques, adaptables à tous les niveaux.',
      'Une dimension méditative qui invite au retour au calme intérieur.',
      'Une pratique qui conjugue aussi bien souplesse que force.'
    ],
    bienfaits: [
      'Amélioration de la souplesse et de la mobilité articulaire.',
      'Renforcement musculaire profond et tonicité générale.',
      'Réduction du stress grâce au travail respiratoire et à la pleine conscience.',
      'Meilleure qualité de sommeil et apaisement du système nerveux.'
    ]
  },
  pilates: {
    title: 'Pilates',
    img: 'assets/img/activite-pilates.jpg',
    imgWebp: 'assets/img/activite-pilates.webp',
    alt: 'Pratiquante au sol en exercice de Pilates',
    origines: `Le Pilates doit son nom à Joseph Pilates, qui a développé sa méthode au début du XXe siècle. Passionné
      de gymnastique et de préparation physique, il conçoit un système d'exercices centré sur le renforcement
      profond des muscles posturaux, qu'il nomme lui-même la « contrologie » — le contrôle du corps par l'esprit.
      Sa méthode s'installe ensuite à New York, où elle séduit rapidement danseurs et athlètes soucieux de préserver
      leur corps.`,
    aujourdhui: `Le Pilates s'est largement démocratisé depuis les années 1990, porté notamment par le monde de la
      danse et de la rééducation. Il est aujourd'hui pratiqué partout dans le monde, sur tapis ou sur machines
      spécialisées (reformer, cadillac...), et fréquemment recommandé en complément d'un suivi kinésithérapique
      pour renforcer le dos et la posture.`,
    distingue: [
      'Un travail centré sur le « centre » du corps (sangle abdominale profonde, dos, bassin).',
      'Des mouvements précis et contrôlés, réalisés en pleine conscience.',
      "Une attention constante portée à l'alignement et à la posture.",
      'Une respiration spécifique qui accompagne chaque exercice.'
    ],
    bienfaits: [
      'Renforcement profond de la sangle abdominale et des muscles stabilisateurs.',
      'Amélioration de la posture et soulagement des tensions dorsales.',
      'Meilleur gainage, sans prise de volume musculaire excessive.',
      'Développement de la coordination et de la précision du mouvement.'
    ]
  },
  qigong: {
    title: 'Qi gong',
    img: 'assets/img/activite-qigong.jpg',
    imgWebp: 'assets/img/activite-qigong.webp',
    alt: 'Pratiquant de Qi gong dans un jardin japonais',
    origines: `Le qi gong (littéralement « travail de l'énergie ») est une pratique chinoise ancestrale, étroitement
      liée à la médecine traditionnelle chinoise et au taoïsme. Depuis des siècles, il associe mouvements lents,
      respiration et visualisation dans le but de cultiver et faire circuler le qi, l'énergie vitale, à travers le
      corps.`,
    aujourdhui: `Le qi gong est pratiqué chaque matin par de nombreuses personnes en Chine, dans les parcs et
      jardins publics. Il s'est diffusé en Occident notamment à travers les milieux de la santé et du bien-être, où
      il est de plus en plus proposé en complément d'autres approches, pour son effet apaisant et sa grande
      douceur.`,
    distingue: [
      "Une pratique essentiellement basée sur le souffle et la circulation de l'énergie.",
      "Des mouvements très doux, souvent inspirés de la nature (l'oiseau, la grue, l'arbre...).",
      'Une dimension méditative marquée, proche de la pleine conscience en mouvement.',
      'Une pratique accessible même en cas de mobilité réduite.'
    ],
    bienfaits: [
      'Soutien du système immunitaire et de la vitalité générale.',
      'Apaisement profond du système nerveux et réduction du stress.',
      'Amélioration de la capacité respiratoire.',
      'Sentiment de calme et de recentrage après chaque séance.'
    ]
  }
};

const dmOverlay = document.getElementById('disciplineOverlay');
const dmModal = dmOverlay ? dmOverlay.querySelector('.discipline-modal') : null;

function renderInlineImg(container, webp, src, alt) {
  container.innerHTML = '';
  if (!src) return;
  container.hidden = false;
  container.innerHTML = `
    <picture>
      <source srcset="${webp}" type="image/webp">
      <img src="${src}" alt="${alt}" loading="lazy">
    </picture>`;
}

function renderDiscipline(key) {
  const d = DISCIPLINES[key];
  if (!d || !dmModal) return;

  dmModal.querySelector('.dm-hero picture source').srcset = d.imgWebp;
  const heroImg = dmModal.querySelector('.dm-hero picture img');
  heroImg.src = d.img;
  heroImg.alt = d.alt;
  dmModal.querySelector('.dm-title').textContent = d.title;

  dmModal.querySelector('.dm-origines').textContent = d.origines;
  const originesImgBox = dmModal.querySelector('.dm-origines-img');
  if (d.originesImg) {
    renderInlineImg(originesImgBox, d.originesImgWebp, d.originesImg, d.originesAlt);
  } else {
    originesImgBox.hidden = true;
    originesImgBox.innerHTML = '';
  }

  dmModal.querySelector('.dm-aujourdhui').textContent = d.aujourdhui;
  const aujourdhuiImgBox = dmModal.querySelector('.dm-aujourdhui-img');
  if (d.aujourdhuiImg) {
    renderInlineImg(aujourdhuiImgBox, d.aujourdhuiImgWebp, d.aujourdhuiImg, d.aujourdhuiAlt);
  } else {
    aujourdhuiImgBox.hidden = true;
    aujourdhuiImgBox.innerHTML = '';
  }

  const distingueList = dmModal.querySelector('.dm-distingue');
  distingueList.innerHTML = d.distingue.map(item => `<li>${item}</li>`).join('');

  const bienfaitsList = dmModal.querySelector('.dm-bienfaits');
  bienfaitsList.innerHTML = d.bienfaits.map(item => `<li>${item}</li>`).join('');

  dmModal.querySelector('.dm-note').textContent =
    `Comme chaque pratique proposée chez Zenway, le ${d.title.toLowerCase()} s'inscrit en complément d'un suivi médical, jamais en remplacement.`;
}

let dmLastFocused = null;

function openDiscipline(key) {
  if (!dmOverlay) return;
  renderDiscipline(key);
  dmLastFocused = document.activeElement;
  dmOverlay.style.display = 'flex';
  dmOverlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    dmOverlay.scrollTop = 0;
    dmOverlay.classList.add('open');
  });
  dmOverlay.querySelector('.dm-close').focus();
}

function closeDiscipline() {
  if (!dmOverlay) return;
  dmOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (dmLastFocused) dmLastFocused.focus();
  dmModal.addEventListener('transitionend', () => {
    dmOverlay.style.display = 'none';
  }, { once: true });
}

if (dmOverlay) {
  document.querySelectorAll('.pcard[data-discipline]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.more')) return;
      openDiscipline(card.dataset.discipline);
    });
    card.addEventListener('keydown', (e) => {
      if (e.target.closest('.more')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDiscipline(card.dataset.discipline);
      }
    });
  });
  document.querySelectorAll('.more[data-discipline]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDiscipline(btn.dataset.discipline);
    });
  });
  dmOverlay.querySelector('.dm-close').addEventListener('click', closeDiscipline);
  dmOverlay.addEventListener('click', (e) => {
    if (e.target === dmOverlay) closeDiscipline();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dmOverlay.classList.contains('open')) closeDiscipline();
  });
}
