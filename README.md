# Zenway Saint-Laurent-du-Var — Site vitrine

Site statique (HTML/CSS/JS, sans backend) pour la section Zenway de Saint-Laurent-du-Var.
Inscriptions gérées via HelloAsso (lien externe + emplacement prêt pour le widget iframe).

## Déploiement sur GitHub Pages

### 1. Créer le repo

Sur ton compte GitHub perso, crée un nouveau repo (public), par exemple `zenway-saint-laurent`.
Ne l'initialise pas avec un README depuis l'interface (on a déjà tout en local).

### 2. Pousser le site

Depuis ce dossier :

```bash
git init
git add .
git commit -m "Site Zenway Saint-Laurent-du-Var"
git branch -M main
git remote add origin https://github.com/<TON-COMPTE>/zenway-saint-laurent.git
git push -u origin main
```

### 3. Activer GitHub Pages

Dans le repo sur GitHub : **Settings → Pages**
- Source : `Deploy from a branch`
- Branch : `main` / `(root)`
- Save

Le site sera disponible (1-2 min après) à :

```
https://<TON-COMPTE>.github.io/zenway-saint-laurent/
```

### 4. Mises à jour

À chaque modification de `index.html` :

```bash
git add .
git commit -m "Description de la modif"
git push
```

GitHub Pages republie automatiquement en quelques minutes.

## Domaine personnalisé (plus tard)

Une fois la décision prise avec Raymond sur le sous-domaine de `zenway-rh.fr` :

1. Dans **Settings → Pages → Custom domain**, saisir le sous-domaine choisi (ex. `saint-laurent-du-var.zenway-rh.fr`). GitHub crée automatiquement un fichier `CNAME` à la racine du repo.
2. Chez le gestionnaire DNS de `zenway-rh.fr`, ajouter un enregistrement :
   - Type : `CNAME`
   - Nom : le sous-domaine choisi (ex. `saint-laurent-du-var`)
   - Valeur : `<TON-COMPTE>.github.io`
3. Attendre la propagation DNS (quelques minutes à 24h), puis cocher "Enforce HTTPS" dans les paramètres Pages une fois le check DNS validé.

## À faire avant mise en ligne publique

- Remplacer les photos placeholder (hero, ambiance, 4 pratiques) — voir commentaires `REMPLACER` dans `index.html`.
- Remplacer l'URL du formulaire HelloAsso (section Inscriptions) par le vrai lien une fois le formulaire créé.
- Vérifier les coordonnées de la carte (section Infos pratiques).
