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
- Les données configurables (vidéos, HelloAsso) sont dans des fichiers dédiés de `assets/js/`, clairement séparés du code de rendu. Le planning, les événements et les infos pratiques sont gérés depuis l'admin, pas dans un fichier (voir « Exception backend » ci-dessous).
- Aucune dépendance npm côté site public. Aucun build step, aucun bundler pour `index.html` / `assets/`.
- **Pas de fichier `.nojekyll`** — inutile sur Vercel, réservé à GitHub Pages.
- **Exception backend (voir section dédiée ci-dessous)** : un petit backend serverless existe uniquement pour la gestion des événements, du planning et des infos pratiques (stockage + admin). Il vit dans `api/` (+ `package.json` racine pour ses seules dépendances) et ne change rien à la nature statique du reste du site.

---

## Exception backend — gestion des événements, du planning et des infos pratiques

Le reste du site reste 100 % statique (HTML/CSS/JS vanilla, zéro build). Trois fonctionnalités dérogent à la règle « pas de backend / pas de base de données » : la gestion des événements (portes ouvertes, rencontres...), celle du planning (jours et horaires de séance) et celle des infos pratiques (adresse, parking, téléphone, e-mail, prochain rendez-vous), pour permettre à Béatrice de les mettre à jour sans toucher au code.

### Stack de cette exception

- **Base de données** : Supabase (Postgres), tables `events` et `planning_slots`.
- **Fonctions serverless** : Vercel Functions (Node.js) dans `api/`, routage par fichiers.
- **Authentification admin** : Google Sign-In (Google Identity Services, client-side), avec vérification du token côté serveur (`google-auth-library`) et **whitelist d'emails** (`ADMIN_EMAILS`) — seuls les emails listés peuvent accéder à l'admin, peu importe le compte Google utilisé.
- **Session admin** : cookie `httpOnly`/`Secure` signé (HMAC, `crypto` natif Node — pas de dépendance JWT dédiée).
- **Images des événements** : facultatives, déposées sur **Vercel Blob** (`@vercel/blob`). L'admin les redimensionne et les compresse côté client (canvas, 1600 px max, JPEG) avant l'envoi à `api/events/image.js` ; seule l'URL publique du fichier est stockée (`events.image_url`), jamais l'image elle-même — la base reste légère et la règle « pas d'image en base64 » plus bas ne concerne que le HTML public, pas ce passage transitoire côté admin.
- **`package.json` racine** : existe uniquement pour les dépendances de `api/` (`@supabase/supabase-js`, `@vercel/blob`, `google-auth-library`). N'affecte pas le déploiement du site statique (pas de build step, Vercel sert `index.html`/`assets/` tel quel et déploie `api/` comme fonctions).
- **Admin conçue comme une console classique** : barre latérale de navigation à gauche, une seule page montée à la fois dans la zone de travail. `admin/index.html` gère la connexion, puis `admin.js` fabrique une entrée de menu et une page par module déclaré dans `window.AdminModules`. La page courante vit dans l'adresse (`#/evenements`), donc le bouton Précédent du navigateur et les liens directs fonctionnent. Quatre pages aujourd'hui — « Tableau de bord », « Événements », « Planning » et « Infos pratiques » — chacune avec un CRUD complet via le panneau latéral (« Infos pratiques » porte une fiche unique : pas de création ni de suppression, un seul formulaire d'édition). L'admin est destinée à en accueillir d'autres (voir « Ajouter un module admin »). Cela ne change rien à la portée du backend/BDD, qui reste strictement limité aux événements, au planning et aux infos pratiques tant qu'aucune autre décision n'est prise.
- **« Infos pratiques » est la source de vérité** : le site public lit ces valeurs via `GET /api/infos` (voir « Fichiers » ci-dessous) ; `index.html` ne conserve le contenu écrit en dur que comme repli tant qu'aucune fiche n'existe en base (voir le seed dans `db/README.md`). Contrairement aux événements et au planning, ce module n'a pas de fichier `public.js` séparé : `GET /api/infos` est public (cette table ne contient aucune donnée « pas encore publiée », donc rien à filtrer selon la session), seul `PUT /api/infos` exige une session admin. C'est aussi une contrainte pratique : le plan Hobby de Vercel limite à 12 fonctions serverless par déploiement, et le projet est déjà à cette limite.
- **Menu burger en mobile** : sous 900 px la barre latérale sort du flux et devient un tiroir, ouvert par le bouton de l'en-tête, refermé par Échap, par le voile, ou par le choix d'une page.
- **Thème clair / sombre** : l'admin porte les deux, réglés par `data-theme` sur `<html>` (`assets/js/admin-theme.js`, chargé en synchrone dans le `<head>` pour éviter l'éclair au chargement). Sans choix explicite, on suit `prefers-color-scheme`. La barre latérale reste vert profond dans les deux cas — c'est l'ancre d'identité. Aucune couleur en dur dans les composants : tout passe par les jetons `--ad-*` définis en tête de `admin.css`.
- **Panneau latéral** : tout ce qui agit (consulter une fiche, modifier, réordonner, mettre en ligne, archiver, supprimer) se passe dans un panneau unique et partagé (`assets/js/admin-panel.js`), bâti sur `<dialog>` natif — piège à focus, Échap et voile de fond viennent du navigateur. Les pages ne portent que de la lecture et des listes. Sur mobile le panneau prend tout l'écran.
- **Magasins partagés** : les événements et les créneaux de planning sont chacun lus une seule fois et diffusés (`assets/js/admin-store.js`, deux magasins distincts dans le même fichier). Le tableau de bord et les pages « Événements » / « Planning » s'y abonnent : publier depuis l'une met les autres à jour sans rechargement.

### Fichiers

```
api/
├── _lib/
│   ├── supabase.js     ← client Supabase (clé service_role, jamais exposée au front)
│   ├── session.js       ← cookie de session admin + `exigerAdmin`, le garde de toutes les routes admin
│   ├── log.js           ← journal des actions admin, des erreurs serveur et des accès refusés
│   ├── google.js        ← vérification du token Google (audience = GOOGLE_CLIENT_ID)
│   ├── events.js        ← limites de longueur des champs, partagées par events/index.js et [id].js
│   ├── planning.js      ← limites de longueur des champs, partagées par planning/index.js et [id].js
│   └── infos.js          ← limites de longueur des champs, utilisées par infos/index.js
├── auth/
│   ├── google.js        ← POST : vérifie le token Google, whitelist, pose le cookie
│   ├── me.js             ← GET : session admin active ?
│   └── logout.js         ← POST : efface le cookie
├── events/
│   ├── public.js         ← GET public : événements publiés (non archivés, non expirés) pour le site
│   ├── index.js          ← GET (liste, admin) / POST (créer, admin)
│   ├── [id].js            ← PUT (modifier, admin) / DELETE (admin)
│   └── image.js           ← POST (admin) : dépose une image sur Vercel Blob, renvoie son URL
├── planning/
│   ├── public.js         ← GET public : créneaux triés par position, pour le site
│   ├── index.js          ← GET (liste, admin) / POST (créer en fin de liste, admin)
│   ├── [id].js            ← PUT (modifier les champs, admin) / DELETE (admin)
│   └── order.js           ← POST (admin) : réécrit tout l'ordre en une écriture atomique
└── infos/
    └── index.js          ← GET (fiche, public) / PUT (modifier, admin) — pas de POST/DELETE, fiche unique ; pas de public.js séparé (voir « Exception backend »)

admin/
└── index.html            ← coquille admin : connexion + jeu d'icônes + charpente de la console

assets/js/
├── config-admin.js         ← identifiant client Google (page /admin uniquement)
├── admin-theme.js          ← thème clair/sombre, chargé en synchrone dans le <head>
├── admin-auth.js           ← connexion Google + session, partagé par tous les modules admin
├── admin-store.js          ← magasins des événements, du planning et des infos pratiques + mise en forme des dates
├── admin-panel.js          ← panneau latéral partagé (<dialog>), utilisé par tous les modules
├── admin-dashboard.js      ← module « Tableau de bord » (lecture des trois magasins)
├── admin-events.js         ← module « Événements » (CRUD via le panneau)
├── admin-planning.js       ← module « Planning » (CRUD via le panneau : ajouter, modifier, réordonner, supprimer)
├── admin-infos.js          ← module « Infos pratiques » (CRUD via le panneau, fiche unique)
└── admin.js                ← coquille : menu latéral, montage des pages, interrupteur de thème

db/
├── README.md               ← conventions de schéma + procédure d'application
└── migrations/             ← scripts SQL numérotés, append-only, à jouer dans l'ordre
    ├── 001_socle.sql             ← pgcrypto + fonction partagée set_updated_at()
    ├── 002_evenements.sql        ← table events (module « Événements »)
    ├── 003_evenements_dates.sql  ← colonnes starts_at (date) et archived sur events
    ├── 004_evenements_bandeau.sql ← retire link_url, renomme active en featured, ajoute ends_at
    ├── 005_evenements_image.sql   ← ajoute image_url (image facultative, Vercel Blob)
    ├── 006_planning.sql           ← table planning_slots (module « Planning »)
    ├── 007_planning_ordre.sql     ← fonction planning_set_order() : réordonnancement atomique
    └── 008_infos_pratiques.sql    ← table infos_pratiques (module « Infos pratiques »), fiche unique
```

### Schéma de base de données

Le schéma vit dans `db/migrations/`, en fichiers SQL numérotés joués à la main dans l'éditeur SQL Supabase. Règles : **append-only** (on ne modifie jamais un fichier déjà exécuté en production, on en ajoute un nouveau), scripts idempotents, et pour toute table `id uuid` + `created_at`/`updated_at` + trigger `set_updated_at` + **RLS activée sans policy** (l'API passe par la clé `service_role` qui contourne RLS). Détail et modèle complet dans `db/README.md`.

### Ajouter un module admin

Pour ajouter une nouvelle section à l'admin (autre chose que les événements et le planning) :

1. Créer `assets/js/admin-<nom>.js` qui s'enregistre en poussant `{ id, label, icon, title, mount(container, page), unmount() }` dans `window.AdminModules` (voir `admin-events.js` comme modèle). `id` sert d'identifiant et de fragment d'URL (`#/<id>`), `icon` est l'identifiant d'un symbole du jeu d'icônes de `admin/index.html`, `title` le titre affiché en haut de la zone de travail (défaut : `label`). L'objet `page` reçu par `mount` expose :
   - `page.setActions([{ label, icone, style, onClick }])` — les boutons d'action en haut à droite, l'action principale en `ad-btn-primary` ;
   - `page.setBadge(texte)` — la pastille du menu, un compte seulement (`null` pour l'effacer) ;
   - `page.flash(message)` — une confirmation discrète, qui s'efface ;
   - `page.go(id)` — aller à une autre page.
2. L'inclure dans `admin/index.html`, après `admin-auth.js` et avant `admin.js`. L'ordre des `<script>` fixe l'ordre du menu.
3. Si le module a besoin de stockage, décider au cas par cas si `api/` et Supabase sont réutilisés (nouvelle table) ou si une autre solution convient — ce n'est plus couvert par la règle « strictement limité aux événements et au planning » ci-dessus une fois la décision prise explicitement avec l'utilisateur.
4. Si une nouvelle table est décidée, ajouter un fichier `db/migrations/<NNN>_<module>.sql` en suivant le modèle de `db/README.md` (jamais de modification d'une migration déjà appliquée).

La coquille (`admin.js`) n'a pas besoin d'être modifiée : elle lit `window.AdminModules`, fabrique une entrée de menu par module, et monte une seule page à la fois selon l'adresse. `unmount()` doit libérer ce que `mount()` a pris (abonnements au magasin, écouteurs globaux) : contrairement à l'ancienne page unique, les modules sont réellement démontés à chaque changement de page.

Chaque page dit en toutes lettres ce qu'elle commande sur le site public, et ce qui est en ligne à l'instant — c'est ce qui distingue cette console d'un simple formulaire. Les règles visuelles sont dans `DESIGN.md`.

### Variables d'environnement (à définir dans Vercel → Settings → Environment Variables)

| Variable                    | Rôle                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `SUPABASE_URL`              | URL du projet Supabase                                                                                                                         |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service_role Supabase (accès serveur uniquement, jamais exposée au front)                                                                  |
| `GOOGLE_CLIENT_ID`          | Client ID OAuth 2.0 créé dans Google Cloud Console                                                                                             |
| `ADMIN_EMAILS`              | Emails autorisés à administrer, séparés par des virgules                                                                                       |
| `SESSION_SECRET`            | Secret aléatoire, sert à signer le cookie de session admin. **32 caractères minimum**, refusé en dessous (`openssl rand -base64 48`)           |
| `BLOB_READ_WRITE_TOKEN`     | Jeton d'accès au store Vercel Blob — injecté automatiquement quand le store est connecté au projet (Vercel → Storage), rien à saisir à la main |

Voir `README.md` pour la procédure complète (SQL Supabase, config Google Cloud Console).

### Règles propres à cette exception

- Ne jamais élargir ce backend à autre chose que les événements, le planning et les infos pratiques (pas d'espace membre, pas de gestion des adhésions — HelloAsso reste seul responsable de ça).
- Le site public ne doit jamais appeler Supabase directement : tout passe par `api/events/public.js`, `api/planning/public.js` ou `GET /api/infos` (voir ci-dessus pourquoi les infos pratiques n'ont pas de fichier `public.js` séparé), seules routes publiques, qui ne renvoient que les champs nécessaires à l'affichage.
- La clé `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais apparaître dans un fichier de `assets/` ou dans `index.html`.
- `admin/index.html` n'est pas listé dans la nav publique ni le footer — accès par URL directe uniquement, protégé par la connexion Google + whitelist.
- Le dépôt d'image (`api/events/image.js`) est admin uniquement ; le site public ne fait jamais que lire l'URL déjà stockée (`image_url`), jamais de dépôt côté public.
- Toute route admin commence par `const email = exigerAdmin(req, res); if (!email) return;` — jamais un simple `getSessionEmail`, qui ne dit que « le cookie est signé », pas « cet e-mail est toujours dans `ADMIN_EMAILS` ». Une seule réserve, délibérée : `api/auth/logout.js`, qui garde `getSessionEmail`. La déconnexion ne lit ni n'écrit aucune donnée, et doit aboutir même pour un e-mail retiré de la whitelist entre-temps — `exigerAdmin` le refuserait par un 401 sans effacer le cookie, laissant l'utilisateur avec une session qu'il ne peut plus fermer.
- Toute écriture réussie appelle `logAudit`, toute erreur serveur `logErreur` (`api/_lib/log.js`). Une fonction serverless n'a pas d'autre mémoire que sa sortie standard : un `catch` muet côté API efface la seule trace disponible. Ce qui est journalisé ne revient jamais au client, dont les erreurs restent génériques (`server_error`). Le journal ne reprend jamais une valeur reçue d'une route publique, ni le message d'une exception de bibliothèque tierce (celles de `google-auth-library` recopient le jeton entier ou la charge utile décodée) : seulement son type.
- Tout champ saisi à la main qui devient une URL sur le site public — aujourd'hui le seul `map_url` des infos pratiques — est validé côté serveur **et** côté client (schéma https, et hôte attendu quand il y en a un). `image_url` n'est jamais saisi : l'admin reprend telle quelle l'URL renvoyée par `/api/events/image`, la validation serveur y suffit donc seule.
- Deux limites assumées du dépôt d'image, sues et acceptées plutôt que découvertes :
  - le contrôle par signature de fichier (`signatureInvalide`, `api/_lib/events.js`) rejette un contenu étranger — un SVG étiqueté `image/jpeg` est refusé — mais laisse passer un fichier polyglotte dont les premiers octets forment une vraie signature JPEG. Le risque reste borné : le fichier est servi depuis une origine distincte du site, avec le `contentType` que nous imposons ;
  - `imageUrlInvalide` contraint l'hôte à `*.public.blob.vercel-storage.com`, ce qui autorise le store Blob de n'importe quel client Vercel, pas seulement le nôtre. L'exploiter suppose une session admin déjà compromise. Le resserrement sur l'hôte exact du store demanderait une variable d'environnement supplémentaire et reste à faire.

---

## Charte graphique — TOUJOURS respecter

### Couleurs (variables CSS déjà définies dans `assets/css/base.css`)

```css
--green-900: #1b4332 /* Fonds foncés : footer, header scrollé */ --green-800: #22543e
  /* Dégradés foncés */ --green-700: #2d6a4f /* Titres, boutons, accent principal */ --teal: #2f8f7f
  /* Dégradés, accents */ --teal-bright: #36a18c /* Survols, mises en valeur */ --mint: #d8f3dc
  /* Fonds clairs, badges */ --mint-soft: #eef7f0 /* Fonds de section clairs */ --beige: #f5f1e8
  /* Fond Infos pratiques */ --paper: #faf8f2 /* Fond général */ --gold: #c9a86a
  /* Boutons CTA, accents premium */ --gold-soft: #e7d6ad /* Accents secondaires sur fonds foncés */
  --ink: #243029 /* Texte principal */ --ink-soft: #4b5a51 /* Texte secondaire, légendes */;
```

Ne jamais introduire de nouvelle couleur sans l'ajouter en variable CSS et justifier son usage.

### Typographies (auto-hébergées, woff2 dans `assets/fonts/`)

| Variable CSS | Police             | Usage                         |
| ------------ | ------------------ | ----------------------------- |
| `--serif`    | Cormorant Garamond | H1, H2, H3, citations grandes |
| `--sans`     | DM Sans            | Texte courant, nav, boutons   |

Deux polices, pas une de plus. Une troisième, Caveat, a longtemps été déclarée sans jamais habiller le moindre texte : elle a été retirée. Ne pas la réintroduire sans un usage réel et décidé.

### Logo

Trois feuilles SVG en dégradé vert/teal. Le mot « zen » en DM Sans gras blanc, « way » en lettrage manuscrit teal. Le logo est une image (`assets/img/logo/logo-zenway.png` et sa variante webp) : son lettrage est dessiné, pas composé par une police du site. Ne jamais déformer, recolorer ou modifier les proportions.

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
│   │   ├── discipline-modal.css ← fiches des quatre disciplines (modale)
│   │   ├── admin.css        ← page /admin (console : coquille + tous les modules)
│   │   ├── footer.css       ← pied de page
│   │   └── responsive.css   ← media queries (chargé en dernier)
│   ├── fonts/               ← woff2 Cormorant Garamond / DM Sans
│   │                          (sous-ensembles latin + latin-ext, auto-hébergés
│   │                          pour éviter l'appel à fonts.googleapis.com)
│   ├── js/
│   │   ├── config-helloasso.js  ← slugs HelloAsso, injection des liens/widget
│   │   ├── config-videos.js     ← vidéo teaser hero + galerie YouTube
│   │   ├── planning-schedule.js ← fetch /api/planning/public, alimente la section « Planning »
│   │   ├── events-banner.js     ← fetch /api/events/public, alimente la section événements + le bandeau
│   │   ├── nav-reveal.js        ← scroll nav, burger menu, animations reveal
│   │   ├── hero-bath.js         ← animation du bain du hero
│   │   ├── parallax.js          ← défilement parallaxe des visuels
│   │   ├── practice-modals.js   ← ouverture des fiches disciplines
│   │   ├── config-admin.js      ← identifiant client Google (page /admin uniquement)
│   │   ├── admin-theme.js       ← thème clair/sombre de l'admin (chargé dans le <head>)
│   │   ├── admin-auth.js        ← connexion Google + session, partagé par les modules admin
│   │   ├── admin-store.js       ← magasins des événements, du planning et des infos pratiques + mise en forme des dates
│   │   ├── admin-panel.js       ← panneau latéral partagé de l'admin (<dialog>)
│   │   ├── admin-dashboard.js   ← module admin « Tableau de bord »
│   │   ├── admin-events.js      ← module admin « Événements » (CRUD)
│   │   ├── admin-planning.js    ← module admin « Planning » (CRUD)
│   │   ├── admin-infos.js       ← module admin « Infos pratiques » (CRUD, fiche unique)
│   │   └── admin.js             ← coquille admin : menu, montage des pages, thème
│   └── img/                 ← chaque photo existe en .jpg (ou .png) + .webp,
│       │                      servies via <picture> ; les favicons et l'og-image
│       │                      n'ont pas de variante webp
│       ├── logo/            ← logo-zenway (nav, footer)
│       ├── bea/             ← photos de Béatrice
│       ├── activites/       ← les quatre pratiques (cartes de la page d'accueil)
│       ├── disciplines/     ← fiches disciplines : *-origines et *-aujourdhui
│       ├── hero/            ← visuel de la section d'accueil
│       ├── video/           ← affiche de la vidéo teaser
│       ├── favicons/        ← déclinaisons d'icône (16 → 512 px)
│       └── meta/            ← og-image du partage social
├── admin/
│   └── index.html       ← page d'administration des événements (voir « Exception backend »)
├── api/                 ← fonctions serverless Vercel (voir « Exception backend »)
├── db/                  ← migrations SQL Supabase (voir « Exception backend »)
├── package.json         ← dépendances de api/ uniquement (aucun build step pour le site)
├── package-lock.json    ← versions figées de ces dépendances, commitées : c'est lui qui gouverne l'installation
├── vercel.json          ← en-têtes HTTP : cache, sécurité, CSP
├── .github/workflows/   ← indexnow.yml : signale les mises à jour aux moteurs
├── robots.txt           ← règles d'exploration
├── sitemap.xml          ← plan du site
├── llms.txt             ← résumé du site pour les agents conversationnels
├── site.webmanifest     ← manifeste (nom, icônes, couleurs)
├── favicon.ico          ← icône de repli
├── 4fdd1f90…​.txt         ← clé de vérification IndexNow (ne pas renommer)
├── .gitignore          ← exclut .DS_Store, .vercel, .impeccable, .env.local
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
9. INSCRIPTION (`#inscription`) — section unique, une seule colonne centrée : message clé, 3 étapes condensées, points clés, CTA HelloAsso et widget/iframe
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
- ❌ Backend, API maison, base de données — **sauf l'exception documentée dans « Exception backend — gestion des événements, du planning et des infos pratiques »**, strictement limitée à cet usage
- ❌ Espace membre (décision prise — HelloAsso couvre les besoins de gestion)
- ❌ Écriture inclusive
- ❌ Nouvelle couleur hors palette définie
- ❌ Nouvelle police hors les trois définies
- ❌ Commit directement sur `main`
- ❌ Fichier `.nojekyll` (inutile sur Vercel)

### Le message clé — à ne jamais trahir

Zenway n'est **pas** un enchaînement de quatre cours séparés. C'est **une seule discipline** qui fusionne Tai-chi chuan, Yoga, Pilates et Qi gong dans un seul enchaînement continu, sur une musique relaxante. Ne jamais présenter les quatre pratiques comme des options ou des cours indépendants.
