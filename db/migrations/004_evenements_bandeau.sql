-- ============================================================
-- 004 — ÉVÉNEMENTS : plusieurs événements publics, bandeau, fin de
-- parution
-- Jusqu'ici un seul événement pouvait exister sur le site à la fois
-- (`active`). Désormais tout événement non archivé est publié dans la
-- section « Événements » du site ; `active` devient `featured` et ne
-- commande plus que la mise en avant dans le bandeau du haut — un seul
-- événement à la fois, comme avant, mais ce n'est plus la condition
-- pour apparaître sur le site.
-- Le lien d'inscription individuel disparaît : chaque fiche redevient
-- informative, l'inscription passe par le parcours unique du site
-- (#inscription).
-- Ajoute une date de fin de parution facultative : passée cette date,
-- l'événement n'apparaît plus nulle part sur le site, sans qu'il soit
-- besoin de l'archiver.
-- Nécessite 003_evenements_dates.sql. Rejouable sans risque.
-- ============================================================

alter table public.events drop column if exists link_url;

-- `rename column` n'est pas idempotent par nature (la deuxième
-- exécution ne trouverait plus `active`) : on ne le joue que si la
-- colonne existe encore sous son ancien nom.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'events' and column_name = 'active'
  ) then
    alter table public.events rename column active to featured;
  end if;
end $$;

alter table public.events
  add column if not exists ends_at date;

-- Un seul événement mis en avant dans le bandeau à la fois (reprend
-- l'ancien index events_un_seul_actif, sur la colonne renommée).
drop index if exists events_un_seul_actif;
create unique index if not exists events_un_seul_vedette
  on public.events (featured)
  where featured;

-- L'ancien index ne servait qu'à la lecture du seul événement actif ;
-- le site public lit désormais tous les événements non archivés (voir
-- events_publics ci-dessous), il ne sert plus à rien.
drop index if exists events_actif_recent;

-- Ce que le site public lit à chaque chargement : les événements non
-- archivés, filtrés ensuite en mémoire par date de fin.
create index if not exists events_publics
  on public.events (ends_at)
  where not archived;

-- Garde-fou : un événement archivé n'est jamais l'événement mis en
-- avant (reprend events_archive_jamais_active, sur la colonne renommée).
alter table public.events
  drop constraint if exists events_archive_jamais_active;
alter table public.events
  add constraint events_archive_jamais_vedette
  check (not (archived and featured));
