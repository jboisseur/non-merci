/*
    Date de dernière modification : 2026-01-04
*/

//
// Liste des aliments
//

    // Constantes et variables    
    const datalist = document.getElementById("aliment-honni-liste");

    // Fonctions
    const ajouterOptions = () => {
        // fetch
        fetch('./options.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const sorted = data.options.sort();
            sorted.forEach(item => {
                const nouvelItem = document.createElement('option');
                nouvelItem.setAttribute('value', item)
                datalist.appendChild(nouvelItem);
            })
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });


    }

    ajouterOptions();


//
//  Partie Invité·e
//

    // Constantes et variables
    const msg = document.getElementById("message"); // todo: remplacer par un toast
    const lienJSON = document.getElementById("exportjson");
    const formulaire = document.querySelector('#form');
    const input = document.querySelector('#alimenthonni');
    const fichier = document.querySelector("#maliste-edition");
    const maListe = document.querySelector('#maliste');
    const nom = document.getElementById("nom");
    const exports = document.getElementById("exports");

    // Fonctions
    const recupListeAliments = () => {
        const listeHTML = document.querySelectorAll('.item');
        let listeTexte = [];
        for (let i = 0; i < listeHTML.length; i++) { 
            listeTexte.push(listeHTML[i].textContent)
        }
        return listeTexte;
    };

    const ajouterItemDeListe = aliment => {
        const nouvelAliment = document.createElement('li');
        nouvelAliment.setAttribute('class', 'badge primary muted');
        nouvelAliment.innerHTML = `<span class="item">${aliment}</span> <button type="button" class="delete" aria-label="Supprimer l'aliment">&#x2715;</button>`;

        return nouvelAliment;
    }
    
    const ajouterAliment = () => {
        // remise à blanc du message
        msg.textContent = "";        
        
        // récupère le texte entré en input
        const inputValue = input.value;
        
        // vérifie si n'est pas déjà dans la liste et si non, ajoute à la 
        const listeTexte = recupListeAliments();
        
        if (listeTexte.some(listeTexte => listeTexte === inputValue) ) {
            msg.textContent = "Cet aliment est déjà présent dans la liste";
        }
        else {
            const nouvelAliment = ajouterItemDeListe(inputValue);
            maListe.appendChild(nouvelAliment);
            exports.removeAttribute("hidden");
        }
        
        // remettre le champ à blanc
        input.value = '';
    };

    const supprimerAliment = e => {
        const aliment = e.target; 
        if (aliment.classList.contains('delete')) {
            aliment.parentElement.remove();
        }
    };

    const telecharger = (lien) => {
        const ajoutZero = n => { return n < 10 ? '0' + n : n };
        
        const id = document.querySelector('#nom').value;
        const texte = recupListeAliments();  
        const maintenant = new Date();
        const date = maintenant.getFullYear().toString() + ajoutZero(maintenant.getMonth() + 1) + ajoutZero(maintenant.getDate()) + ajoutZero(maintenant.getHours()) + ajoutZero(maintenant.getMinutes()) + ajoutZero(maintenant.getSeconds());

        const maListe = {
            "id": id,
            "liste": texte,
            "date": date
        }
        
        const nomFichier = `nonmerci_${id}_${date}.json`;
        
        lien.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(maListe)));
        lien.setAttribute('download', nomFichier);
    }

    const charger = e => {
        new Response(e.target.files[0]).json().then(json => {
            nom.value = json.id;            
            json.liste.forEach(item => {
                const nouvelAliment = ajouterItemDeListe(item);
                maListe.appendChild(nouvelAliment);
            })

            exports.removeAttribute("hidden");

            // todo Ajouter une classe pour mettre une petite coche verte pour dire que c'est bien chargé
            
        }, err => {
            // todo Prendre en charge erreur de format
        })


    }

    // Écouteurs d'événements
    formulaire.addEventListener('click', ajouterAliment);
    maListe.addEventListener('click', supprimerAliment);
    lienJSON.addEventListener('click', e => telecharger(lienJSON));
    fichier.addEventListener('change', e => charger(e));