# Portfolio — Titouan Lefebvre-Le Brouster

Portfolio professionnel en HTML/CSS/JS vanilla, conçu pour GitHub Pages.

## Ajouter ta photo

1. Place ton image dans le dossier racine (par ex. `photo.jpg`)
2. Dans `index.html`, décommente la balise `<img>` et commente le `<span>` placeholder :

```html
<div class="hero__photo reveal">
  <img src="photo.jpg" alt="Titouan Lefebvre-Le Brouster">
  <!-- <span class="hero__photo-placeholder">Photo</span> -->
</div>
```

## Déployer sur GitHub Pages

### 1. Créer le repository

```bash
git init
git add .
git commit -m "Initial commit — portfolio"
```

### 2. Pousser sur GitHub

```bash
git remote add origin https://github.com/titouan-llb/titouan-llb.github.io.git
git branch -M main
git push -u origin main
```

> Nommer le repo `titouan-llb.github.io` permet un accès direct à
> `https://titouan-llb.github.io` sans configuration supplémentaire.

### 3. Activer GitHub Pages

1. **Settings → Pages**
2. Source : **Deploy from a branch**
3. Branche : `main` / `/ (root)`
4. Sauvegarder

Le site sera accessible sous quelques minutes.

## Structure

```
├── index.html          # Accueil / Hero + photo
├── projets.html        # 8 projets techniques
├── certifications.html # Certifications & langues
├── parcours.html       # Timeline formation / expériences
├── contact.html        # Informations de contact
├── style.css           # Styles partagés
├── nav.js              # Navigation, curseur, animations
└── README.md
```

## Technologies

- HTML5, CSS3, JavaScript vanilla
- Google Fonts (Cormorant Garamond, DM Sans)
- IntersectionObserver pour les animations au scroll
- Glassmorphism, curseur custom, responsive mobile-first

## Licence

Usage personnel — © 2025 Titouan Lefebvre-Le Brouster
