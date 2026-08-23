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
  admin-bg: "#f2f0e9"
  admin-surface: "#ffffff"
  admin-side: "#1b4332"
  admin-bg-dark: "#0f2419"
  admin-surface-dark: "#173425"
  admin-side-dark: "#0a1e14"
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
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.85rem"
    fontWeight: 400
    lineHeight: 1.1
  panel-title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.45rem"
    fontWeight: 400
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
    backgroundColor: "{colors.gold}"
    textColor: "{colors.green-900}"
    rounded: "{rounded.sm}"
    padding: "11px 18px"
    minHeight: "44px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "#d8bb85"
    textColor: "{colors.green-900}"
  button-line:
    backgroundColor: "{colors.admin-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "11px 18px"
    minHeight: "44px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "11px 18px"
  icon-button:
    backgroundColor: "transparent"
    rounded: "{rounded.sm}"
    width: "38px"
    height: "38px"
  input-field:
    backgroundColor: "{colors.admin-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    minHeight: "46px"
  box:
    backgroundColor: "{colors.admin-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px 26px 26px"
    border: "1px solid rgba(36, 48, 41, 0.14)"
  nav-item:
    backgroundColor: "transparent"
    textColor: "rgba(216, 243, 220, 0.68)"
    rounded: "{rounded.sm}"
    padding: "11px 13px"
  nav-item-active:
    backgroundColor: "rgba(216, 243, 220, 0.14)"
    textColor: "#eaf5ec"
  pill-live:
    backgroundColor: "#f6ecd6"
    textColor: "#75591f"
    rounded: "{rounded.xs}"
    padding: "4px 10px 4px 8px"
  site-button:
    rounded: "{rounded.xs}"
    padding: "14px 28px"
---

# Design System: Zenway Saint-Laurent-du-Var

## Overview

Le projet porte **deux surfaces au registre volontairement différent**, tenues ensemble par une seule palette, trois caractères et une même discipline de tracé.

**Le site public — « les bandes qui alternent ».** La page ne pose pas de cartes sur un fond : elle avance par bandes pleine largeur qui alternent le crème (`#f8f4ec`) et l'ardoise chaude (`#343b3d`), sans jamais rien encadrer. Le contenu est posé à même la bande, tenu par des filets de 1 px et par l'espace ; l'ombre ne sert qu'aux médaillons et aux médias, jamais à découper un bloc de texte. Chaque bande porte un ou deux ornements au trait, dessinés pour ce site — bambou, feuillage, courbes de niveau, vigne dorée, ensō, volutes — et une illustration en matière, la petite pile de galets du pied de « Nos pratiques ». La grande pile, dans « Adhésion & inscription », est une exception délibérée : une vraie photo plutôt qu'un dessin, seule photo purement décorative du site (les autres photos — Béatrice, les quatre pratiques, les fiches disciplines — montrent toutes un fait, jamais un décor). La discipline que le site présente fusionne quatre pratiques en un seul enchaînement continu ; la page fait de même, une bande coulant dans la suivante par une coupure courbe plutôt qu'une ligne droite.

**L'administration — la console, jouée droit.** `/admin` ne cherche pas à prolonger les bandes du site : c'est un outil, et il prend la forme que tout le monde reconnaît dans un back-office de site — barre latérale de navigation à gauche, pleine hauteur, qui ne bouge jamais ; zone de travail claire à droite ; une page par section. La barre latérale reste vert profond dans les deux thèmes — un vert que le site public n'emploie plus depuis la refonte, et que l'admin garde comme son ancre propre. Le reste emprunte le vocabulaire attendu d'un admin — tableaux à filets fins, onglets soulignés, pastilles d'état, panneau latéral — au niveau de finition d'un admin de site éditorial, sans ironie ni signature glissée en douce.

Le public du site est majoritairement senior : la densité reste basse, les cibles tactiles larges, et aucune information n'est portée par la couleur seule. L'administration a une seule utilisatrice non technique : chaque page y dit en toutes lettres ce qu'elle commande sur le site public et ce qui est en ligne à l'instant.

**Key Characteristics :**

- Côté site : des bandes pleine largeur qui alternent crème et ardoise, des coupures courbes entre elles, des ornements au trait dessinés pour ce site
- Côté admin : une charpente de console classique, des filets de 1 px, deux thèmes complets
- L'or rare et décisif dans les deux mondes ; la sauge pour l'action de second rang côté site, le teal pour le focus côté admin
- Cormorant pour les titres, DM Sans pour tout le reste — deux polices, pas une de plus
- Des icônes tracées, jamais un glyphe unicode ni un emoji
- L'état écrit avant d'être coloré

## Colors

Deux mondes de couleur qui se partagent un or. Le site public vit en crème et ardoise chaude ; l'administration garde la palette de forêt d'origine. Les jetons du site sont préfixés `--r-*` et définis en tête de `assets/css/base.css`.

### Primary

- **Or Sanctuaire** (`#c9a86a`) : la seule couleur de décision, et le seul point commun des deux surfaces. Sur le site : le bouton d'appel, le cerclage des médaillons, la vigne et les volutes, les puces de liste. Dans l'admin : l'action principale et l'état « visible par le public ». Jamais décoratif au point de perdre son sens.
- **Or Chaud** (`#d8bb85`) : le survol de l'or, et le second point des dégradés dorés.
- **Or Voile** (`#f0e4c9`) : les aplats d'or très clairs sur fond crème — fond d'icône d'événement, points de lumière des ornements.

### Secondary

- **Sauge** (`#5d7358`) : la seule couleur végétale du site public, réservée à l'action de second rang — le bouton d'inscription du hero, le bandeau d'événement, les icônes de libellé.
- **Sauge Profonde** (`#4b5e47`) : le survol de la sauge, et le texte de sauge sur fond clair.
- **Sauge Claire** (`#9fb298`) et **Voile de Sauge** (`#dfe7db`) : la sauge sur fond sombre, et les pastilles de sauge sur fond clair.
- **Teal Sanctuaire** (`#2f8f7f`) : n'existe plus que dans l'administration — icônes de libellé, liens internes, anneau de focus. Assombri à `#26786a` en thème clair, éclairci à `#4bbba3` en sombre.

### Neutral

- **Crème** (`#f8f4ec`) et **Crème Chaud** (`#f1ebdf`) : les bandes claires du site, et la matière des fiches disciplines.
- **Ardoise Chaude** (`#343b3d`), **Ardoise Profonde** (`#2b3133`), **Ardoise Levée** (`#3e4649`) : les bandes sombres, leur creux et leur relief. Ce ne sont pas des gris : ils tirent tous vers le vert.
- **Os** (`#e9e2d3`) et **Os Doux** (`#bcb6a8`) : texte principal et secondaire sur bande sombre.
- **Encre** (`#2b332f`) et **Encre Douce** (`#5f6a62`) : texte principal et secondaire sur bande claire.
- **Filet** (`#ddd4c1`) et **Filet Marqué** (`#cabfa7`) : les deux poids de trait sur clair. Sur sombre, ce sont `--r-line-dark` et `--r-line-dark-strong`, l'os à 16 % et 28 %.
- **Vert Forêt Profonde** (`#1b4332`) : ne subsiste que comme ancre de l'administration (barre latérale) et couleur de thème du navigateur.

### La pierre des médaillons

Quatre jetons (`--r-anneau-haut` `#c1b8a6`, `--r-anneau-corps` `#8e887c`, `--r-anneau-bas` `#7b7060`, `--r-anneau-ombre` `#635b50`) composent le dégradé de pierre qui cercle les quatre médaillons de « Nos pratiques ». Ils n'existent que pour cet usage : c'est le seul endroit du site où une couleur imite une matière plutôt que de désigner un rôle.

### Tertiary

- **Terre Brûlée** (`#a3341f`), sur **fond** `#fbeae6` et **filet** `#eec3b8` : erreur et suppression, exclusivement. Jamais un avertissement, jamais un accent. En thème sombre le texte remonte à `#f2a894` pour rester lisible.

### La couche de rôles de l'admin

L'administration ne consomme jamais la palette de marque directement : elle passe par une couche de jetons `--ad-*` définie en tête de `assets/css/admin.css`, redéfinie une fois par thème sous `:root[data-theme="clair"]` et `:root[data-theme="sombre"]`. Sans choix explicite, `assets/js/admin-theme.js` suit `prefers-color-scheme` ; le fichier est chargé en synchrone dans le `<head>` pour que le thème soit posé avant le premier rendu.

Les rôles principaux : `--ad-bg` (le fond de la zone de travail), `--ad-surface` (toute surface de contenu), `--ad-raise` (l'en-tête de tableau), `--ad-line` / `--ad-line-soft` (les deux poids de filet), `--ad-side` et sa famille (la barre latérale), `--ad-accent` (l'or), `--ad-focus`, `--ad-danger`, `--ad-ok`.

### Named Rules

**La règle de l'ancre verte.** La barre latérale de l'admin est vert profond dans les deux thèmes — `#1b4332` en clair, `#0a1e14` en sombre. C'est le seul élément qui ne bascule pas de registre, et c'est ce qui empêche la console de ressembler à n'importe quel admin.

**La règle de l'or rare.** L'or ne se pose que sur trois choses : l'action principale, l'état « visible par le public », et le repère de position courante (entrée de menu active, onglet courant). S'il apparaît ailleurs, c'est de la décoration et il faut l'enlever.

**La règle du mot avant la couleur.** Aucun état n'est porté par la seule couleur. « En ligne », « En réserve », « Archivé » s'écrivent et portent leur icône ; le champ doré ne fait que confirmer.

**La règle du jeton.** Aucune couleur en dur dans un composant de l'admin. Une valeur littérale hors jeton n'est admise que pour un voile de `::backdrop` et les couleurs d'ombre.

## Typography

**Display Font :** Cormorant Garamond (Georgia, serif)
**Body Font :** DM Sans (system-ui, sans-serif)

Les deux sont auto-hébergées en woff2 dans `assets/fonts/` (sous-ensembles latin et latin-ext) : aucun appel à `fonts.googleapis.com`. Une troisième, Caveat, figurait ici sans habiller le moindre texte ; elle a été retirée du projet.

**Character :** un serif de la Renaissance, léger et haut d'axe, posé sur une grotesque géométrique tiède. Le contraste est fort en dessin mais faible en taille : les titres ne hurlent pas, ils changent de voix.

### Hierarchy

- **Display** (DM Sans 300, `clamp(2rem, 4.6vw, 3.65rem)`, capitales, `0.01em`) : le H1 du hero, une seule fois par page. C'est la seule exception à la règle du serif en titre — le hero parle en capitales larges, pas en serif.
- **Signature** (Cormorant 400 italique, `clamp(1.8rem, 3vw, 2.5rem)`) : « Le Zenway », sous le H1. Une ligne par page, jamais deux.
- **Headline** (Cormorant 400, `clamp(1.9rem, 3.4vw, 2.9rem)`, capitales, `0.02em`) : les H2 de section du site public.
- **Page title** (400, `1.85rem`, 1.1) : le titre de page dans l'en-tête de l'admin. Taille fixe, jamais fluide ; ramenée à `1.5rem` sous 900 px et `1.4rem` sous 700 px.
- **Panel title** (400, `1.45rem`, 1.15) : le titre du panneau latéral.
- **Body** (400, `1.06rem`, 1.7) : le texte courant du site public. Mesure de 62 à 68 caractères.
- **Lede** (400, `1rem`, 1.65) : la phrase d'ouverture d'une page d'admin, qui dit ce que la page commande. Mesure plafonnée à 68 caractères.
- **Field** (400, `0.98rem`, 1.5) : la valeur saisie dans un champ, et le titre cliquable d'une ligne de tableau.
- **UI body** (400, `0.94rem`, 1.55) : le texte de l'interface d'administration — lignes de tableau, valeurs, descriptions d'action.
- **Note** (400, `0.9rem`, 1.55) : messages de confirmation, textes d'état vide, liens externes.
- **Label** (600, `0.85rem`, 1.3) : libellés de champ, boutons, entrées de menu.
- **Caption** (600, `0.78rem`, 1.4) : pastilles d'état, étiquettes d'événement, adresse de la personne connectée.
- **Section label** (700, `0.8rem`, `0.09em`, capitales) : le titre d'un bloc de page.
- **Overline** (700, `0.74rem`, `0.09em`, capitales) : en-têtes de colonne, compteurs, chapeau du panneau. **Réservé à ces emplois**, jamais au-dessus d'un titre de page.
- **Overline XS** (400, `0.7rem`, `0.1em`, capitales) : la seule ligne en dessous — le lieu sous le mot « Administration » dans la barre latérale.
- **Eyebrow** (DM Sans 400, `0.82rem`, `0.18em`, capitales) : le chapeau au-dessus du H1 du hero, et lui seul sur le site public.

### Named Rules

**La règle de l'échelle serrée.** Entre deux niveaux consécutifs de l'interface, le rapport reste entre 1,12 et 1,2. La hiérarchie se fait au poids et à la famille avant de se faire à la taille. L'admin a son propre barreau, plus serré que celui du site : c'est une échelle d'interface, pas une échelle éditoriale.

**La règle du serif rare en mode tâche.** Dans l'admin, Cormorant ne touche que deux choses : le titre de page et le titre du panneau. Tout ce qui est libellé, bouton, valeur ou donnée est en DM Sans.

**La règle du chapeau interdit.** Aucun sur-titre en petites capitales espacées au-dessus d'un titre. L'overline existe, mais comme en-tête de colonne, titre de bloc ou étiquette de contexte dans le panneau — jamais comme amorce d'un titre.

## Layout

### Le site public

Un conteneur de 1180 px (`--r-maxw`) avec une gouttière de 28 px (`--r-gut`). La page n'a pas de fond propre : chaque section porte le sien, en bande pleine largeur, et le conteneur ne fait que borner le texte. Trois ruptures :

- **1040 px** — les médaillons passent de quatre à deux colonnes, les grilles à deux colonnes se resserrent.
- **880 px** — menu burger, tiroir plein écran, colonne unique pour les grilles de section. Les nappes d'ornement s'effacent en opacité plutôt que de disparaître.
- **620 px** — les médaillons passent à une colonne ; les ornements qui sont des compositions en largeur (la vigne des médaillons, les volutes du bas de section, la vague de coupure du hero) sont retirés : à cette largeur ils se resserrent en nœuds au lieu de se lire.

### L'administration

Une charpente en deux colonnes, en flex : une barre latérale de **264 px** collée en haut et haute de tout l'écran, puis la zone de travail. Celle-ci porte un en-tête collant de **68 px** minimum (titre de page à gauche, actions à droite) et une page de contenu limitée à **1120 px**, avec `34px 40px 90px` de padding.

Trois ruptures :

- **1100 px** — les paddings se resserrent, la colonne de libellés des listes de faits passe de 210 à 172 px.
- **900 px** — la barre latérale sort du flux : elle devient un tiroir de `min(300px, 86vw)` en `translateX(-100%)`, ouvert par le bouton burger de l'en-tête, posé au-dessus d'un voile. Les listes de faits passent en colonne unique.
- **700 px** — l'en-tête passe sur deux lignes et l'action principale prend toute la largeur ; les tableaux se replient en fiches empilées ; le panneau latéral prend tout l'écran.

**La règle de la respiration au-dessus.** Toujours plus d'espace au-dessus d'un titre qu'en dessous. Un groupe se serre, deux groupes s'écartent.

**La règle du tableau qui ne défile pas.** Sous 700 px un tableau ne part jamais en défilement latéral : il se replie en fiches, chaque cellule devenant une ligne. Un défilement horizontal cacherait justement la colonne d'état, qui est l'information la plus utile de la liste.

## Elevation & Depth

Les deux surfaces n'ont pas le même relief, et c'est délibéré.

**Le site public est posé à même la bande.** Le relief n'y sert qu'à trois choses : les médaillons de pratique, les médias (vidéos, carte, fiches disciplines) et le formulaire d'adhésion. Tout le reste — texte, listes, lignes d'événement, grille de planning — est tenu par des filets de 1 px et par l'espace. Une ombre sous un paragraphe n'appartient pas à ce système.

**L'administration est plate, tenue par des filets.** Une surface se distingue par sa bordure de 1 px, pas par son élévation. L'ombre y est une confirmation discrète à deux couches, jamais un effet.

### Shadow Vocabulary

- **Le posé léger** (`--r-shadow-sm`, `0 2px 6px rgb(43 51 47 / 6%), 0 8px 20px rgb(43 51 47 / 7%)`) — site public, bande claire : cartes vidéo, encarts.
- **Le posé** (`--r-shadow`, `0 4px 12px rgb(43 51 47 / 8%), 0 18px 44px rgb(43 51 47 / 10%)`) — site public, bande claire : fiches disciplines, carte de planning.
- **Le posé sur sombre** (`--r-shadow-dark`, `0 4px 12px rgb(12 16 15 / 26%), 0 22px 52px rgb(12 16 15 / 30%)`) — site public, bande sombre : les médaillons de pratique. Sur fond sombre l'ombre seule ne détache rien : les médaillons y ajoutent leur cerclage de pierre.
- **Le posé de console** (`--ad-shadow`, `0 1px 2px rgba(27,67,50,.05), 0 8px 24px -18px rgba(27,67,50,.4)`) — admin : blocs, tableaux, rangées. La première couche assoit, la seconde suggère.
- **Le flottant** (`--ad-shadow-lg`, `0 18px 48px -24px rgba(19,48,35,.45)`) — admin : le panneau latéral, le tiroir de menu, la carte de connexion, la bannière de confirmation.
- **Le filet interne** (`inset 0 0 0 1px …`) : la façon de cerner une pastille ou un encart sans lui donner de bordure.

### Named Rules

**La règle du sol unique.** Une surface ne se pose jamais sur une autre surface de même nature. Si un contenu semble réclamer une carte dans une carte, c'est qu'il lui faut une liste séparée par des filets.

**La règle de l'ombre douce.** Toute ombre a un décalage vertical et un flou d'au moins le double de ce décalage. Une ombre nette, sans flou ou sans décalage, n'appartient pas à ce système.

**La règle de l'ombre qui ne porte rien en sombre.** En thème sombre, une ombre portée sur fond sombre ne détache rien : tout élément qui doit se distinguer y ajoute un filet (`inset 0 0 0 1px`). L'onglet sélectionné et les pastilles suivent cette règle.

## Shapes

Les deux surfaces divergent ici, et c'est ce qui les distingue le plus vite. **Le site public arrondit** : ses commandes sont des gélules, ses médias et ses encarts ont 22 px de rayon (`--r-radius`), ses médaillons sont des cercles parfaits. **L'administration garde les angles vifs** : une surface de contenu y a toujours 0 de rayon.

Côté site public :

- **50 %** — les médaillons de pratique ; c'est la forme signature de la page.
- **999 px** — tous les boutons, les pastilles et les étiquettes.
- **22 px** (`--r-radius`) — médias, fiches disciplines, carte de planning, formulaire d'adhésion.
- **12–14 px** — les petits blocs : icône d'événement, vignette d'image, images des fiches.

Côté administration :

- **0** — toute surface de contenu ; c'est la forme signature de la console.
- **2 px** — pastilles d'état et étiquettes.
- **3 px** — boutons, champs de saisie, entrées de menu, boutons-icônes, alertes.
- **999 px** — les compteurs seulement : pastille du menu, compteur d'onglet.

Les bordures sont des filets de 1 px, jamais plus, dans les deux mondes.

Un liseré coloré de plus de 1 px sur le flanc d'un bloc n'existe pas dans ce système ; un état se marque par un champ de couleur qui remplit la ligne entière. Seule exception assumée : le filet d'or de 2 px qui détache le rappel « en complément d'un suivi médical » au pied de chaque fiche discipline.

## Components

### Buttons

- **Shape :** 3 px de rayon dans l'admin ; gélule (999 px) sur le site public. Hauteur minimale 44 px pour la cible tactile dans les deux cas.
- **Primary :** fond Or Sanctuaire, texte Vert Forêt Profonde, graisse 700, `11px 18px`. Au survol, l'or passe à `#d8bb85`. Pas de déplacement : dans une console, un bouton qui bouge au survol est du bruit.
- **Line :** fond de surface, filet `--ad-line`, texte d'encre. Au survol, le filet passe au teal.
- **Danger :** plein Terre Brûlée sur texte blanc, réservé à la confirmation de suppression.
- **Icon button :** 38 × 38 px, transparent, filet au survol. Dans la barre latérale il perd son filet au repos.
- **Working :** le bouton garde sa place et sa largeur, son icône est remplacée par une roue de 16 px et son libellé dit ce qui se passe (« Enregistrement… »). Il retrouve son icône exacte au retour, et tout le pied du panneau se verrouille pendant l'opération.

**Les boutons du site public** forment une famille à part, en gélule : **Gold** (fond or, texte ardoise) pour l'appel d'une bande sombre, **Sage** (fond sauge, texte crème) pour l'appel d'une bande claire, **Line** (filet seul) pour l'action de second rang. Un seul bouton plein par bande — s'il en faut deux, le second passe en Line.

### Inputs / Fields

- **Style :** fond de surface, filet `--ad-line`, 3 px de rayon, `12px 14px`, hauteur minimale 46 px.
- **Focus :** le filet passe au teal et un halo de 3 px l'entoure ; aucun déplacement.
- **Hint :** chaque champ porte sous lui une phrase qui dit où la valeur apparaîtra sur le site public.
- **Error :** le message se pose dans le pied du panneau, dans le bloc d'alerte Terre Brûlée, nomme le problème et la sortie, et le focus retourne au champ fautif.

### Navigation — la barre latérale

- **Entrée :** icône, libellé, pastille de compte facultative. 3 px de rayon, `11px 13px`.
- **Repos :** texte menthe à 68 %, fond transparent. **Survol :** fond menthe à 9 %, texte plein.
- **Active :** `aria-current="page"`, fond menthe à 14 %, texte plein, graisse 600, icône en or, pastille en or plein. Aucun liseré latéral.
- **Tiroir mobile :** sous 900 px, `translateX(-100%)` → `0`, voile de fond, fermeture par Échap, par le voile, par le bouton de fermeture, ou par le choix d'une page.

### Tables

- **En-tête :** fond `--ad-raise`, overline, filet bas de 1 px.
- **Ligne :** `15px 20px`, filet haut à 8 %, curseur pointeur — toute la ligne ouvre la fiche, mais le titre reste un vrai `<button>` pour le clavier.
- **Ligne mise en avant :** champ Or Sanctuaire Clair sur toute la ligne, qui garde sa teinte au survol.
- **Sous 700 px :** chaque ligne devient une fiche bordée, l'en-tête disparaît, et la flèche d'ouverture se positionne à droite en absolu.
- **Site public, grille de planning :** elle réclame 620 px de colonnes. Sous 760 px, le tableau cède la place à une liste de séances — pastille du jour, horaire en Cormorant, lieu — écrite dans le HTML à côté de lui : le CSS n'en montre jamais qu'une, jamais de défilement horizontal.

### Tabs

Onglets soulignés, pas de segment ni de pilule : filet de 1 px sous la rangée, soulignement de 2 px en or sous l'onglet courant, compteur en pastille à droite du libellé.

### Chips / Pills

Fond `--ad-hover` et filet interne au repos ; fond Or Sanctuaire Clair et texte `#75591f` quand le contenu est visible par le public. Toujours accompagnée d'une icône (œil ouvert, œil barré, carton d'archive) et du texte en clair.

### Panel — le panneau latéral

Bâti sur `<dialog>` natif : le piège à focus, la fermeture par Échap et le voile viennent du navigateur. Tiroir de 520 px à droite, plein écran sous 700 px, en trois bandes — en-tête (icône, chapeau, titre, fermeture), corps défilant, pied fixe portant l'alerte et les actions. Le premier champ prend le focus à l'ouverture. Tout ce qui agit dans l'admin passe par lui ; les pages ne portent que de la lecture et des listes.

### Rows — les rangées d'action

Une rangée par action possible : icône, titre en gras, **et une phrase qui dit la conséquence sur le site public**. C'est la forme que prend une décision dans cette console, jamais un bouton nu.

### Feedback

- **Flash :** bannière posée en bas de l'écran, hors du flux, fond menthe, qui s'efface après cinq secondes.
- **Empty :** icône à 32 px, titre, une phrase qui explique ce que le visiteur voit à la place sur le site, et l'action de sortie quand elle existe.
- **Skeleton :** barres balayées par un dégradé, doublées d'un `role="status"` invisible.

### Signature Component — la page qui déclare ce qu'elle commande

Chaque page de l'admin dit en toutes lettres ce que le site publie à cause d'elle, avant tout autre contenu : le tableau de bord en fait sa matière (« Mis en avant dans le bandeau », « Prochaine séance », chacun avec son renvoi), les pages en lecture seule portent un encart qui avoue où éditer en attendant que la modification soit branchée. Aucune page ne peut exister sans cette déclaration : c'est ce qui distingue cette console d'un simple formulaire.

## Do's and Don'ts

### Do:

- **Do** passer par les jetons `--ad-*` pour toute couleur de l'admin, et déclarer les deux thèmes ensemble.
- **Do** écrire tout état en toutes lettres, avec son icône, avant de lui donner une couleur.
- **Do** réserver l'or à l'action principale, à l'état publié et au repère de position.
- **Do** garder les cibles cliquables au-dessus de 44 px et la densité basse.
- **Do** dessiner les icônes en SVG, tracé 1,5 px et bouts arrondis, et poser le tracé sur le `<svg>` porteur du `<use>` — un sélecteur ne franchit pas le clone, une propriété héritée si.
- **Do** faire dire à chaque rangée d'action sa conséquence sur le site public.
- **Do** replier un tableau en fiches sous 700 px plutôt que de le laisser défiler latéralement.
- **Do** ajouter un filet à tout élément qui doit se détacher en thème sombre : l'ombre seule n'y suffit pas.
- **Do** libérer dans `unmount()` tout ce que `mount()` a pris — abonnements au magasin, écouteurs globaux.

### Don't:

- **Don't** imbriquer une surface dans une surface de même nature : une liste séparée par des filets répond au même besoin.
- **Don't** poser un sur-titre en petites capitales espacées au-dessus d'un titre.
- **Don't** utiliser un liseré coloré de plus de 1 px sur le flanc d'un bloc pour marquer un état.
- **Don't** introduire une couleur hors palette sans la déclarer en variable.
- **Don't** ajouter une troisième police : Cormorant et DM Sans suffisent, et une police déclarée sans usage réel finit par être retirée.
- **Don't** employer une fenêtre système (`confirm`, `alert`) : la confirmation de suppression se joue dans le panneau, et propose l'archivage comme sortie.
- **Don't** poser du flou ou du verre en décoration ; le relief de ce système est une ombre et un filet, pas une texture.
- **Don't** arrondir une surface de contenu dans l'admin ; à l'inverse, ne pas donner d'angle vif à une surface du site public.
- **Don't** poser une ombre sous un bloc de texte du site public : ce relief est réservé aux médaillons, aux médias et au formulaire d'adhésion.
- **Don't** laisser un ornament de composition en largeur (vigne, volutes, vague de coupure) sous 620 px : il s'y resserre en nœud.
- **Don't** animer un bouton d'admin en déplacement au survol : la couleur suffit.
