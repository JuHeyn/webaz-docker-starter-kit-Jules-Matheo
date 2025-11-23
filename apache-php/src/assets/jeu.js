// ##################### Carte #####################

let map = L.map('map', {
    center: [48.85, 2.35],
    zoom: 13,
    layers: [
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
    ],
});

let couchesObjets = L.layerGroup().addTo(map);

map.on('zoomend', () => {
    app.afficherObjetSurCarte();
});

// ################# HeatMap ################

var heatmap = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {layers: 'Escape-game:objets', format: 'image/png', transparent: true, tiled: true, crs: L.CRS.EPSG4326});
var layerControl = L.control.layers(null, {'Triche' : heatmap },{collapsed : false}).addTo(map);


// ################### Vue ###################
let app = Vue.createApp({
  data() {
    return {
        debut : new Date(),
        intervalle : '00:00:00',
        objets : [],
        objetCarte : [],
        équipé : {},
        };
   
    },

    mounted() {
        this.chargerObjets();
        this.chargerPseudo();
    },

    methods: {
        chargerPseudo() {
            this.pseudo = document.getElementById('pseudo').innerText;
        },

        horloge() {
            let actuel = new Date();
            let deltaSec = Math.floor((actuel - this.debut)/1000);
            let h = Math.floor(deltaSec / 3600);
            let m = Math.floor((deltaSec - h * 3600) / 60);
            let s = deltaSec - h*3600 - m*60 ;

            h = (h < 10) ? "0" + h : h;
            m = (m < 10) ? "0" + m : m;
            s = (s < 10) ? "0" + s : s;

            this.intervalle = h + ":" + m + ":" + s;
        },

        adresseImage(chemin) {
            return "../assets/img/" + chemin
        },

        équiper (objet) {
            if (objet.id == this.équipé.id) {
                this.équipé = {nom : null, id: -1};
                console.log("Pas d'objet équipé");
            } else {
                this.équipé = objet;
                console.log("Objet équipé : " + this.équipé.nom);
            }
        },

        ajouterObjet(objet) {
            this.objets.push(objet);
        },  

        suppObjetCarte() {
            this.objetCarte = null;
        },

        chargerObjets() {
            fetch('/api/objets')
                .then(response => response.json())
                .then(obj => {
                    this.objetCarte = obj[0];

                    if (this.objetCarte.code) {

                        fetch('/api/enigme?id=' + this.objetCarte.id)
                                .then(response => response.json)
                                .then(eng => this.objetCarte.enigme = eng);

                        if (!this.objetCarte.enigme.saisie) {
                            let requis = [] ;
                            this.objetCarte.enigme.reponse.split(";").forEach(pierre_str => requis.push(Number(pierre_str)));
                            this.objetCarte.restant = requis;
                        
                        }
                    };
                    this.afficherObjetSurCarte();
                    console.log("objets chargés :", this.objetCarte.nom);
                    nouvelleQuete("Il parait qu'une pierre se trouve sur le parvis d'une église située sur une ile de la capitale...");
                })

        },

        chargerObjetSuivant(id) {
            fetch('/api/objets?id=' + id)
                .then(response => response.json())
                .then(obj => {
                    this.objetCarte = obj[0];
                    if (this.objetCarte.code) {

                        fetch('/api/enigme?id=' + this.objetCarte.id)
                                .then(response => response.json())
                                .then(eng => {
                                    this.objetCarte.enigme = eng[0];
                                    if (!this.objetCarte.enigme.saisie) {
                                        let requis = [] ;
                                        this.objetCarte.enigme.reponse.split(";").forEach(pierre_str => requis.push(Number(pierre_str)));
                                        this.objetCarte.restant = requis;
                                    }
                                })

                        
                    };

                    this.afficherObjetSurCarte();

                    console.log("objet suivant :", this.objetCarte.nom);
                });
        },    

        afficherObjetSurCarte() {
                
            couchesObjets.clearLayers();

            let zoom_actuel = map.getZoom();
            let nb_zoom_min = Number(this.objetCarte.min_zoom);

            if ( zoom_actuel < nb_zoom_min) {
                return;
            }

            let geom = JSON.parse(this.objetCarte.geom_wkt);
            
            let icone = L.icon({
                iconUrl: this.adresseImage(this.objetCarte.image),
                iconSize: [48, 48],
                iconAnchor: [24, 24],
                popupAnchor: [0, -25]
            });

            let couche = L.geoJSON(geom, {
                pointToLayer: (feature, latlng) => {
                    let mark = L.marker(latlng, { icon: icone });
                    mark.on('click', () => {
                        
                        if (this.objetCarte.code) {

                            if (this.objetCarte.enigme.saisie) {

                                let reponse = prompt(this.objetCarte.enigme.question);

                                if (this.objetCarte.enigme.reponse.toUpperCase().split(';').includes(reponse.toUpperCase())) {
                                    alert("Code correct ! Tu peux ramasser l'objet.");    
                                } else {
                                    alert("Mauvais code ! Réessaie plus tard.");
                                    return;
                                }

                            } else {
                                
                                if (!this.équipé.nom) {

                                    alert("Tu n'as pas d'objet équipé.");
                                    return ;

                                } else if (this.objetCarte.restant.includes(this.équipé.id)) {

                                    this.objetCarte.restant = this.objetCarte.restant.filter(n => n !== this.équipé.id );
                                    
                                    this.objets = this.objets.filter(o => o.id !== this.équipé.id); // Supprimer l'objet de l'inventaire

                                    alert("Tu as posé la " + this.équipé.nom + " sur le coffre.");

                                    if (this.objetCarte.restant.length == 0) {
                                        alert("Tu as ouvert le coffre !")
                                    } else {
                                        alert("Pour ouvrir ce coffre, il te reste " + this.objetCarte.restant.length + " pierres à poser");
                                        this.équipé = {nom : null, id: -1};
                                        return ;
                                    }

                                } else {

                                    alert("Il faut placer uniquement les pierres pour ouvrir le coffre !")
                                    return ; 

                                }
                            }
                        }
                        
                        if (this.objetCarte.indice) {
                            nouvelleQuete(this.objetCarte.indice, this.objetCarte.nom);
                        }

                        
                        if (!this.objetCarte.enigme){
                            this.ajouterObjet(this.objetCarte);
                        }

                        map.removeLayer(mark);
                        console.log("Objet ramassé :", this.objetCarte.nom);

                        let prochainObjet = this.objetCarte.obj_apres;
                        this.suppObjetCarte();
                        if (prochainObjet == -1) {
                            finDuJeu(app.pseudo, app.intervalle);
                        } else {
                            this.chargerObjetSuivant(prochainObjet);

                        }
                    });
                    return mark;
                }
            })

            couchesObjets.addLayer(couche);
        },

    }
    }).mount('#inventaire');

var intervalID = setInterval(app.horloge, 1000);
var panneauFin = document.getElementById('fin');
panneauFin.style.display = 'none';

function finDuJeu(pseudo, intervalle) {
    panneauFin.style.display = 'block';
    let score = intervalle.split(":");
    document.getElementById('score').innerText = score[1] + " min " + score[2] + " sec";
    fetch('../score?pseudo=' + pseudo + "&score=" + intervalle);
    clearInterval(intervalID);
    intervalID = null;
};

function nouvelleQuete(message, nom) {
    if (nom) {
        messageAlerte = "Bravo vous avez trouvé " + nom + " ! " + message;
        alert(messageAlerte); 
        document.getElementById('quete_actu').innerText = message;
    } else {
        alert(message); 
        document.getElementById('quete_actu').innerText = message;
    }
}