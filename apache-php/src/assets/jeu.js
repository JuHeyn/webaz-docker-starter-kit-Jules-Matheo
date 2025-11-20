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
                    this.afficherObjetsSurCarte();
                    console.log("objets chargés :", this.objets);
                })

        },

        chargerObjetSuivant(id) {
            fetch('/api/objets?id=' + id)
                .then(response => response.json())
                .then(obj => {
                    this.objetsCarte = obj;
                    this.afficherObjetsSurCarte();
     
                    console.log("objet suivant :", obj[0].nom);
                });
        },    

        afficherObjetsSurCarte() {
                
            couchesObjets.clearLayers();

            this.objetsCarte.forEach(obj => {

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
                            this.ajouterObjet(obj);
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
}