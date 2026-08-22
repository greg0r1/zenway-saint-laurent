/* ============================================================
   INFOS PRATIQUES — adresse, parking, téléphone, e-mail et prochain
   rendez-vous, alimentés par /api/infos (module « Infos pratiques »)
   ============================================================ */
(function infospratiques() {
  // Échappe aussi guillemets et apostrophe : ces valeurs finissent
  // parfois en position d'attribut, où un guillemet refermerait
  // l'attribut et permettrait d'en injecter un autre.
  function echapper(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------- Infos pratiques : /api/infos ----------
     Mêmes règles que assets/js/infos-pratiques.js : une fiche
     incomplète n'écrase pas le repli, et une valeur ne devient
     un href que si c'est bien une https. */
  const OBLIGATOIRES = ['address', 'map_url', 'parking', 'phone', 'email'];

  function urlSure(valeur) {
    return typeof valeur === 'string' && /^https:\/\/\S+$/i.test(valeur.trim());
  }

  fetch('/api/infos')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const infos = data && data.infos;
      if (!infos) return;
      const complete = OBLIGATOIRES.every((c) => typeof infos[c] === 'string' && infos[c].trim());
      if (!complete) return;

      document.querySelectorAll('[data-info-link="address"]').forEach((a) => {
        if (urlSure(infos.map_url)) a.href = infos.map_url.trim();
        a.innerHTML = echapper(infos.address).replace(/\n/g, '<br>');
      });
      document.querySelectorAll('[data-info-link="phone"]').forEach((a) => {
        a.href = `tel:${infos.phone.replace(/[^\d+]/g, '')}`;
        a.textContent = infos.phone;
      });
      document.querySelectorAll('[data-info-link="email"]').forEach((a) => {
        a.href = `mailto:${infos.email}`;
        a.textContent = infos.email;
      });
      const parking = document.querySelector('[data-info="parking"]');
      if (parking) parking.textContent = infos.parking;

      const prochain = document.querySelector('[data-info="next_session"]');
      const ligne = document.querySelector('[data-info-row="next_session"]');
      if (prochain && ligne) {
        if (infos.next_session) {
          prochain.textContent = infos.next_session;
          ligne.hidden = false;
        } else {
          ligne.hidden = true;
        }
      }
    })
    .catch(() => {
      /* API indisponible : le repli statique reste affiché */
    });
})();
