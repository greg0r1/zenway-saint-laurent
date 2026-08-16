-- ============================================================
-- 006 — PLANNING (module admin « Planning »)
-- Alimente la section « Planning » du site public : les jours et
-- horaires de séance, modifiables depuis l'admin sans toucher au code.
-- Nécessite 001_socle.sql. Rejouable sans risque (idempotent).
-- ============================================================

create table if not exists public.planning_slots (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  time text not null,
  label text not null default '',
  place text not null default '',
  note text not null default '',
  -- Ordre d'affichage choisi dans l'admin (« Monter » / « Descendre »),
  -- distinct de created_at : un créneau ajouté après un autre peut être
  -- affiché avant lui.
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Le site public et l'admin listent toujours par position croissante.
create index if not exists planning_slots_ordre
  on public.planning_slots (position, created_at);

drop trigger if exists planning_slots_set_updated_at on public.planning_slots;
create trigger planning_slots_set_updated_at
  before update on public.planning_slots
  for each row execute function public.set_updated_at();

-- Aucun accès direct depuis le navigateur : tout passe par api/, qui utilise
-- la clé service_role (laquelle contourne RLS). RLS activée sans aucune policy
-- = tout refusé pour les clés anon/authenticated, même si l'une d'elles fuitait.
alter table public.planning_slots enable row level security;
