<div align="center">

# Zenway Saint-Laurent-du-Var

**Site vitrine de la section locale Zenway de Saint-Laurent-du-Var.**
HTML, CSS et JavaScript natifs — aucun framework, aucun bundler, aucune étape de build.

[![Qualité](https://img.shields.io/github/actions/workflow/status/greg0r1/zenway-saint-laurent/qualite.yml?branch=main&style=flat-square&label=qualité&color=2d6a4f)](https://github.com/greg0r1/zenway-saint-laurent/actions/workflows/qualite.yml)
[![Site en ligne](https://img.shields.io/website?url=https%3A%2F%2Fwww.zenwaysaintlaurentduvar.fr&up_message=en%20ligne&down_message=hors%20ligne&label=site&style=flat-square&color=2d6a4f)](https://www.zenwaysaintlaurentduvar.fr)
[![Déployé sur Vercel](https://img.shields.io/badge/déployé_sur-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Base de données Supabase](https://img.shields.io/badge/base_de_données-Supabase-3ecf8e?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)

[![HTML5](https://img.shields.io/badge/HTML5-natif-e34f26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-natif-1572b6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-f7df1e?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Sans build](https://img.shields.io/badge/build-aucun-2f8f7f?style=flat-square)](#-stack-technique)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A520-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)

[![Code style : Prettier](https://img.shields.io/badge/code_style-Prettier-f7b93e?style=flat-square&logo=prettier&logoColor=black)](https://prettier.io)
[![Linté avec ESLint](https://img.shields.io/badge/linté_avec-ESLint-4b32c3?style=flat-square&logo=eslint&logoColor=white)](https://eslint.org)
[![Commits : Conventional Commits](https://img.shields.io/badge/commits-Conventional_Commits-c9a86a?style=flat-square)](https://www.conventionalcommits.org/)
[![Licence propriétaire](https://img.shields.io/badge/licence-propriétaire-1b4332?style=flat-square)](#-licence)

[Voir le site](https://www.zenwaysaintlaurentduvar.fr) · [Charte visuelle](./DESIGN.md) · [Vérité produit](./PRODUCT.md) · [Conventions de développement](./CLAUDE.md)

</div>

---

## Sommaire

- [Le message clé](#-le-message-clé)
- [Stack technique](#-stack-technique)
- [Structure du projet](#-structure-du-projet)
- [Démarrage local](#-démarrage-local)
- [Qualité de code](#-qualité-de-code)
- [Workflow Git](#-workflow-git)
- [Éditer le contenu](#-éditer-le-contenu)
- [Back-office `/admin`](#-back-office-admin)
- [Backend et base de données](#-backend-et-base-de-données)
- [Configuration et variables d'environnement](#-configuration-et-variables-denvironnement)
- [Déploiement](#-déploiement)
- [Sécurité](#-sécurité)
- [Accessibilité et référencement](#-accessibilité-et-référencement)
- [Charte graphique](#-charte-graphique)
- [Validation avant commit](#-validation-avant-commit)
- [Contacts](#-contacts)
- [Licence](#-licence)

---

## 🌿 Le message clé

> Zenway n'est **pas** un enchaînement de quatre cours séparés. C'est **une seule discipline** qui
> fusionne Tai-chi chuan, Yoga, Pilates et Qi gong dans un seul enchaînement continu, sur une musique
> relaxante.

Ne jamais présenter les quatre pratiques comme des options ou des cours indépendants — ni dans le
site, ni dans un commit, ni dans une communication. C'est la règle éditoriale la plus importante du
projet.

---

## 🧱 Stack technique

| Domaine              | Choix                                                                       |
| -------------------- | --------------------------------------------------------------------------- |
| Site public          | HTML / CSS / JavaScript natifs, `index.html` unique à la racine             |
| Feuilles de style    | CSS brut découpé par domaine dans `assets/css/`, aucun préprocesseur        |
| Scripts              | JS brut découpé par domaine dans `assets/js/`, chargés en `<script src>`    |
| Polices              | Cormorant Garamond et DM Sans auto-hébergées (`assets/fonts/`, woff2)       |
| Hébergement          | [Vercel](https://vercel.com), déploiement automatique depuis GitHub         |
| Back-office          | `admin/` — console privée, connexion Google restreinte à une liste d'emails |
| API                  | Fonctions serverless Vercel (Node.js, CommonJS) dans `api/`                 |
| Base de données      | [Supabase](https://supabase.com) (Postgres), migrations SQL dans `db/`      |
| Images d'événements  | [Vercel Blob](https://vercel.com/docs/vercel-blob), URL publique en base    |
| Inscriptions         | [HelloAsso](https://www.helloasso.com) (lien externe + widget iframe)       |
| Outillage de qualité | Prettier et ESLint (développement uniquement)                               |

**Aucune étape de build.** Vercel sert `index.html` et `assets/` tels quels, et déploie `api/` comme
fonctions. Le `package.json` à la racine n'existe que pour les dépendances de `api/` et l'outillage
de développement : il n'introduit ni bundler, ni transpilation, ni framework.

Le site public reste entièrement statique. Trois fonctionnalités seulement passent par le backend —
les **événements**, le **planning** et les **infos pratiques** — pour que Béatrice puisse les mettre
à jour sans toucher au code. Cette exception est délimitée et documentée dans
[`CLAUDE.md`](./CLAUDE.md) ; elle ne doit pas être élargie.

---

## 📁 Structure du projet

```
zenway-saint-laurent/
├── index.html                  ← page unique du site public
├── admin/
│   └── index.html              ← coquille du back-office (connexion + console)
├── assets/
│   ├── css/
│   │   ├── fonts.css           ← @font-face des polices auto-hébergées
│   │   ├── base.css            ← variables, reset, typographie, logo, reveal
│   │   ├── nav.css             ← en-tête fixe, liens, burger
│   │   ├── hero.css            ← section d'accueil
│   │   ├── sections.css        ← concept, planning, pour qui, vidéos, événements…
│   │   ├── video.css           ← composant vidéo (teaser + galerie)
│   │   ├── discipline-modal.css← fiches des quatre disciplines (modale)
│   │   ├── admin.css           ← back-office (coquille + tous les modules)
│   │   ├── footer.css          ← pied de page
│   │   └── responsive.css      ← media queries, chargé en dernier
│   ├── fonts/                  ← woff2 Cormorant Garamond et DM Sans
│   ├── img/                    ← chaque visuel en .jpg/.png + .webp, servis en <picture>
│   │   ├── logo/  bea/  activites/  disciplines/  hero/  video/  favicons/  meta/
│   └── js/
│       ├── config-helloasso.js ← slugs HelloAsso, injection des liens et du widget
│       ├── config-videos.js    ← vidéo teaser du hero + galerie YouTube
│       ├── planning-schedule.js← alimente la section « Planning » depuis l'API
│       ├── events-banner.js    ← alimente la section « Événements » et le bandeau
│       ├── infos-pratiques.js  ← alimente la section « Infos pratiques » depuis l'API
│       ├── hero-bath.js        ← animation du bain du hero
│       ├── parallax.js         ← défilement parallaxe des visuels
│       ├── practice-modals.js  ← ouverture des fiches disciplines
│       ├── nav-reveal.js       ← scroll de la nav, burger, animations reveal
│       ├── config-admin.js     ← identifiant client Google (page /admin uniquement)
│       ├── admin-theme.js      ← thème clair/sombre, chargé dans le <head>
│       ├── admin-auth.js       ← connexion Google et session admin
│       ├── admin-store.js      ← magasins partagés (événements, planning, infos)
│       ├── admin-panel.js      ← panneau latéral partagé (<dialog>)
│       ├── admin-dashboard.js  ← module « Tableau de bord »
│       ├── admin-events.js     ← module « Événements »
│       ├── admin-planning.js   ← module « Planning »
│       ├── admin-infos.js      ← module « Infos pratiques »
│       └── admin.js            ← coquille : menu, montage des pages, thème
├── api/                        ← fonctions serverless (voir « Backend et base de données »)
│   ├── _lib/                   ← code partagé, jamais exposé comme route
│   ├── auth/                   ← google.js · me.js · logout.js
│   ├── events/                 ← public.js · index.js · [id].js · image.js
│   ├── planning/               ← public.js · index.js · [id].js · order.js
│   └── infos/                  ← index.js (GET public, PUT admin)
├── db/
│   ├── README.md               ← conventions de schéma et procédure d'application
│   └── migrations/             ← scripts SQL numérotés, append-only
├── .github/workflows/
│   └── indexnow.yml            ← signale les mises à jour aux moteurs de recherche
├── vercel.json                 ← en-têtes HTTP : cache, sécurité, CSP
├── package.json                ← dépendances de api/ et outillage de développement
├── eslint.config.mjs           ← configuration ESLint
├── .prettierrc.json            ← configuration Prettier
├── robots.txt · sitemap.xml · llms.txt · site.webmanifest · favicon.ico
├── PRODUCT.md                  ← vérité produit durable (public, usage, contraintes)
├── DESIGN.md                   ← système visuel : palette, typo, formes, composants
├── CLAUDE.md                   ← conventions de développement, à lire avant toute modification
└── README.md                   ← ce fichier
```

---

## 🚀 Démarrage local

### Prérequis

- **Git**
- **Python 3** — suffit pour travailler sur le site public seul
- **Node.js ≥ 20** et la [CLI Vercel](https://vercel.com/docs/cli) — nécessaires pour l'API et le
  back-office

### Installation

```bash
git clone https://github.com/greg0r1/zenway-saint-laurent.git
cd zenway-saint-laurent
git checkout develop
```

### Cas 1 — travailler sur le site public seul

Aucune dépendance à installer :

```bash
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>. Les sections « Planning », « Événements » et « Infos pratiques »
resteront sur leur contenu de repli, faute d'API en local — c'est normal et sans conséquence pour du
travail de mise en page.

### Cas 2 — travailler sur l'API ou le back-office

```bash
npm install                 # dépendances de api/ + outillage
vercel link                 # une seule fois, relie le dossier au projet Vercel
vercel env pull .env.local  # récupère les variables d'environnement
vercel dev                  # sert le site, l'API et /admin sur http://localhost:3000
```

`vercel dev` sert en HTTP : le cookie de session admin y perd son drapeau `Secure` et son préfixe
`__Host-`, automatiquement, sans configuration (voir `api/_lib/session.js`).

> **Attention** : `vercel env pull` ne récupère pas les variables marquées « Sensitive » dans Vercel
> (`SESSION_SECRET`, `ADMIN_EMAILS`) — elles sont volontairement illisibles après enregistrement.
> Renseignez-les à la main dans `.env.local` pour travailler en local. Ce fichier est ignoré par Git.

---

## 🧹 Qualité de code

La mise en forme et les vérifications statiques sont outillées : aucun débat de style en revue, et
les fautes d'inattention (variable inutilisée, symbole non défini, `==` fautif) sont attrapées avant
le commit.

| Commande               | Effet                                                     |
| ---------------------- | --------------------------------------------------------- |
| `npm run format`       | Met en forme tout le dépôt avec Prettier                  |
| `npm run format:check` | Vérifie la mise en forme sans rien modifier               |
| `npm run lint`         | Analyse le JavaScript avec ESLint                         |
| `npm run lint:fix`     | Corrige automatiquement ce qui peut l'être                |
| `npm run verifier`     | `format:check` puis `lint` — à lancer avant chaque commit |

- **Prettier** (`.prettierrc.json`) couvre HTML, CSS, JS, JSON et Markdown. Les binaires, le
  lockfile et les fichiers dont la mise en forme ne nous appartient pas sont exclus par
  `.prettierignore`.
- **ESLint** (`eslint.config.mjs`) distingue deux mondes : les fonctions serverless de `api/`
  (Node, CommonJS) et les scripts de `assets/js/` (navigateur, portée globale partagée, sans
  modules). Les symboles échangés entre fichiers du site sont déclarés dans la configuration.

Ces outils sont des dépendances de développement : ils ne changent rien à ce qui est servi en
production, et le site reste sans étape de build.

---

## 🔄 Workflow Git

### Branches

| Branche         | Rôle                                                | Vercel         |
| --------------- | --------------------------------------------------- | -------------- |
| `main`          | Production — déploiement automatique à chaque push  | URL production |
| `develop`       | Développement en cours, base de travail quotidienne | Preview URL    |
| `feature/<nom>` | Nouvelle fonctionnalité                             | Preview URL    |
| `fix/<nom>`     | Correction de bug ou d'affichage                    | Preview URL    |
| `content/<nom>` | Mise à jour de contenu uniquement                   | Preview URL    |

**Règles :** jamais de commit direct sur `main` ; une branche par tâche, supprimée après le merge ;
toute PR est ouverte vers `develop`, jamais vers `main`. Le passage en production se fait par une PR
`develop` → `main`.

### Cycle de développement

```bash
git checkout develop && git pull origin develop
git checkout -b feature/ma-fonctionnalite
# … développement …
npm run verifier
git commit -m "feat(section): description en français"
git push -u origin feature/ma-fonctionnalite
```

Chaque push génère une **preview Vercel** : c'est là qu'on valide visuellement avant de merger.

### Convention de commits

Format [Conventional Commits](https://www.conventionalcommits.org/), en français, description en
minuscules, sans point final :

```
<type>(<scope>): <description courte>
```

| Type       | Usage                                                     |
| ---------- | --------------------------------------------------------- |
| `feat`     | Nouvelle section ou fonctionnalité                        |
| `fix`      | Correction de bug ou d'affichage                          |
| `content`  | Modification de texte, d'image ou de données de config    |
| `style`    | Modification CSS ou mise en forme, sans effet fonctionnel |
| `refactor` | Restructuration sans changement visible                   |
| `chore`    | Maintenance (README, config, dépendances)                 |

```
feat(planning): ajout de la section planning avec config JS
fix(hero): correction de l'alignement sur mobile iOS
content(videos): ajout des replays portes ouvertes 27 juin
chore(vercel): suppression du fichier .nojekyll inutile sur Vercel
```

---

## ✏️ Éditer le contenu

Le contenu se répartit en deux familles : ce qui vit dans le code, et ce que Béatrice modifie
elle-même depuis le back-office.

### Depuis le code

**Vidéos** — `assets/js/config-videos.js` :

```js
const CONFIG_VIDEOS = {
  teaser: {
    youtubeId: "XXXXXXXXXXX", // identifiant de la vidéo teaser du hero
    duration: "1:30"
  },
  gallery: [{ youtubeId: "XXXXXXXXXXX", title: "Titre de la vidéo" }]
};
```

**HelloAsso** — `assets/js/config-helloasso.js` :

```js
const CONFIG_HELLOASSO = {
  adhesions: {
    ready: true,
    campaign: "zenway-st-laurent-du-var",
    form: "adhesions",
    slug: "zenway-st-laurent-du-var"
  },
  evenements: {
    ready: false, // à passer à true quand des événements HelloAsso existent
    campaign: "zenway-st-laurent-du-var",
    form: "evenements",
    slug: "zenway-st-laurent-du-var"
  }
};
```

**Textes, images, sections** — directement dans `index.html` et `assets/css/`, en respectant le ton
éditorial décrit dans [`CLAUDE.md`](./CLAUDE.md) : vouvoiement, français standard, masculin
générique, jamais d'écriture inclusive, jamais d'emoji dans le contenu du site.

### Depuis le back-office

Les **événements**, le **planning** et les **infos pratiques** ne sont plus dans le code : ils se
modifient sur `/admin` et sont servis au site par l'API. Voir la section suivante.

---

## 🗂️ Back-office `/admin`

Console privée, accessible par URL directe uniquement — elle n'apparaît ni dans la navigation, ni
dans le pied de page, ni dans le sitemap, et les moteurs ont consigne de ne pas l'indexer.

**Accès :** `https://www.zenwaysaintlaurentduvar.fr/admin/`, connexion avec un compte Google dont
l'adresse figure dans `ADMIN_EMAILS`. Tout autre compte Google, même valide, est refusé.

**Modules :**

| Page            | Ce qu'elle commande sur le site public                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Tableau de bord | Vue d'ensemble de ce qui est en ligne à l'instant                                                                                      |
| Événements      | Section « Événements à venir » et bandeau haut de page — créer, modifier, mettre en avant, archiver, supprimer, avec image facultative |
| Planning        | Section « Planning » — créer, modifier, réordonner, supprimer les créneaux                                                             |
| Infos pratiques | Section « Infos pratiques » — fiche unique : adresse, lien plan, parking, téléphone, e-mail, prochain rendez-vous                      |

**Ergonomie :** barre latérale de navigation, une page montée à la fois, page courante dans l'adresse
(`#/evenements`) — le bouton Précédent et les liens directs fonctionnent. Toutes les actions passent
par un panneau latéral partagé, bâti sur `<dialog>` natif. Thème clair et sombre, menu burger sous
900 px.

Un événement non archivé, dont la date de fin de parution n'est pas dépassée, apparaît
automatiquement dans « Événements à venir ». Un seul peut en plus être marqué « Mettre en avant dans
le bandeau », qui l'affiche tout en haut du site.

Pour ajouter un module, suivre la procédure « Ajouter un module admin » de [`CLAUDE.md`](./CLAUDE.md).

---

## 🛠️ Backend et base de données

### Routes de l'API

Douze fonctions serverless — c'est exactement la limite du plan Hobby de Vercel. Toute nouvelle route
demande donc d'en fusionner ou d'en supprimer une autre.

| Route                  | Méthodes       | Accès  | Rôle                                                               |
| ---------------------- | -------------- | ------ | ------------------------------------------------------------------ |
| `/api/auth/google`     | `POST`         | Public | Vérifie le jeton Google, contrôle la liste blanche, pose le cookie |
| `/api/auth/me`         | `GET`          | Admin  | Session admin active ?                                             |
| `/api/auth/logout`     | `POST`         | Public | Efface le cookie de session                                        |
| `/api/events/public`   | `GET`          | Public | Événements publiés, pour le site                                   |
| `/api/events`          | `GET` `POST`   | Admin  | Liste complète, création                                           |
| `/api/events/[id]`     | `PUT` `DELETE` | Admin  | Modification, suppression                                          |
| `/api/events/image`    | `POST`         | Admin  | Dépôt d'une image sur Vercel Blob, renvoie son URL                 |
| `/api/planning/public` | `GET`          | Public | Créneaux triés, pour le site                                       |
| `/api/planning`        | `GET` `POST`   | Admin  | Liste, création en fin de liste                                    |
| `/api/planning/[id]`   | `PUT` `DELETE` | Admin  | Modification, suppression                                          |
| `/api/planning/order`  | `POST`         | Admin  | Réécrit tout l'ordre en une écriture atomique                      |
| `/api/infos`           | `GET` `PUT`    | Mixte  | `GET` public, `PUT` admin — fiche unique                           |

Le site public n'appelle **jamais** Supabase directement : il passe par les routes publiques
ci-dessus, qui ne renvoient que les champs nécessaires à l'affichage. La clé `service_role` ne quitte
jamais le serveur.

### Base de données

Trois tables Postgres sur Supabase : `events`, `planning_slots`, `infos_pratiques`.

Le schéma vit dans `db/migrations/`, en fichiers SQL numérotés joués **dans l'ordre**, une seule fois
chacun, depuis le SQL Editor de Supabase. Les scripts sont idempotents. La règle est **append-only** :
on ne modifie jamais une migration déjà appliquée en production, on en ajoute une nouvelle.

Chaque table porte `id uuid`, `created_at`, `updated_at`, un trigger `set_updated_at`, et la RLS
activée sans policy — l'API passe par la clé `service_role`, qui la contourne. Détail complet et
modèle de nouvelle table dans [`db/README.md`](./db/README.md).

### Mise en place initiale

<details>
<summary><strong>1. Créer le projet Supabase</strong></summary>

1. Créer un projet sur [supabase.com](https://supabase.com) — le plan gratuit suffit largement.
2. Dans le SQL Editor, exécuter tous les fichiers de `db/migrations/` **dans l'ordre des numéros**,
   puis les seeds indiqués dans [`db/README.md`](./db/README.md) (planning et infos pratiques, pour
   que le site n'affiche pas de section vide).
3. Dans Project Settings → API, récupérer l'URL du projet et la clé **`service_role`** — jamais la
   clé `anon`, et jamais exposée au navigateur.

</details>

<details>
<summary><strong>2. Créer le store Vercel Blob (images des événements)</strong></summary>

1. Projet Vercel → **Storage** → **Blob** → créer un store et le connecter au projet.
2. `BLOB_READ_WRITE_TOKEN` est alors injectée automatiquement dans les environnements — rien à
   saisir à la main.
3. Relever l'**hôte public** du store : c'est le domaine des URL qu'il sert, de la forme
   `<identifiant>.public.blob.vercel-storage.com`. Il se lit dans le store (onglet **Browser**, sur
   l'URL de n'importe quel fichier) ou sur l'adresse d'une image d'événement déjà en ligne.
4. Poser cet hôte, sans `https://` ni barre oblique finale, dans la variable `BLOB_PUBLIC_HOST`, et
   le reprendre **à l'identique** dans la directive `img-src` de `vercel.json`. C'est la seule
   origine d'où le site accepte et affiche une image d'événement : sans elle, le dépôt d'image
   répond `server_error`, et une valeur qui ne correspond pas au store bloque l'affichage des
   images côté visiteur.

</details>

<details>
<summary><strong>3. Créer les identifiants Google OAuth</strong></summary>

1. Sur [Google Cloud Console](https://console.cloud.google.com), créer ou réutiliser un projet.
2. APIs & Services → Écran de consentement OAuth : type « externe » (ou « interne » avec Google
   Workspace). Pas de validation Google nécessaire pour quelques comptes.
3. APIs & Services → Identifiants → Créer des identifiants → ID client OAuth → **Application Web**.
4. Dans « Origines JavaScript autorisées », ajouter `https://www.zenwaysaintlaurentduvar.fr` et les
   URL de preview Vercel utilisées.
5. Copier le **Client ID** dans `assets/js/config-admin.js` (`googleClientId`) et dans la variable
   d'environnement `GOOGLE_CLIENT_ID`. Ce n'est pas une donnée secrète.

</details>

---

## ⚙️ Configuration et variables d'environnement

À définir dans Vercel → Settings → Environment Variables, puis redéployer.

| Variable                    | Rôle                                                                               | Sensible |
| --------------------------- | ---------------------------------------------------------------------------------- | -------- |
| `SUPABASE_URL`              | URL du projet Supabase                                                             | Non      |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé `service_role` — accès serveur uniquement, jamais exposée au front             | **Oui**  |
| `GOOGLE_CLIENT_ID`          | Même Client ID que dans `assets/js/config-admin.js`                                | Non      |
| `ADMIN_EMAILS`              | Adresses autorisées à administrer, séparées par des virgules                       | **Oui**  |
| `SESSION_SECRET`            | Secret de signature du cookie admin, **32 caractères minimum** — refusé en dessous | **Oui**  |
| `BLOB_READ_WRITE_TOKEN`     | Injectée automatiquement par la connexion du store Blob — ne pas la saisir         | **Oui**  |
| `BLOB_PUBLIC_HOST`          | Hôte public exact du store Blob, seule origine acceptée pour les images            | Non      |

Générer un secret de session :

```bash
openssl rand -base64 48
```

> Les variables marquées « Sensitive » dans Vercel deviennent **définitivement illisibles** après
> enregistrement, dans l'interface comme en ligne de commande. C'est voulu : on ne peut que les
> remplacer, jamais les relire.

---

## 🚢 Déploiement

Le déploiement est automatique et sans build :

| Action                            | Résultat                                     |
| --------------------------------- | -------------------------------------------- |
| Push sur `main`                   | Déploiement en production                    |
| Push sur `develop` ou une branche | Preview URL dédiée, à valider avant le merge |
| Merge d'une PR                    | Redéploiement de la branche cible            |

**Réglages Vercel :** aucune commande de build, répertoire de sortie `.` (racine), `api/` déployé
comme fonctions Node.js. Après un push sur `main`, le workflow
[`indexnow.yml`](./.github/workflows/indexnow.yml) signale la mise à jour aux moteurs de recherche.

---

## 🔐 Sécurité

Le back-office administre un site public : sa surface est petite, mais elle est réelle. Les garanties
en place :

**Authentification et session**

- Connexion par Google Sign-In, jeton vérifié côté serveur (`google-auth-library`, audience =
  `GOOGLE_CLIENT_ID`) — jamais de mot de passe stocké par le projet.
- Liste blanche d'adresses (`ADMIN_EMAILS`) : un compte Google valide hors liste est refusé.
- Session portée par un cookie `httpOnly`, `Secure`, `SameSite=Strict`, préfixé `__Host-`, signé en
  HMAC-SHA256 et valable 8 heures. Le secret est refusé s'il fait moins de 32 caractères.
- La liste blanche est **relue à chaque requête**, pas seulement à la connexion : retirer une adresse
  coupe l'accès immédiatement, sans attendre l'expiration du cookie.
- Toute route admin commence par le garde `exigerAdmin` (`api/_lib/session.js`).

**Validation des entrées**

- Longueurs maximales sur tous les champs saisis, côté serveur.
- Toute valeur qui devient une URL sur le site public (`map_url`, `image_url`) est validée côté client
  **et** côté serveur : schéma HTTPS, et hôte attendu quand il y en a un.
- Dépôt d'image : taille contrôlée avant décodage, type MIME vérifié contre la signature réelle du
  fichier, dépôt réservé aux administrateurs.

**Journalisation**

- `api/_lib/log.js` écrit un journal JSON sur la sortie standard, consultable dans les Runtime Logs
  de Vercel : `audit` (toute écriture réussie, avec son auteur), `erreur` (toute erreur serveur),
  `refus` (tout accès refusé). Rien de ce qui est journalisé ne revient au client, dont les messages
  d'erreur restent génériques.

**En-têtes HTTP** (`vercel.json`)

Content-Security-Policy, HSTS avec preload, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`.
Le back-office est en plus servi en `no-store` et marqué `noindex, nofollow, noarchive`.

**Infrastructure**

Une règle de débit du pare-feu Vercel protège `/api/auth/*`. La protection anti-DDoS de la plateforme
est active par défaut. Les comptes listés dans `ADMIN_EMAILS` doivent avoir la validation en deux
étapes activée sur leur compte Google : c'est le seul facteur d'authentification du back-office.

Vérifier l'état des dépendances :

```bash
npm audit --omit=dev
```

---

## ♿ Accessibilité et référencement

- Attribut `alt` sur toutes les images, `aria-label` sur les boutons sans texte visible.
- Contraste WCAG AA minimum, respecté par la palette.
- Structure HTML valide : un seul `<h1>`, hiérarchie de titres continue.
- Navigation au clavier fonctionnelle, y compris dans les modales et le panneau du back-office
  (`<dialog>` natif : piège à focus et fermeture par Échap fournis par le navigateur).
- Images servies en `<picture>` avec variante `.webp`, polices auto-hébergées — aucun appel à
  `fonts.googleapis.com`.
- `robots.txt`, `sitemap.xml`, `llms.txt`, données structurées JSON-LD, et ping IndexNow à chaque
  mise en production.

---

## 🎨 Charte graphique

Le système visuel complet — palette, typographie, formes, composants, règles d'usage — vit dans
[`DESIGN.md`](./DESIGN.md). L'essentiel :

**Couleurs** — définies en variables CSS dans `assets/css/base.css` :

```css
--green-900: #1b4332; /* fonds foncés : footer, header scrollé */
--green-800: #22543e; /* dégradés foncés */
--green-700: #2d6a4f; /* titres, boutons, accent principal */
--teal: #2f8f7f; /* dégradés, accents */
--teal-bright: #36a18c; /* survols, mises en valeur */
--mint: #d8f3dc; /* fonds clairs, badges */
--mint-soft: #eef7f0; /* fonds de section clairs */
--beige: #f5f1e8; /* fond « Infos pratiques » */
--paper: #faf8f2; /* fond général */
--gold: #c9a86a; /* boutons CTA, accents premium */
--gold-soft: #e7d6ad; /* accents secondaires sur fonds foncés */
--ink: #243029; /* texte principal */
--ink-soft: #4b5a51; /* texte secondaire, légendes */
```

Aucune couleur hors palette sans l'ajouter en variable et justifier son usage.

**Typographies** — deux polices, pas une de plus :

| Usage                           | Police             | Variable  |
| ------------------------------- | ------------------ | --------- |
| Titres H1–H3, grandes citations | Cormorant Garamond | `--serif` |
| Texte courant, nav, boutons     | DM Sans            | `--sans`  |

**Logo** — image (`assets/img/logo/`), lettrage dessiné et non composé par une police du site. Ne
jamais le déformer, le recolorer ni modifier ses proportions.

---

## ✅ Validation avant commit

```bash
npm run verifier
```

Puis, à l'œil :

- Rendu correct sur mobile à **375 px** — le projet est pensé mobile-first.
- Aucune erreur dans la console du navigateur.
- Aucune image cassée ni placeholder oublié.
- HTML valide : balises fermées, un seul `<h1>`, pas de `<div>` orphelin.
- Message de commit clair, en français, au format Conventional Commits.
- Le message clé du projet n'est trahi nulle part.

---

## 📞 Contacts

|                |                                                         |
| -------------- | ------------------------------------------------------- |
| **Animatrice** | Béatrice Viallon (Béa)                                  |
| **Téléphone**  | 06 66 05 66 49                                          |
| **E-mail**     | contact@zenwaysaintlaurentduvar.fr                      |
| **Lieu**       | KMCS, 357 chemin des Iscles, 06700 Saint-Laurent-du-Var |
| **Séance**     | Mardi, 17 h 45 – 18 h 45                                |
| **Réseau**     | [Zenway — Raymond Holle](https://zenway-rh.fr)          |

---

## 📄 Licence

Contenu et code propriétaires. Toute copie ou réutilisation sans accord explicite est interdite.

---

<div align="center">

[Site](https://www.zenwaysaintlaurentduvar.fr) · [`CLAUDE.md`](./CLAUDE.md) · [`DESIGN.md`](./DESIGN.md) · [`PRODUCT.md`](./PRODUCT.md) · [`db/README.md`](./db/README.md)

</div>
