# CLAUDE.md — Zenway Saint-Laurent-du-Var

Instructions permanentes pour Claude Code. À lire **avant chaque modification** du projet.

---

## Contexte du projet

Site vitrine statique pour **Zenway Saint-Laurent-du-Var**, section locale du réseau Zenway fondé par Raymond Holle (zenway-rh.fr).

- **Animatrice** : Béatrice Viallon (Béa)
- **Lieu** : KMCS, 357 chemin des Iscles, Saint-Laurent-du-Var (06700)
- **Séance** : mardi 17 h 45 – 18 h 45
- **Contact** : 06 66 05 66 49 · beatriceviallon12@gmail.com
- **Hébergement** : GitHub Pages (branche `main`, racine `/`)
- **Inscriptions** : HelloAsso (lien externe + widget iframe optionnel)

### Le message clé — à ne jamais trahir

Zenway n'est **pas** un enchaînement de quatre cours séparés. C'est **une seule discipline** qui fusionne Tai-chi chuan, Yoga, Pilates et Qi gong dans un seul enchaînement continu, sur une musique relaxante. Ne jamais présenter les quatre pratiques comme des options ou des cours indépendants.

---

## Stack technique

- **HTML / CSS / JS vanilla uniquement** — pas de framework, pas de bundler, pas de npm.
- Un seul fichier `index.html` à la racine (déployable tel quel sur GitHub Pages).
- Les assets externes (images, fonts) sont référencés par URL ou placés dans `assets/`.
- Les données configurables (planning, vidéos, HelloAsso) sont dans des blocs `<script>` en bas de `index.html`, clairement séparés du code de rendu.
- Aucune dépendance npm. Aucun `package.json`. Aucun build step.

---

## Charte graphique — TOUJOURS respecter

### Couleurs (variables CSS déjà définies dans `index.html`)

```css
--green-900: #1B4332   /* Fonds foncés : footer, header scrollé */
--green-800: #22543E   /* Dégradés foncés */
--green-700: #2D6A4F   /* Titres, boutons, accent principal */
--teal:      #2F8F7F   /* Dégradés, accents */
--teal-bright:#36A18C  /* Survols, mises en valeur */
--mint:      #D8F3DC   /* Fonds clairs, badges */
--mint-soft: #EEF7F0   /* Fonds de section clairs */
--beige:     #F5F1E8   /* Fond Infos pratiques */
--paper:     #FAF8F2   /* Fond général */
--gold:      #C9A86A   /* Boutons CTA, accents premium */
--gold-soft: #E7D6AD   /* Accents secondaires sur fonds foncés */
--ink:       #243029   /* Texte principal */
--ink-soft:  #4B5A51   /* Texte secondaire, légendes */
```

Ne jamais introduire de nouvelle couleur sans l'ajouter en variable CSS et justifier son usage.

### Typographies (Google Fonts, déjà chargées)

| Variable CSS | Police | Usage |
|---|---|---|
| `--serif` | Cormorant Garamond | H1, H2, H3, citations grandes |
| `--sans` | DM Sans | Texte courant, nav, boutons |
| `--script` | Caveat | Accents manuscrits courts, taglines |

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
├── index.html          ← page unique, auto-suffisante
├── assets/
│   └── img/
│       ├── bea.png     ← photo de Béatrice (fond transparent, ratio 3:4)
│       └── seance.jpg  ← photo d'ambiance (ratio 4:3 minimum)
├── .nojekyll           ← fichier vide, désactive Jekyll sur GitHub Pages
├── CLAUDE.md           ← ce fichier
└── README.md           ← instructions déploiement et mise à jour
```

### Structure de `index.html`

Les sections dans l'ordre, chacune avec son commentaire `<!-- === NOM === -->` :

1. `<head>` (meta, fonts, styles)
2. NAV
3. HERO (vidéo de teasing)
4. CONCEPT
5. PRATIQUES
6. PLANNING
7. VIDÉOS
8. POUR QUI
9. PORTES OUVERTES
10. INSCRIPTIONS (HelloAsso)
11. INFOS PRATIQUES
12. CTA BAND
13. FOOTER
14. Scripts (HelloAsso config, Vidéos config, Planning config, Nav/Reveal)

### Blocs de configuration (en bas de `index.html`)

Chaque donnée variable a son propre bloc `<script>` avec un en-tête commenté :

```js
/* ============================================================
   CONFIG [NOM] — à adapter sans toucher au reste du code
   ============================================================ */
```

Ne jamais mélanger la logique de rendu et les données de configuration.

---

## Workflow Git

### Branches

| Branche | Rôle |
|---|---|
| `main` | Production — GitHub Pages sert cette branche. Toujours stable. |
| `develop` | Développement en cours. Base de travail quotidienne. |
| `feature/<nom>` | Nouvelle fonctionnalité (ex: `feature/section-temoignages`) |
| `fix/<nom>` | Correction de bug (ex: `fix/planning-mobile`) |
| `content/<nom>` | Mise à jour de contenu uniquement (ex: `content/ajout-videos-juin`) |

### Règles

- **Ne jamais pousser directement sur `main`** — toujours passer par une PR depuis `develop`.
- `develop` → `main` = déploiement. Le merge déclenche la mise en ligne automatiquement.
- Une branche par tâche. Supprimer la branche après merge.

### Convention de commits (Conventional Commits)

```
<type>(<scope>): <description courte en français>
```

**Types :**

| Type | Usage |
|---|---|
| `feat` | Nouvelle section ou fonctionnalité |
| `fix` | Correction de bug ou d'affichage |
| `content` | Modification de texte, d'image ou de données de config |
| `style` | Modification CSS sans impact fonctionnel |
| `refactor` | Restructuration du code sans changement visible |
| `chore` | Maintenance (README, .nojekyll, etc.) |

**Exemples :**

```
feat(planning): ajout de la section planning avec config JS
fix(hero): correction de l'alignement sur mobile iOS
content(videos): ajout des replays portes ouvertes 27 juin
style(nav): harmonisation de la couleur du lien actif
chore(readme): mise à jour de la procédure de déploiement
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
