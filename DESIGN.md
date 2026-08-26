---
name: Zenway Saint-Laurent-du-Var
description: Un site vitrine en bandes alternées de crème et d'ardoise chaude, ponctué d'or et de sauge, et une console d'administration classique qui en partage les caractères.
colors:
  gold: "#c9a86a"
  gold-warm: "#d8bb85"
  gold-veil: "#f0e4c9"
  sage: "#5d7358"
  sage-deep: "#4b5e47"
  sage-light: "#9fb298"
  sage-veil: "#dfe7db"
  dark: "#343b3d"
  dark-deep: "#2b3133"
  dark-raise: "#3e4649"
  cream: "#f8f4ec"
  cream-2: "#f1ebdf"
  bone: "#e9e2d3"
  bone-soft: "#bcb6a8"
  line: "#ddd4c1"
  line-strong: "#cabfa7"
  ink: "#2b332f"
  ink-soft: "#5f6a62"
  green-900: "#1b4332"
  teal: "#2f8f7f"
  danger: "#a3341f"
  danger-bg: "#fbeae6"
  danger-border: "#eec3b8"
  admin-accent: "#427482"
  admin-accent-hover: "#3a6674"
  admin-accent-text: "#2c6373"
  admin-accent-field: "#dcebee"
  admin-bg: "#f5f8f9"
  admin-surface: "#ffffff"
  admin-side: "#ffffff"
  admin-raise: "#f2f7f8"
  admin-tint: "#cfe2e7"
  admin-tint-deep: "#b7d3da"
  admin-text: "#22333a"
  admin-soft: "#4e6169"
  admin-muted: "#64777d"
  admin-title: "#1c2b31"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.2rem, 3.4vw, 3.2rem)"
    fontWeight: 400
    lineHeight: 1.08
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.1rem, 4.2vw, 3.2rem)"
    fontWeight: 400
    lineHeight: 1.08
  page-title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.01em"
    textTransform: "uppercase"
  panel-title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.2
  gate-title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.02em"
    textTransform: "uppercase"
  wordmark:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
    textTransform: "uppercase"
  stat:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 700
    lineHeight: 1.05
  figure:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.06rem"
    fontWeight: 400
    lineHeight: 1.7
  lede:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  field:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.5
  ui-body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.94rem"
    fontWeight: 400
    lineHeight: 1.55
  note:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.3
  caption:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.4
  section-label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.09em"
    textTransform: "uppercase"
  overline:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.09em"
    textTransform: "uppercase"
  overline-xs:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.1em"
    textTransform: "uppercase"
rounded:
  none: "0"
  xs: "2px"
  sm: "3px"
  md: "10px"
  card: "14px"
  lg: "20px"
  pill: "999px"
  circle: "50%"
  media: "22px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  gutter: "30px"
components:
  button-primary:
    backgroundColor: "{colors.admin-accent}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 18px"
    minHeight: "42px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.admin-accent-hover}"
    textColor: "#ffffff"
  button-soft:
    backgroundColor: "{colors.admin-accent-field}"
    textColor: "{colors.admin-title}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
    minHeight: "42px"
  button-line:
    backgroundColor: "{colors.admin-surface}"
    textColor: "{colors.admin-text}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
    minHeight: "42px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  icon-button:
    backgroundColor: "transparent"
    rounded: "{rounded.md}"
    width: "38px"
    height: "38px"
  input-field:
    backgroundColor: "{colors.admin-surface}"
    textColor: "{colors.admin-text}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
    minHeight: "46px"
  box:
    backgroundColor: "{colors.admin-surface}"
    textColor: "{colors.admin-text}"
    rounded: "{rounded.card}"
    padding: "22px 24px 24px"
    shadow: "soft two-layer, no border"
  stat-card:
    backgroundColor: "linear-gradient(160deg, {colors.admin-tint}, {colors.admin-accent-field})"
    textColor: "{colors.admin-title}"
    rounded: "{rounded.card}"
    typography: "{typography.stat}"
  nav-item:
    backgroundColor: "transparent"
    textColor: "rgba(34, 51, 58, 0.7)"
    rounded: "0 {rounded.md} {rounded.md} 0"
    padding: "12px 14px 12px 21px"
  nav-item-active:
    backgroundColor: "{colors.admin-accent-field}"
    textColor: "{colors.admin-title}"
    rail: "4px {colors.admin-accent} au bord gauche de la barre"
  pill-live:
    backgroundColor: "{colors.admin-accent-field}"
    textColor: "{colors.admin-accent-text}"
    rounded: "{rounded.pill}"
    padding: "4px 10px 4px 8px"
  site-button:
    rounded: "{rounded.xs}"
    padding: "14px 28px"
---

# Design System: Zenway Saint-Laurent-du-Var

## Overview

Le projet porte **deux surfaces au registre volontairement différent**, tenues ensemble par une seule palette, trois caractères et une même discipline de tracé.

**Le site public — « les bandes qui alternent ».** La page ne pose pas de cartes sur un fond : elle avance par bandes pleine largeur qui alternent le crème (`#f8f4ec`) et l'ardoise chaude (`#343b3d`), sans jamais rien encadrer. Le contenu est posé à même la bande, tenu par des filets de 1 px et par l'espace ; l'ombre ne sert qu'aux médaillons et aux médias, jamais à découper un bloc de texte. Chaque bande porte un ou deux ornements au trait, dessinés pour ce site — bambou, feuillage, courbes de niveau, vigne dorée, ensō, volutes — et une illustration en matière, la petite pile de galets du pied de « Nos pratiques ». La grande pile, dans « Adhésion & inscription », est une exception délibérée : une vraie photo plutôt qu'un dessin, seule photo purement décorative du site (les autres photos — Béatrice, les quatre pratiques, les fiches disciplines — montrent toutes un fait, jamais un décor). La discipline que le site présente fusionne quatre pratiques en un seul enchaînement continu ; la page fait de même, une bande coulant dans la suivante par une coupure courbe plutôt qu'une ligne droite.

**L'administration — la console, d'après une maquette épinglée.** `/admin` ne cherche pas à prolonger les bandes du site : c'est un outil, et sa forme vient d'une maquette que l'utilisateur a fournie et validée. Barre latérale blanche à gauche, pleine hauteur, qui ne bouge jamais ; zone de travail gris-bleu très clair à droite ; une page par section, montée dans une grille de douze colonnes. Les cartes sont blanches, arrondies (14 px) et tenues par l'ombre plutôt que par le filet — à l'inverse du site public, qui n'arrondit que ses médias et n'ombre jamais un bloc de texte.

La console a **sa propre couleur et sa propre voix**, et c'est délibéré : le sarcelle ardoise (`#427482`) y porte l'action, la navigation, la position courante et le focus ; **l'or et le serif du site public ne franchissent pas la porte de l'admin**. Les titres sont en DM Sans gras capitales, pas en Cormorant. Un seul thème, clair : pas de bascule sombre.

Le reste emprunte le vocabulaire attendu d'un admin — tableaux, onglets soulignés, pastilles d'état, panneau latéral — au niveau de finition d'un admin de site éditorial, sans ironie ni signature glissée en douce.

Le public du site est majoritairement senior : la densité reste basse, les cibles tactiles larges, et aucune information n'est portée par la couleur seule. L'administration a une seule utilisatrice non technique : chaque page y dit en toutes lettres ce qu'elle commande sur le site public et ce qui est en ligne à l'instant.

**Key Characteristics :**

- Côté site : des bandes pleine largeur qui alternent crème et ardoise, des coupures courbes entre elles, des ornements au trait dessinés pour ce site
- Côté admin : une grille de cartes blanches arrondies sur fond gris-bleu, une barre latérale blanche, un seul thème
- L'or rare et décisif **côté site seulement** ; la sauge pour l'action de second rang côté site, le sarcelle ardoise pour tout ce qui agit côté admin
- Cormorant pour les titres **du site public**, DM Sans pour tout le reste et pour la totalité de l'admin — deux polices, pas une de plus
- Des icônes tracées, jamais un glyphe unicode ni un emoji
- L'état écrit avant d'être coloré

## Colors

Deux mondes de couleur qui ne se partagent plus rien. Le site public vit en crème et ardoise chaude, ponctué d'or et de sauge ; l'administration vit en gris-bleu, blanc et sarcelle ardoise. Les jetons du site sont préfixés `--r-*` et définis en tête de `assets/css/base.css`, ceux de l'admin `--ad-*` en tête de `assets/css/admin.css`.

### Primary

- **Or Sanctuaire** (`#c9a86a`) : la seule couleur de décision **du site public** — le bouton d'appel, le cerclage des médaillons, la vigne et les volutes, les puces de liste. Jamais décoratif au point de perdre son sens. **N'entre pas dans l'administration**, qui a sa propre couleur d'action (voir Sarcelle Ardoise).
- **Or Chaud** (`#d8bb85`) : le survol de l'or, et le second point des dégradés dorés.
- **Or Voile** (`#f0e4c9`) : les aplats d'or très clairs sur fond crème — fond d'icône d'événement, points de lumière des ornements.

### Secondary

- **Sauge** (`#5d7358`) : la seule couleur végétale du site public, réservée à l'action de second rang — le bouton d'inscription du hero, le bandeau d'événement, les icônes de libellé.
- **Sauge Profonde** (`#4b5e47`) : le survol de la sauge, et le texte de sauge sur fond clair.
- **Sauge Claire** (`#9fb298`) et **Voile de Sauge** (`#dfe7db`) : la sauge sur fond sombre, et les pastilles de sauge sur fond clair.
- **Sarcelle Ardoise** (`#427482`, `--ad-accent`) : **la couleur de l'administration, et d'elle seule**. Elle porte tout ce qui agit ou situe — bouton d'action plein (texte blanc, 5,2:1), icônes, liseré et champ de l'entrée de menu active, soulignement de l'onglet courant, anneau de focus, puces de liste. Deux satellites : `#3a6674` au survol, et **`#2c6373`** (`--ad-accent-text`) pour tout usage en texte ou en lien, où `#427482` seul n'atteint pas AA sur blanc. Son champ très pâle est `#dcebee` (`--ad-accent-field`).
- **Teal Sanctuaire** (`#2f8f7f`) : ne sert plus nulle part. Conservé ici comme mémoire de l'ancienne charte, à ne pas réintroduire.

### Neutral

- **Crème** (`#f8f4ec`) et **Crème Chaud** (`#f1ebdf`) : les bandes claires du site, et la matière des fiches disciplines.
- **Ardoise Chaude** (`#343b3d`), **Ardoise Profonde** (`#2b3133`), **Ardoise Levée** (`#3e4649`) : les bandes sombres, leur creux et leur relief. Ce ne sont pas des gris : ils tirent tous vers le vert.
- **Os** (`#e9e2d3`) et **Os Doux** (`#bcb6a8`) : texte principal et secondaire sur bande sombre.
- **Encre** (`#2b332f`) et **Encre Douce** (`#5f6a62`) : texte principal et secondaire sur bande claire.
- **Filet** (`#ddd4c1`) et **Filet Marqué** (`#cabfa7`) : les deux poids de trait sur clair. Sur sombre, ce sont `--r-line-dark` et `--r-line-dark-strong`, l'os à 16 % et 28 %.
- **Vert Forêt Profonde** (`#1b4332`) : ne sert plus nulle part depuis que l'admin a sa propre palette. Conservé ici comme mémoire de l'ancienne charte, à ne pas réintroduire.
- **Les neutres de l'admin**, tous tirés vers le bleu-vert et non vers le gris : fond de page `#f5f8f9`, surface `#ffffff`, relief `#f2f7f8` (en-tête de tableau, rangée d'action au repos), encre `#22333a`, encre douce `#4e6169`, encre muette `#64777d` (4,7:1 sur blanc — le plancher, pas une marge), titre `#1c2b31`.
- **La teinte de la carte statistique** : `#cfe2e7` (`--ad-tint`) en dégradé vers `#dcebee`, et `#b7d3da` (`--ad-tint-deep`) pour le filigrane de feuilles qui l'habite. Ces deux jetons n'existent que pour cette carte.

### La pierre des médaillons

Quatre jetons (`--r-anneau-haut` `#c1b8a6`, `--r-anneau-corps` `#8e887c`, `--r-anneau-bas` `#7b7060`, `--r-anneau-ombre` `#635b50`) composent le dégradé de pierre qui cercle les quatre médaillons de « Nos pratiques ». Ils n'existent que pour cet usage : c'est le seul endroit du site où une couleur imite une matière plutôt que de désigner un rôle.

### Tertiary

- **Terre Brûlée** (`#a3341f`), sur **fond** `#fbeae6` et **filet** `#eec3b8` : erreur et suppression, exclusivement. Jamais un avertissement, jamais un accent.

### La couche de rôles de l'admin

L'administration ne consomme jamais la palette de marque directement : elle passe par une couche de jetons `--ad-*` définie en tête de `assets/css/admin.css`, sous un `:root` unique — un seul thème, clair, pas de bascule sombre.

Les rôles principaux : `--ad-bg` (le fond gris-bleu de la zone de travail), `--ad-surface` (toute surface de contenu, blanche), `--ad-raise` (l'en-tête de tableau, les rangées d'action au repos), `--ad-line` / `--ad-line-soft` (les deux poids de filet, réservés aux détails fonctionnels — champ, séparateur de tableau ou de liste), `--ad-side` et sa famille (la barre latérale, blanche), `--ad-accent` et sa famille `--ad-accent-hover` / `--ad-accent-text` / `--ad-accent-field` (le sarcelle), `--ad-tint` / `--ad-tint-deep` (la carte statistique seule), `--ad-focus`, `--ad-danger`, `--ad-ok`.

`--ad-focus` vaut exactement `--ad-accent` : la console n'a qu'une couleur d'appui, et le focus n'en invente pas une seconde.

### Named Rules

**La règle de la couleur unique.** L'administration n'a qu'une couleur, le Sarcelle Ardoise. Tout ce qui agit ou situe la prend ; tout le reste est neutre. Une deuxième couleur d'accent dans l'admin est une erreur, pas une variante — et l'or du site public en fait partie.

**La règle de la porte.** L'or et le Cormorant ne franchissent pas la porte de `/admin`, et le sarcelle ne sort pas de l'admin. Les deux surfaces partagent la même famille de formes et la même discipline de tracé, pas leur palette ni leur voix typographique.

**La règle du mot avant la couleur.** Aucun état n'est porté par la seule couleur. « En avant », « Publié », « Archivé » s'écrivent et portent leur icône ; le champ sarcelle ne fait que confirmer.

**La règle du jeton.** Aucune couleur en dur dans un composant de l'admin. Une valeur littérale hors jeton n'est admise que pour un voile de `::backdrop` et les couleurs d'ombre.

## Typography

**Display Font :** Cormorant Garamond (Georgia, serif)
**Body Font :** DM Sans (system-ui, sans-serif)

Les deux sont auto-hébergées en woff2 dans `assets/fonts/` (sous-ensembles latin et latin-ext) : aucun appel à `fonts.googleapis.com`. Une troisième, Caveat, figurait ici sans habiller le moindre texte ; elle a été retirée du projet.

**Character :** un serif de la Renaissance, léger et haut d'axe, posé sur une grotesque géométrique tiède. Le contraste est fort en dessin mais faible en taille : les titres ne hurlent pas, ils changent de voix.

**Le partage des deux surfaces.** Cormorant habille les titres **du site public** et rien d'autre. **L'administration est entièrement en DM Sans**, jusqu'à ses titres, qui prennent le gras et les capitales au lieu du serif : c'est une console, sa voix est celle d'un outil.

### Hierarchy

- **Display** (DM Sans 300, `clamp(2rem, 4.6vw, 3.65rem)`, capitales, `0.01em`) : le H1 du hero, une seule fois par page. C'est la seule exception à la règle du serif en titre — le hero parle en capitales larges, pas en serif.
- **Signature** (Cormorant 400 italique, `clamp(1.8rem, 3vw, 2.5rem)`) : « Le Zenway », sous le H1. Une ligne par page, jamais deux.
- **Headline** (Cormorant 400, `clamp(1.9rem, 3.4vw, 2.9rem)`, capitales, `0.02em`) : les H2 de section du site public.
- **Page title** (DM Sans 700, `1.7rem`, 1.1, `0.01em`, capitales) : le titre de page dans l'en-tête de l'admin. Taille fixe, jamais fluide ; ramenée à `1.4rem` sous 900 px et `1.25rem` sous 700 px.
- **Panel title** (DM Sans 700, `1.2rem`, 1.2) : le titre du panneau latéral. En casse normale, pas en capitales : c'est souvent un titre d'événement saisi par l'utilisatrice.
- **Gate title** (DM Sans 700, `1.55rem`, `0.02em`, capitales) : le mot « Administration » sur l'écran de connexion.
- **Wordmark** (DM Sans 700, `1.25rem`, `0.04em`, capitales) : « ZENWAY » en tête de la barre latérale, à côté du logo.
- **Stat** (DM Sans 700, `2.6rem`, 1.05) : le grand chiffre de la carte statistique du tableau de bord. Le seul endroit de l'admin où un nombre est traité en display.
- **Figure** (DM Sans 700, `1.7rem`, 1.15) : la valeur mise en avant d'une carte de résumé — l'horaire de la prochaine séance.
- **Body** (400, `1.06rem`, 1.7) : le texte courant du site public. Mesure de 62 à 68 caractères.
- **Lede** (400, `1rem`, 1.65) : la phrase d'ouverture d'une page d'admin, qui dit ce que la page commande. Mesure plafonnée à 68 caractères.
- **Field** (400, `0.98rem`, 1.5) : la valeur saisie dans un champ, et le titre cliquable d'une ligne de tableau.
- **UI body** (400, `0.94rem`, 1.55) : le texte de l'interface d'administration — lignes de tableau, valeurs, descriptions d'action.
- **Note** (400, `0.9rem`, 1.55) : messages de confirmation, textes d'état vide, liens externes.
- **Label** (600, `0.85rem`, 1.3) : libellés de champ, boutons, entrées de menu.
- **Caption** (600, `0.78rem`, 1.4) : pastilles d'état, étiquettes d'événement, adresse de la personne connectée.
- **Section label** (700, `0.8rem`, `0.09em`, capitales) : le titre d'un bloc de page.
- **Overline** (700, `0.74rem`, `0.09em`, capitales) : en-têtes de colonne, compteurs, chapeau du panneau. **Réservé à ces emplois**, jamais au-dessus d'un titre de page.
- **Top overline** (600, `0.78rem`, `0.06em`, capitales) : la ligne « Zenway Saint-Laurent-du-Var · Backoffice » au-dessus du titre de page. **Exception épinglée, voir la règle du chapeau ci-dessous** — cet emploi, et lui seul, est autorisé au-dessus d'un titre.
- **Eyebrow** (DM Sans 400, `0.82rem`, `0.18em`, capitales) : le chapeau au-dessus du H1 du hero, et lui seul sur le site public.

### Named Rules

**La règle de l'échelle serrée.** Entre deux niveaux consécutifs de l'interface, le rapport reste entre 1,12 et 1,2. La hiérarchie se fait au poids et à la famille avant de se faire à la taille. L'admin a son propre barreau, plus serré que celui du site : c'est une échelle d'interface, pas une échelle éditoriale.

**La règle du serif absent en mode tâche.** Dans l'admin, Cormorant ne touche plus rien du tout. Titres compris : ils passent au DM Sans gras capitales. Une console n'a pas de voix éditoriale.

**La règle du chapeau interdit, et sa seule exception.** Aucun sur-titre en petites capitales espacées au-dessus d'un titre. L'overline existe comme en-tête de colonne, titre de bloc ou étiquette de contexte dans le panneau. **L'unique exception est l'en-tête de l'admin** (« Zenway Saint-Laurent-du-Var · Backoffice » au-dessus du titre de page) : elle vient d'une maquette épinglée par l'utilisateur, elle situe l'outil pour quelqu'un qui y arrive par URL directe, et elle n'est reconductible nulle part ailleurs — surtout pas sur le site public.

## Layout

### Le site public

Un conteneur de 1180 px (`--r-maxw`) avec une gouttière de 28 px (`--r-gut`). La page n'a pas de fond propre : chaque section porte le sien, en bande pleine largeur, et le conteneur ne fait que borner le texte. Trois ruptures :

- **1040 px** — les médaillons passent de quatre à deux colonnes, les grilles à deux colonnes se resserrent.
- **880 px** — menu burger, tiroir plein écran, colonne unique pour les grilles de section. Les nappes d'ornement s'effacent en opacité plutôt que de disparaître.
- **620 px** — les médaillons passent à une colonne ; les ornements qui sont des compositions en largeur (la vigne des médaillons, les volutes du bas de section, la vague de coupure du hero) sont retirés : à cette largeur ils se resserrent en nœuds au lieu de se lire.

### L'administration

Une charpente en deux colonnes, en flex : une barre latérale de **232 px** collée en haut et haute de tout l'écran, puis la zone de travail. Celle-ci porte un en-tête collant de **84 px** minimum (sur-titre et titre de page à gauche, actions de page puis Déconnexion à droite) et une page de contenu limitée à **1220 px**, avec `20px 40px 90px` de padding.

**La grille du tableau de bord** est en **douze colonnes**, gouttière 20 px, et ne sert qu'à cette page. Les cartes s'y posent en `span 3 / 4 / 5 / 7` : trois cartes de résumé en haut (4+4+4), le tableau des séances et les actions au milieu (7+5), deux cartes de rappel et l'illustration en bas (5+4+3). Les autres pages restent en colonne simple.

Trois ruptures :

- **1100 px** — les paddings se resserrent, la colonne de libellés des listes de faits passe de 210 à 172 px, et la grille du tableau de bord retombe à deux colonnes (tout en `span 6`).
- **900 px** — la barre latérale sort du flux : elle devient un tiroir de `min(300px, 86vw)` en `translateX(-100%)`, ouvert par le bouton burger de l'en-tête, posé au-dessus d'un voile. Les listes de faits passent en colonne unique.
- **700 px** — l'en-tête passe sur deux lignes, l'action principale prend toute la largeur et la Déconnexion perd son libellé pour ne garder que son icône (son `aria-label` porte le mot) ; la grille du tableau de bord passe en colonne unique ; les tableaux se replient en fiches empilées ; le panneau latéral prend tout l'écran.

**La règle de la respiration au-dessus.** Toujours plus d'espace au-dessus d'un titre qu'en dessous. Un groupe se serre, deux groupes s'écartent.

**La règle du tableau qui ne défile pas.** Sous 700 px un tableau ne part jamais en défilement latéral : il se replie en fiches, chaque cellule devenant une ligne. Un défilement horizontal cacherait justement la colonne d'état, qui est l'information la plus utile de la liste.

## Elevation & Depth

Les deux surfaces n'ont pas le même relief, et c'est délibéré.

**Le site public est posé à même la bande.** Le relief n'y sert qu'à trois choses : les médaillons de pratique, les médias (vidéos, carte, fiches disciplines) et le formulaire d'adhésion. Tout le reste — texte, listes, lignes d'événement, grille de planning — est tenu par des filets de 1 px et par l'espace. Une ombre sous un paragraphe n'appartient pas à ce système.

**L'administration flotte, tenue par l'ombre.** Une surface de contenu se distingue par son ombre et son rayon, pas par une bordure — l'inverse du site public, qui réserve le relief à trois usages précis et tient tout le reste au filet. Le filet ne reste que pour le fonctionnel : un champ, un séparateur de tableau, une dropzone.

### Shadow Vocabulary

- **Le posé léger** (`--r-shadow-sm`, `0 2px 6px rgb(43 51 47 / 6%), 0 8px 20px rgb(43 51 47 / 7%)`) — site public, bande claire : cartes vidéo, encarts.
- **Le posé** (`--r-shadow`, `0 4px 12px rgb(43 51 47 / 8%), 0 18px 44px rgb(43 51 47 / 10%)`) — site public, bande claire : fiches disciplines, carte de planning.
- **Le posé sur sombre** (`--r-shadow-dark`, `0 4px 12px rgb(12 16 15 / 26%), 0 22px 52px rgb(12 16 15 / 30%)`) — site public, bande sombre : les médaillons de pratique. Sur fond sombre l'ombre seule ne détache rien : les médaillons y ajoutent leur cerclage de pierre.
- **Le posé de console** (`--ad-shadow`, `0 2px 8px -4px rgba(28,55,64,.07), 0 18px 40px -24px rgba(28,55,64,.18)`) — admin : blocs, tableaux, rangées au survol, fiches empilées en mobile. C'est ce qui les détache du fond gris-bleu, plus que le rayon.
- **Le posé léger de console** (`--ad-shadow-sm`, `0 1px 2px rgba(28,55,64,.05), 0 8px 20px -14px rgba(28,55,64,.16)`) — admin : encarts, état vide autonome, rangée d'action au survol.
- **Le flottant** (`--ad-shadow-lg`, `0 26px 64px -28px rgba(20,42,50,.35)`) — admin : le panneau latéral, le tiroir de menu, la carte de connexion, la bannière de confirmation.
- **Le filet interne** (`inset 0 0 0 1px …`) : la façon de cerner une pastille ou un encart sans lui donner de bordure.

### Named Rules

**La règle du sol unique.** Une surface ne se pose jamais sur une autre surface de même nature. Si un contenu semble réclamer une carte dans une carte, c'est qu'il lui faut une liste séparée par des filets. Elle est appliquée en CSS, pas seulement écrite : dans l'admin, `.ad-box .ad-tablewrap` et `.ad-box .ad-empty` perdent leur fond, leur ombre et leur rayon, et sous 700 px les fiches empilées d'un tableau déjà encarté redeviennent de simples lignes filetées.

**La règle de l'ombre douce.** Toute ombre a un décalage vertical et un flou d'au moins le double de ce décalage. Une ombre nette, sans flou ou sans décalage, n'appartient pas à ce système.

## Shapes

**Les deux surfaces arrondissent, chacune à sa mesure.** Le site public reste sur sa gélule et ses 22 px de rayon (`--r-radius`), ses médaillons en cercles parfaits. L'administration a sa propre échelle, plus resserrée : 10 px pour le fonctionnel et pour **tous ses boutons**, 14 px pour les cartes de contenu, 20 px pour les moments hors-page. Les commandes de l'admin sont des rectangles arrondis, pas des gélules : c'est ce qui distingue le plus vite un bouton de console d'un bouton d'appel du site.

Côté site public :

- **50 %** — les médaillons de pratique ; c'est la forme signature de la page.
- **999 px** — tous les boutons, les pastilles et les étiquettes.
- **22 px** (`--r-radius`) — médias, fiches disciplines, carte de planning, formulaire d'adhésion.
- **12–14 px** — les petits blocs : icône d'événement, vignette d'image, images des fiches.

Côté administration :

- **10 px** (`--ad-r-md`) — **tous les boutons**, champs de saisie, boutons-icônes, vignettes, alertes, rangées d'action.
- **14 px** (`--ad-r-card`) — blocs, tableaux, encarts, fiches mobiles.
- **20 px** (`--ad-r-lg`) — carte de connexion, coin intérieur du panneau latéral.
- **`0 10px 10px 0`** — l'entrée de menu : carrée au bord gauche de la barre, arrondie côté intérieur, pour que le liseré de l'entrée active touche le bord.
- **999 px** — pastilles, étiquettes, compteurs et puces seulement.

Les bordures sont des filets de 1 px, jamais plus, dans les deux mondes.

Un liseré coloré de plus de 1 px sur le flanc d'un bloc n'existe pas dans ce système ; un état se marque par un champ de couleur qui remplit la ligne entière. **Deux exceptions assumées**, et pas une de plus : le filet d'or de 2 px qui détache le rappel « en complément d'un suivi médical » au pied de chaque fiche discipline, et le **liseré sarcelle de 4 px de l'entrée de menu active** dans l'admin, épinglé par la maquette. Ce dernier ne marque pas un état mais une position, il est doublé par le champ pâle et par `aria-current="page"`, et il ne se reconduit sur aucun autre composant.

## Components

### Buttons

- **Shape :** rectangle arrondi à 10 px dans l'admin, gélule (999 px) sur le site public. Hauteur minimale 42 px dans l'admin, 44 px sur le site.
- **Primary :** fond Sarcelle Ardoise, texte blanc (5,2:1), graisse 700, `10px 18px`. Au survol le fond descend à `#3a6674`. Pas de déplacement : dans une console, un bouton qui bouge au survol est du bruit.
- **Soft :** fond `--ad-accent-field`, texte de titre, sans filet — l'action de second rang d'une rangée ou d'une ligne de tableau, quand la principale est déjà pleine à côté.
- **Line :** fond de surface, filet `--ad-line`, texte d'encre. Au survol, le filet passe au sarcelle.
- **Danger :** plein Terre Brûlée sur texte blanc, réservé à la confirmation de suppression.
- **Icon button :** 38 × 38 px, transparent, filet au survol, 10 px de rayon. Dans la barre latérale il perd son filet au repos.
- **Déconnexion :** à part des actions de page, tout à droite de l'en-tête — filet et texte sarcelle sur fond de surface. Sous 700 px elle perd son libellé et ne garde que son icône, son `aria-label` portant le mot.
- **Working :** le bouton garde sa place et sa largeur, son icône est remplacée par une roue de 16 px et son libellé dit ce qui se passe (« Enregistrement… »). Il retrouve son icône exacte au retour, et tout le pied du panneau se verrouille pendant l'opération.

**Les boutons du site public** forment une famille à part, en gélule : **Gold** (fond or, texte ardoise) pour l'appel d'une bande sombre, **Sage** (fond sauge, texte crème) pour l'appel d'une bande claire, **Line** (filet seul) pour l'action de second rang. Un seul bouton plein par bande — s'il en faut deux, le second passe en Line.

### Inputs / Fields

- **Style :** fond de surface, filet `--ad-line`, 10 px de rayon, `12px 14px`, hauteur minimale 46 px.
- **Focus :** le filet passe au sarcelle et un halo de 3 px l'entoure ; aucun déplacement.
- **Hint :** chaque champ porte sous lui une phrase qui dit où la valeur apparaîtra sur le site public.
- **Error :** le message se pose dans le pied du panneau, dans le bloc d'alerte Terre Brûlée, nomme le problème et la sortie, et le focus retourne au champ fautif.

### Navigation — la barre latérale

- **Tête :** le logo et le mot **ZENWAY** en capitales grasses, rien d'autre. Le lieu et le mot « Administration » ont quitté la barre : ils sont dans le sur-titre de l'en-tête.
- **Entrée :** icône, libellé, pastille de compte facultative. Rayon `0 10px 10px 0`, `12px 14px 12px 21px`. La rangée part du bord gauche de la barre : c'est ce qui permet au liseré de l'entrée active d'y toucher.
- **Repos :** encre à 70 % d'opacité (5,1:1 sur blanc), fond transparent. **Survol :** fond sarcelle à 7 %, texte plein.
- **Active :** `aria-current="page"`, fond `--ad-accent-field`, texte de titre, icône sarcelle, graisse 700, pastille en sarcelle plein, **et un liseré sarcelle de 4 px collé au bord gauche de la barre**. C'est l'exception au « pas de liseré latéral », épinglée par la maquette et décrite dans Shapes : elle marque une position, jamais un état, et le champ pâle la double.
- **Pied :** « Voir le site public », puis l'adresse de la personne connectée. Le bouton de déconnexion n'y est plus : il est monté dans l'en-tête.
- **Tiroir mobile :** sous 900 px, `translateX(-100%)` → `0`, voile de fond, fermeture par Échap, par le voile, par le bouton de fermeture, ou par le choix d'une page.

### Tables

- **En-tête :** pas de fond ni d'overline — **libellés en gras, en casse normale**, encre de titre, sur un simple filet bas de 1 px. C'est la table de la maquette.
- **Ligne :** `13px 16px`, filet haut de 1 px. La première et la dernière cellule se rapprochent du bord (`4px`) pour que la colonne s'aligne sur le titre de la carte.
- **Ligne cliquable :** seule une table portant `.ad-table-click` prend le curseur pointeur et le survol — toute la ligne ouvre alors la fiche, mais le titre reste un vrai `<button>` pour le clavier. Une table dont chaque ligne porte déjà son bouton (le tableau de bord) ne la prend pas : deux cibles concurrentes sur la même ligne, c'est une ambiguïté, pas une commodité.
- **Ligne mise en avant :** champ `--ad-accent-field` sur toute la ligne, qui garde sa teinte au survol.
- **Sous 700 px :** chaque ligne devient une fiche ombrée, l'en-tête disparaît, et la flèche d'ouverture se positionne à droite en absolu. Dans une table déjà encartée, la fiche redevient une simple ligne filetée — voir la règle du sol unique.
- **Site public, grille de planning :** elle réclame 620 px de colonnes. Sous 760 px, le tableau cède la place à une liste de séances — pastille du jour, horaire en Cormorant, lieu — écrite dans le HTML à côté de lui : le CSS n'en montre jamais qu'une, jamais de défilement horizontal.

### Tabs

Onglets soulignés, pas de segment ni de pilule : filet de 1 px sous la rangée, soulignement de 2 px en sarcelle sous l'onglet courant, compteur en pastille à droite du libellé.

### Chips / Pills

Fond `--ad-hover` et filet interne au repos ; fond `--ad-accent-field` et texte `--ad-accent-text` (5,5:1) quand le contenu est visible par le public. Toujours accompagnée d'une icône (œil ouvert, œil barré, carton d'archive) et du texte en clair.

### Card head — le titre de carte et son action

Titre de bloc à gauche, action à droite, sur une seule ligne. Deux formes seulement : un **lien de renvoi** en sarcelle avec sa flèche (`ad-card-go`) quand l'action est « aller voir ailleurs », un **bouton plein** quand elle est « faire quelque chose ici ». Jamais les deux dans la même carte.

### Panel — le panneau latéral

Bâti sur `<dialog>` natif : le piège à focus, la fermeture par Échap et le voile viennent du navigateur. Tiroir de 520 px à droite, coin intérieur arrondi à 20 px (le bord extérieur reste flush avec l'écran), plein écran et sans rayon sous 700 px, en trois bandes — en-tête (icône, chapeau, titre, fermeture), corps défilant, pied fixe portant l'alerte et les actions. Le premier champ prend le focus à l'ouverture. Tout ce qui agit dans l'admin passe par lui ; les pages ne portent que de la lecture et des listes.

### Rows — les rangées d'action

Une rangée par action possible : icône, titre en gras, **et une phrase qui dit la conséquence sur le site public**. C'est la forme que prend une décision dans cette console, jamais un bouton nu.

Deux variantes, selon que la rangée est elle-même la cible ou qu'elle porte sa commande : `ad-row` (toute la rangée est cliquable, fond `--ad-raise`, ombre légère au survol) et `ad-act` (la rangée est une ligne filetée, le bouton à droite porte l'action). Le tableau de bord emploie la seconde, les pages la première.

### Dashboard cards — les trois formes de résumé

- **Stat** : carte teintée en dégradé, grand chiffre, une phrase qui dit ce que ce chiffre commande sur le site, un bouton plein, et un filigrane de feuilles en `--ad-tint-deep`. Une seule par page.
- **List** : puces sarcelle, libellé à gauche, méta à droite (`ad-list`). La forme par défaut d'un rappel.
- **Figure** : une valeur en gros, sa précision en dessous, et une **onde** posée en absolu contre les trois bords bas de la carte — la même figure que les coupures courbes du site public, seul écho formel entre les deux surfaces.

### Feedback

- **Flash :** bannière posée en bas de l'écran, hors du flux, fond `--ad-ok-bg`, texte `--ad-ok` (7,3:1), qui s'efface après cinq secondes.
- **Empty :** icône à 32 px, titre, une phrase qui explique ce que le visiteur voit à la place sur le site, et l'action de sortie quand elle existe.
- **Skeleton :** barres balayées par un dégradé, doublées d'un `role="status"` invisible.

### Signature Component — la page qui déclare ce qu'elle commande

Chaque page de l'admin dit en toutes lettres ce que le site publie à cause d'elle. Les pages de liste le disent dans leur phrase d'ouverture (`ad-lede`), au-dessus de tout autre contenu. **Le tableau de bord n'a pas de phrase d'ouverture** : il en fait la matière de ses cartes, chacune nommant ce qu'elle commande (« visibles dans la section “Événements à venir” du site », « Le bandeau du site est masqué ») et portant son renvoi vers la page qui l'édite. Aucune page ne peut exister sans cette déclaration, sous l'une ou l'autre forme : c'est ce qui distingue cette console d'un simple formulaire.

## Do's and Don'ts

### Do:

- **Do** passer par les jetons `--ad-*` pour toute couleur de l'admin.
- **Do** écrire tout état en toutes lettres, avec son icône, avant de lui donner une couleur.
- **Do** garder une seule couleur d'accent dans l'admin, le Sarcelle Ardoise, et une seule dans le site public, l'or.
- **Do** employer `--ad-accent-text` (`#2c6373`) dès que le sarcelle devient du texte ou un lien : `--ad-accent` n'atteint pas AA sur blanc.
- **Do** garder les cibles cliquables au-dessus de 44 px et la densité basse.
- **Do** dessiner les icônes en SVG, tracé 1,5 px et bouts arrondis, et poser le tracé sur le `<svg>` porteur du `<use>` — un sélecteur ne franchit pas le clone, une propriété héritée si.
- **Do** faire dire à chaque rangée d'action sa conséquence sur le site public.
- **Do** replier un tableau en fiches sous 700 px plutôt que de le laisser défiler latéralement.
- **Do** garder le filet pour le fonctionnel (champ, dropzone, séparateur de tableau ou de liste) même quand la carte qui l'entoure n'en a plus — l'ombre et le rayon portent le reste.
- **Do** retirer fond, ombre et rayon à un tableau ou à un état vide déjà posé dans une carte : `.ad-box .ad-tablewrap` et `.ad-box .ad-empty` le font déjà, ne les redéclarez pas.
- **Do** libérer dans `unmount()` tout ce que `mount()` a pris — abonnements au magasin, écouteurs globaux.

### Don't:

- **Don't** imbriquer une surface dans une surface de même nature : une liste séparée par des filets répond au même besoin.
- **Don't** poser un sur-titre en petites capitales espacées au-dessus d'un titre — hors l'unique en-tête de l'admin, épinglé par la maquette.
- **Don't** utiliser un liseré coloré de plus de 1 px sur le flanc d'un bloc pour marquer un état — hors l'unique entrée de menu active de l'admin, qui marque une position et non un état.
- **Don't** faire entrer l'or ou le Cormorant dans `/admin`, ni sortir le sarcelle vers le site public.
- **Don't** introduire une couleur hors palette sans la déclarer en variable.
- **Don't** ajouter une troisième police : Cormorant et DM Sans suffisent, et une police déclarée sans usage réel finit par être retirée.
- **Don't** employer une fenêtre système (`confirm`, `alert`) : la confirmation de suppression se joue dans le panneau, et propose l'archivage comme sortie.
- **Don't** poser du flou ou du verre en décoration ; le relief de ce système est une ombre et un filet, pas une texture.
- **Don't** laisser une surface de contenu de l'admin sans le rayon de son jeton (12/18/24 px) ; à l'inverse, ne pas donner à un bloc de texte du site public un rayon hors de sa liste assumée (médias, encarts, gélules).
- **Don't** poser une ombre sous un bloc de texte du site public : ce relief est réservé aux médaillons, aux médias et au formulaire d'adhésion.
- **Don't** laisser un ornament de composition en largeur (vigne, volutes, vague de coupure) sous 620 px : il s'y resserre en nœud.
- **Don't** animer un bouton d'admin en déplacement au survol : la couleur suffit.
