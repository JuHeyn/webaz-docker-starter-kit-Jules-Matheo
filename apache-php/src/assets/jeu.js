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
    app.afficherObjetsSurCarte();
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
        objetsCarte : [],
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

        suppObjetCarte(objet) {
            this.objetsCarte = this.objetsCarte.filter(o => o.id !== objet.id);
        },

        chargerObjets() {
            fetch('/api/objets')
                .then(response => response.json())
                .then(obj => {
                    this.objetsCarte = obj;
                    this.objetsCarte.forEach(obj => {
                        if (obj.code) {
                            if (obj.code[0] == "1") {
                                let requis = [] ;
                                obj.code.substring(2).split(";").forEach(pierre_str => requis.push(Number(pierre_str)));
                                obj.restant = requis;
                            
                            }
                        }
                    });
                    this.afficherObjetsSurCarte();
                    console.log("objets chargés :", this.objetsCarte);
                    nouvelleQuete("Il parait qu'une pierre se trouve sur le parvis d'une église située sur une ile de la capitale...");
                })

        },

        chargerObjetSuivant(id) {
            fetch('/api/objets?id=' + id)
                .then(response => response.json())
                .then(obj => {
                    this.objetsCarte = obj;
                    this.objetsCarte.forEach(obj => {
                        if (obj.code) {
                            if (obj.code[0] == "1") {
                                let requis = [] ;
                                obj.code.substring(2).split(";").forEach(pierre_str => requis.push(Number(pierre_str)));
                                obj.restant = requis;
                            }
                        }
                    });

                    this.afficherObjetsSurCarte();

                    console.log("objet suivant :", obj[0].nom);
                });
        },    

        afficherObjetsSurCarte() {
                
            couchesObjets.clearLayers();

            this.objetsCarte.forEach(obj => {

                let zoom_actuel = map.getZoom();
                let nb_zoom_min = Number(obj.min_zoom);

                console.log(zoom_actuel);
                if ( zoom_actuel < nb_zoom_min) {
                    return;
                }

                let geom = JSON.parse(obj.geom_wkt);
                
                let icone = L.icon({
                    iconUrl: this.adresseImage(obj.image),
                    iconSize: [48, 48],
                    iconAnchor: [24, 24],
                    popupAnchor: [0, -25]
                });

                let couche = L.geoJSON(geom, {
                    pointToLayer: (feature, latlng) => {
                        let mark = L.marker(latlng, { icon: icone });
                        mark.on('click', () => {
                            
                            if (obj.code) {
                                if (obj.code[0] == "0") {
                                    let alert_code = {
                                        1:"Le coffre est verouillé mais le mot de passe pour l'ouvrir est le nom du musée sur lequel tu te trouves :",
                                        7:"Le coffre est verouillé par le code a 4 chhiffres que tu viens de récupérer :",
                                    }
                                    let prompt_msg = alert_code[obj.id];
                                    let reponse = prompt(prompt_msg);

                                    if (obj.code.substring(2).toUpperCase().split(';').includes(reponse.toUpperCase())) {
                                        alert("Code correct ! Tu peux ramasser l'objet.");    
                                    } else {
                                        alert("Mauvais code ! Réessaie plus tard.");
                                        return;
                                    }

                                } else if (obj.code[0] == "1") {
                                    
                            
                                    if (!this.équipé.nom) {

                                        alert("Tu n'as pas d'objet équipé.");
                                        return ;

                                    } else if (obj.restant.includes(this.équipé.id)) {

                                        obj.restant = obj.restant.filter(n => n !== this.équipé.id );
                                        
                                        this.objets = this.objets.filter(o => o.id !== this.équipé.id); // Supprimer l'objet de l'inventaire

                                        alert("Tu as posé la " + this.équipé.nom + " sur le coffre.");

                                        if (obj.restant.length == 0) {
                                            alert("Tu as ouvert le coffre !")
                                        } else {
                                            alert("Pour ouvrir ce coffre, il te reste " + obj.restant.length + " pierres à poser");
                                            this.équipé = {nom : null, id: -1};
                                            return ;
                                        }

                                    } else {

                                        alert("Il faut placer uniquement les pierres pour ouvrir le coffre !")
                                        return ; 

                                    }
                                }
                            }
                            
                            let message_obj = {
                                0: "Maintenant, rendez-vous au musée le plus proche pour continuer votre quête.",
                                2: "Maintenant, rendez-vous au quartier artistique plus au Nord.",
                                3: "Maintenant, rendez-vous au grand parc qui se trouve à l'Ouest de là ou tu te trouves.",
                                4: "Maintenant, tes 4 pierres pourrons ouvrir le coffre qui se trouve du côté des Trocadéros.",
                                6: "Maintenant, avec ce code tu pourras ouvrir le coffre qui se trouve à deux pas d'ici au symbole même de Paris.",
                                8: "Tu as tous les pouvoirs entre tes mains pour sauver le monde.",
                            }

                            if (obj.id in message_obj) {
                                nouvelleQuete(message_obj[obj.id], obj.nom);
                            }

                            
                            if (obj.id in message_obj){
                                this.ajouterObjet(obj);
                            }
                            
                            this.suppObjetCarte(obj);
                            map.removeLayer(mark);
                            console.log("Objet ramassé :", obj.nom);
                            if (obj.obj_apres == -1) {
                                finDuJeu(app.pseudo, app.intervalle);
                            } else {
                                this.chargerObjetSuivant(obj.obj_apres);
                            }
                        });
                        return mark;
                    }
                })

                couchesObjets.addLayer(couche);
            });
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