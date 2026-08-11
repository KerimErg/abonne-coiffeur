# Ajouter vos propres photos

Le site est prêt à accueillir vos vraies photos. Aucune retouche de code
compliquée n'est nécessaire.

## Méthode simple (remplacer les visuels existants)

1. Préparez vos photos (format **JPG** ou **WebP** de préférence).
   - Galerie : format carré conseillé, environ **1000 × 1000 px**.
   - Grandes vignettes de la galerie (`wide`) : format paysage
     **1600 × 900 px**.
   - Photo « Le salon » : format portrait **900 × 1120 px**.
   - Visuel d'accueil (hero) : format portrait **900 × 1080 px**.
2. Déposez vos fichiers dans ce dossier `images/`.
3. Ouvrez `index.html` et, dans la section **Galerie**, remplacez le
   `src` de chaque `<img>` par le nom de votre fichier — par exemple :

   ```html
   <img src="images/ma-coupe.jpg" alt="Coupe dégradée" loading="lazy" />
   ```

4. Pour la photo « Le salon » ou le visuel d'accueil, remplacez de la
   même façon `images/salon.svg` (ou `images/hero-portrait.svg`) dans la
   balise `<img>` correspondante d'`index.html`.

## Conseils

- Gardez des noms de fichiers simples, sans espaces ni accents
  (ex. `salon-01.jpg`).
- Renseignez toujours le texte `alt` : il décrit la photo pour
  l'accessibilité et le référencement.
- Le cadrage est libre : les images sont automatiquement recadrées
  (`object-fit: cover`) par le style.

## Fichiers actuellement fournis (illustrations)

- `hero-portrait.svg` — visuel d'accueil
- `salon.svg` — vignette « Le salon »
- `gallery-1.svg` … `gallery-6.svg` — vignettes de la galerie
- `favicon.svg` — icône de l'onglet du navigateur

Ces illustrations vectorielles servent d'habillage en attendant vos
photos réelles. Remplacez-les quand vous le souhaitez.
