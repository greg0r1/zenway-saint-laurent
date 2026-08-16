# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Deux publics, un seul produit.

- **Le public du site** : habitants de Saint-Laurent-du-Var et des environs, souvent seniors ou personnes en reprise d'activité douce, qui cherchent une pratique corporelle apaisante près de chez eux. Ils arrivent par recherche locale ou bouche-à-oreille, lisent sur mobile, et veulent savoir en quelques secondes ce qu'est Zenway, quand ça a lieu, et comment s'inscrire.
- **Les administrateurs du site** (surface `/admin`) : Béatrice Viallon, l'animatrice, non technique, qui met à jour le contenu courant quelques fois par mois ; et Grégory, qui assure la partie technique. Le duo est confirmé : l'interface peut assumer un vocabulaire et une densité légèrement plus outillés qu'un outil grand public, sans jamais devenir un panneau d'administration technique.

## Product Purpose

Faire connaître la section Zenway de Saint-Laurent-du-Var, remplir ses séances, et permettre à Béatrice de tenir le site à jour sans toucher au code. Le succès : un visiteur comprend la discipline et s'inscrit via HelloAsso ; Béatrice publie un événement ou corrige un horaire seule.

## Positioning

Zenway est **une seule discipline** qui fusionne Tai-chi chuan, Yoga, Pilates et Qi gong dans un enchaînement continu unique, sur musique relaxante — jamais quatre cours séparés, jamais un menu d'options. C'est le fait produit central et il ne se négocie pas. La section est locale, rattachée au réseau Zenway fondé par Raymond Holle (zenway-rh.fr). Zenway est complémentaire d'un suivi médical, jamais un substitut.

## Operating Context

- Séance : mardi 17 h 45 – 18 h 45, au KMCS, 357 chemin des Iscles, Saint-Laurent-du-Var (06700).
- Inscriptions et adhésions : HelloAsso, seul responsable de la gestion des membres et des paiements. Aucun espace membre côté site.
- Contact : 06 66 05 66 49 · contact@zenwaysaintlaurentduvar.fr
- Hébergement : Vercel, déploiement automatique depuis GitHub (`greg0r1/zenway-saint-laurent`). `main` = production, `develop` = préproduction, une branche par tâche, PR vers `develop`.
- L'administration se fait depuis un poste de bureau comme depuis un téléphone ; l'accès est par URL directe, hors navigation publique.

## Capabilities and Constraints

- Site public : HTML/CSS/JS vanilla, aucun framework, aucun bundler, aucun build step, aucune dépendance npm. Un `index.html` à la racine, CSS et JS découpés en fichiers statiques dans `assets/`.
- Exception assumée : un petit backend serverless pour l'administration seule — fonctions Vercel dans `api/`, base Postgres Supabase, migrations SQL numérotées et append-only dans `db/migrations/`.
- Authentification admin : Google Identity Services côté client, vérification du jeton côté serveur, whitelist d'emails (`ADMIN_EMAILS`), session par cookie httpOnly signé.
- Le site public n'appelle jamais Supabase directement : une seule route publique (`api/events/public.js`).
- L'admin est conçue comme une console classique : barre latérale de navigation, une page à la fois. Chaque module s'enregistre dans `window.AdminModules` et expose `{ id, label, mount, unmount }`.
- Périmètre confirmé du backoffice : **Événements** (existant, fonctionnel), **Planning des séances**, **Infos pratiques & contact**. Les textes éditoriaux des sections et les vidéos restent hors périmètre pour l'instant — décision explicite, à ne pas élargir sans accord.
- Hors périmètre définitif : espace membre, gestion des adhésions, paiements. HelloAsso couvre ces besoins.

## Brand Commitments

- Nom : Zenway Saint-Laurent-du-Var. Animatrice : Béatrice Viallon (Béa).
- Palette figée, déjà en variables CSS : verts profonds (`--green-900` `#1b4332`, `--green-800`, `--green-700`), teal (`--teal` `#2f8f7f`, `--teal-bright`), menthes claires (`--mint`, `--mint-soft`), papier et beige (`--paper`, `--beige`), or (`--gold` `#c9a86a`, `--gold-soft`), encres (`--ink`, `--ink-soft`). Aucune couleur hors palette sans variable déclarée.
- Deux polices, auto-hébergées, aucune autre : Cormorant Garamond (titres), DM Sans (texte courant, interface). Une troisième, Caveat, a été retirée : déclarée de longue date, elle n'habillait aucun texte.
- Logo : trois feuilles SVG en dégradé vert/teal, « zen » en DM Sans gras, « way » en lettrage manuscrit teal. C'est une image, son lettrage est dessiné et ne dépend d'aucune police du site. Jamais déformé ni recoloré.
- Ton : français standard, masculin générique, jamais d'écriture inclusive. Vouvoiement, chaleureux et apaisant, jamais directif ni médical. Champ lexical : zénitude, harmonie, équilibre, douceur, souffle, sérénité. Zéro emoji dans le contenu.
- L'utilisateur a explicitement demandé que le backoffice reprenne les couleurs du thème du site.

## Evidence on Hand

- Photographies réelles disponibles dans `assets/img/` : Béatrice en posture (`bea-posture-005.png`), les quatre pratiques (`activite-taichi.jpg`, `activite-yoga.jpg`, `activite-pilates.jpg`, `activite-qigong.jpg`), les deux variantes du logo.
- Vidéos YouTube réelles référencées dans `assets/js/config-videos.js`.
- Système de design déjà relevé dans `.impeccable/design.json` (couleurs nommées, rampes tonales, ombres, motion, points de rupture).
- Aucun témoignage, aucun chiffre de fréquentation, aucun tarif validé n'est disponible : ne jamais en inventer.

## Product Principles

1. Une seule discipline, jamais quatre cours — toute présentation qui suggère un choix entre les pratiques trahit le produit.
2. Le site public reste statique et sans build ; le backend n'existe que pour l'administration et ne s'étend pas au-delà du périmètre écrit ci-dessus.
3. Béatrice doit pouvoir tenir le site à jour seule : chaque écran d'administration explique ce qu'il modifie et où cela apparaîtra sur le site public.
4. La zénitude est une contrainte de conception, pas seulement un thème : rien d'urgent, rien de bruyant, aucune alarme gratuite, y compris dans l'outil d'administration.
5. HelloAsso reste seul responsable des inscriptions, des adhésions et des paiements.

## Accessibility & Inclusion

Public majoritairement senior : contraste WCAG AA au minimum, cibles tactiles généreuses, aucune dépendance à la couleur seule pour porter une information, texte alternatif sur toutes les images, respect de `prefers-reduced-motion`. Le site est testé en priorité à 375 px de large.
