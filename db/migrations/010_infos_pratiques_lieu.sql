-- ============================================================
-- 010 — INFOS PRATIQUES : nom et lien du lieu d'accueil
-- Ajoute venue_name et venue_url, facultatifs : la phrase « Les
-- séances se déroulent dans les locaux de… » de la section « Infos
-- pratiques » du site public devient modifiable depuis l'admin,
-- plutôt qu'écrite en dur dans index.html. Une valeur vide de l'un
-- ou l'autre laisse le repli statique du HTML affiché (voir
-- assets/js/infos-pratiques.js) : il n'y a rien à afficher tant que
-- l'admin n'a pas renseigné ce lieu partenaire.
-- Nécessite 008_infos_pratiques.sql. Rejouable sans risque (idempotent).
-- ============================================================

alter table public.infos_pratiques
  add column if not exists venue_name text not null default '',
  add column if not exists venue_url text not null default '';
