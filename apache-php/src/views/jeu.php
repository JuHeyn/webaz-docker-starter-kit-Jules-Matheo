<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Escape-Game</title>
    <link rel="stylesheet" href="../assets/jeu.css">
</head>
<body>
    <div id="map">
    </div>

    <div id="inventaire">
        <div id="liste" class="mx-auto p-2">
            <div v-for="objet in objets" class="objets" :id="objet.ordre" v-on:click="équiper(objet)"> 
                <p v-if="objet.ordre == équipé" id="selectionné">{{ objet.nom }}</p>
                <p v-else>{{ objet.nom }}</p>
                <img :src="objet.img">
            </div>
        </div>
    </div>

    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="../assets/jeu.js"></script>
</body>
</html>