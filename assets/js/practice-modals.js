/* ============================================================
   PRACTICE-MODALS — ouverture/fermeture des fenêtres modales de détail
   Une fenêtre modale par pratique (<dialog>), à l'apple : fond
   assombri et flouté, carte centrée, fermeture par la croix, un
   clic hors carte ou la touche Échap (gérée nativement).
   ============================================================ */
(function practiceModals() {
  const buttons = [...document.querySelectorAll('.more[data-modal]')];
  if (!buttons.length) return;

  buttons.forEach(btn => {
    const modal = document.getElementById(btn.dataset.modal);
    if (!modal) return;

    btn.addEventListener('click', () => {
      document.body.style.overflow = 'hidden';
      modal.showModal();
    });

    modal.querySelector('.modal-close')?.addEventListener('click', () => {
      modal.close();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });

    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
      btn.focus();
    });
  });
})();
