<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Escape-Game</title>
    <link rel="stylesheet" href="../assets/jeu.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">

</head>
<body>
    <div id="fin" style="display:none">
        <div id="message" class="position-absolute top-50 start-50 translate-middle text-center ">
            <h1>Félicitation <?= $_POST['pseudo']?> !</h1>
            <p>Tu as réussi à assembler le gant de Thanos en seulement <span id="score"></span> !</p>
            <p>N'hésites pas à rejouer pour améliorer ton temps :</p>
            <a href="../"><button class="btn btn-success">Rejouer</button></a>
        </div>
    </div>
    <div id="jeu" class="z-0">
        <div id="map">
        </div>
        <div id="inventaire" >
            <div class="mx-auto p-2">
                <p id="temps">{{ intervalle.split(':')[1] + " min " + intervalle.split(':')[2] + " sec" }}</p>
                <p id="pseudo"><?= $_POST['pseudo'] ?></p>
            </div>
            <div id="liste" class="mx-auto p-2">
                <div v-for="objet in objets" class="objets" :id="objet.id" v-on:click="équiper(objet)">
                    <p v-if="objet.id == équipé.id" id="selectionné">{{ objet.nom }}</p>
                    <p v-else>{{ objet.nom }}</p>
                    <img :src="adresseImage(objet.image)" :alt="objet.nom">
                </div>
            </div>
        </div>
    </div>


    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script src="../assets/jeu.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>