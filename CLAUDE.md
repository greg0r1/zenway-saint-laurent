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
- Aucune dépendance npm. Aucun `package.json`. Aucun build step.
- **Pas de fichier `.nojekyll`** — inutile sur Vercel, réservé à GitHub Pages.

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
│   │   ├── base.css        ← variables, reset, typo, logo, reveal
│   │   ├── nav.css          ← en-tête fixe, liens, burger
│   │   ├── hero.css         ← section d'accueil
│   │   ├── sections.css     ← concept & pratiques, planning, pour qui,
│   │   │                      vidéos, événements, inscriptions, infos, cta
│   │   ├── video.css        ← composant vidéo (teaser + galerie)
│   │   ├── footer.css       ← pied de page
│   │   └── responsive.css   ← media queries (chargé en dernier)
│   ├── js/
│   │   ├── config-helloasso.js  ← slugs HelloAsso, injection des liens/widget
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
├── .gitignore          ← exclut .DS_Store et autres fichiers système
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
- ❌ Backend, API maison, base de données
- ❌ Espace membre (décision prise — HelloAsso couvre les besoins de gestion)
- ❌ Écriture inclusive
- ❌ Nouvelle couleur hors palette définie
- ❌ Nouvelle police hors les trois définies
- ❌ Commit directement sur `main`
- ❌ Fichier `.nojekyll` (inutile sur Vercel)

### Le message clé — à ne jamais trahir

Zenway n'est **pas** un enchaînement de quatre cours séparés. C'est **une seule discipline** qui fusionne Tai-chi chuan, Yoga, Pilates et Qi gong dans un seul enchaînement continu, sur une musique relaxante. Ne jamais présenter les quatre pratiques comme des options ou des cours indépendants.

