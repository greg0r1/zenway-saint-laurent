/* ============================================================
   CONFIG ÉVÉNEMENTS HELLOASSO — à activer quand un événement existe
   1. Crée l'événement (portes ouvertes, rencontre...) sur HelloAsso.
   2. Récupère le slug de l'asso et de l'événement dans l'URL :
      https://www.helloasso.com/associations/<org>/evenements/<campaign>
   3. Renseigne org + campaign + le contenu ci-dessous, puis passe ready: true.
   Tant que ready reste à false, la section « Événements » garde son état
   statique actuel (aucun événement prévu) — aucun changement visuel.
   ============================================================ */
const HELLOASSO_EVENEMENTS = {
  org: "zenway-st-laurent-du-var", // slug de l'association
  type: "evenements",
  campaign: "",                    // slug de l'événement
  tag: "Prochain événement",
  title: "",                       // titre de l'événement
  description: "",                 // courte description
  ready: false                     // → true quand l'événement est prêt à afficher
};

(function setupEvenements(){
  if (!HELLOASSO_EVENEMENTS.ready) return;

  const base = `https://www.helloasso.com/associations/${HELLOASSO_EVENEMENTS.org}/${HELLOASSO_EVENEMENTS.type}/${HELLOASSO_EVENEMENTS.campaign}`;
  const aside = document.querySelector('.event');
  if (!aside) return;

  aside.innerHTML = `
    <p class="event-tag">${HELLOASSO_EVENEMENTS.tag}</p>
    <h3>${HELLOASSO_EVENEMENTS.title}</h3>
    <p>${HELLOASSO_EVENEMENTS.description}</p>
    <a href="${base}" class="btn btn-line" target="_blank" rel="noopener">S'inscrire à l'événement</a>
  `;
})();
