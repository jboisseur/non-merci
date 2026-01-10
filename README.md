# Kézako
_Non merci_ est une petite application web en construction pour aider les personnes qui cuisinent pour d'autres à se souvenir de qui ne mange pas quoi. Les personnes invitées peuvent créer leur liste d'aliments qu'elles ne mangent pas et l'hôte peut en charger plusieurs en fonction de qui vient et obtenir une liste agrégée pour prévoir le repas en fonction.

La philosophie est de ne collecter aucune donnée personnelle et de rester d'un usage aussi simple que possible.

[Démo](https://nonmerci.jboisseur.xyz/)

# À faire
Plein de choses, notamment :
- Lecture des fichiers : vérifier le format des données, gérer les erreurs
- Invité·e : exporter en ordre alpha, gérer le cas où on supprime tous les items
- Hôte : compléter la ligne de l'aliment s'il existe déjà plutôt que dans créer un, permettre l'impression / récupération du tableau, cas où les fichiers sont ajoutés successivement plutôt qu'en même temps
- Kelp UI : ouvrir une issue / faire une PR / faire un custom CSS pour la gestion des `th` hors `thead` + `tfoot`
- Récupérer en masse une liste d'aliments pour la `datalist`, par API ?


# Crédits
Merci à [Kelp UI](https://kelpui.com/) pour l'interface !
