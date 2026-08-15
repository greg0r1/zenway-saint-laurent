-- ============================================================
-- 005 — ÉVÉNEMENTS : image facultative
-- Chaque événement peut désormais porter une image (déposée sur
-- Vercel Blob par l'admin, redimensionnée côté client avant l'envoi).
-- On ne stocke que l'URL publique du fichier, jamais le fichier
-- lui-même : la base reste légère.
-- Nécessite 002_evenements.sql. Rejouable sans risque.
-- ============================================================

alter table public.events
  add column if not exists image_url text;
