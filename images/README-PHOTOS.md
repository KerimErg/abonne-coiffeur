# Ajouter vos propres photos

Le site est prêt à accueillir vos vraies photos. Aucune retouche de code
compliquée n'est nécessaire.

## Méthode simple (remplacer les visuels existants)

1. Préparez vos photos (format **JPG** ou **WebP** de préférence).
   - Galerie : format carré conseillé, environ **1000 × 1000 px**.
   - Première photo de la galerie (mise en avant) : format paysage
     **1600 × 800 px**.
   - Photo « Le salon » : format portrait **900 × 1100 px**.
2. Déposez vos fichiers dans ce dossier `images/`.
3. Ouvrez `js/main.js` et modifiez la liste `galleryItems` : remplacez
   chaque `src` par le nom de votre fichier, par exemple :

   ```js
   { src: "images/mon-salon-1.jpg", alt: "Coupe dégradée", caption: "Coupe & coiffage" },
   ```

4. Pour la photo « Le salon », ouvrez `index.html` et remplacez
   `images/salon.svg` par le nom de votre fichier dans la balise
   `<img>` correspondante.

## Conseils

- Gardez des noms de fichiers simples, sans espaces ni accents
  (ex. `salon-01.jpg`).
- Renseignez toujours le texte `alt` : il décrit la photo pour
  l'accessibilité et le référencement.
- Vous pouvez ajouter autant d'entrées que vous le souhaitez dans
  `galleryItems`, la galerie s'adapte automatiquement.

## Fichiers actuellement fournis (visuels temporaires élégants)

- `hero.svg`, `salon.svg` — décor d'ambiance
- `gallery-1.svg` … `gallery-6.svg` — vignettes de la galerie
- `favicon.svg` — icône de l'onglet du navigateur

Ces illustrations vectorielles servent d'habillage en attendant vos
photos réelles. Remplacez-les quand vous le souhaitez.
