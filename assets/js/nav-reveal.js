/* ============================================================
   NAV-REVEAL — menu burger de l'en-tête
   ============================================================ */
(function burgerMenu() {
  const burger = document.getElementById('burger');
  const links = document.getElementById('navlinks');
  if (!burger || !links) return;

  // Le menu ouvert occupe tout l'écran : la page derrière ne doit
  // plus défiler ni rester atteignable, sous peine de laisser
  // deviner un fond qui continue à vivre sous le panneau.
  function setOpen(open) {
    links.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }

  burger.addEventListener('click', () => {
    setOpen(!links.classList.contains('open'));
  });

  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setOpen(false);
      burger.focus();
    }
  });
})();
