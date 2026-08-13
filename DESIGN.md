---
name: Zenway Saint-Laurent-du-Var
description: Une feuille de papier levée sur un bain d'eau verte — le site vitrine et son atelier d'administration.
colors:
  gold: "#c9a86a"
  gold-soft: "#e7d6ad"
  teal: "#2f8f7f"
  teal-bright: "#36a18c"
  green-900: "#1b4332"
  green-950: "#17392b"
  green-800: "#22543e"
  green-700: "#2d6a4f"
  mint: "#d8f3dc"
  mint-soft: "#eef7f0"
  beige: "#f5f1e8"
  paper: "#faf8f2"
  ink: "#243029"
  ink-soft: "#4b5a51"
  danger: "#a3341f"
  danger-bg: "#fbeae6"
  danger-border: "#eec3b8"
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
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.95rem"
    fontWeight: 400
    lineHeight: 1.1
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "1.06rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.3
  script-accent:
    fontFamily: "Caveat, cursive"
    fontSize: "1.5rem"
    fontWeight: 400
rounded:
  none: "0"
  xs: "2px"
  sm: "3px"
  pill: "999px"
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
    backgroundColor: "{colors.gold}"
    textColor: "{colors.green-900}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.gold-soft}"
    textColor: "{colors.green-900}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.mint}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  input-field:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    height: "46px"
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "38px 42px 42px"
  state-chip-live:
    backgroundColor: "{colors.gold-soft}"
    textColor: "#5a4415"
    rounded: "{rounded.xs}"
    padding: "7px 14px 7px 11px"
---

# Design System: Zenway Saint-Laurent-du-Var

## Overview

**Creative North Star : « La feuille levée sur le bain »**

Le fond n'est jamais un aplat. C'est un bain : trois dégradés radiaux de verts profonds superposés, fixés au viewport, qui donnent au fond une épaisseur d'eau plutôt qu'une couleur. Sur ce bain, le contenu arrive comme une feuille de papier chaud posée à la surface — angles vifs, aucun arrondi, et une ombre longue et très diffuse qui la fait flotter sans jamais la découper. Tout le système tient dans ce rapport de deux matières : l'eau sombre et le papier clair.

La discipline que le site présente fusionne quatre pratiques en un seul enchaînement continu ; le système visuel se comporte de la même façon. Une seule famille de gestes, jamais un assemblage de composants empruntés. L'or n'apparaît que là où quelque chose doit être décidé ou signalé comme publié ; le teal ne sert qu'aux états d'attention et au focus ; tout le reste est vert, papier et encre. Le public est majoritairement senior : la densité reste basse, les cibles tactiles larges, et aucune information n'est portée par la couleur seule.

L'atelier d'administration (`/admin`) est le même monde en mode tâche. Il n'invente rien : il empile les mêmes feuilles sur le même bain, remplace les titres de section par des titres de feuille, et refuse le vocabulaire du panneau d'administration générique — pas de routeur à onglets, pas de carte blanche arrondie à ombre douce, pas de barre latérale pleine.

**Key Characteristics :**
- Un fond en profondeur d'eau, jamais un aplat de couleur
- Du papier à angles vifs, posé, jamais encadré
- Une ombre longue et très diffuse comme seule source de relief
- L'or rare et décisif, le teal réservé à l'attention
- Cormorant pour les titres, DM Sans pour tout le reste, Caveat une ligne à la fois
- Une densité basse et des cibles généreuses, tenues par le public visé

## Colors

Une palette de forêt et d'eau, réchauffée par un or unique et un papier crème ; aucune couleur froide, aucun gris neutre.

### Primary
- **Or Sanctuaire** (`#c9a86a`) : la seule couleur de décision. Bouton d'action principale, cran de la section lue dans le sommaire de l'atelier, filet sous la barre d'administration. Jamais décorative.
- **Or Sanctuaire Clair** (`#e7d6ad`) : le survol de l'or, et le fond des états « publié sur le site ». Sur fond sombre, il porte les sur-titres de la barre.

### Secondary
- **Teal Sanctuaire** (`#2f8f7f`) : l'attention sans l'alarme — icônes de titre de feuille, libellés de champ secondaires, anneau de focus des champs.
- **Teal Lumineux** (`#36a18c`) : le survol du teal et le contour de focus sur les surfaces papier.

### Neutral
- **Vert Forêt Profonde** (`#1b4332`) : le corps du bain et le fond des barres. C'est la couleur de base du produit.
- **Vert Abyssal** (`#17392b`) : le second point du dégradé de fond, qui creuse le bain en bas à droite.
- **Vert Mousse** (`#22543e`) : le premier point du dégradé, en haut à gauche ; sert aussi aux libellés de formulaire sur papier.
- **Vert Forêt** (`#2d6a4f`) : titres sur papier, fond des boutons pleins secondaires, liens dans les listes.
- **Menthe** (`#d8f3dc`) : le texte et les filets sur fond sombre.
- **Menthe Douce** (`#eef7f0`) : le champ de couleur qui désigne une ligne publiée ou un encart de décision dans une feuille.
- **Beige Sanctuaire** (`#f5f1e8`) : le fond des blocs d'aveu — ce que le système ne sait pas encore faire.
- **Papier** (`#faf8f2`) : la matière de toute surface de contenu.
- **Encre** (`#243029`) et **Encre Douce** (`#4b5a51`) : texte principal et texte secondaire sur papier.

### Tertiary
- **Terre Brûlée** (`#a3341f`), sur **fond** `#fbeae6` et **filet** `#eec3b8` : erreur et suppression, exclusivement. Jamais un avertissement, jamais un accent.

### Named Rules

**La règle des deux matières.** Toute surface est soit du bain, soit du papier. Il n'existe pas de troisième fond. Un bloc à l'intérieur d'une feuille se distingue par une teinte de la palette claire (menthe douce, beige) et un filet interne, jamais par une nouvelle élévation.

**La règle de l'or rare.** L'or ne se pose que sur trois choses : l'action principale, l'état « visible par le public », et le repère de position courante. S'il apparaît ailleurs, c'est de la décoration et il faut l'enlever.

**La règle du mot avant la couleur.** Aucun état n'est porté par la seule couleur. « En ligne sur le site » s'écrit ; la pastille dorée ne fait que le confirmer.

## Typography

**Display Font :** Cormorant Garamond (Georgia, serif)
**Body Font :** DM Sans (system-ui, sans-serif)
**Accent Font :** Caveat (cursive)

**Character :** un serif de la Renaissance, léger et haut d'axe, posé sur une grotesque géométrique tiède. Le contraste est fort en dessin mais faible en taille : les titres ne hurlent pas, ils changent de voix.

### Hierarchy
- **Display** (400, `clamp(2.2rem, 3.4vw, 3.2rem)`, 1.08) : le H1 du hero, une seule fois par page.
- **Headline** (400, `clamp(2.1rem, 4.2vw, 3.2rem)`, 1.08) : les H2 de section du site public.
- **Title** (400, `1.95rem`, 1.1) : les titres de feuille dans l'atelier. Taille fixe, jamais fluide : en mode tâche, un titre qui se redimensionne avec la fenêtre dessert la lecture.
- **Body** (400, `1.06rem`, 1.7) : le texte courant. Mesure de 62 à 68 caractères sur papier.
- **Label** (600, `0.85rem`, 1.3) : libellés de champ, boutons, éléments de sommaire.
- **Accent manuscrit** (400, `1.5rem`) : une phrase, une ligne, jamais un paragraphe.

### Named Rules

**La règle de l'échelle serrée.** Entre deux niveaux consécutifs de l'interface, le rapport reste entre 1,12 et 1,2. La hiérarchie se fait au poids et à la famille avant de se faire à la taille.

**La règle du sans-serif en mode tâche.** Dans l'atelier, Cormorant ne touche que les titres de feuille. Tout ce qui est libellé, bouton, valeur ou donnée est en DM Sans, et Caveat n'y entre pas du tout.

**La règle du chapeau interdit.** Aucun sur-titre en petites capitales espacées au-dessus d'un titre. Une donnée qui doit accompagner un titre se place en dessous, en casse normale, et se nomme (« Étiquette : … »).

## Layout

Le site public tient dans un conteneur de 1180 px avec une gouttière de 30 px, ramenée à 20 px sous 980 px. Les sections respirent à 74–110 px de padding vertical et passent toutes en colonne unique à 980 px.

L'atelier partage la largeur de 1180 px mais l'organise en deux colonnes : une réglette de sommaire de 196 px et la pile de feuilles. Une seule page, aucun routeur : toutes les sections sont montées simultanément et empilées avec 40 px entre elles ; la réglette est un sommaire qui suit la lecture, pas une navigation qui remplace le contenu.

Deux points de rupture structurels : **980 px** (le site passe en colonne unique) et **940 px** (la réglette de l'atelier quitte la marge et devient une bande horizontale collée sous la barre). Un troisième à **700 px** rend la barre d'administration non collante, pour rendre l'écran à la saisie, et **680 px** ouvre le menu burger du site public.

**La règle de la respiration au-dessus.** Toujours plus d'espace au-dessus d'un titre qu'en dessous. Un groupe se serre, deux groupes s'écartent.

**La règle de la mesure du champ.** Un champ de formulaire ne dépasse jamais 620 px, quelle que soit la largeur de la feuille : au-delà, l'œil perd le lien entre le libellé et la fin de la ligne saisie.

## Elevation & Depth

Le système est **posé, pas empilé**. Il n'existe qu'un seul geste de relief : une ombre très décalée vers le bas, très floue et très rentrée (`-34px` de spread), qui fait flotter le papier au-dessus du bain sans jamais dessiner un contour. À l'intérieur d'une feuille, la profondeur n'existe plus : les blocs se distinguent par un filet de 1 px ou un champ de couleur, jamais par une ombre.

### Shadow Vocabulary
- **La feuille levée** (`box-shadow: 0 30px 70px -34px rgba(0, 0, 0, 0.85)`) : toute surface papier posée sur le bain.
- **Le relief de survol** (`box-shadow: 0 12px 24px -14px rgba(0, 0, 0, 0.7)`) : les boutons dorés au survol, combinés à `translateY(-1px)`.
- **Le filet interne** (`box-shadow: inset 0 0 0 1px …`) : la seule façon de cerner un bloc dans une feuille.

### Named Rules

**La règle du sol unique.** Une feuille ne se pose jamais sur une autre feuille. Si un contenu semble réclamer une carte dans une carte, c'est qu'il lui faut une liste séparée par des filets.

**La règle de l'ombre douce.** Toute ombre a un décalage vertical et un flou d'au moins le double de ce décalage. Une ombre nette, sans flou ou sans décalage, n'appartient pas à ce système.

## Shapes

Le papier n'a **aucun arrondi** : les feuilles, les cartes de connexion et les blocs de section ont des angles vifs. Les arrondis sont réservés aux commandes et à un seul usage de média :

- **0** — toute surface papier ; c'est la forme signature.
- **2 px** — pastilles d'état et étiquettes.
- **3 px** — boutons, champs de saisie, encarts internes.
- **999 px** — les boutons du site public uniquement (les CTA marketing).
- **22 px** — les médias du site public (vidéos, cartes, images).

Les bordures sont des filets de 1 px, jamais plus. Un liseré coloré de plus de 1 px sur le côté d'un bloc n'existe pas dans ce système ; un état se marque par un champ de couleur qui déborde jusqu'aux marges de la feuille.

## Components

### Buttons
- **Shape :** angles très légèrement adoucis (3 px), hauteur minimale 46 px pour la cible tactile.
- **Primary :** fond Or Sanctuaire, texte Vert Forêt Profonde, graisse 700, `12px 20px`.
- **Hover / Focus :** l'or passe en Or Sanctuaire Clair, le bouton monte de 1 px et prend le relief de survol. Le focus visible est un contour Teal Lumineux de 2 px sur papier, Or sur le bain.
- **Line :** transparent, filet d'encre à 16 %, texte Encre. Au survol, fond Menthe Douce et filet Vert Forêt.
- **Quiet (sur le bain) :** transparent, filet menthe à 38 %, texte Menthe.
- **Danger :** transparent, filet et texte Terre Brûlée ; en confirmation, le bouton devient plein Terre Brûlée sur texte blanc.
- **Working :** le bouton garde sa place, son icône est remplacée par une roue de 16 px et son libellé dit ce qui se passe (« Enregistrement… »). Il retrouve son icône au retour.

### Inputs / Fields
- **Style :** fond blanc pur, filet d'encre à 16 %, 3 px de rayon, `12px 14px`, hauteur minimale 46 px.
- **Focus :** le filet passe en Teal Sanctuaire et un halo de 3 px à 18 % l'entoure ; aucun déplacement.
- **Error :** le message se pose sous le champ concerné dans le bloc d'alerte Terre Brûlée, nomme le problème et la sortie.

### Chips
- **État :** fond Menthe Douce et texte Vert Mousse au repos, fond Or Sanctuaire Clair et texte `#5a4415` quand le contenu est visible par le public. Toujours accompagné d'une icône œil ouvert ou barré et du texte en clair.
- **Badge de ligne :** version compacte en petites capitales, sur une ligne publiée.

### Cards / Containers
- **La feuille** est le seul conteneur : fond Papier, angles vifs, aucune bordure, la feuille levée en ombre, `38px 42px 42px` de padding, ramené à `32px 26px` sous 940 px et `28px 20px` sous 520 px.
- **Blocs internes :** séparés par un filet d'encre à 8 % et 30 px de padding haut, jamais par une carte imbriquée.

### Navigation
- **La réglette de sommaire :** un filet vertical d'où pend chaque section par un cran de 16 × 2 px. Le cran de la section lue s'étend à pleine longueur et passe à l'or ; celui de la section survolée s'étend aux quatre cinquièmes et passe en menthe. L'extension se fait par `transform: scaleX()`, jamais par `width`. Chaque entrée porte, sous son libellé, l'état publié de sa section en abrégé.
- **Mobile :** sous 940 px la réglette bascule en bande horizontale défilante collée sous la barre, et le cran devient un filet sous l'entrée.
- **La barre :** Vert Forêt Profonde, filet Or Sanctuaire Clair à 24 % en pied, collante au-dessus de 700 px seulement.

### Signature Component — l'état de publication

Chaque feuille de l'atelier déclare, juste sous son titre et avant son contenu, ce que le site publie en ce moment à cause d'elle : une pastille avec l'icône d'œil, l'état écrit en toutes lettres, et l'or si c'est visible du public. Le même état, abrégé, s'inscrit dans la réglette. Aucune feuille ne peut exister sans cette déclaration : c'est ce qui distingue cet atelier d'un formulaire.

## Do's and Don'ts

### Do:
- **Do** poser tout contenu sur du papier à angles vifs avec la feuille levée (`0 30px 70px -34px rgba(0,0,0,.85)`).
- **Do** écrire tout état en toutes lettres avant de lui donner une couleur.
- **Do** réserver l'or à l'action principale, à l'état publié et au repère de position.
- **Do** garder les champs de formulaire sous 620 px et les cibles cliquables au-dessus de 44 px.
- **Do** dessiner les icônes en SVG, tracé 1,5 px et bouts arrondis, et poser le tracé sur le `<svg>` porteur du `<use>`.
- **Do** confirmer une suppression dans la ligne elle-même.
- **Do** animer par `transform` et couleur ; laisser opacité et visibilité tranquilles pour qu'une animation en pause ne cache jamais un contenu.

### Don't:
- **Don't** imbriquer une carte dans une carte : une liste séparée par des filets répond au même besoin.
- **Don't** poser un sur-titre en petites capitales espacées au-dessus d'un titre.
- **Don't** utiliser un liseré coloré de plus de 1 px sur le flanc d'un bloc pour marquer un état.
- **Don't** introduire une couleur hors palette sans la déclarer en variable dans `assets/css/base.css`.
- **Don't** faire entrer Caveat dans une interface de tâche, ni l'utiliser sur plus d'une ligne.
- **Don't** employer une fenêtre système (`confirm`, `alert`) ni une modale pour une tâche qui ne réclame ni interruption ni protection.
- **Don't** poser du flou ou du verre en décoration ; le relief de ce système est une ombre, pas une texture.
- **Don't** arrondir une surface papier.
