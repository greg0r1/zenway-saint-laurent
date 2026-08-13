-- ============================================================
-- 002 — ÉVÉNEMENTS (module admin « Événements »)
-- Alimente le bandeau et la section « Événements à venir » du site.
-- Nécessite 001_socle.sql. Rejouable sans risque (idempotent).
-- ============================================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tag text not null default 'Prochain événement',
  link_url text not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Un seul événement affiché sur le site à la fois. L'API bascule déjà
-- l'ancien événement actif avant d'en activer un autre : cet index est le
-- garde-fou côté base si un jour un autre chemin d'écriture est ajouté.
create unique index if not exists events_un_seul_actif
  on public.events (active)
  where active;

-- Le site public lit l'événement actif à chaque chargement : index dédié.
create index if not exists events_actif_recent
  on public.events (created_at desc)
  where active;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- Aucun accès direct depuis le navigateur : tout passe par api/, qui utilise
-- la clé service_role (laquelle contourne RLS). RLS activée sans aucune policy
-- = tout refusé pour les clés anon/authenticated, même si l'une d'elles fuitait.
alter table public.events enable row level security;
