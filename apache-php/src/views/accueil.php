<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <title>Accueil</title>
</head>
<body>
    <div id="menu" class="position-absolute top-50 start-50 translate-middle text-center ">
        <div id="début">
            <h1>Bienvenue sur notre escape game</h1>
            
            <p>Ton but dans ce jeu sera de collecter les pierres de l'infinies ainsi que le gant de Thanos pour l'empecher de les prendre et supprimer la moitié de la planète. 
                Nos agents nous ont informé qu'elles se sont éparpillées dans Paris et ça sera à toi de les retrouver</p>
            
            <p>Cliquez ici pour commencer le jeu :</p>
            <form action="../jeu" method="POST">
                <input type="text" id="pseudo" name="pseudo" required placeholder="Ton pseudo">
                <button class="btn btn-outline-success">Commencer</button>
            </form>
            <!-- <a href="../jeu"><button type="button" class="btn btn-outline-success">Commencer</button></a> -->
        </div>
        </br>
        <div id="scores">
            <?php 
                $sql = "SELECT * FROM score ORDER BY temps LIMIT 10";
                $reponse = pg_query($link, $sql);
                $scores = pg_fetch_all($reponse);
                $ordre = 0;
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