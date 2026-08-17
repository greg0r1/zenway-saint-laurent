/* ============================================================
   HERO-BATH — canvas des quatre galets de pigment dans le bain
   Quatre galets de plage, un par pratique, déposés dans l'ordre
   de l'enchaînement Zenway : chacun écarte doucement ceux déjà
   posés pour se faire une place, sans jamais s'y mélanger — la
   retenue ronde d'une pierre polie par l'eau, pas un aplat liquide.
   Le déplacement radial qui écarte les galets voisins reprend la
   formule de Lu / Jaffer / Mould (marbrure turque) —
   p' = c + (p - c) · racine(1 + r² / |p - c|²) — réduite pour
   qu'elle les pousse sans jamais les faire se fondre l'un dans
   l'autre.
   ============================================================ */

(function pebbleBath() {
  const canvas = document.getElementById('bath');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Les quatre pigments, dans l'ordre de l'enchaînement Zenway — les
  // couleurs sont lues depuis les variables CSS (mêmes tons que les
  // pastilles .c1-.c4 de la légende) pour rester la seule source de vérité.
  const rootStyle = getComputedStyle(document.documentElement);
  const cssColor = (name, fallback) => rootStyle.getPropertyValue(name).trim() || fallback;
  const PIGMENTS = [
    { name: 'Tai-chi chuan', color: cssColor('--teal', '#2f8f7f') },
    { name: 'Yoga', color: cssColor('--mint', '#d8f3dc') },
    { name: 'Pilates', color: cssColor('--teal-bright', '#36a18c') },
    { name: 'Qi gong', color: cssColor('--gold', '#c9a86a') }
  ];

  const POINTS = 160;
  let W = 0,
    H = 0,
    dpr = 1;
  let drops = []; // chaque galet : { color, pts: [[x,y], ...] }
  let raf = null;

  /* Retourne false tant que le bain n'a pas de dimensions mesurables
     (onglet en arrière-plan, conteneur encore replié au chargement). */
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }

  /* Un galet : silhouette ovale légèrement aplatie et tournée, dont
     le contour porte deux harmoniques de faible amplitude — assez
     pour lire une pierre naturelle, jamais assez pour onduler comme
     un pigment liquide. `seed` varie le galet sans dépendre du hasard. */
  function pebble(cx, cy, r, seed) {
    const rot = (seed % 1) * Math.PI;
    const flat = 0.74 + Math.abs(Math.sin(seed * 3.1)) * 0.18;
    const rx = r,
      ry = r * flat;
    const cosR = Math.cos(rot),
      sinR = Math.sin(rot);
    const pts = [];
    for (let i = 0; i < POINTS; i++) {
      const a = (i / POINTS) * Math.PI * 2;
      const wobble = 1 + 0.05 * Math.sin(a * 2 + seed) + 0.035 * Math.sin(a * 3 - seed * 1.7);
      const ex = Math.cos(a) * rx * wobble;
      const ey = Math.sin(a) * ry * wobble;
      pts.push([cx + ex * cosR - ey * sinR, cy + ex * sinR + ey * cosR]);
    }
    return pts;
  }

  /* Un galet neuf écarte doucement ceux déjà posés, pour se faire une
     place sans jamais s'y fondre — le rayon de poussée reste plus
     court que le galet lui-même, pour qu'il nudge ses voisins au lieu
     de les emporter en volutes. */
  function addDrop(cx, cy, r, color, seed) {
    const pushR2 = r * 0.55 * (r * 0.55);
    for (const d of drops) {
      for (const p of d.pts) {
        const dx = p[0] - cx,
          dy = p[1] - cy;
        const d2 = dx * dx + dy * dy || 0.0001;
        const k = Math.sqrt(1 + pushR2 / d2);
        p[0] = cx + dx * k;
        p[1] = cy + dy * k;
      }
    }
    drops.push({ color, pts: pebble(cx, cy, r, seed) });
  }

  /* Éclaircit (pct > 0) ou assombrit (pct < 0) une couleur #rrggbb —
     pour le dégradé et le liseré qui donnent leur volume aux galets. */
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255,
      g = (n >> 8) & 255,
      b = n & 255;
    const t = pct < 0 ? 0 : 255;
    const p = Math.abs(pct);
    return `rgb(${Math.round(r + (t - r) * p)}, ${Math.round(g + (t - g) * p)}, ${Math.round(b + (t - b) * p)})`;
  }

  /* Le bain est rempli d'un bord à l'autre : le pigment déborde du
     cadre, comme une cuve plus large que la feuille qu'on y lève. */
  function build(progress) {
    drops = [];
    const cy = H * 0.5;
    // calé sur la plus petite dimension : sur un large écran on obtient
    // plus de figures serrées, jamais deux nappes molles étirées
    const R = Math.min(W, H) * 0.38;
    // Chaque dépôt repousse les précédents : pour que l'or reste un
    // filet et non une nappe, les gouttes rétrécissent dans l'ordre.
    const SCALE = [1, 0.84, 0.68, 0.46];
    // Les décalages verticaux ci-dessous sont calés sur H en supposant
    // une cuve large (bureau, W ≫ H) : sur un canvas plus haut que
    // large (mobile), la même formule les disperse au point de faire
    // flotter un pigment seul, hors de la figure — l'inverse du geste
    // qu'il illustre. On les compresse dès que H dépasse W, jamais
    // au-delà de leur valeur d'origine.
    const vScale = Math.min(1, W / H);

    // Chaque pigment est déposé en plusieurs gouttes, comme au pinceau,
    // toujours dans l'ordre de l'enchaînement Zenway.
    // Les centres débordent volontairement du cadre : la cuve est plus
    // large que ce qu'on en voit, le pigment ne s'arrête jamais net.
    const seq = [
      [
        [W * 0.1, cy - H * 0.42 * vScale],
        [W * 0.3, cy + H * 0.44 * vScale],
        [W * -0.04, cy + H * 0.06 * vScale]
      ],
      [
        [W * 0.44, cy - H * 0.1 * vScale],
        [W * 0.6, cy + H * 0.46 * vScale],
        [W * 0.24, cy - H * 0.5 * vScale]
      ],
      [
        [W * 0.76, cy - H * 0.44 * vScale],
        [W * 0.54, cy + H * 0.16 * vScale],
        [W * 0.94, cy + H * 0.42 * vScale]
      ],
      [
        [W * 0.88, cy - H * 0.04 * vScale],
        [W * 0.7, cy - H * 0.52 * vScale],
        [W * 1.04, cy + H * 0.5 * vScale]
      ]
    ];

    const laid = Math.min(4, Math.floor(progress * 5.1));
    for (let i = 0; i < laid; i++) {
      seq[i].forEach((c, j) => {
        addDrop(c[0], c[1], R * SCALE[i] * (0.62 + j * 0.16), PIGMENTS[i].color, i * 3 + j + 1);
      });
    }
    highlight(laid);
  }

  /* Le pigment actif dans la liste latérale suit le dépôt en cours */
  function highlight(laid) {
    const items = document.querySelectorAll('.drops li');
    items.forEach((li, i) => li.classList.toggle('in', i < laid));
  }

  function paint() {
    ctx.clearRect(0, 0, W, H);
    for (const d of drops) {
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      for (const p of d.pts) {
        if (p[0] < minX) minX = p[0];
        if (p[0] > maxX) maxX = p[0];
        if (p[1] < minY) minY = p[1];
        if (p[1] > maxY) maxY = p[1];
      }
      const cx = (minX + maxX) / 2,
        cy = (minY + maxY) / 2;
      const rad = Math.max(maxX - minX, maxY - minY) / 2;

      ctx.beginPath();
      ctx.moveTo(d.pts[0][0], d.pts[0][1]);
      for (let i = 1; i < d.pts.length; i++) ctx.lineTo(d.pts[i][0], d.pts[i][1]);
      ctx.closePath();

      // Lumière en haut à gauche, ombre en bas à droite : le dégradé
      // qui fait lire une pierre lisse plutôt qu'un aplat de pigment.
      const grad = ctx.createRadialGradient(
        cx - rad * 0.35,
        cy - rad * 0.4,
        rad * 0.1,
        cx,
        cy,
        rad * 1.15
      );
      grad.addColorStop(0, shade(d.color, 0.22));
      grad.addColorStop(0.55, d.color);
      grad.addColorStop(1, shade(d.color, -0.22));
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.lineWidth = 1;
      ctx.strokeStyle = shade(d.color, -0.3);
      ctx.globalAlpha = 0.35;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  /* Une seule séquence orchestrée, jouée une fois puis rejouable.
     La composition finale est garantie même si l'onglet est mis en
     arrière-plan et que les frames sont suspendues. */
  const DUR = 4200;
  let settle = null;
  let start = 0;
  let done = false;
  let started = false;

  function finish() {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    clearTimeout(settle);
    done = true;
    build(1);
    paint();
  }

  function frame(now) {
    const t = Math.min((now - start) / DUR, 1);
    // sortie exponentielle : le geste ralentit en se posant
    build(1 - Math.pow(1 - t, 3));
    paint();
    if (t < 1) raf = requestAnimationFrame(frame);
    else {
      raf = null;
      done = true;
    }
  }

  function play() {
    if (raf) cancelAnimationFrame(raf);
    clearTimeout(settle);
    started = true;
    done = false;
    if (reduced) {
      finish();
      return;
    }
    start = performance.now();
    raf = requestAnimationFrame(frame);
    // filet de sécurité : si les frames sont suspendues (onglet en
    // arrière-plan), la composition finale est posée quand même
    settle = setTimeout(() => {
      if (!done) finish();
    }, DUR + 500);
  }

  // Une séquence interrompue par un passage en arrière-plan se termine
  // au retour, plutôt que de rester figée à mi-geste.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !done && W > 1) finish();
  });

  // Premier remplissage : la séquence complète joue une seule fois.
  // Tout redimensionnement après coup (rotation, ou la barre d'adresse
  // mobile qui se rétracte au scroll) redessine juste la composition
  // finale à la nouvelle taille — jamais un second passage de gouttes,
  // qui se verrait comme un bain qui se reforme en plein scroll.
  function reset() {
    if (!size()) return false;
    if (done) {
      build(1);
      paint();
    } else if (!started) {
      play();
    }
    // sinon : la séquence est déjà en cours — le redimensionnement est
    // pris en compte par size(), la frame en vol continue sans relancer.
    return true;
  }

  // Le bain se remplit dès qu'il a une taille : au chargement, ou plus
  // tard si la page était en arrière-plan / le conteneur encore replié.
  if (!reset() && 'ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      if (reset()) ro.disconnect();
    });
    ro.observe(canvas);
  }

  let rt = null;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(reset, 180);
  });
})();
