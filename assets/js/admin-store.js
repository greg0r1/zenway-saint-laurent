/* ============================================================
   ADMIN-STORE — la source unique des événements et du planning pour
   la console. Le tableau de bord et les feuilles « Événements » /
   « Planning » lisent les mêmes listes : publier depuis l'une met
   l'autre à jour sans rechargement, et chaque API n'est interrogée
   qu'une fois.
   ============================================================ */
const AdminStore = (function adminStore() {
  const abonnes = [];

  const etat = {
    statut: 'attente',   // attente | chargement | pret | erreur
    events: [],
    erreur: null
  };

  function abonner(fn) {
    abonnes.push(fn);
    fn(instantane());
    return () => {
      const i = abonnes.indexOf(fn);
      if (i >= 0) abonnes.splice(i, 1);
    };
  }

  // Un événement est archivé soit par choix (archived), soit parce que sa
  // fin de parution est dépassée (voir api/events/public.js, qui applique
  // la même règle côté site public) : les deux causes rangent la fiche au
  // même endroit dans l'admin, sans état intermédiaire « plus en ligne
  // mais pas encore archivé ».
  function estArchive(ev) {
    return !!ev.archived || !!(ev.ends_at && estPasse(ev.ends_at));
  }

  function instantane() {
    const events = etat.events;
    const enLigne = events.filter((ev) => !estArchive(ev));
    const vedette = enLigne.find((ev) => ev.featured) || null;
    return {
      statut: etat.statut,
      erreur: etat.erreur,
      events,
      vedette,
      enLigne,
      archives: events.filter(estArchive)
    };
  }

  function diffuser() {
    const snap = instantane();
    abonnes.forEach((fn) => fn(snap));
  }

  /* Une réponse 200 n'est pas forcément du JSON : une redirection vers un
     écran de connexion (protection de déploiement Vercel, portail Wi-Fi)
     renvoie du HTML avec ce même statut. Sans ce filet, res.json() rejette
     hors de tout catch et la page reste indéfiniment sur son squelette,
     sans message ni bouton « Réessayer ». Partagé par les trois magasins. */
  async function lireJson(res) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  async function charger() {
    if (etat.statut === 'chargement') return;
    etat.statut = 'chargement';
    etat.erreur = null;
    diffuser();

    let res;
    try {
      res = await fetch('/api/events');
    } catch {
      echouer('reseau');
      return;
    }
    if (res.status === 401) {
      echouer('session');
      return;
    }
    if (!res.ok) {
      echouer('serveur');
      return;
    }

    const data = await lireJson(res);
    if (!data) {
      echouer('serveur');
      return;
    }
    // `archived`/`ends_at` peuvent manquer tant que les migrations 003/004
    // ne sont pas jouées : on normalise pour que l'interface ne dépende
    // jamais d'un undefined.
    etat.events = (data.events || []).map((ev) => ({
      ...ev,
      archived: !!ev.archived,
      featured: !!ev.featured,
      starts_at: ev.starts_at || null,
      ends_at: ev.ends_at || null,
      image_url: ev.image_url || null
    }));
    etat.statut = 'pret';
    diffuser();
  }

  function echouer(cause) {
    etat.statut = 'erreur';
    etat.erreur = cause;
    diffuser();
  }

  function reinitialiser() {
    etat.statut = 'attente';
    etat.events = [];
    etat.erreur = null;
    reinitialiserPlanning();
    reinitialiserInfos();
  }

  /* --------- Écritures : l'API répond, puis on relit la liste --------- */

  async function enregistrer(payload, id) {
    const res = await fetch(id ? `/api/events/${id}` : '/api/events', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('save_failed');
    await charger();
  }

  async function modifier(id, champs) {
    const res = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(champs)
    });
    if (!res.ok) throw new Error('update_failed');
    await charger();
  }

  async function supprimer(id) {
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('delete_failed');
    await charger();
  }

  /* ---------- Mise en forme des dates, partagée par les pages ---------- */

  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  function versDate(iso) {
    if (!iso) return null;
    const d = new Date(`${String(iso).slice(0, 10)}T12:00:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function dateLongue(iso) {
    const d = versDate(iso);
    if (!d) return '';
    return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
  }

  function dateCourte(iso) {
    const d = versDate(iso);
    if (!d) return null;
    return { jour: String(d.getDate()), mois: MOIS[d.getMonth()].slice(0, 4), annee: String(d.getFullYear()) };
  }

  /* Distance en jours pleins, du point de vue du matin d'aujourd'hui. */
  function joursRestants(iso) {
    const d = versDate(iso);
    if (!d) return null;
    const aujourdhui = new Date();
    aujourdhui.setHours(12, 0, 0, 0);
    return Math.round((d - aujourdhui) / 86400000);
  }

  function quand(iso) {
    const n = joursRestants(iso);
    if (n === null) return 'Date non précisée';
    if (n === 0) return "C'est aujourd'hui";
    if (n === 1) return 'Demain';
    if (n === -1) return 'Hier';
    if (n > 1) return `Dans ${n} jours`;
    return `Il y a ${Math.abs(n)} jours`;
  }

  function estPasse(iso) {
    const n = joursRestants(iso);
    return n !== null && n < 0;
  }

  /* ============================================================
     PLANNING — même principe que ci-dessus, magasin distinct : les
     créneaux de séance n'ont rien à voir avec les événements, mais
     partagent le même besoin (une liste lue une fois, diffusée à
     plusieurs pages).
     ============================================================ */

  const abonnesPlanning = [];

  const etatPlanning = {
    statut: 'attente',   // attente | chargement | pret | erreur
    slots: [],
    erreur: null
  };

  function abonnerPlanning(fn) {
    abonnesPlanning.push(fn);
    fn(instantanePlanning());
    return () => {
      const i = abonnesPlanning.indexOf(fn);
      if (i >= 0) abonnesPlanning.splice(i, 1);
    };
  }

  function instantanePlanning() {
    return { statut: etatPlanning.statut, erreur: etatPlanning.erreur, slots: etatPlanning.slots };
  }

  function diffuserPlanning() {
    const snap = instantanePlanning();
    abonnesPlanning.forEach((fn) => fn(snap));
  }

  async function chargerPlanning() {
    if (etatPlanning.statut === 'chargement') return;
    etatPlanning.statut = 'chargement';
    etatPlanning.erreur = null;
    diffuserPlanning();

    let res;
    try {
      res = await fetch('/api/planning');
    } catch {
      echouerPlanning('reseau');
      return;
    }
    if (res.status === 401) {
      echouerPlanning('session');
      return;
    }
    if (!res.ok) {
      echouerPlanning('serveur');
      return;
    }

    const data = await lireJson(res);
    if (!data) {
      echouerPlanning('serveur');
      return;
    }
    etatPlanning.slots = data.slots || [];
    etatPlanning.statut = 'pret';
    diffuserPlanning();
  }

  function echouerPlanning(cause) {
    etatPlanning.statut = 'erreur';
    etatPlanning.erreur = cause;
    diffuserPlanning();
  }

  function reinitialiserPlanning() {
    etatPlanning.statut = 'attente';
    etatPlanning.slots = [];
    etatPlanning.erreur = null;
  }

  async function enregistrerPlanning(payload, id) {
    const res = await fetch(id ? `/api/planning/${id}` : '/api/planning', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('save_failed');
    await chargerPlanning();
  }

  async function supprimerPlanning(id) {
    const res = await fetch(`/api/planning/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('delete_failed');
    await chargerPlanning();
  }

  // Échange le créneau avec son voisin immédiat. L'ordre complet part
  // en une seule requête (voir api/planning/order.js) : deux écritures
  // séparées pouvaient, si la seconde échouait, laisser deux créneaux
  // à la même position et donc un ordre arbitraire.
  async function deplacerPlanning(id, direction) {
    const slots = etatPlanning.slots;
    const index = slots.findIndex((s) => String(s.id) === String(id));
    if (index === -1) return;
    const voisin = direction === 'haut' ? index - 1 : index + 1;
    if (voisin < 0 || voisin >= slots.length) return;

    const ids = slots.map((s) => s.id);
    [ids[index], ids[voisin]] = [ids[voisin], ids[index]];

    const res = await fetch('/api/planning/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    if (!res.ok) throw new Error('reorder_failed');
    await chargerPlanning();
  }

  /* ============================================================
     INFOS PRATIQUES — même principe que ci-dessus, magasin distinct :
     une fiche unique (pas une liste), abonnement et rechargement
     partagés par le tableau de bord et la page « Infos pratiques ».
     ============================================================ */

  const abonnesInfos = [];

  const etatInfos = {
    statut: 'attente',   // attente | chargement | pret | erreur
    infos: null,
    erreur: null
  };

  function abonnerInfos(fn) {
    abonnesInfos.push(fn);
    fn(instantaneInfos());
    return () => {
      const i = abonnesInfos.indexOf(fn);
      if (i >= 0) abonnesInfos.splice(i, 1);
    };
  }

  function instantaneInfos() {
    return { statut: etatInfos.statut, erreur: etatInfos.erreur, infos: etatInfos.infos };
  }

  function diffuserInfos() {
    const snap = instantaneInfos();
    abonnesInfos.forEach((fn) => fn(snap));
  }

  async function chargerInfos() {
    if (etatInfos.statut === 'chargement') return;
    etatInfos.statut = 'chargement';
    etatInfos.erreur = null;
    diffuserInfos();

    // Lecture publique (voir api/infos/index.js) : pas de session à
    // vérifier ici, contrairement au chargement des événements et du
    // planning.
    let res;
    try {
      res = await fetch('/api/infos');
    } catch {
      echouerInfos('reseau');
      return;
    }
    if (!res.ok) {
      echouerInfos('serveur');
      return;
    }

    const data = await lireJson(res);
    if (!data) {
      echouerInfos('serveur');
      return;
    }
    etatInfos.infos = data.infos || null;
    etatInfos.statut = 'pret';
    diffuserInfos();
  }

  function echouerInfos(cause) {
    etatInfos.statut = 'erreur';
    etatInfos.erreur = cause;
    diffuserInfos();
  }

  function reinitialiserInfos() {
    etatInfos.statut = 'attente';
    etatInfos.infos = null;
    etatInfos.erreur = null;
  }

  async function enregistrerInfos(payload) {
    const res = await fetch('/api/infos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('save_failed');
    await chargerInfos();
  }

  return {
    abonner, charger, enregistrer, modifier, supprimer, reinitialiser, instantane,
    dateLongue, dateCourte, joursRestants, quand, estPasse, estArchive,
    abonnerPlanning, chargerPlanning, instantanePlanning,
    enregistrerPlanning, supprimerPlanning, deplacerPlanning,
    abonnerInfos, chargerInfos, instantaneInfos, enregistrerInfos
  };
})();
