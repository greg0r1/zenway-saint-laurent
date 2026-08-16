/* ============================================================
   INFOS-PRATIQUES — section « Infos pratiques », alimentée par
   /api/infos/public (voir api/infos/public.js). Si la requête échoue
   ou si aucune fiche n'existe encore en base, le contenu statique
   déjà présent dans index.html reste affiché tel quel — aucun
   changement visuel. La carte Google Maps (iframe) n'est jamais
   touchée : elle reste fixe.
   ============================================================ */
(function setupInfosPratiques() {
  const liens = document.querySelectorAll('[data-info-link]');
  const champs = document.querySelectorAll('[data-info]');
  if (!liens.length && !champs.length) return;

  // Échappe les guillemets et l'apostrophe en plus des chevrons, pour
  // rester sûr en position d'attribut (value="…", src="…") : sans cela,
  // un guillemet dans la donnée referme l'attribut et permet d'en
  // injecter un autre, un gestionnaire d'événement par exemple. Sans
  // effet en contenu textuel, où le parseur rend les entités telles quelles.
  function echapper(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function rendre(infos) {
    document.querySelectorAll('[data-info-link="address"]').forEach((a) => {
      a.href = infos.map_url;
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
    const ligneProchain = document.querySelector('[data-info-row="next_session"]');
    if (prochain && ligneProchain) {
      if (infos.next_session) {
        prochain.textContent = infos.next_session;
        ligneProchain.hidden = false;
      } else {
        ligneProchain.hidden = true;
      }
    }
  }

  fetch('/api/infos/public')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data || !data.infos) return;
      rendre(data.infos);
    })
    .catch(() => { /* API indisponible : contenu statique par défaut conservé */ });
})();
