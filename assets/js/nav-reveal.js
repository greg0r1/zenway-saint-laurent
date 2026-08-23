/* ============================================================
   NAV / RÉVÉLATION — barre de navigation (état au défilement, tiroir
   mobile) et révélation des blocs à l'entrée dans le champ
   ============================================================ */
(function navreveal() {
  document.documentElement.classList.add('js');

  /* ---------- Barre de navigation ---------- */
  const nav = document.getElementById('nav');
  const liens = document.getElementById('navLinks');
  const burger = document.getElementById('burger');

  if (nav) {
    // Chaque bande de la page (voir CLAUDE.md) porte ou non `r-dark` : la
    // barre reprend son état clair d'origine (celui du hero) dès qu'une
    // bande sombre passe dessous, et son état sombre sur une bande claire —
    // elle suit l'alternance plutôt que de rester figée après le hero. Le
    // footer est inclus : il porte lui aussi `r-dark` (voir index.html),
    // sans quoi la barre repasserait sombre en bas de page, sur un fond
    // qui l'est tout autant.
    const sections = document.querySelectorAll(
      '#contenu > .r-hero, #contenu > .r-section, .r-footer'
    );
    const majEtat = () => {
      // Lectures d'abord, écritures ensuite : `is-scrolled` change le
      // `top` de la barre quand le bandeau d'événement est affiché
      // (voir nav.css), donc l'écrire avant de lire les rectangles
      // forcerait un recalcul de mise en page superflu.
      const estDefile = window.scrollY > 40;
      let surBandeSombre = false;
      if (sections.length) {
        const limite = nav.getBoundingClientRect().bottom;
        for (const section of sections) {
          const r = section.getBoundingClientRect();
          if (r.top <= limite && r.bottom > limite) {
            surBandeSombre = section.classList.contains('r-dark');
            break;
          }
        }
      }
      nav.classList.toggle('is-scrolled', estDefile);
      nav.classList.toggle('is-light', surBandeSombre);
    };
    majEtat();
    window.addEventListener('scroll', majEtat, { passive: true });
    window.addEventListener('resize', majEtat);
  }

  if (burger && liens) {
    const fermer = () => {
      liens.classList.remove('is-open');
      document.documentElement.classList.remove('r-noscroll');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
    };
    burger.addEventListener('click', () => {
      const ouvert = liens.classList.toggle('is-open');
      // Le tiroir remplace la page plutôt que de flotter dessus : sans ce
      // verrou elle reste défilable derrière, invisible mais toujours là.
      document.documentElement.classList.toggle('r-noscroll', ouvert);
      burger.setAttribute('aria-expanded', String(ouvert));
      burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    liens.addEventListener('click', (e) => {
      const lien = e.target.closest('a');
      if (!lien) return;
      // Sur desktop `liens` n'est jamais "is-open" (le bouton qui pose cette
      // classe est display:none, jamais cliqué) : le lien y garde son
      // comportement natif, inchangé. Seul le tiroir mobile plein écran a
      // besoin d'être fermé avant de sauter — sinon les deux se jouent dans
      // le même geste, et le calcul de défilement se fait pendant qu'un
      // aplat opaque recouvre encore tout l'écran, d'où une arrivée mal
      // calée.
      if (!liens.classList.contains('is-open')) return;
      const href = lien.getAttribute('href') || '';
      const cible = href.startsWith('#') && document.getElementById(href.slice(1));
      // Ctrl/Cmd/Maj/Alt ou clic autre que gauche : on laisse le navigateur
      // faire (ouverture dans un nouvel onglet, etc.), on ferme juste le
      // tiroir au passage.
      const clicSimple =
        cible && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
      if (clicSimple) e.preventDefault();
      fermer();
      if (clicSimple) {
        const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.setTimeout(
          () => {
            // Section suivante posée pile sous l'en-tête, sans respiration
            // supplémentaire : la précédente s'arrête net à sa bordure,
            // rien ne dépasse dessous. On lit le BAS réel de l'en-tête, pas
            // sa hauteur : quand un événement est à la une, la nav est
            // descendue de la hauteur du bandeau, et sa hauteur seule
            // ferait arriver la section sous l'en-tête.
            const bas = nav ? nav.getBoundingClientRect().bottom : 0;
            const y = cible.getBoundingClientRect().top + window.scrollY - bas;
            window.scrollTo({ top: Math.max(0, y), behavior: reduit ? 'auto' : 'smooth' });
            history.pushState(null, '', href);
          },
          reduit ? 0 : 360
        );
      }
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
})();
