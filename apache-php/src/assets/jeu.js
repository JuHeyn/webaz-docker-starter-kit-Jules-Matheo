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
        objet: { nom: "Pierre du Temps", ordre: 3, indice: "Chiffre = 2" }
    },
    {
        id: 2,
        coords: [48.8606, 2.3376],
        type: "texte",
        question: "Énigme 2 : Quel musée célèbre est ici ? (réponse : louvre)",
        reponse: "louvre",
        objet: { nom: "Pierre de l’Espace", ordre: 4, indice: "Chiffre = 7" }
    },
    {
        id: 3,
        coords: [48.8867, 2.3431],
        type: "texte",
        question: "Énigme 3 : Quel quartier artistique est ici ? (réponse : montmartre)",
        reponse: "montmartre",
        objet: { nom: "Pierre de l’Âme", ordre: 5, indice: "Chiffre = 4" }
    },
    {
        id: 4,
        coords: [48.857, 2.295],
        type: "code4",
        question: "Énigme 4 : Entrez le code révélé par les pierres (xxxx)",
        reponse: "2749",
        objet: { nom: "Pierre du Pouvoir", ordre: 6, indice: "Chiffre = 9" }
    },
    {
        id: 5,
        coords: [48.8584, 2.2945],
        type: "final",
        question: "DERNIÈRE ÉNIGME : Vous ne pouvez obtenir le Gant que si vous possédez les 4 pierres.",
        objet: { nom: "Gant de l’Infin… euh de Paris", ordre: 7, indice: "Objet final" }
    }
];
let heatmap = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {layers: 'Escape-game:objets', format: 'image/png', transparent: true, tiled: true, crs: L.CRS.EPSG4326});
let layerControl = L.control.layers(null, {'Triche' : heatmap },{collapsed : false}).addTo(map);


let app = Vue.createApp({
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
        objetsTrouvés: [1,2],
        enigmeActuelle: 1
        };
    },
        computed: {
        
    },
     methods:{
        ajouterObjet(obj){
            if(!this.objetsTrouves.includes(obj.ordre)){
                this.objets.push(obj);
                this.objetsTrouves.push(obj.ordre);
                alert("💎 Objet obtenu : "+obj.nom+ (obj.indice?" (indice: "+obj.indice+")":""));
            }
        },


        equiper(obj){ this.objetEquipe=obj; },


        placerPierre(){
            if(!this.objetEquipe){ alert("Équipez une pierre !"); return; }
            let o=this.objetEquipe;
            if(![3,4,5,6].includes(o.ordre)){ alert("Ce n'est pas une pierre !"); return; }
            if(this.pierresPlacees.includes(o.ordre)){ alert("Déjà placée !"); return; }


            this.pierresPlacees.push(o.ordre);
            alert("Pierre placée : "+o.nom);


            if(this.pierresPlacees.length===4){
                alert("🧤 Toutes les pierres sont placées ! Vous recevez le Gant.");
                this.ajouterObjet({nom:"Gant de l'Infini", ordre:7});
            }
            }
}
}).mount('#inventaire');



function validerEnigme(id){
    let e = enigmes.find(x=>x.id===id);
    let rep = document.getElementById("rep"+id).value.trim().toLowerCase();
    if(rep===e.reponse){
        alert("Correct !");
        vm.ajouterObjet(e.objet);
        map.closePopup();
    } 
    else alert("Mauvaise réponse.");
}


function validerCode(id){
    let e = enigmes.find(x=>x.id===id);
    let rep = document.getElementById("code"+id).value.trim();
    if(rep===e.reponse){
        alert("Code correct !");
        vm.ajouterObjet(e.objet);
        map.closePopup();
    } 
    else alert("Code incorrect.");
}


enigmes.forEach(e=>{
let m = L.marker(e.coords).addTo(map);


if(e.type==="texte"){
    m.bindPopup(`
        <b>Énigme ${e.id}</b><br><br>${e.question}<br><br>
        <input id="rep${e.id}" placeholder="Réponse"><br><br>
        <button onclick="validerEnigme(${e.id})">Valider</button>
    `);
    }
    if(e.type==="code4"){
        m.bindPopup(`
            <b>Énigme ${e.id}</b><br><br>${e.question}<br><br>
            <input id="code${e.id}" placeholder="4 chiffres"><br><br>
            <button onclick="validerCode(${e.id})">Valider</button>
        `);
    }
    if(e.type==="final"){
        m.bindPopup(`
            <b>Énigme Finale</b><br><br>${e.question}<br><br>
            <button onclick="vm.placerPierre()">Placer la pierre équipée</button>
        `);
}
})