/* ============================================================
   PARALLAX — le papier se décolle du bain
   Un seul principe, tenu partout : le décor et la marbrure remontent
   lentement, les feuilles levées et Béatrice descendent avec le
   scroll. C'est le geste de la levée prolongé, pas un effet ajouté
   par-dessus. Tout est en translate3d, borné, et coupé net si
   l'utilisateur a demandé moins d'animation.
   ============================================================ */
(function parallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers = [...document.querySelectorAll('[data-par]')].map((el) => ({
    el,
    rate: parseFloat(el.dataset.par) || 0
  }));
  if (!layers.length) return;

  let ticking = false;

  function frame() {
    ticking = false;
    const y = window.scrollY;
    // au-delà de la hauteur du hero, plus rien ne bouge : les couches
    // ne doivent jamais se désolidariser du contenu qu'elles portent
    const hero = document.getElementById('hero');
    const bound = hero ? hero.offsetHeight : window.innerHeight;
    const t = Math.min(y, bound);
    for (const l of layers) {
      l.el.style.transform = `translate3d(0, ${(t * l.rate).toFixed(1)}px, 0)`;
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }

  frame();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
