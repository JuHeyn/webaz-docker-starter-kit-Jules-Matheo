/********************************************
 * 1 — CARTE
 ********************************************/
let map = L.map('map', {
    center: [48.85, 2.35],
    zoom: 13,
    layers: [
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap',
        }),
    ],
});


/********************************************
 * 2 — LISTE DES ÉNIGMES (6 + finale)
 ********************************************/
let enigmes = [
    {
        id: 1,
        coords: [48.853, 2.3498],
        type: "texte",
        question: "Quel monument célèbre se trouve ici ?",
        reponse: "notre-dame",
        objet: { nom: "Pierre du Temps", ordre: 3 }
    },

    {
        id: 2,
        coords: [48.8606, 2.3376],
        type: "texte",
        question: "Quel musée célèbre est ici ?",
        reponse: "louvre",
        objet: { nom: "Pierre de l’Espace", ordre: 4 }
    },

    {
        id: 3,
        coords: [48.8867, 2.3431],
        type: "texte",
        question: "Quel quartier artistique est ici ?",
        reponse: "montmartre",
        objet: { nom: "Pierre de l’Âme", ordre: 5 }
    },

    {
        id: 4,
        coords: [48.880, 2.32],
        type: "texte",
        question: "Quel grand parc se trouve ici ?",
        reponse: "monceau",
        objet: { nom: "Pierre du Pouvoir", ordre: 6 }
    },

    /* 🔵 NOUVEL AUTEL AVEC DRAG & DROP */
    {
        id: 5,
        coords: [48.87, 2.30],
        type: "autel",
        question: "Déposez ici les 4 pierres pour révéler un code secret.",
        objet: null
    },

    /* 🔐 CODE À 4 CHIFFRES (généré) */
    {
        id: 6,
        coords: [48.857, 2.295],
        type: "code4",
        question: "Entrez le code révélé par l’autel.",
        reponse: null,
        objet: null
    },

    /* 🧤 ÉNIGME FINALE */
    {
        id: 7,
        coords: [48.8584, 2.2945],
        type: "final",
        question: "Dernière étape : prenez le gant.",
        objet: { nom: "Gant de l'Infini", ordre: 7 }
    }
];



/********************************************
 * 3 — INVENTAIRE (Vue.js) + DRAG&DROP LOGIC
 ********************************************/
let vm = Vue.createApp({
    data() {
        return {
            objets: [
                { nom: 'Clé', ordre: 1 },
                { nom: 'Carte', ordre: 2 }
            ],
            objetsTrouves: [1,2],
            objetEquipe: null,

            enigmeActuelle: 1,
            pierresPlacees: [],
            codeSecret: null
        };
    },

    methods: {

        ajouterObjet(obj) {
            if (!this.objetsTrouves.includes(obj.ordre)) {
                this.objets.push(obj);
                this.objetsTrouves.push(obj.ordre);
                alert("💎 Objet obtenu : " + obj.nom);

                this.enigmeActuelle++;
                mettreAJourVisibiliteMarkers();
            }
        },

        equiper(obj) {
            this.objetEquipe = obj;
        },

        /********************************************
         * DRAG & DROP DE L'INVENTAIRE
         ********************************************/
        startDrag(event, objet) {
            event.dataTransfer.setData("objet", JSON.stringify(objet));
        },

        /********************************************
         * Dépôt d’une pierre sur l’autel
         ********************************************/
        dropPierre(event) {
            let objet = JSON.parse(event.dataTransfer.getData("objet"));

            // vérifier si c’est une pierre
            if (![3,4,5,6].includes(objet.ordre)) {
                alert("Ce n'est pas une pierre !");
                return;
            }

            if (this.pierresPlacees.includes(objet.ordre)) {
                alert("Cette pierre est déjà placée !");
                return;
            }

            this.pierresPlacees.push(objet.ordre);
            event.target.classList.add("placed");
            event.target.innerHTML = "Pierre placée (" + this.pierresPlacees.length + "/4)";

            // si les 4 pierres sont déposées
            if (this.pierresPlacees.length === 4) {
                alert("🔥 Les 4 pierres résonnent ! Un code apparaît.");

                // génération du code secret
                this.codeSecret = "" +
                    (Math.floor(Math.random() * 9) + 1) +
                    (Math.floor(Math.random() * 9) + 1) +
                    (Math.floor(Math.random() * 9) + 1) +
                    (Math.floor(Math.random() * 9) + 1);

                let enigmeCode = enigmes.find(e => e.id === 6);
                enigmeCode.reponse = this.codeSecret;

                alert("🔐 CODE RÉVÉLÉ : " + this.codeSecret);

                this.enigmeActuelle++;
                mettreAJourVisibiliteMarkers();
            }
        }
    }
}).mount("#inventaire");



/********************************************
 * 4 — VALIDATION DES ÉNIGMES
 ********************************************/
function validerEnigme(id) {
    let e = enigmes.find(x => x.id === id);
    let rep = document.getElementById("rep"+id).value.trim().toLowerCase();

    if (rep === e.reponse) {
        alert("Bonne réponse !");
        vm.ajouterObjet(e.objet);
        map.closePopup();
    } else {
        alert("Incorrect.");
    }
}

function validerCode(id) {
    let e = enigmes.find(x => x.id === id);
    let rep = document.getElementById("code"+id).value.trim();

    if (rep === e.reponse) {
        alert("Code correct !");
        vm.enigmeActuelle++;
        mettreAJourVisibiliteMarkers();
    } else {
        alert("Code incorrect.");
    }
}



/********************************************
 * 5 — MARQUEURS AFFICHÉS PROGRESSIVEMENT
 ********************************************/
let markers = [];

function mettreAJourVisibiliteMarkers() {
    markers.forEach(m => {
        if (m.enigme.id === vm.enigmeActuelle)
            map.addLayer(m.marker);
        else
            map.removeLayer(m.marker);
    });
}



/********************************************
 * 6 — CRÉATION DES MARKERS + POPUPS
 ********************************************/
enigmes.forEach(e => {
    let m = L.marker(e.coords);
    markers.push({ marker: m, enigme: e });

    if (e.type === "texte") {
        m.bindPopup(`
            <b>Énigme ${e.id}</b><br><br>
            ${e.question}<br><br>
            <input id="rep${e.id}" placeholder="Réponse"><br><br>
            <button onclick="validerEnigme(${e.id})">Valider</button>
        `);
    }

    if (e.type === "autel") {
        m.bindPopup(`
            <b>Autel des Pierres</b><br><br>
            ${e.question}<br><br>

            <div id="zone-pierre"
                ondrop="vm.dropPierre(event)"
                ondragover="event.preventDefault()"
                style="
                    width:150px;
                    height:150px;
                    border:2px dashed yellow;
                    background:rgba(255,255,255,0.2);
                    border-radius:10px;
                    text-align:center;
                    padding-top:60px;
                    color:white;
                ">
                Déposez une pierre ici
            </div>
        `);
    }

    if (e.type === "code4") {
        m.bindPopup(`
            <b>Énigme ${e.id}</b><br><br>
            ${e.question}<br><br>
            <input id="code${e.id}" placeholder="4 chiffres"><br><br>
            <button onclick="validerCode(${e.id})">Valider</button>
        `);
    }

    if (e.type === "final") {
        m.bindPopup(`
            <b>Énigme Finale</b><br><br>
            ${e.question}<br><br>
            <button onclick="vm.ajouterObjet(${JSON.stringify(e.objet)})">
                Récupérer le gant
            </button>
        `);
    }
});

mettreAJourVisibiliteMarkers();
