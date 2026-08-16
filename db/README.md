# Base de données (Supabase)

Schéma de la base Postgres utilisée par le back-office (`admin/` + `api/`). Le site public
reste statique : il ne lit la base que par `api/events/public.js`, `api/planning/public.js`
et `api/infos/public.js`.

## Appliquer les migrations

1. Projet Supabase → **SQL Editor**.
2. Exécuter les fichiers de `migrations/` **dans l'ordre des numéros**, une seule fois chacun.
3. Vérifier dans **Table Editor** que les tables attendues existent.

Tous les scripts sont idempotents (`if not exists`, `create or replace`, `drop trigger if exists`) :
les rejouer ne casse rien. En cas de doute sur ce qui a déjà été appliqué, tout rejouer dans l'ordre
est sans risque.

**Après `006_planning.sql`** : la table `planning_slots` est vide, donc `api/planning/public.js`
renvoie une liste vide et la section « Planning » du site affiche le message d'attente
(« Le planning détaillé sera bientôt publié ici ») tant qu'aucun créneau n'est ajouté depuis
l'admin. Pour éviter que le créneau actuellement en ligne disparaisse le temps que Béatrice le
ressaisisse, insérer le créneau existant juste après avoir joué la migration :

```sql
insert into public.planning_slots (day, time, label, place, note, position) values (
  'Mardi', '17 h 45 — 18 h 45', 'Séance Zenway · tous niveaux',
  'KMCS, 357 chemin des Iscles, Saint-Laurent-du-Var', 'Début des cours le mardi 8 septembre', 1
);
```

**Après `008_infos_pratiques.sql`** : la table `infos_pratiques` est vide, donc
`api/infos/public.js` renvoie `infos: null` et la section « Infos pratiques » du site public
garde le contenu statique écrit dans `index.html` (aucun script ne le remplace tant qu'aucune
ligne n'existe). Pour que l'admin devienne la source de vérité dès la migration jouée, insérer
une ligne reprenant les valeurs actuellement en dur dans `index.html` :

```sql
insert into public.infos_pratiques (address, map_url, parking, phone, email, next_session) values (
  E'KMCS, 357 chemin des Iscles\n06700 Saint-Laurent-du-Var',
  'https://maps.app.goo.gl/YJDeT1Dd7B6R1KkK9',
  'Stationnement gratuit sur place',
  '06 66 05 66 49',
  'contact@zenwaysaintlaurentduvar.fr',
  'Mardi 8 septembre, 17 h 45 – 18 h 45'
);
```

| Fichier | Contenu |
| --- | --- |
| `001_socle.sql` | Extension `pgcrypto`, fonction partagée `set_updated_at()` |
| `002_evenements.sql` | Table `events` (module admin « Événements ») |
| `003_evenements_dates.sql` | Colonnes `starts_at` (date de l'événement) et `archived` sur `events` |
| `004_evenements_bandeau.sql` | Retire `link_url`, renomme `active` en `featured` (mise en avant dans le bandeau, plus condition de publication), ajoute `ends_at` (fin de parution facultative) |
| `005_evenements_image.sql` | Ajoute `image_url` (image facultative, déposée sur Vercel Blob par l'admin) |
| `006_planning.sql` | Table `planning_slots` (module admin « Planning ») |
| `007_planning_ordre.sql` | Fonction `planning_set_order(uuid[])` : réécrit tout l'ordre des créneaux en une seule instruction (atomique) |
| `008_infos_pratiques.sql` | Table `infos_pratiques` (module admin « Infos pratiques »), ligne unique |

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
