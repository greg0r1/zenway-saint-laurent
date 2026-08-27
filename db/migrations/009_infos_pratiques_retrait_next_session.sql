-- ============================================================
-- 009 — INFOS PRATIQUES : retrait de next_session
-- « Prochain rendez-vous » n'est plus une valeur saisie à la main :
-- le site public la calcule désormais depuis le plus proche événement
-- à venir (voir api/events/public.js et assets/js/events-banner.js),
-- pour ne jamais désynchroniser d'avec la section « Événements ».
-- Nécessite 008_infos_pratiques.sql. Rejouable sans risque (idempotent).
-- ============================================================

alter table public.infos_pratiques drop column if exists next_session;
