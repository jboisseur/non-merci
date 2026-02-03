/*
    Date de dernière modification : 2026-02-01
*/

//
//  Partie Invité·e
//

    // Constantes et variables
    const datalist = document.getElementById("alimenthonni-datalist");
    const datalistFallback = document.querySelector('select[name="alimenthonni"]');
    const msg = document.getElementById("message");
    const lienTelechargement = document.getElementById("export");
    const formulaire = document.getElementById("form");
    const msgEdition = document.getElementById("communicationedition");
    const input = document.getElementById("alimenthonni");
    const fichierInvite = document.getElementById("maliste-edition");
    const maListeInvite = document.getElementById("maliste");
    const champNom = document.getElementById("nom");
    const recapInvite = document.getElementById("recapinvitee");

    // Fonctions
    const ajouterOptions = () => {
        // Ajoute des <option> à l'élément <datalist> à partir d'un fichier
        fetch('./options.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed fetching options list. Status: ${response.status} ${response.statusText}`);
            }
            else {
                return response.json();
            }
        })
        .then(data => {
            // Vérifications : la clé "options" existe et c'est un array de chaines de texte
            if(data.options && Array.isArray(data.options) && data.options.every(item => typeof item === 'string')) {
                const sorted = data.options.sort();
                sorted.forEach(item => {
                    const nouvelItem = document.createElement('option');
                    nouvelItem.setAttribute('value', item)
                    nouvelItem.textContent = item;
                    datalist.appendChild(nouvelItem);
                    datalistFallback.appendChild(nouvelItem);
                })
            }
            else {
                console.error(`Error: failed options list verifications.`)
            }
        })
        .catch(error => {
            console.error(`Failed reading file. Error: ${error}`);
        });
    }

    const recupListeAliments = () => {
        const listeHTML = document.querySelectorAll('.item');
        let listeTexte = [];
        for (let i = 0; i < listeHTML.length; i++) { 
            listeTexte.push(listeHTML[i].textContent.trim().toLowerCase())
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
        msg.setAttribute("hidden", "true");        
        
        // récupère le texte entré en input
        const inputValue = input.value.trim().toLowerCase();

        // récupère les aliments déjà ajoutés        
        const listeTexte = recupListeAliments();

        // vérifie si la donnée entrée est vide
        if (!inputValue) {
            msg.removeAttribute("hidden");
            msg.textContent = "Il n'y a pas d'aliment à ajouter";
        }

        // vérifie si n'est pas déjà dans la liste
        else if (listeTexte.some(listeTexte => listeTexte === inputValue) ) {
            msg.textContent = "Cet aliment est déjà présent dans la liste 😌";
        }
        else {
            // révélation du récapitulatif
            recapInvite.removeAttribute("hidden");

            const nouvelAliment = ajouterItemDeListe(inputValue);
            maListeInvite.appendChild(nouvelAliment);
        }
        
        // remettre le champ à blanc
        input.value = '';
    };

    const supprimerAliment = e => {
        const aliment = e.target; 
        if (aliment.classList.contains('delete')) {
            aliment.parentElement.remove();
        }
        if (recupListeAliments().length === 0) {
            // cacher le récapitulatif
            recapInvite.setAttribute("hidden", "true");
        }
    };

    const telecharger = (lien) => {
        const ajoutZero = n => { return n < 10 ? '0' + n : n };
        
        const nom = champNom.value;
        const texte = recupListeAliments().sort();  
        const maintenant = new Date();
        const date = `${maintenant.getFullYear()}-${ajoutZero(maintenant.getMonth() + 1)}-${ajoutZero(maintenant.getDate())}T${ajoutZero(maintenant.getHours())}:${ajoutZero(maintenant.getMinutes())}:${ajoutZero(maintenant.getSeconds())}`;

        const maListe = {
            "nom": nom,
            "liste": texte,
            "date": date
        }

        let regex = /\D/gi;
        const dateFileName = date.replaceAll(regex, "");
        
        const nomFichier = `nonmerci_${nom}_${dateFileName}.txt`;
        
        lien.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(maListe)));
        lien.setAttribute('download', nomFichier);
    }

    const charger = e => {
        new Response(e.target.files[0]).json().then(json => {

            if(typeof json.nom === 'string' && json.liste.every(item => typeof item === 'string')) {

                // On masque l'éventuel message d'erreur
                msgEdition.setAttribute("hidden", "true");

                // On montre le nom du fichier chargé
                msgEdition.removeAttribute("hidden");
                msgEdition.classList.remove("danger");
                msgEdition.classList.add("success");
                msgEdition.innerHTML = `<strong>${e.target.files[0].name}</strong> chargé !`;

                // On remplit les champs
                    // Nom
                    champNom.value = json.nom;
                    
                    // Liste
                    json.liste.forEach(item => {
                        const nouvelAliment = ajouterItemDeListe(item);
                        maListeInvite.appendChild(nouvelAliment);
                    })

                // On montre le récapitulatif
                recapInvite.removeAttribute("hidden");
            }

            else {
                msgEdition.removeAttribute("hidden");
                msgEdition.classList.remove("success");
                msgEdition.classList.add("danger");
                msgEdition.textContent = "Il y a un problème avec la structure du fichier.";
            }
        }, err => {
            // Console
            console.error(`Failed reading file. Error: ${err}`);

            // Interface
            msgEdition.removeAttribute("hidden");
            msgEdition.classList.remove("success");
            msgEdition.classList.add("danger");
            msgEdition.textContent = "Le fichier n'a pas pu être chargé. Veuillez réessayer.";
        })
    }

    // Appel de fonction
    ajouterOptions();

    // Écouteurs d'événements
    formulaire.addEventListener('click', ajouterAliment);
    maListeInvite.addEventListener('click', supprimerAliment);
    lienTelechargement.addEventListener('click', e => telecharger(lienTelechargement));
    fichierInvite.addEventListener('change', e => charger(e));


//
//  Partie Hôte
//

    // Constantes et variables
    const fichierHote = document.querySelector("#maliste-recuperation");
    const tableHote = document.getElementById("table");
    const tableHoteThead = document.querySelector("#table thead tr");
    const tableHoteBody = document.querySelector("#table tbody");
    const tableHoteFoot = document.querySelector("#table tfoot tr")

    // Fonctions
    const getColonne = () => {
        const nbLignes = tableHoteBody.rows.length;

        let res = [];

        for (let i = 0; i < nbLignes; i++) {
            const tr = tableHoteBody.rows[i];
            const td = tr.cells[0];
                res.push(td.innerText);
        }

        return res;
    }

    const chargerHote = e => {
        // Afficher le tableau
        tableHote.removeAttribute("hidden");

        // Variables
        const nonApplicable = "—";
        const sensInterdit = "⛔";

        // Traiter chaque fichier
        const nbFichiers = e.target.files.length;

        for (let i = 0; i < nbFichiers; i++) {
            
            new Response(e.target.files[i]).json().then(json => {

                // Uniformiser les données
                const liste = [];
                json.liste.forEach(item => { liste.push(item.trim().toLowerCase()) });

                // Créer une colonne
                const thThead = document.createElement("th");
                thThead.setAttribute("scope", "col");
                thThead.textContent = json.nom;
                tableHoteThead.appendChild(thThead);

                // Créer les lignes (une par aliment)           
                liste.forEach(item => {

                    if (!getColonne().some(elem => elem === item)) {
                        const tr = tableHoteBody.insertRow(); 
                        const thBody = document.createElement("th");
                        thBody.setAttribute("scope", "row");
                        thBody.textContent = item;
                        tr.appendChild(thBody); // todo à ajouter selon ordre alpha
                    }
                })

                // Créer les cellules (autant par ligne qu'il y a de colonnes)
                const lignes = Array.from(tableHoteBody.rows);
                const nbColonnes = tableHoteThead.cells.length - 1;
    
                lignes.forEach(ligne => {
                    const nbCellules = ligne.cells.length - 1;
                    for (let j = nbCellules; j < nbColonnes; j++) {
                        ligne.insertCell();
                    }
                })

                // Remplir les cellules
                lignes.forEach(ligne => {
                    const cells = Array.from(ligne.cells);
                    
                    const alimentTableau = cells[0].textContent;

                    for (let j = 1; j < cells.length; j++ ) {
                        // Vérifier si l'aliment est présent dans le fichier json

                        if (liste.includes(alimentTableau) && cells[j].cellIndex === nbColonnes) {
                                cells[j].textContent= sensInterdit;                            
                        }

                        else {
                            if (cells[j].textContent == "") {
                                cells[j].textContent = nonApplicable;
                            }
                        }                        
                    }
                })

                // Ajouter la date dans le footer
                const celluleDate = tableHoteFoot.insertCell();
                const date = new Date(Date.parse(json.date));                
                const dateOptions = { year: "numeric", month: "short", day: "numeric"};
                const dateTexte = document.createTextNode(date.toLocaleString("fr-FR", dateOptions));
                celluleDate.appendChild(dateTexte);
            })
        }}            
    
    // Écouteurs d'événements
    fichierHote.addEventListener('change', e => chargerHote(e));