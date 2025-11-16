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


let enigmes = [
    {
        id: 1,
        coords: [48.853, 2.3498], 
        type: "texte",
        question: "Énigme 1 : Quel monument célèbre se trouve ici ? (réponse : notre-dame)",
        reponse: "notre-dame",
        objet: {
            nom: "Pierre du Temps",
            ordre: 3,
           // img: "../assets/img/pierre_temps.png"
        }
    },
    {
        id: 2,
        coords: [48.8606, 2.3376],
        type: "texte",
        question: "Énigme 2 : Quel musée célèbre est ici ? (réponse : louvre)",
        reponse: "louvre",
        objet: {
            nom: "Pierre de l’Espace",
            ordre: 4,
           // img: "../assets/img/pierre_espace.png"
        }
    },
    {
        id: 3,
        coords: [48.8867, 2.3431], 
        type: "texte",
        question: "Énigme 3 : Quel quartier artistique est ici ? (réponse : montmartre)",
        reponse: "montmartre",
        objet: {
            nom: "Pierre de l’Âme",
            ordre: 5,
            //img: "../assets/img/pierre_ame.png"
        }
    },
    {
        id: 4,
        coords: [41.9028, 12.4964], 
        type: "clic",
        question: "Énigme 4 : Là où tous les chemins mènent… Clique sur Rome pour obtenir la pierre.",
        objet: {
            nom: "Pierre du Pouvoir",
            ordre: 6,
            //img: "../assets/img/pierre_pouvoir.png"
        }
    },
    {
        id: 5,
        coords: [48.857, 2.295], 
        type: "texte",
        question: "Énigme 5 : Quel monument en fer domine Paris ? (réponse : tour eiffel)",
        reponse: "tour eiffel",
        objet: {
            nom: "Pierre de la Réalité",
            ordre: 7,
           // img: "../assets/img/pierre_realite.png"
        }
    }
];

var heatmap = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {layers: 'Escape-game:objets', format: 'image/png', transparent: true, tiled: true, crs: L.CRS.EPSG4326});
var layerControl = L.control.layers(null, {'Triche' : heatmap },{collapsed : false}).addTo(map);


enigmes.forEach(e => {
    let marker = L.marker(e.coords).addTo(map);
    if (e.type === "texte") {
        marker.bindPopup(`
            <b>ÉNIGME ${e.id}</b><br><br>
            ${e.question}<br><br>
            <input type="text" id="rep${e.id}" placeholder="Votre réponse"><br><br>
            <button onclick="validerEnigme(${e.id})">Valider</button>
        `);
    }
    if (e.type === "clic") {
        marker.bindPopup(`
            <b>ÉNIGME ${e.id}</b><br><br>
            ${e.question}<br><br>
            <i>Clique sur ce marqueur !</i>
        `);

        marker.on("click", () => {
            alert("Bonne réponse ! Tous les chemins mènent à Rome 🇮🇹");
            vm.ajouterObjet(e.objet);
            map.closePopup();
        });
    }
});

Vue.createApp({
  data() {
    return {
        objets : [
            {
                nom : 'Clé',
                ordre : 1,
                img : "../assets/img/cle.png"
            },
            {
                nom : 'Carte',
                ordre : 2,
                img : "../assets/img/carte.jpg"
            }
        ],
        équipé : 1,
        };
    },
    computed: {
        
    },
    methods: {
        équiper (objet) {
            this.équipé = objet.ordre;
        }
    },
}).mount('#inventaire');
