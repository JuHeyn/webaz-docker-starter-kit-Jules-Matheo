<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <title>Félicitations !</title>
</head>
<body>
    <div id="menu" class="position-absolute top-50 start-50 translate-middle text-center ">
        <div id="début">
            <h1>Bravo !</h1>
            <p>Tu as réussi à assembler le gant de Thanos en seulement <?= $score?> !</p>
            <form action="../jeu" method="POST">
                <input type="text" id="pseudo" name="pseudo" required placeholder="Ton pseudo">
                <button class="btn btn-outline-success">Commencer</button>
            </form>
            <!-- <a href="../jeu"><button type="button" class="btn btn-outline-success">Commencer</button></a> -->
        </div>
</br>
        <div id="scores">
            <?php 
                $host = 'db';
                $port = 5432;
                $dbname = 'mydb';
                $user = 'postgres';
                $pass = 'postgres';

                // Connexion BDD
                $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");
                $sql = "SELECT * FROM score ORDER BY temps";
                $reponse = pg_query($link, $sql);
                $scores = pg_fetch_all($reponse);
                $ordre = 0
            ?>
            <table class="table table-bordered table-striped">
                <thead class="table-dark">
                    <tr >
                        <th scope="col">N°</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Score</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <?php foreach ($scores as $score) { ?>
                        <tr>
                            <th><?php echo $ordre; $ordre += 1 ?></th>
                            <th><?= $score['nom']?></th>
                            <td><?= $score['temps'] ?></td>
                        </tr>
                    <?php }?>
                </tbody>
            </table>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>