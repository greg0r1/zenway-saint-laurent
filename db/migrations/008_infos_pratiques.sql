-- ============================================================
-- 008 — INFOS PRATIQUES (module admin « Infos pratiques »)
-- Alimente la section « Infos pratiques » du site public : adresse,
-- parking, téléphone, e-mail et prochain rendez-vous, modifiables
-- depuis l'admin sans toucher au code. Une seule ligne existe dans
-- cette table (voir le seed dans db/README.md) : aucune route
-- api/infos n'en crée d'autre.
-- Nécessite 001_socle.sql. Rejouable sans risque (idempotent).
-- ============================================================

create table if not exists public.infos_pratiques (
  id uuid primary key default gen_random_uuid(),
  address text not null default '',
  map_url text not null default '',
  parking text not null default '',
  phone text not null default '',
  email text not null default '',
  -- Prochain rendez-vous affiché : texte libre, indépendant du
  -- Planning (table planning_slots), à tenir à jour manuellement.
  next_session text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists infos_pratiques_set_updated_at on public.infos_pratiques;
create trigger infos_pratiques_set_updated_at
  before update on public.infos_pratiques
  for each row execute function public.set_updated_at();

-- Aucun accès direct depuis le navigateur : tout passe par api/, qui utilise
-- la clé service_role (laquelle contourne RLS). RLS activée sans aucune policy
-- = tout refusé pour les clés anon/authenticated, même si l'une d'elles fuitait.
alter table public.infos_pratiques enable row level security;
