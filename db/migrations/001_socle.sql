-- ============================================================
-- 001 — SOCLE COMMUN
-- Conventions partagées par toutes les tables du back-office.
-- Rejouable sans risque (idempotent).
-- ============================================================

-- gen_random_uuid() — fourni par pgcrypto, déjà présent sur Supabase.
create extension if not exists pgcrypto;

-- Tient à jour la colonne updated_at à chaque UPDATE.
-- À rattacher à chaque nouvelle table via un trigger (modèle : 002_evenements.sql).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
