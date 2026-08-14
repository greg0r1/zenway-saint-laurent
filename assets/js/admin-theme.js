/* ============================================================
   ADMIN-THEME — clair / sombre pour l'atelier.
   Chargé dans le <head>, en synchrone : le thème doit être posé sur
   <html> avant le premier rendu, sinon la page apparaît en clair une
   fraction de seconde avant de basculer.
   Trois états : 'clair', 'sombre', et 'systeme' (par défaut, on suit
   le réglage de l'appareil).
   ============================================================ */
const AdminTheme = (function adminTheme() {
  const CLE = 'zenway-admin-theme';
  const MEDIA = window.matchMedia('(prefers-color-scheme: dark)');
  const listeners = [];

  function lire() {
    try {
      const v = localStorage.getItem(CLE);
      return v === 'clair' || v === 'sombre' ? v : 'systeme';
    } catch {
      return 'systeme';
    }
  }

  /* Le choix explicite l'emporte ; sinon on suit l'appareil. */
  function resoudre(choix) {
    if (choix === 'clair' || choix === 'sombre') return choix;
    return MEDIA.matches ? 'sombre' : 'clair';
  }

  function appliquer(choix) {
    const actif = resoudre(choix);
    document.documentElement.setAttribute('data-theme', actif);
    document.documentElement.style.colorScheme = actif === 'sombre' ? 'dark' : 'light';
    listeners.forEach((fn) => fn(actif, choix));
    return actif;
  }

  function definir(choix) {
    try {
      if (choix === 'systeme') localStorage.removeItem(CLE);
      else localStorage.setItem(CLE, choix);
    } catch { /* navigation privée : le thème vaut pour la session */ }
    return appliquer(choix);
  }

  /* Bascule simple : on passe à l'inverse de ce qui est affiché, ce qui
     sort du mode « systeme » — c'est le geste attendu d'un interrupteur. */
  function basculer() {
    return definir(resoudre(lire()) === 'sombre' ? 'clair' : 'sombre');
  }

  function actuel() {
    return { choix: lire(), actif: resoudre(lire()) };
  }

  function surChangement(fn) {
    listeners.push(fn);
  }

  MEDIA.addEventListener('change', () => {
    if (lire() === 'systeme') appliquer('systeme');
  });

  appliquer(lire());

  return { definir, basculer, actuel, surChangement };
})();
