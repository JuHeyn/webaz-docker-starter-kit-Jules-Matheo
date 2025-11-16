L.map('map', {
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
        question: "Énigme 1 : Quel monument célèbre se trouve ici ? (réponse : notre-dame)",
        reponse: "notre-dame",
        objet: {
            nom: "Clé ancienne",
            ordre: 3,
            img: "../assets/img/cle.png"
        }
    },
    
    {
        id: 2,
        coords: [48.8606, 2.3376],
        question: "Énigme 2 : Quel musée célèbre est ici ? (réponse : louvre)",
        reponse: "louvre",
        objet: {
            nom: "Fragment de carte",
            ordre: 4,
            img: "../assets/img/carte.jpg"
        }
    },

    {
        id: 3,
        coords: [48.8867, 2.3431],
        question: "Énigme 3 : Quel quartier artistique est ici ? (réponse : montmartre)",
        reponse: "montmartre",
        objet: {
            nom: "Boussole",
            ordre: 5,
            img: "../assets/img/boussole.png"
        }
    },
    
    {
        id: 4,
        coords: [48.857, 2.295],
        question: "Énigme 4 : Quel monument en fer domine Paris ? (réponse : tour eiffel)",
        reponse: "tour eiffel",
        objet: {
            nom: "Clé finale",
            ordre: 6,
            img: "../assets/img/clefinale.png"
        }
    }
];


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
        équipé : 1
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
