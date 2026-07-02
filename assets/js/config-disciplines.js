/* ============================================================
   CONFIG-DISCIPLINES — ouverture/fermeture des 4 modales de détail
   (le contenu de chaque fiche est écrit statiquement dans index.html
   pour rester indexable ; ce script ne fait que gérer l'affichage)
   ============================================================ */
const dmOverlay = document.getElementById('disciplineOverlay');
const dmModals = dmOverlay ? dmOverlay.querySelectorAll('.discipline-modal') : [];

let dmCurrentModal = null;
let dmLastFocused = null;

function openDiscipline(key) {
  if (!dmOverlay) return;
  const modal = dmOverlay.querySelector(`.discipline-modal[data-discipline="${key}"]`);
  if (!modal) return;

  dmModals.forEach(m => { m.hidden = m !== modal; });
  dmCurrentModal = modal;

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
  if (!dmOverlay || !dmCurrentModal) return;
  dmOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (dmLastFocused) dmLastFocused.focus();
  dmCurrentModal.addEventListener('transitionend', () => {
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
