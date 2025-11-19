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

// ################# HeatMap ################

var heatmap = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {layers: 'Escape-game:objets', format: 'image/png', transparent: true, tiled: true, crs: L.CRS.EPSG4326});
var layerControl = L.control.layers(null, {'Triche' : heatmap },{collapsed : false}).addTo(map);


// ################### Vue ###################
let app = Vue.createApp({
  data() {
    return {
        debut : new Date(),
        intervalle : '00:00:00',
        pseudo : document.getElementById('pseudo'),
        objets : [
            {
                nom : 'Clé',
                id : 1,
                img : "../assets/img/cle.png"
            },
            {
                nom : 'Carte',
                id : 2,
                img : "../assets/img/carte.jpg"
            }
        ],
        équipé : {},
        };
    },
    computed: {
        
    },
    methods: {
        horloge(){
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

        équiper (objet) {
            this.équipé = objet;
            console.log("Objet équipé : " + this.équipé.nom)
        }
        
    },
}).mount('#inventaire');

var intervalID = setInterval(app.horloge, 1000);
