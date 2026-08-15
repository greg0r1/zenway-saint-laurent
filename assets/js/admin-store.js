/* ============================================================
   ADMIN-STORE — la source unique des événements pour la console.
   Le tableau de bord et la feuille « Événements » lisent la même
   liste : publier depuis l'une met l'autre à jour sans rechargement,
   et l'API n'est interrogée qu'une fois.
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

  function instantane() {
    const events = etat.events;
    const vedette = events.find((ev) => ev.featured) || null;
    return {
      statut: etat.statut,
      erreur: etat.erreur,
      events,
      vedette,
      courants: events.filter((ev) => !ev.archived),
      archives: events.filter((ev) => ev.archived)
    };
  }

  function diffuser() {
    const snap = instantane();
    abonnes.forEach((fn) => fn(snap));
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

    const data = await res.json();
    // `archived`/`ends_at` peuvent manquer tant que les migrations 003/004
    // ne sont pas jouées : on normalise pour que l'interface ne dépende
    // jamais d'un undefined.
    etat.events = (data.events || []).map((ev) => ({
      ...ev,
      archived: !!ev.archived,
      featured: !!ev.featured,
      starts_at: ev.starts_at || null,
      ends_at: ev.ends_at || null
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

  return {
    abonner, charger, enregistrer, modifier, supprimer, reinitialiser, instantane,
    dateLongue, dateCourte, joursRestants, quand, estPasse
  };
})();
