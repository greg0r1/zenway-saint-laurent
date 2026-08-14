-- ============================================================
-- 003 — ÉVÉNEMENTS : date de séance et archivage
-- Ajoute à `events` la date de l'événement et son classement en
-- archive, pour que l'admin puisse séparer « à venir », « en réserve »
-- et « archives » sans que Béatrice ait à supprimer quoi que ce soit.
-- Nécessite 002_evenements.sql. Rejouable sans risque (idempotent).
-- ============================================================

-- Date de l'événement lui-même, distincte de created_at (date de saisie).
-- Nullable : un événement sans date précise reste valide.
alter table public.events
  add column if not exists starts_at date;

-- Rangé par Béatrice, plus proposé dans les listes courantes. Un
-- événement archivé ne peut pas être affiché sur le site (voir l'index
-- ci-dessous), ce qui évite de republier un événement passé par erreur.
alter table public.events
  add column if not exists archived boolean not null default false;

-- Le tri courant de l'admin : les événements à venir d'abord, les sans
-- date en fin de liste.
create index if not exists events_par_date
  on public.events (starts_at desc nulls last);

-- L'admin liste les archives séparément à chaque ouverture de la feuille.
create index if not exists events_archives
  on public.events (archived)
  where archived;

-- Garde-fou : un événement archivé n'est jamais l'événement affiché.
-- L'API remet déjà `active` à false en archivant ; cette contrainte tient
-- même si un autre chemin d'écriture est ajouté un jour.
alter table public.events
  drop constraint if exists events_archive_jamais_active;
alter table public.events
  add constraint events_archive_jamais_active
  check (not (archived and active));
