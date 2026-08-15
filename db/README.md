# Base de données (Supabase)

Schéma de la base Postgres utilisée par le back-office (`admin/` + `api/`). Le site public
reste statique : il ne lit la base que par `api/events/public.js`.

## Appliquer les migrations

1. Projet Supabase → **SQL Editor**.
2. Exécuter les fichiers de `migrations/` **dans l'ordre des numéros**, une seule fois chacun.
3. Vérifier dans **Table Editor** que les tables attendues existent.

Tous les scripts sont idempotents (`if not exists`, `create or replace`, `drop trigger if exists`) :
les rejouer ne casse rien. En cas de doute sur ce qui a déjà été appliqué, tout rejouer dans l'ordre
est sans risque.

| Fichier | Contenu |
| --- | --- |
| `001_socle.sql` | Extension `pgcrypto`, fonction partagée `set_updated_at()` |
| `002_evenements.sql` | Table `events` (module admin « Événements ») |
| `003_evenements_dates.sql` | Colonnes `starts_at` (date de l'événement) et `archived` sur `events` |
| `004_evenements_bandeau.sql` | Retire `link_url`, renomme `active` en `featured` (mise en avant dans le bandeau, plus condition de publication), ajoute `ends_at` (fin de parution facultative) |

## Ajouter une table pour un nouveau module admin

Les migrations sont **append-only** : on ne modifie jamais un fichier déjà exécuté en production,
on en ajoute un nouveau (`003_<module>.sql`, `004_…`). Un fichier = un module ou une évolution.

Modèle à suivre pour toute nouvelle table (voir `002_evenements.sql`) :

```sql
create table if not exists public.<table> (
  id uuid primary key default gen_random_uuid(),
  -- … colonnes métier …
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists <table>_set_updated_at on public.<table>;
create trigger <table>_set_updated_at
  before update on public.<table>
  for each row execute function public.set_updated_at();

alter table public.<table> enable row level security;
```

Checklist :

- **`id uuid`** + `created_at` / `updated_at` sur toute table, sans exception.
- **Trigger `set_updated_at`** rattaché : `updated_at` ne doit jamais dépendre du code applicatif.
- **RLS activée, aucune policy.** L'API passe par la clé `service_role` qui contourne RLS ;
  laisser RLS désactivée exposerait la table à la clé `anon`.
- **Index** sur les colonnes réellement filtrées par l'API, pas « au cas où ».
- Les règles d'ajout d'un module côté front sont dans `CLAUDE.md` → « Ajouter un module admin ».

## Rappels

- La clé `SUPABASE_SERVICE_ROLE_KEY` ne vit que dans les variables d'environnement Vercel,
  jamais dans `assets/` ni dans `index.html`.
- Aucune donnée personnelle d'adhérent ici : les adhésions restent gérées par HelloAsso.
