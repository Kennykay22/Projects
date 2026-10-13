let burger = document.getElementById("burger");


//Creation de Array pour le slide 

let images = [
    "ImageBurger1.jpg",
    "ImageBurger2.jpg",
    "ImageBurger3.jpg",
    "ImageBurger4.jpeg",
];

let positionIm = 0 ;  // initialisation du compteur


//let ingredients = []       // Array pour stocker les ingredients 
let ingredients = JSON.parse(localStorage.getItem("ingredients")) || []; // local storage 

let nomBurger = [
    "Bacon Burger",
    "Cheese Burger",
    "classic Burger " , 
    "blue cheese Burger ",
];

let burgerCree = []; 

// fonction qui change le cpt, donc index de positionIm
function changeImage(){
    positionIm ++;
    
    if (positionIm >= images.length){
        positionIm = 0;
    }

    burger.src = images[positionIm];
    
    document.getElementById("nomBurger").textContent = ""; // Effacer le nom lors du changement
}

setInterval(changeImage, 10000);


// Afficher le nom du burger au clic

burger.addEventListener("click", function() {
    document.getElementById("nomBurger").textContent = nomBurger[positionIm];
});


//Creation Ingredient  

let formIng = document.getElementById("formIngredient");

formIng.addEventListener("submit", function(event){        // 
    event.preventDefault();

    let nom = document.getElementById("nomIng").value ;
    let quantite = Number(document.getElementById("quantite").value);

    console.log("nom:" + nom);
    console.log("quantite" + quantite)


// Pour gerer les cas de submit
    if (nom.trim() === "") {
        document.getElementById("erreurIngredient").textContent = "Veuillez saisir un nom !";
    }else if (quantite <= 0 || isNaN(quantite)) {
        document.getElementById("erreurIngredient").textContent = "La quantité doit être supérieure à 0 !";
    }else {
        document.getElementById("erreurIngredient").textContent = "";
        ingredients.push({nom: nom, quantite: quantite})

    console.log("Ingrédient valide :", nom, quantite);

    localStorage.setItem("ingredients", JSON.stringify(ingredients));

    afficherIngredients();    
}

});


console.log(ingredients);


//reset les ingredients ( Pas dans la consigne mais je trouve c'est important)

let buttonReset = document.getElementById("resetIngredients");
buttonReset.addEventListener("click",function(){
    ingredients = [];

    localStorage.removeItem("ingredients");   // supprime ellements saved

    location.reload();

});


//Creation burger 

// fonction pour afficher les ingredients

function afficherIngredients() {

    for (let j = 1; j <= 3; j++) {

        let liste = document.getElementById("ingredient" + j);

        // Garder les 8 options de base
        while (liste.options.length > 8) {
            liste.remove(8);
        }
        for (let i = 0; i < ingredients.length; i++) {        // Ajouter les ingredients crees disponibles
            let ingredient = ingredients[i];

            if (ingredient.quantite > 0) {
                let option = document.createElement("option");
                option.value = ingredient.nom;
                option.textContent = ingredient.nom;
                liste.appendChild(option);
            }
        }
    }
}

afficherIngredients();

let formBurger = document.getElementById("formBurger")

formBurger.addEventListener("submit", function(event){
    event.preventDefault();

    let nom = document.getElementById("nomNouveauBurger").value;

    let ingredient1 = document.getElementById("ingredient1").value;
    let ingredient2 = document.getElementById("ingredient2").value;
    let ingredient3 = document.getElementById("ingredient3").value;

    console.log("Nom du burger :", nom);
    console.log("Ingrédient 1 :", ingredient1);
    console.log("Ingrédient 2 :", ingredient2);
    console.log("Ingrédient 3 :", ingredient3);


    // Verification du stock des ingredients crees (les choix de base sont toujours disponibles).
    let choix = [ingredient1, ingredient2, ingredient3];
    let stockSuffisant = true;
    for (let i = 0; i < ingredients.length; i++) {
        let quantiteUtilisee = 0;
        for (let j = 0; j < choix.length; j++) {
            if (ingredients[i].nom === choix[j]) {
                quantiteUtilisee++;
            }
        }
        if (ingredients[i].quantite < quantiteUtilisee) {
            stockSuffisant = false;
        }
    }

    if (stockSuffisant) {
        burgerCree.push({
            nom: nom,
            ingredient1: ingredient1,
            ingredient2: ingredient2,
            ingredient3: ingredient3
        });

        for (let i = 0; i < ingredients.length; i++) {
            for (let j = 0; j < choix.length; j++) {
                if (ingredients[i].nom === choix[j]) {
                    ingredients[i].quantite--;
                }
            }
        }
        localStorage.setItem("ingredients", JSON.stringify(ingredients));
        afficherIngredients();
        document.getElementById("erreurBurger").textContent = "";
        console.log(burgerCree);
        console.log("Burger cree");
    } else {
        document.getElementById("erreurBurger").textContent = "Quantité insuffisante pour un ingrédient.";
    }
});


// qui sommes nous, api , requete, etc




// Qui sommes-nous ? : appel AJAX (cours JavaScript 4)
let lienQuiSommesNous = document.getElementById("lienQuiSommesNous");
lienQuiSommesNous.addEventListener("click", appelApi);

function appelApi() {
    let requete = new XMLHttpRequest();
    requete.onreadystatechange = recuperationResultat;
    requete.open("GET", "https://opendata.agencebio.org/api/gouv/operateurs?siret=79317749400028");
    requete.send();
}

function recuperationResultat() {
    if (this.readyState === 4) {
        if (this.status === 200) {
            let reponse = JSON.parse(this.responseText);
            console.log(reponse);

            if (reponse.items && reponse.items.length > 0) {
                let ferme = reponse.items[0];
                let adresse = ferme.adressesOperateurs[0];

                let phrase = "Notre restaurant travaille avec des produits locaux provenant de la ferme bio numéro " + ferme.numeroBio;
                phrase += " de Monsieur " + ferme.gerant;
                phrase += " située à l'adresse " + adresse.lieu + " " + adresse.codePostal + " " + adresse.ville;
                phrase += ". Cette ferme intervient dans les commerces :";
                document.getElementById("infoProducteur").textContent = phrase;

                let listeProductions = document.getElementById("listeProductions");
                listeProductions.innerHTML = "";
                for (let i = 0; i < ferme.productions.length; i++) {
                    let element = document.createElement("li");
                    element.textContent = ferme.productions[i].nom;
                    listeProductions.appendChild(element);
                }
            } else {
                console.log("Aucun producteur trouvé pour ce SIRET.");
            }
        } else {
            console.log("Erreur lors de l'appel de l'API, code : " + this.status);
        }
    }
}




//Pour les pages 

function afficherPage(idPage) {

    let pages = [
        "main",
        "creationIngredient",
        "creationBurger",
        "quiSommesNous"
    ];

    // Cacher toutes les pages
    for (let i = 0; i < pages.length; i++) {
        document.getElementById(pages[i]).style.display = "none";
    }

    // Afficher la page demandée
    document.getElementById(idPage).style.display = "block";
}
