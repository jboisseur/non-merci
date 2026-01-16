# Kézako
_Non merci_ est une petite application web en construction pour aider les personnes qui cuisinent pour d'autres à se souvenir de qui ne mange pas quoi. Les personnes invitées peuvent créer leur liste d'aliments qu'elles ne mangent pas et l'hôte peut en charger plusieurs en fonction de qui vient et obtenir une liste agrégée pour prévoir le repas en fonction.

La philosophie est de ne collecter aucune donnée personnelle et de rester d'un usage aussi simple que possible.

[Démo](https://nonmerci.jboisseur.xyz/)

# À faire
Plein de choses, notamment :
- Lecture des fichiers : 
   - vérifier le format des données
   - gérer les erreurs
   - gérer les doublons d'aliments orthographiés différemment
- Hôte : 
   - permettre l'impression / récupération du tableau (localStorage, fichier)
   - possibilité de supprimer des colonnes
- Invité·e : 
   - écouter l'appui sur entrée pour ajouter un aliment voire tabulation ?
   - préciser d'ajouter l'aliment au singulier
- Kelp UI : 
   - `th` hors `thead` + `tfoot` KO, signaler / réparer
   - options de la `datalist` ne s'affichent par sur Firefox, signaler / réparer
   - utiliser https://kelpui.com/docs/components/form-ajax/ pour les formulaires ?
   - customiser
- Récupérer en masse une liste d'aliments pour la `datalist`, par API ?
- Personnaliser le bouton de chargement des fichiers ; indiquer quand un fichier est chargé

# Crédits
Merci à [Kelp UI](https://kelpui.com/) pour l'interface !