<?php

declare(strict_types=1);

require_once 'flight/Flight.php';

Flight::route('/', function() {
    Flight::render('accueil');
});

Flight::route('/jeu', function() {
    Flight::render('jeu');
});

Flight::route('GET /api/objets', function() {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    // Connexion BDD
    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");
    
    if (isset($_GET["id"])) {
        $id = $_GET["id"];
        $sql = "SELECT  id, nom, indice, image, min_zoom, depart, obj_avant, code,ST_AsGeoJSON(geom) AS geom_wkt FROM objets WHERE id = {$id}"; 
    } else {
        $sql = "SELECT  id, nom, indice, image, min_zoom, depart, obj_avant, code,ST_AsGeoJSON(geom) AS geom_wkt FROM objets WHERE depart"; 
    }
    
    $reponse = pg_query($link, $sql);
    $resultats = pg_fetch_all($reponse);

    foreach ($resultats as $ligne) {
        $ligne["id"] = (int)$ligne["id"];
        $ligne["min_zoom"] = (int)$ligne["min_zoom"];
        $ligne["depart"] = (bool)$ligne["depart"];
        $ligne["obj_avant"] = (int)$ligne["obj_avant"];
        $resultat[] = $ligne;
    }
    Flight::json($resultat);
});

Flight::route('/test-db', function () {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    // Connexion BDD
    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    $sql = "SELECT * FROM points";
    $query = pg_query($link, $sql);
    $results = pg_fetch_all($query);
    Flight::json($results);
});

Flight::start();

?>