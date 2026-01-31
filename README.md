# Kézako
_Non merci_ est une petite application web en construction pour aider les personnes qui cuisinent pour d'autres à se souvenir de qui ne mange pas quoi. Les personnes invitées peuvent créer leur liste d'aliments qu'elles ne mangent pas et l'hôte peut en charger plusieurs en fonction de qui vient et obtenir une liste agrégée pour prévoir le repas en fonction.

La philosophie est de ne collecter aucune donnée personnelle et de rester d'un usage aussi simple que possible.

[Démo](https://nonmerci.jboisseur.xyz/)

# À faire
## Préalable à la bêta
- Lecture des fichiers : 
   - vérifier le format des données
   - gérer les erreurs
- Hôte : 
   - ordre alphabétique
   - permettre l'impression / récupération du tableau (localStorage, fichier)
   - possibilité de supprimer des colonnes
- Invité·e : 
   - faciliter le partage (Signal, What's app, mail)
- Interface :
   - clarifier le concept : formulaire progressif pour la partie "Je suis invité·e" ? 
   - options de la `datalist` ne s'affichent par sur Firefox, mettre en place une alternative / signaler
   - customiser
- Github : préciser les règles de contribution et ajouter un lien en bas de page

## Et ensuite
- Lecture des fichiers : 
   - gérer les doublons d'aliments orthographiés différemment (pluriels, faute de frappe / orthographe...)
- Invité·e : 
   - écouter entrée et tabulation pour ajouter un élément ?
   - mettre un placeholder aléatoire pour l'aliment à ajouter à la liste
- Kelp UI : 
   - `th` hors `thead` + `tfoot` KO, signaler / réparer
   - utiliser https://kelpui.com/docs/components/form-ajax/ pour les formulaires ?
- Récupérer en masse une liste d'aliments pour la `datalist`, par API ?
- Personnaliser le bouton de chargement des fichiers ; indiquer quand un fichier est chargé
- Internationalisation
- Proposer des recettes de base en fonction (éliminer les options incompatibles)
- Passer les vérifications côté serveur ?

# Crédits
Merci à [Kelp UI](https://kelpui.com/) pour l'interface !