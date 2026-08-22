/* ============================================================
   FICHES DISCIPLINES — ouverture des quatre fenêtres de détail
   Un <dialog> par discipline : fermeture par la croix, par un clic
   hors carte, ou par Échap (géré nativement par le navigateur, qui
   fournit aussi le piège à focus).
   ============================================================ */
(function fichesDisciplines() {
  const boutons = [...document.querySelectorAll('[data-modal]')];
  if (!boutons.length) return;

  boutons.forEach((btn) => {
    const modale = document.getElementById(btn.dataset.modal);
    if (!modale) return;

    btn.addEventListener('click', () => {
      // Même verrou que le tiroir de navigation : sans lui la page reste
      // défilable derrière la fiche, invisible mais toujours là.
      document.documentElement.classList.add('r-noscroll');
      modale.showModal();
    });

    modale.querySelector('.r-modal-close')?.addEventListener('click', () => modale.close());

    modale.addEventListener('click', (e) => {
      if (e.target === modale) modale.close();
    });

    modale.addEventListener('close', () => {
      document.documentElement.classList.remove('r-noscroll');
      btn.focus();
    });
  });
})();
