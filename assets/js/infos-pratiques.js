/* ============================================================
   INFOS-PRATIQUES — section « Infos pratiques », alimentée par
   /api/infos (GET, public — voir api/infos/index.js). Si la requête
   échoue ou si aucune fiche n'existe encore en base, le contenu
   statique déjà présent dans index.html reste affiché tel quel —
   aucun changement visuel. La carte Google Maps (iframe) n'est
   jamais touchée : elle reste fixe.
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

  // Les colonnes de infos_pratiques valent '' par défaut : une fiche
  // créée sans son seed, ou dont une colonne est restée vide, arriverait
  // ici avec des champs vides. Les recopier effacerait le contenu du
  // repli au lieu de le remplacer — on préfère alors ne rien toucher.
  // next_session est exclu : vide, il masque sa ligne, c'est voulu.
  const OBLIGATOIRES = ['address', 'map_url', 'parking', 'phone', 'email'];

  function ficheComplete(infos) {
    return OBLIGATOIRES.every((champ) => typeof infos[champ] === 'string' && infos[champ].trim());
  }

  // L'API n'accepte que des https (voir api/_lib/infos.js), mais la ligne
  // en base a pu être posée en SQL direct (le seed de db/README.md) sans
  // passer par cette validation : on revérifie avant d'en faire un href,
  // seul endroit où une valeur saisie devient une URL pour les visiteurs.
  function urlSure(valeur) {
    return typeof valeur === 'string' && /^https:\/\/\S+$/i.test(valeur.trim());
  }

  function rendre(infos) {
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

  fetch('/api/infos')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data || !data.infos || !ficheComplete(data.infos)) return;
      rendre(data.infos);
    })
    .catch(() => { /* API indisponible : contenu statique par défaut conservé */ });
})();
