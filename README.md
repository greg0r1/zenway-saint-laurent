# Zenway Saint-Laurent-du-Var — Site vitrine

Site statique minimaliste (HTML/CSS/JS vanilla, sans dépendances) pour la section locale Zenway de Saint-Laurent-du-Var. Hébergé sur Vercel avec déploiement automatique depuis GitHub.

**[Voir le site en production](https://zenway-saint-laurent.vercel.app)**

---

## 📋 Stack technique

- **HTML / CSS / JS vanilla uniquement** — aucun framework, aucun bundler, aucune dépendance npm côté site public
- **Exception** : gestion des événements via Supabase + fonctions Vercel (`api/`) + admin protégée par Google (voir « Gestion des événements » plus bas)
- **Un seul fichier `index.html`** auto-suffisant à la racine
- **CSS modulaire** : découpé par domaine fonctionnel dans `assets/css/`
- **JS modulaire** : découpé par domaine fonctionnel dans `assets/js/`
- **Hébergement** : [Vercel](https://vercel.com) (déploiement automatique à chaque push sur `main`)
- **Inscriptions** : intégration HelloAsso (lien externe + widget iframe)

---

## 🚀 Démarrage local

### Prérequis

- **Git** (pour cloner le repo)
- **Python 3** (pour lancer un serveur statique) ou **Node.js** (optionnel)

### Installation

```bash
# Cloner le repo
git clone https://github.com/greg0r1/zenway-saint-laurent.git
cd zenway-saint-laurent

# Passer sur la branche develop pour développer
git checkout develop
```

### Lancer le serveur de développement

```bash
# Option 1 : Python 3 (recommandé, aucune dépendance supplémentaire)
python3 -m http.server 8000

# Option 2 : Node.js (si http-server est installé)
npx http-server
```

Puis ouvrir **`http://localhost:8000`** dans le navigateur.

> **Note** : Le serveur recharge automatiquement si tu modifies les fichiers CSS/JS/HTML (via un outil comme [Live.js](https://livereload.com/) en local, ou via Vercel Preview si tu pushes une branche).

---

## 📁 Structure du projet

```
zenway-saint-laurent/
├── index.html              ← page unique, auto-suffisante
├── assets/
│   ├── css/
│   │   ├── fonts.css       ← @font-face des polices auto-hébergées
│   │   ├── base.css        ← variables CSS, reset, typo, logo, animations
│   │   ├── nav.css         ← en-tête fixe, navigation, burger menu
│   │   ├── hero.css        ← section accueil avec vidéo teaser
│   │   ├── sections.css    ← concept, planning, vidéos, inscriptions, infos pratiques
│   │   ├── footer.css      ← pied de page
│   │   └── responsive.css  ← media queries (chargé en dernier)
│   ├── fonts/              ← polices auto-hébergées (woff2, sous-ensembles latin)
│   │   ├── cormorant-garamond-*.woff2
│   │   ├── dm-sans-*.woff2
│   │   └── caveat-*.woff2
│   ├── js/
│   │   ├── config-helloasso.js     ← configuration HelloAsso (slugs, widget)
│   │   ├── config-videos.js        ← vidéo teaser hero + galerie YouTube
│   │   ├── config-planning.js      ← créneaux de séance affichés
│   │   ├── config-evenements.js    ← événements HelloAsso (préparation future)
│   │   └── nav-reveal.js           ← navigation, burger menu, animations reveal
│   └── img/
│       ├── logo-zenway.png         ← logo complet (nav, footer)
│       ├── bea-posture-005.png     ← photo de Béatrice en posture Zenway
│       ├── activite-taichi.jpg     ← pratique Tai-chi chuan
│       ├── activite-yoga.jpg       ← pratique Yoga
│       ├── activite-pilates.jpg    ← pratique Pilates
│       └── activite-qigong.jpg     ← pratique Qi gong
├── .gitignore
├── CLAUDE.md               ← instructions permanentes pour les développeurs
└── README.md               ← ce fichier
```

---

## 🔄 Workflow Git

### Branches

| Branche         | Rôle                                                | Vercel          |
| --------------- | --------------------------------------------------- | --------------- |
| `main`          | Production — déploiement automatique à chaque push  | URL production  |
| `develop`       | Développement en cours                              | Preview URL     |
| `feature/<nom>` | Nouvelle fonctionnalité                             | Preview URL     |
| `fix/<nom>`     | Correction de bug                                   | Preview URL     |
| `content/<nom>` | Mise à jour de contenu uniquement                   | Preview URL     |

### Cycle de développement

1. **Créer une branche** à partir de `develop` :
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/ma-fonctionnalite
   ```

2. **Développer et committer** avec [Conventional Commits](https://www.conventionalcommits.org/) :
   ```bash
   git add .
   git commit -m "feat(section): description en français"
   git push origin feature/ma-fonctionnalite
   ```

3. **Ouvrir une Pull Request** vers `develop` (pas vers `main`) via GitHub.

4. **Tester sur la preview Vercel** — un lien est généré automatiquement sur la PR.

5. **Merger dans `develop`** une fois validé et approuvé.

6. **Merger `develop` dans `main`** quand prêt pour la production.

### Convention de commits

```
<type>(<scope>): <description courte en français>
```

**Types autorisés :**

- `feat` : nouvelle fonctionnalité ou section
- `fix` : correction de bug
- `content` : modification de texte, image, ou données config
- `style` : modification CSS sans impact fonctionnel
- `refactor` : restructuration du code
- `chore` : maintenance (config, deps, etc.)

**Exemple :**
```
feat(inscription): ajout du widget HelloAsso embarqué
fix(hero): correction du positionnement vidéo sur mobile
content(planning): mise à jour des créneaux de juillet
```

---

## ✏️ Éditer le contenu

### Vidéos (teaser hero + galerie)

Fichier : `assets/js/config-videos.js`

```js
const CONFIG_VIDEOS = {
  teaser: {
    youtubeId: "XXXXX", // ID de la vidéo YouTube teaser
    duration: "1:30"
  },
  gallery: [
    { youtubeId: "XXXXX", title: "Titre de la vidéo" },
    // ...
  ]
};
```

### Planning (créneaux de séance)

Fichier : `assets/js/config-planning.js`

```js
const CONFIG_PLANNING = [
  { day: "Mardi", time: "17:45 – 18:45", location: "KMCS, Saint-Laurent-du-Var" },
  // ...
];
```

### HelloAsso (adhésions + événements)

Fichier : `assets/js/config-helloasso.js`

```js
const CONFIG_HELLOASSO = {
  adhesions: {
    ready: true,
    campaign: "zenway-st-laurent-du-var",
    form: "adhesions",
    slug: "zenway-st-laurent-du-var"
  },
  evenements: {
    ready: false, // À passer à true quand des événements sont créés
    campaign: "zenway-st-laurent-du-var",
    form: "evenements",
    slug: "zenway-st-laurent-du-var"
  }
};
```

---

## 🎨 Charte graphique

### Palette de couleurs (CSS variables)

Toutes les couleurs sont définies dans `assets/css/base.css` :

```css
--green-900: #1b4332    /* Fonds foncés */
--green-800: #22543e
--green-700: #2d6a4f
--teal: #2f8f7f        /* Accent principal */
--teal-bright: #36a18c
--mint: #d8f3dc        /* Fonds clairs */
--mint-soft: #eef7f0
--beige: #f5f1e8
--paper: #faf8f2       /* Fond général */
--gold: #c9a86a        /* Boutons CTA */
--gold-soft: #e7d6ad
--ink: #243029         /* Texte principal */
--ink-soft: #4b5a51    /* Texte secondaire */
```

**Règle** : ne jamais ajouter une couleur hors cette palette sans la documenter.

### Typographies (Google Fonts auto-hébergées)

| Usage              | Police             | CSS variable |
| ------------------ | ------------------ | ------------ |
| Titres (H1–H3)     | Cormorant Garamond | `--serif`    |
| Texte courant      | DM Sans            | `--sans`     |
| Accents manuscrits | Caveat             | `--script`   |

**Règle** : Caveat uniquement pour les accroches courtes (max une ligne).

### Logo

Trois feuilles SVG en dégradé vert/teal. Texte : « zen » en DM Sans gras blanc, « way » en Caveat teal. Ne jamais modifier les proportions ou les couleurs.

---

## ♿ Accessibilité

- ✅ Attributs `alt` sur toutes les images
- ✅ `aria-label` sur les boutons sans texte visible
- ✅ Contraste WCAG AA minimum
- ✅ Structure HTML valide (un seul `<h1>`, hiérarchie des headings)

---

## 🚀 Déploiement

### À Vercel (production)

Le déploiement est **automatique** :

1. Pusher sur `main` → Vercel détecte le changement et redéploie en production
2. Pusher sur une branche `feature/*` → Vercel génère une **preview URL** pour tester avant de merger

**Vérifier le statut du déploiement :**
```bash
vercel --prod  # Voir le statut en ligne de commande (si Vercel CLI est installé)
```

### Paramètres Vercel

- **Build Command** : (aucun — site statique)
- **Output Directory** : `.` (racine)
- **Environment** : production

---

## 🗓️ Gestion des événements (admin)

Le site public reste statique, mais une exception existe pour la gestion des événements (portes ouvertes, rencontres...) : elle repose sur Supabase (base de données), des fonctions serverless Vercel (`api/`) et une connexion Google restreinte à une liste d'emails (`admin/`). Voir `CLAUDE.md` → « Exception backend — gestion des événements » pour le détail de l'architecture et des règles.

### 1. Créer le projet Supabase

1. Créer un projet sur [supabase.com](https://supabase.com) (le plan gratuit suffit largement).
2. Dans l'éditeur SQL du projet, exécuter :

```sql
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tag text not null default 'Prochain événement',
  link_url text not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

3. Dans Project Settings → API, récupérer l'URL du projet et la clé **`service_role`** (jamais la clé `anon`, jamais exposée au navigateur).

### 2. Créer les identifiants Google OAuth

1. Sur [Google Cloud Console](https://console.cloud.google.com), créer (ou réutiliser) un projet.
2. APIs & Services → Écran de consentement OAuth : configurer un écran de type « externe » (ou « interne » si Google Workspace), pas besoin de validation Google pour un usage interne à quelques comptes.
3. APIs & Services → Identifiants → Créer des identifiants → ID client OAuth → type **Application Web**.
4. Dans « Origines JavaScript autorisées », ajouter l'URL de production (`https://www.zenwaysaintlaurentduvar.fr`) et les URLs de preview Vercel utilisées.
5. Copier le **Client ID** obtenu dans `assets/js/config-admin.js` (`googleClientId`) — ce n'est pas une donnée secrète.

### 3. Variables d'environnement Vercel

Dans le projet Vercel → Settings → Environment Variables, ajouter :

| Variable | Valeur |
| --- | --- |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé `service_role` Supabase |
| `GOOGLE_CLIENT_ID` | Même Client ID que dans `config-admin.js` |
| `ADMIN_EMAILS` | Emails autorisés à administrer, séparés par des virgules (ex: `contact@zenwaysaintlaurentduvar.fr,graphigreg@gmail.com`) |
| `SESSION_SECRET` | Chaîne aléatoire longue (ex : générée avec `openssl rand -hex 32`) |

Redéployer après avoir ajouté ces variables.

### 4. Utiliser l'admin

Se rendre sur `https://<domaine>/admin/`, se connecter avec un compte Google listé dans `ADMIN_EMAILS`, puis créer/modifier/supprimer les événements. Seul l'événement marqué « Afficher sur le site » apparaît dans le bandeau et la section événements du site public (un seul à la fois).

---

## 🔍 Validation avant commit

Avant de pousser, vérifier :

- ✅ Structure HTML valide (balises ouvertes/fermées, un seul `<h1>`)
- ✅ Aucune image cassée ou placeholder oublié
- ✅ Responsive design OK sur mobile (375px)
- ✅ Aucune console error en F12
- ✅ Commit message clair et en français

---

## 📝 Message clé du projet

⚠️ **Important** : Zenway n'est **pas** un enchaînement de quatre cours séparés. C'est **une seule discipline** qui fusionne Tai-chi chuan, Yoga, Pilates et Qi gong dans un seul enchaînement continu, sur une musique relaxante. **Ne jamais présenter les quatre pratiques comme des options ou des cours indépendants.**

---

## 📞 Contacts

- **Animatrice** : Béatrice Viallon (Béa)
- **Téléphone** : 06 66 05 66 49
- **E-mail** : contact@zenwaysaintlaurentduvar.fr
- **Lieu** : KMCS, 357 chemin des Iscles, Saint-Laurent-du-Var (06700)
- **Séance** : Mardi 17h45 – 18h45

---

## 📄 Licence

Contenu propriétaire. Copie non autorisée sans accord explicite.

---

## 🔗 Ressources

- [CLAUDE.md](./CLAUDE.md) — instructions permanentes pour les développeurs
- [Zenway (fondateur)](https://zenway-rh.fr)
- [HelloAsso](https://www.helloasso.com)
- [Vercel](https://vercel.com)
