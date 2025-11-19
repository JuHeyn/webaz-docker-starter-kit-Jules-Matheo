/********************************************
 * 1 — CARTE (inchangé)
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
 * 2 — ENIGMES (ta liste)
 ********************************************/
let enigmes = [
  { id: 1, coords: [48.853, 2.3498], type: "texte", question: "Quel monument célèbre se trouve ici ?", reponse: "notre-dame", objet: { nom: "Pierre du Temps", ordre: 3 } },
  { id: 2, coords: [48.8606, 2.3376], type: "texte", question: "Quel musée célèbre est ici ?", reponse: "louvre", objet: { nom: "Pierre de l’Espace", ordre: 4 } },
  { id: 3, coords: [48.8867, 2.3431], type: "texte", question: "Quel quartier artistique est ici ?", reponse: "montmartre", objet: { nom: "Pierre de l’Âme", ordre: 5 } },
  { id: 4, coords: [48.880, 2.32], type: "texte", question: "Quel grand parc se trouve ici ?", reponse: "monceau", objet: { nom: "Pierre du Pouvoir", ordre: 6 } },
  { id: 5, coords: [48.87, 2.30], type: "autel", question: "Déposez ici les 4 pierres pour révéler un code secret.", objet: null },
  { id: 6, coords: [48.857, 2.295], type: "code4", question: "Entrez le code révélé par l’autel.", reponse: null, objet: null },
  { id: 7, coords: [48.8584, 2.2945], type: "final", question: "Dernière étape : prenez le Gant.", objet: { nom: "Gant de l'Infini", ordre: 7 } }
];


/********************************************
 * 3 — VUE (INVENTAIRE + drag/drop helpers)
 *    NOTE: HTML utilise "équiper" et "équipé"
 ********************************************/
let vm = Vue.createApp({
  data() {
    return {
      objets: [
        { nom: 'Clé', ordre: 1, img: "../assets/img/cle.png" },
        { nom: 'Carte', ordre: 2, img: "../assets/img/carte.jpg" }
      ],
      objetsTrouves: [1, 2],
      équipé: null,             // correspond au v-if dans ton HTML
      objetEquipe: null,        // référence complète à l'objet (optionnel)
      enigmeActuelle: 1,
      pierresPlacees: [],
      codeSecret: null
    };
  },

  methods: {
    /**** Ajoute un objet à l'inventaire (appelé après résolution d'énigme) ****/
    ajouterObjet(obj) {
      if (!this.objetsTrouves.includes(obj.ordre)) {
        this.objets.push(obj);
        this.objetsTrouves.push(obj.ordre);
        alert("💎 Objet obtenu : " + obj.nom);

        // progresser vers l'énigme suivante
        this.enigmeActuelle++;
        mettreAJourVisibiliteMarkers();
        // après ajout d'objet, on (re)prépare l'inventaire draggable dans le DOM
        this.$nextTick(preparerDragSurObjets);
      }
    },

    /**** Méthode appelée depuis ton HTML : équiper(objet) ****/
    équiper(objet) {
      // ton HTML compare 'objet.ordre == équipé'
      this.équipé = objet.ordre;
      this.objetEquipe = objet;
      // feedback visuel
      // console.log("Équipé :", objet.nom);
    },

    /**** Drag start: utile si tu veux lier au drag natif via Vue ****/
    startDrag(ev, objet) {
      ev.dataTransfer.setData("texte/objet", JSON.stringify(objet));
      // optionnel : set drag image
    },

    /**** Méthode exposée au popup de l'autel via ondrop="vm.dropPierre(event)" ****/
    dropPierre(ev) {
    ev.preventDefault();
    
    let raw = null;
    try {
        raw = ev.dataTransfer.getData("texte/objet") || ev.dataTransfer.getData("objet");
    } catch (err) { raw = null; }

    if (!raw) {
        alert("Aucun objet transféré. Assurez-vous de glisser depuis l'inventaire.");
        return;
    }

    let objet = null;
    try { objet = JSON.parse(raw); } catch (err) { objet = null; }

    if (!objet) {
        let ordreStr = ev.dataTransfer.getData("ordre");
        if (ordreStr) {
        let ordre = parseInt(ordreStr, 10);
        objet = this.objets.find(o => o.ordre === ordre);
        }
    }

    if (!objet) {
        alert("Objet introuvable.");
        return;
    }

    // Vérification que c'est bien une pierre
    if (![3, 4, 5, 6].includes(objet.ordre)) {
        alert("Ce n'est pas une pierre !");
        return;
    }

    // Retirer la pierre de l'inventaire si elle y est
    let index = this.objets.findIndex(o => o.ordre === objet.ordre);
    if (index !== -1) {
        this.objets.splice(index, 1);
        if (this.équipé === objet.ordre) this.équipé = null;
    }

    // Ajouter la pierre aux pierres placées
    this.pierresPlacees.push(objet.ordre);
    try { ev.target.classList.add("placed"); } catch(e){}

    alert("Pierre placée : " + objet.nom + " (" + this.pierresPlacees.length + "/4)");

    // Si les 4 pierres sont placées, générer le code
    if (this.pierresPlacees.length === 4) {
            this.codeSecret = "" +
            (Math.floor(Math.random()*9)+1) +
            (Math.floor(Math.random()*9)+1) +
            (Math.floor(Math.random()*9)+1) +
            (Math.floor(Math.random()*9)+1);

            let e6 = enigmes.find(x => x.id === 6);
            if (e6) e6.reponse = this.codeSecret;

            alert("🔐 Les 4 pierres résonnent — code révélé : " + this.codeSecret);

            // Débloquer l'énigme suivante (code)
            this.enigmeActuelle++;
            mettreAJourVisibiliteMarkers();
        }
    }

  },

  mounted() {
    // préparer les items de l'inventaire pour être draggables dès que Vue a rendu
    this.$nextTick(preparerDragSurObjets);
  }
}).mount('#inventaire');


/********************************************
 * 4 — Validation des énigmes (inchangé)
 ********************************************/
function validerEnigme(id) {
  let e = enigmes.find(x => x.id === id);

  // sécurité : ne pas valider si énigme pas encore débloquée
  if (id !== vm.enigmeActuelle) {
    alert("Cette énigme n'est pas encore débloquée !");
    return;
  }

  let input = document.getElementById("rep"+id);
  if (!input) { alert("Champ introuvable"); return; }

  let rep = input.value.trim().toLowerCase();
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
  // sécurité : ne pas valider si pas encore débloqué
  if (id !== vm.enigmeActuelle) {
    alert("Cette énigme n'est pas encore débloquée !");
    return;
  }
  let input = document.getElementById("code"+id);
  if (!input) { alert("Champ introuvable"); return; }
  let rep = input.value.trim();
  if (rep === e.reponse) {
    alert("Code correct !");
    vm.enigmeActuelle++;
    mettreAJourVisibiliteMarkers();
    map.closePopup();
  } else {
    alert("Code incorrect.");
  }
}


/********************************************
 * 5 — Markers & progression (affichage progressif)
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
 * 6 — Création des markers + popups
 *     (le popup d'autel appelle vm.dropPierre(event))
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
             width:150px;height:150px;border:2px dashed yellow;
             background:rgba(255,255,255,0.05);border-radius:10px;
             text-align:center;padding-top:60px;color:black;">
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


/********************************************
 * 7 — Helper : préparer les éléments de l'inventaire pour drag
 *     (s'exécute après que Vue ait rendu la liste dans ton HTML)
 ********************************************/
function preparerDragSurObjets() {
  // la structure HTML que tu as : <div id="liste"> <div v-for="objet in objets" class="objets" :id="objet.ordre" v-on:click="équiper(objet)"> ...
  // sélectionne tous les éléments .objets et remonte l'ordre pour lier l'objet réel
  let nodes = document.querySelectorAll('#liste .objets');
  nodes.forEach(node => {
    // rendre draggable
    node.setAttribute('draggable', 'true');

    // obtenir l'ordre depuis l'id (tu as : :id="objet.ordre")
    let ordre = parseInt(node.id, 10);

    // trouver l'objet correspondant dans vm.objets
    let objet = vm.objets.find(o => o.ordre === ordre);
    if (!objet) return;

    // dragstart : envoyer l'objet en JSON et l'ordre
    node.addEventListener('dragstart', ev => {
      try {
        ev.dataTransfer.setData("texte/objet", JSON.stringify(objet));
      } catch (err) {
        // fallback simple
        ev.dataTransfer.setData("ordre", String(objet.ordre));
      }
    });

    // clic : si ton HTML a déjà v-on:click="équiper(objet)" ce n'est pas strictement nécessaire,
    // mais s'il y a un problème on peut assurer un fallback :
    node.addEventListener('click', () => {
      vm.équiper(objet);
    });
  });
}

// appel initial si Vue a déjà rendu (si pas encore, mounted() s'en occupe)
setTimeout(preparerDragSurObjets, 300);
