-- ============================================================
-- 007 — PLANNING : réordonnancement atomique
-- Échanger deux créneaux en deux UPDATE séparés depuis l'admin
-- laissait, si le second échouait, deux créneaux à la même position :
-- l'ordre affiché devenait alors arbitraire. Cette fonction réécrit
-- tout l'ordre en une seule instruction — donc en une seule
-- transaction : soit l'ordre entier est enregistré, soit rien.
-- Nécessite 006_planning.sql. Rejouable sans risque (idempotent).
-- ============================================================

-- `ids` est la liste complète des créneaux dans l'ordre voulu.
-- Les positions sont réattribuées 1..n : tout écart hérité (doublon,
-- trou) est corrigé au passage.
create or replace function public.planning_set_order(ids uuid[])
returns void
language plpgsql
as $$
declare
  attendus integer;
  fournis integer;
begin
  select count(*) into attendus from public.planning_slots;

  select count(distinct u.id) into fournis
  from unnest(ids) as u(id)
  where exists (select 1 from public.planning_slots s where s.id = u.id);

  -- Un ordre partiel laisserait les créneaux absents de la liste sur
  -- leurs anciennes positions, qui entreraient en collision avec les
  -- nouvelles. On refuse plutôt que de produire un ordre incohérent.
  if fournis <> attendus then
    raise exception 'ordre incomplet : % creneaux en base, % fournis', attendus, fournis;
  end if;

  update public.planning_slots s
  set position = o.rang::integer
  from unnest(ids) with ordinality as o(id, rang)
  where s.id = o.id;
end;
$$;
