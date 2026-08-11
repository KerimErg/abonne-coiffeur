# Aboné Coiffeur — Site web

Site vitrine du salon **Aboné Coiffeur**, situé au 8 rue du Général Leclerc,
67800 Bischheim. Site statique, responsive, en HTML / CSS / JavaScript,
prêt à être publié sur **GitHub Pages**.

## Aperçu

- **Accueil** — présentation et appels à l'action (appeler / prendre RDV)
- **Le salon** — description et points forts
- **Prestations** — coupe, coloration, balayage, brushing, permanente,
  chignon & mariage
- **Galerie** — visuels du salon (photos à ajouter facilement)
- **Horaires** — affichage du jour et statut « ouvert / fermé » dynamique
- **Contact** — adresse, téléphone, carte Google Maps intégrée
- Boutons **Appeler** et **Prendre rendez-vous** (barre flottante sur mobile)

## Informations affichées (données publiques vérifiées)

- **Adresse :** 8 rue du Général Leclerc, 67800 Bischheim
- **Téléphone :** 03 88 33 39 47
- **Horaires :** lundi au samedi, 9h – 19h · dimanche fermé

> Les tarifs ne sont pas affichés en dur : ils varient selon la prestation
> et la longueur, et sont communiqués au salon ou par téléphone. Aucune
> donnée non vérifiée (réseaux sociaux, prix précis) n'a été inventée.

## Structure du projet

```
.
├── index.html          Page principale
├── css/
│   └── styles.css      Styles (palette, mise en page, responsive)
├── js/
│   └── main.js         Menu mobile, galerie, horaires, animations
├── images/             Visuels + guide pour ajouter vos photos
│   └── README-PHOTOS.md
└── README.md
```

## Ajouter vos photos

Tout est expliqué dans [`images/README-PHOTOS.md`](images/README-PHOTOS.md).
En résumé : déposez vos images dans `images/`, puis mettez à jour la liste
`galleryItems` dans `js/main.js`.

## Ajouter les réseaux sociaux plus tard

Dans `index.html`, un bloc `.socials` est déjà préparé en commentaire dans
la section **Contact**. Décommentez-le et renseignez les liens réels
(Instagram, Facebook) une fois les pages officielles confirmées.

## Publier sur GitHub Pages

1. Poussez le contenu sur la branche souhaitée.
2. Dans **Settings → Pages**, choisissez la branche et le dossier racine
   (`/root`).
3. Le site sera accessible à l'adresse fournie par GitHub Pages.

Le fichier `index.html` étant à la racine, aucune configuration
supplémentaire n'est nécessaire.

## Développement local

Aucune dépendance à installer. Ouvrez `index.html` dans un navigateur, ou
lancez un petit serveur local :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```
