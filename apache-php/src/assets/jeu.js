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
