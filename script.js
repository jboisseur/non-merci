/*
    Date de dernière modification : 2026-01-10
*/

//
//  Partie Invité·e
//

    // Constantes et variables
    const datalist = document.getElementById("alimenthonni-datalist");
    const msg = document.getElementById("message"); // todo: remplacer par un toast
    const lienJSON = document.getElementById("exportjson");
    const formulaire = document.getElementById('form');
    const input = document.getElementById('alimenthonni');
    const fichierInvite = document.getElementById("maliste-edition");
    const maListeInvite = document.getElementById('maliste');
    const champNom = document.getElementById("nom");
    const exports = document.getElementById("exports");

    // Fonctions
    const ajouterOptions = () => {
        // Ajoute des <option> à l'élément <datalist> à partir d'un fichier
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
            maListeInvite.appendChild(nouvelAliment);
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
        
        const nom = champNom.value;
        const texte = recupListeAliments();  
        const maintenant = new Date();
        const date = `${maintenant.getFullYear()}-${ajoutZero(maintenant.getMonth() + 1)}-${ajoutZero(maintenant.getDate())}T${ajoutZero(maintenant.getHours())}:${ajoutZero(maintenant.getMinutes())}:${ajoutZero(maintenant.getSeconds())}`;

        const maListe = {
            "nom": nom,
            "liste": texte,
            "date": date
        }

        let regex = /\D/gi;
        const dateFileName = date.replaceAll(regex, "");
        
        const nomFichier = `nonmerci_${nom}_${dateFileName}.json`;
        
        lien.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(maListe)));
        lien.setAttribute('download', nomFichier);
    }

    const charger = e => {
        new Response(e.target.files[0]).json().then(json => {
            champNom.value = json.nom;            
            json.liste.forEach(item => {
                const nouvelAliment = ajouterItemDeListe(item);
                maListeInvite.appendChild(nouvelAliment);
            })

            exports.removeAttribute("hidden");

            // todo Ajouter une classe pour mettre une petite coche verte pour dire que c'est bien chargé
            
        }, err => {
            // todo Prendre en charge erreur de format
        })
    }

    // Appel de fonction
    ajouterOptions();

    // Écouteurs d'événements
    formulaire.addEventListener('click', ajouterAliment);
    maListeInvite.addEventListener('click', supprimerAliment);
    lienJSON.addEventListener('click', e => telecharger(lienJSON));
    fichierInvite.addEventListener('change', e => charger(e));


//
//  Partie Hôte
//

    // Constantes et variables
    const fichierHote = document.querySelector("#maliste-recuperation");
    const tableHoteThead = document.querySelector("#table thead tr");
    const tableHoteBody = document.querySelector("#table tbody");
    const tableHoteFoot = document.querySelector("#table tfoot tr")

    // Fonctions
    const chargerHote = e => {
        const nbFichiers = e.target.files.length;
        // util : —
        for (let i = 0; i < nbFichiers; i++) {
            // Pour chaque fichier
            new Response(e.target.files[i]).json().then(json => {
                // Créer un table header
                const thThead = document.createElement("th");
                thThead.setAttribute("scope", "col");
                thThead.textContent = json.nom;
                tableHoteThead.appendChild(thThead);
                
                json.liste.forEach(item => {
                    const tr = tableHoteBody.insertRow();                    

                    // Aliment
                    const thBody = document.createElement("th");
                    thBody.setAttribute("scope", "row");
                    thBody.textContent = item;
                    tr.appendChild(thBody);

                    // Ajouter autant de cellules qu'il y a de fichiers
                    for (let j = 0 ; j < nbFichiers; j++) {
                        tr.insertCell();
                    }

                    // Ajouter le sens interdit pour la colonne correspondant au fichier courant
                    const non = document.createTextNode("⛔");
                    tr.children[i + 1].appendChild(non);
                })

                // Ajouter la date dans le footer
                const celluleDate = tableHoteFoot.insertCell(i + 1);
                const date = new Date(Date.parse(json.date));
                
                const dateOptions = { year: "numeric", month: "short", day: "numeric"};
                const dateTexte = document.createTextNode(date.toLocaleString("fr-FR", dateOptions));
                celluleDate.appendChild(dateTexte);
            
            }, err => {
                // todo Prendre en charge erreur
            })
        }
            
    }
    
    // Écouteurs d'événements
    fichierHote.addEventListener('change', e => chargerHote(e));