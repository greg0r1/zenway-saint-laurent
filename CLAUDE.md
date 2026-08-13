# CLAUDE.md — Zenway Saint-Laurent-du-Var

Instructions permanentes pour Claude Code. À lire **avant chaque modification** du projet.

---

## Contexte du projet

Site vitrine statique pour **Zenway Saint-Laurent-du-Var**, section locale du réseau Zenway fondé par Raymond Holle (zenway-rh.fr).

- **Animatrice** : Béatrice Viallon (Béa)
- **Lieu** : KMCS, 357 chemin des Iscles, Saint-Laurent-du-Var (06700)
- **Séance** : mardi 17 h 45 – 18 h 45
- **Contact** : 06 66 05 66 49 · contact@zenwaysaintlaurentduvar.fr
- **Repo GitHub** : github.com/greg0r1/zenway-saint-laurent
- **Hébergement** : Vercel (connecté au repo GitHub, déploiement automatique)
- **Inscriptions** : HelloAsso (lien externe + widget iframe optionnel)

### Le message clé — à ne jamais trahir

Zenway n'est **pas** un enchaînement de quatre cours séparés. C'est **une seule discipline** qui fusionne Tai-chi chuan, Yoga, Pilates et Qi gong dans un seul enchaînement continu, sur une musique relaxante. Ne jamais présenter les quatre pratiques comme des options ou des cours indépendants.

---

## Stack technique

- **HTML / CSS / JS vanilla uniquement** — pas de framework, pas de bundler, pas de npm.
- Un seul fichier `index.html` à la racine (déployable tel quel), le CSS est découpé en fichiers statiques dans `assets/css/`, le JS en fichiers statiques dans `assets/js/`.
- Les assets externes (images, fonts) sont référencés par URL ou placés dans `assets/`.
- Les données configurables (planning, vidéos, HelloAsso) sont dans des fichiers dédiés de `assets/js/`, clairement séparés du code de rendu.
- Aucune dépendance npm côté site public. Aucun build step, aucun bundler pour `index.html` / `assets/`.
- **Pas de fichier `.nojekyll`** — inutile sur Vercel, réservé à GitHub Pages.
- **Exception backend (voir section dédiée ci-dessous)** : un petit backend serverless existe uniquement pour la gestion des événements (stockage + admin). Il vit dans `api/` (+ `package.json` racine pour ses seules dépendances) et ne change rien à la nature statique du reste du site.

---

## Exception backend — gestion des événements

Le reste du site reste 100 % statique (HTML/CSS/JS vanilla, zéro build). Une seule fonctionnalité déroge à la règle « pas de backend / pas de base de données » : la gestion des événements (portes ouvertes, rencontres...), pour permettre à Béatrice de publier un événement sans toucher au code.

### Stack de cette exception

- **Base de données** : Supabase (Postgres), table unique `events`.
- **Fonctions serverless** : Vercel Functions (Node.js) dans `api/`, routage par fichiers.
- **Authentification admin** : Google Sign-In (Google Identity Services, client-side), avec vérification du token côté serveur (`google-auth-library`) et **whitelist d'emails** (`ADMIN_EMAILS`) — seuls les emails listés peuvent accéder à l'admin, peu importe le compte Google utilisé.
- **Session admin** : cookie `httpOnly`/`Secure` signé (HMAC, `crypto` natif Node — pas de dépendance JWT dédiée).
- **`package.json` racine** : existe uniquement pour les dépendances de `api/` (`@supabase/supabase-js`, `google-auth-library`). N'affecte pas le déploiement du site statique (pas de build step, Vercel sert `index.html`/`assets/` tel quel et déploie `api/` comme fonctions).
- **Page admin conçue comme un atelier de feuilles** : `admin/index.html` gère la connexion (partagée) puis monte **toutes** les feuilles sur une seule page, une par module déclaré dans `window.AdminModules`. Pas d'onglets, pas de routeur : la réglette de gauche est un sommaire qui suit la lecture. Trois modules aujourd'hui — « Événements » (CRUD complet), « Planning » et « Infos pratiques » (lecture seule, voir ci-dessous). L'admin est destinée à en accueillir d'autres (voir « Ajouter un module admin »). Cela ne change rien à la portée du backend/BDD, qui reste strictement limité aux événements tant qu'aucune autre décision n'est prise.
- **Les modules en lecture seule ne recopient aucune valeur** : « Planning » lit `assets/js/config-planning.js`, « Infos pratiques » lit la section `#infos` de `index.html` au moment de l'ouverture. Ils affichent donc toujours ce qui est réellement en ligne et ne peuvent pas dériver. Chacun porte un encart qui dit franchement où éditer en attendant que la modification soit branchée.

### Fichiers

```
api/
├── _lib/
│   ├── supabase.js     ← client Supabase (clé service_role, jamais exposée au front)
│   ├── session.js       ← création/vérification du cookie de session admin
│   └── google.js        ← vérification du token Google (audience = GOOGLE_CLIENT_ID)
├── auth/
│   ├── google.js        ← POST : vérifie le token Google, whitelist, pose le cookie
│   ├── me.js             ← GET : session admin active ?
│   └── logout.js         ← POST : efface le cookie
└── events/
    ├── active.js         ← GET public : l'événement actif (ou null) pour le site
    ├── index.js          ← GET (liste, admin) / POST (créer, admin)
    └── [id].js            ← PUT (modifier, admin) / DELETE (admin)

admin/
└── index.html            ← coquille admin : connexion + jeu d'icônes + pile de feuilles

assets/js/
├── config-admin.js        ← identifiant client Google (page /admin uniquement)
├── admin-auth.js           ← connexion Google + session, partagé par tous les modules admin
├── admin-events.js         ← module « Événements » (CRUD), s'enregistre dans window.AdminModules
├── admin-planning.js       ← module « Planning » (lecture seule de config-planning.js)
├── admin-infos.js          ← module « Infos pratiques » (lecture seule de index.html)
└── admin.js                ← coquille : sommaire, montage des feuilles

db/
├── README.md               ← conventions de schéma + procédure d'application
└── migrations/             ← scripts SQL numérotés, append-only, à jouer dans l'ordre
    ├── 001_socle.sql        ← pgcrypto + fonction partagée set_updated_at()
    └── 002_evenements.sql   ← table events (module « Événements »)
```

### Schéma de base de données

Le schéma vit dans `db/migrations/`, en fichiers SQL numérotés joués à la main dans l'éditeur SQL Supabase. Règles : **append-only** (on ne modifie jamais un fichier déjà exécuté en production, on en ajoute un nouveau), scripts idempotents, et pour toute table `id uuid` + `created_at`/`updated_at` + trigger `set_updated_at` + **RLS activée sans policy** (l'API passe par la clé `service_role` qui contourne RLS). Détail et modèle complet dans `db/README.md`.

### Ajouter un module admin

Pour ajouter une nouvelle section à l'admin (autre chose que les événements) :

1. Créer `assets/js/admin-<nom>.js` qui s'enregistre en poussant `{ id, label, icon, summary, mount(container, sheet), unmount() }` dans `window.AdminModules` (voir `admin-events.js` comme modèle). `icon` est l'identifiant d'un symbole du jeu d'icônes de `admin/index.html`, `summary` la phrase qui dit ce que la feuille commande sur le site public. L'objet `sheet` reçu par `mount` expose `sheet.setState({ text, short, live })` — l'état de publication, écrit en toutes lettres sur la feuille et en abrégé dans le sommaire — et `sheet.flash(message)` pour une confirmation discrète.
2. L'inclure dans `admin/index.html`, après `admin-auth.js` et avant `admin.js`.
3. Si le module a besoin de stockage, décider au cas par cas si `api/` et Supabase sont réutilisés (nouvelle table) ou si une autre solution convient — ce n'est plus couvert par la règle « strictement limité aux événements » ci-dessus une fois la décision prise explicitement avec l'utilisateur.
4. Si une nouvelle table est décidée, ajouter un fichier `db/migrations/<NNN>_<module>.sql` en suivant le modèle de `db/README.md` (jamais de modification d'une migration déjà appliquée).

La coquille (`admin.js`) n'a pas besoin d'être modifiée : elle lit `window.AdminModules`, fabrique une feuille et une entrée de sommaire par module, et suit la lecture au défilement.

Toute feuille doit déclarer son état de publication via `sheet.setState` : c'est ce qui distingue cet atelier d'un simple formulaire. Les règles visuelles (feuille de papier à angles vifs, or rare, chapeau typographique interdit, pas de carte dans une carte) sont dans `DESIGN.md`.

### Variables d'environnement (à définir dans Vercel → Settings → Environment Variables)

| Variable | Rôle |
| --- | --- |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service_role Supabase (accès serveur uniquement, jamais exposée au front) |
| `GOOGLE_CLIENT_ID` | Client ID OAuth 2.0 créé dans Google Cloud Console |
| `ADMIN_EMAILS` | Emails autorisés à administrer, séparés par des virgules |
| `SESSION_SECRET` | Secret aléatoire long, sert à signer le cookie de session admin |

Voir `README.md` pour la procédure complète (SQL Supabase, config Google Cloud Console).

### Règles propres à cette exception

- Ne jamais élargir ce backend à autre chose que les événements (pas d'espace membre, pas de gestion des adhésions — HelloAsso reste seul responsable de ça).
- Le site public ne doit jamais appeler Supabase directement : tout passe par `api/events/active.js`, seule route publique, qui ne renvoie que les champs nécessaires à l'affichage.
- La clé `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais apparaître dans un fichier de `assets/` ou dans `index.html`.
- `admin/index.html` n'est pas listé dans la nav publique ni le footer — accès par URL directe uniquement, protégé par la connexion Google + whitelist.

---

## Charte graphique — TOUJOURS respecter

### Couleurs (variables CSS déjà définies dans `assets/css/base.css`)

```css
--green-900: #1b4332 /* Fonds foncés : footer, header scrollé */
  --green-800: #22543e /* Dégradés foncés */ --green-700: #2d6a4f
  /* Titres, boutons, accent principal */ --teal: #2f8f7f
  /* Dégradés, accents */ --teal-bright: #36a18c /* Survols, mises en valeur */
  --mint: #d8f3dc /* Fonds clairs, badges */ --mint-soft: #eef7f0
  /* Fonds de section clairs */ --beige: #f5f1e8 /* Fond Infos pratiques */
  --paper: #faf8f2 /* Fond général */ --gold: #c9a86a
  /* Boutons CTA, accents premium */ --gold-soft: #e7d6ad
  /* Accents secondaires sur fonds foncés */ --ink: #243029
  /* Texte principal */ --ink-soft: #4b5a51 /* Texte secondaire, légendes */;
```

Ne jamais introduire de nouvelle couleur sans l'ajouter en variable CSS et justifier son usage.

### Typographies (Google Fonts, déjà chargées)

| Variable CSS | Police             | Usage                               |
| ------------ | ------------------ | ----------------------------------- |
| `--serif`    | Cormorant Garamond | H1, H2, H3, citations grandes       |
| `--sans`     | DM Sans            | Texte courant, nav, boutons         |
| `--script`   | Caveat             | Accents manuscrits courts, taglines |

Ne jamais utiliser d'autre police. Caveat est réservé aux phrases courtes (max une ligne) — jamais pour des paragraphes.

### Logo

Trois feuilles SVG en dégradé vert/teal. Le mot « zen » en DM Sans gras blanc, « way » en Caveat teal. Ne jamais déformer, recolorer ou modifier les proportions.

---

## Ton éditorial — TOUJOURS respecter

- **Français standard, masculin générique.** Jamais d'écriture inclusive (pas de `·e`, `tou·te·s`, etc.).
- **Vouvoiement**, ton chaleureux, apaisant et accueillant. Jamais directif ni médical.
- Champ lexical : zénitude, harmonie, équilibre, douceur, détente, souffle, sérénité.
- Zenway = **complémentaire** à un suivi médical, jamais substitut.
- Pas de jargon technique ou sportif.
- Sobriété en emojis dans les textes du site (zéro emoji dans le contenu).

---

## Architecture des fichiers

```
zenway-saint-laurent/
├── index.html          ← page unique, auto-suffisante (structure + scripts)
├── assets/
│   ├── css/
│   │   ├── fonts.css        ← @font-face des polices auto-hébergées
│   │   ├── base.css        ← variables, reset, typo, logo, reveal
│   │   ├── nav.css          ← en-tête fixe, liens, burger
│   │   ├── hero.css         ← section d'accueil
│   │   ├── sections.css     ← concept & pratiques, planning, pour qui,
│   │   │                      vidéos, événements, inscriptions, infos, cta
│   │   ├── video.css        ← composant vidéo (teaser + galerie)
│   │   ├── admin.css        ← page /admin (atelier : coquille + tous les modules)
│   │   ├── footer.css       ← pied de page
│   │   └── responsive.css   ← media queries (chargé en dernier)
│   ├── fonts/               ← woff2 Cormorant Garamond / DM Sans / Caveat
│   │                          (sous-ensembles latin + latin-ext, auto-hébergés
│   │                          pour éviter l'appel à fonts.googleapis.com)
│   ├── js/
│   │   ├── config-helloasso.js  ← slugs HelloAsso, injection des liens/widget
│   │   ├── events-banner.js     ← fetch /api/events/active, alimente bandeau + section événements
│   │   ├── config-admin.js      ← identifiant client Google (page /admin uniquement)
│   │   ├── admin-auth.js        ← connexion Google + session, partagé par les modules admin
│   │   ├── admin-events.js      ← module admin « Événements » (CRUD)
│   │   ├── admin-planning.js    ← module admin « Planning » (lecture seule)
│   │   ├── admin-infos.js       ← module admin « Infos pratiques » (lecture seule)
│   │   ├── admin.js             ← coquille admin : sommaire, montage des feuilles
│   │   ├── config-videos.js     ← vidéo teaser hero + galerie YouTube
│   │   ├── config-planning.js   ← créneaux de séance affichés
│   │   └── nav-reveal.js        ← scroll nav, burger menu, animations reveal
│   └── img/
│       ├── logo-zenway.png             ← logo complet (nav, footer)
│       ├── logo-zenway-minimaliste.png ← variante du logo (visuel concept)
│       ├── bea-posture-005.png         ← photo de Béatrice en posture Zenway
│       ├── activite-taichi.jpg         ← photo pratique Tai-chi chuan
│       ├── activite-yoga.jpg           ← photo pratique Yoga
│       ├── activite-pilates.jpg        ← photo pratique Pilates
│       └── activite-qigong.jpg         ← photo pratique Qi gong
├── admin/
│   └── index.html       ← page d'administration des événements (voir « Exception backend »)
├── api/                 ← fonctions serverless Vercel (voir « Exception backend »)
├── db/                  ← migrations SQL Supabase (voir « Exception backend »)
├── package.json         ← dépendances de api/ uniquement (aucun build step pour le site)
├── .gitignore          ← exclut .DS_Store et autres fichiers système
├── PRODUCT.md          ← vérité produit durable (public, usage, contraintes)
├── DESIGN.md           ← système visuel : palette, typo, formes, composants, règles
├── CLAUDE.md           ← ce fichier
└── README.md           ← instructions déploiement et mise à jour
```

### Structure de `index.html`

Les sections dans l'ordre, chacune avec son commentaire `<!-- === NOM === -->` :

1. `<head>` (meta, fonts, `<link rel="stylesheet">` vers `assets/css/`, script Vercel Insights)
2. NAV
3. HERO (vidéo de teasing)
4. CONCEPT & PRATIQUES (section fusionnée — concept Zenway + les 4 cartes pratiques)
5. PLANNING
6. POUR QUI
7. VIDÉOS
8. ÉVÉNEMENTS À VENIR (remplace les anciennes « portes ouvertes » ponctuelles)
9. INSCRIPTION (`#inscription`) — section unique : message clé, 3 étapes condensées, points clés, CTA HelloAsso, et widget/iframe en regard
10. INFOS PRATIQUES
11. CTA BAND
12. FOOTER
13. `<script src="...">` vers `assets/js/` (HelloAsso config, Vidéos config, Planning config, Nav/Reveal)

Une seule section d'inscription (`#inscription`) : les anciennes sections `#inscription` (widget) et `#inscriptions` (étapes + CTA) ont été fusionnées pour éviter la redondance et permettre une inscription rapide, en un seul écran. Le lien de nav et de footer "Inscriptions" a été retiré au profit du seul CTA "S'inscrire" (`#inscription`).

### Fichiers CSS (`assets/css/`)

Le CSS est découpé en fichiers statiques par domaine fonctionnel, chargés via `<link rel="stylesheet">` dans le `<head>`, dans l'ordre où ils apparaissent dans l'arborescence ci-dessus (`responsive.css` toujours chargé en dernier pour surcharger les autres). Pas de préprocesseur, pas de build : du CSS brut, modifiable directement.

Chaque fichier commence par un en-tête commenté :

```css
/* ============================================================
   NOM DU FICHIER — description courte
   ============================================================ */
```

Ne jamais remettre du CSS inline dans `index.html` via une balise `<style>`.

### Fichiers JS (`assets/js/`)

Le JS est découpé en fichiers statiques par domaine fonctionnel, chargés via `<script src="...">` en bas de `index.html`, dans l'ordre listé dans l'arborescence ci-dessus. Pas de build, pas de modules ES — du JS brut, modifiable directement.

Chaque fichier commence par un en-tête commenté :

```js
/* ============================================================
   NOM DU FICHIER — description courte
   ============================================================ */
```

Les fichiers de configuration (`config-*.js`) regroupent les données variables (planning, vidéos, HelloAsso) en haut de fichier, suivies du code de rendu qui les consomme. Ne jamais mélanger la logique de rendu et les données de configuration dans des fichiers séparés — chaque `config-*.js` reste autonome. Ne jamais remettre du JS inline dans `index.html` via une balise `<script>` sans `src`.

---

## Workflow Git + Vercel

### Branches

| Branche         | Rôle                                                                | Vercel                  |
| --------------- | ------------------------------------------------------------------- | ----------------------- |
| `main`          | Production — Vercel déploie automatiquement à chaque push           | URL de production       |
| `develop`       | Développement en cours. Base de travail quotidienne.                | Preview URL automatique |
| `feature/<nom>` | Nouvelle fonctionnalité (ex: `feature/section-temoignages`)         | Preview URL automatique |
| `fix/<nom>`     | Correction de bug (ex: `fix/planning-mobile`)                       | Preview URL automatique |
| `content/<nom>` | Mise à jour de contenu uniquement (ex: `content/ajout-videos-juin`) | Preview URL automatique |

### Règles

- **Ne jamais pousser directement sur `main`** — toujours passer par une PR depuis `develop`.
- Chaque push sur `develop` ou `feature/*` génère automatiquement une **preview URL Vercel** — l'utiliser pour valider visuellement avant de merger sur `main`.
- `develop` → `main` = déploiement en production. Vercel redéploie automatiquement.
- Une branche par tâche. Supprimer la branche après merge.

### Cycle de travail (Claude Code)

À chaque nouvelle tâche demandée par l'utilisateur :

1. Se placer sur `develop` à jour (`git checkout develop && git pull`), puis créer une nouvelle branche dédiée (`feature/<nom>`, `fix/<nom>` ou `content/<nom>`) — jamais travailler directement sur `develop` ou `main`.
2. Une fois la tâche terminée et validée, committer, pousser la branche et ouvrir une **PR vers `develop`** (pas vers `main`).
3. Le merge de la PR est décidé et exécuté par l'utilisateur — Claude Code ne merge pas lui-même.
4. Après merge, remettre `main` et `develop` à jour (local + distant) et supprimer la branche de la tâche (locale + distante).

### Convention de commits (Conventional Commits)

```
<type>(<scope>): <description courte en français>
```

**Types :**

| Type       | Usage                                                  |
| ---------- | ------------------------------------------------------ |
| `feat`     | Nouvelle section ou fonctionnalité                     |
| `fix`      | Correction de bug ou d'affichage                       |
| `content`  | Modification de texte, d'image ou de données de config |
| `style`    | Modification CSS sans impact fonctionnel               |
| `refactor` | Restructuration du code sans changement visible        |
| `chore`    | Maintenance (README, .gitignore, config Vercel, etc.)  |

**Exemples :**

```
feat(planning): ajout de la section planning avec config JS
fix(hero): correction de l'alignement sur mobile iOS
content(videos): ajout des replays portes ouvertes 27 juin
style(nav): harmonisation de la couleur du lien actif
chore(vercel): suppression du fichier .nojekyll inutile sur Vercel
```

- Description en **minuscules**, en français, sans point final.
- Pas de `git commit -m "wip"` ou `"update"` — chaque commit doit être lisible.

---

## Règles de développement

1. **Mobile-first** : toujours tester visuellement sur 375px avant de valider.
2. **Accessibilité minimale** : attributs `alt` sur toutes les images, `aria-label` sur les boutons sans texte, contraste WCAG AA.
3. **Pas d'image en base64** dans le HTML — toujours des fichiers dans `assets/img/`.
4. **Placeholders** : quand une image est manquante, laisser un placeholder commenté `<!-- REMPLACER : description (format attendu) -->` plutôt qu'une image cassée.
5. **Sections commentées** : chaque section commence par `<!-- ============ NOM ============ -->`.
6. **Variables CSS** : toute couleur ou valeur répétée plus de deux fois devient une variable CSS.
7. Valider la structure HTML avant chaque commit : balises ouvertes/fermées, un seul `<h1>`, pas de `<div>` orphelins.

---

## Ce qu'on ne fait PAS dans ce projet

- ❌ Angular, React, Vue ou tout autre framework
- ❌ npm / node_modules / package.json
- ❌ Backend, API maison, base de données — **sauf l'exception documentée dans « Exception backend — gestion des événements »**, strictement limitée à cet usage
- ❌ Espace membre (décision prise — HelloAsso couvre les besoins de gestion)
- ❌ Écriture inclusive
- ❌ Nouvelle couleur hors palette définie
- ❌ Nouvelle police hors les trois définies
- ❌ Commit directement sur `main`
- ❌ Fichier `.nojekyll` (inutile sur Vercel)

### Le message clé — à ne jamais trahir

Zenway n'est **pas** un enchaînement de quatre cours séparés. C'est **une seule discipline** qui fusionne Tai-chi chuan, Yoga, Pilates et Qi gong dans un seul enchaînement continu, sur une musique relaxante. Ne jamais présenter les quatre pratiques comme des options ou des cours indépendants.

