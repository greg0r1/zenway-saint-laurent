/* ============================================================
   FICHES DISCIPLINES — ouverture des quatre fenêtres de détail
   Un <dialog> par discipline, deux déclencheurs chacune (le médaillon
   photo et le lien « En détail ») : fermeture par la croix, par un clic
   hors carte, ou par Échap (géré nativement par le navigateur, qui
   fournit aussi le piège à focus).
   ============================================================ */
(function fichesDisciplines() {
  const declencheurs = [...document.querySelectorAll('[data-modal]')];
  if (!declencheurs.length) return;

  // Deux déclencheurs peuvent partager la même fiche : les écouteurs
  // propres à la <dialog> (croix, clic hors carte, fermeture) ne
  // doivent donc être posés qu'une fois par fiche, pas une fois par
  // déclencheur, sous peine de les déclencher deux fois à chaque clic.
  const dernierDeclencheur = new Map();

  declencheurs.forEach((btn) => {
    const modale = document.getElementById(btn.dataset.modal);
    if (!modale) return;

    if (!dernierDeclencheur.has(modale)) {
      dernierDeclencheur.set(modale, null);

      modale.querySelector('.r-modal-close')?.addEventListener('click', () => modale.close());

      modale.addEventListener('click', (e) => {
        if (e.target === modale) modale.close();
      });

      modale.addEventListener('close', () => {
        document.documentElement.classList.remove('r-noscroll');
        dernierDeclencheur.get(modale)?.focus();
      });
    }

    btn.addEventListener('click', () => {
      // Même verrou que le tiroir de navigation : sans lui la page reste
      // défilable derrière la fiche, invisible mais toujours là.
      document.documentElement.classList.add('r-noscroll');
      dernierDeclencheur.set(modale, btn);
      modale.showModal();
    });
  });
})();
