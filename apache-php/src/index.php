<?php

declare(strict_types=1);

require_once 'flight/Flight.php';

$host = 'db';
$port = 5432;
$dbname = 'mydb';
$user = 'postgres';
$pass = 'postgres';

// Connexion BDD
$link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");
Flight::set('db_link', $link);

Flight::route('/', function() {
    Flight::render('accueil', ["link" => Flight::get('db_link')]);
});

Flight::route('GET /score', function() {
    $link = Flight::get('db_link');

    pg_query_params($link, "INSERT INTO score (nom, temps) VALUES ( $1, $2 )", [$_GET['pseudo'], $_GET['score']]);
});

Flight::route('/jeu', function() {
    Flight::render('jeu');
});

Flight::route('GET /api/objets', function() {
    $link = Flight::get('db_link');

    if (isset($_GET["id"])) {
        $id = $_GET["id"];
        $sql = "SELECT  id, nom, indice, image, min_zoom, depart, obj_apres, code, ST_AsGeoJSON(geom) AS geom_wkt FROM objet WHERE id = {$id}"; 
    } else {
        $sql = "SELECT  id, nom, indice, image, min_zoom, depart, obj_apres, code, ST_AsGeoJSON(geom) AS geom_wkt FROM objet WHERE depart"; 
    }
    
    $reponse = pg_query($link, $sql);
    $resultats = pg_fetch_all($reponse);

    foreach ($resultats as $ligne) {
        $ligne["id"] = (int)$ligne["id"];
        $ligne["min_zoom"] = (int)$ligne["min_zoom"];
        $ligne["depart"] = ($ligne["depart"] == 'f') ? False:True;
        $ligne["obj_apres"] = (int)$ligne["obj_apres"];
        $ligne["code"] = ($ligne["code"]== 'f') ? False:True;
        $resultat[] = $ligne;
    }
    Flight::json($resultat);
});


Flight::route('GET /api/enigme', function() {
    $link = Flight::get('db_link');

    if (isset($_GET["id"])) {
        $id = $_GET["id"];
        $sql = "SELECT id, saisie, question, reponse FROM enigme WHERE id = {$id}"; 
        $reponse = pg_query($link, $sql);
        $resultats = pg_fetch_all($reponse);

        foreach ($resultats as $ligne) {
            $ligne["id"] = (int)$ligne["id"];
            $ligne["saisie"] = ($ligne["saisie"]== 'f') ? False:True;
            $resultat[] = $ligne;
        }

    } else {

        $sql = "SELECT id FROM enigme"; 
        $reponse = pg_query($link, $sql);
        $resultats = pg_fetch_all($reponse);

        foreach ($resultats as $ligne) {
            $ligne["id"] = (int)$ligne["id"];
            $resultat[] = $ligne;
        }
    }   
    Flight::json($resultat);
});

Flight::start();

?>