-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE objet (
    id integer,
    nom text,
    indice text,
    image text,
    min_zoom integer,
    depart boolean,
    obj_apres integer,
    code boolean,
    PRIMARY KEY (id)
);

SELECT AddGeometryColumn ('objet','geom',4326,'POINT',2);

INSERT INTO objet (id, nom, indice, image, min_zoom, depart, obj_apres, code, geom) VALUES
(0, 'Pierre du Temps', 'Rendez-vous au musée rendant l''architecture égyptienne moderne.', 'pierre_temps.jpg', 18, True, 1, False, ST_SetSRID(ST_MakePoint(2.350021260614442, 48.853232289588526), 4326)),
(1, 'Coffre au mot de passe', null, 'coffre.png', 18, False, 2, True, ST_SetSRID(ST_MakePoint(2.3376682017145742, 48.860839625570065), 4326)),
(2, 'Pierre de l''Espace', 'La prochaine pierre se trouve à un des points le plus haut de Paris.', 'pierre_espace.jpg', 18, False, 3, False, ST_SetSRID(ST_MakePoint(2.3376682017145742, 48.860839625570065), 4326)),
(3, 'Pierre de l''Ame', 'Pour la prochaine pierre, une boussole indiquerait S-O-O depuis là où tu te trouves. Je crois qu''il y a un parc par là-bas...', 'pierre_ame.jpg', 18, False, 4, False, ST_SetSRID(ST_MakePoint(2.343372638233517, 48.88670984319504), 4326)),
(4, 'Pierre du Pouvoir', 'Ces 4 pierres pourraient bien te servir à ouvrir un coffre se trouvant dans le parc ayant le nom d''une planète.', 'pierre_pouvoir.jpg', 18, False, 5, False, ST_SetSRID(ST_MakePoint(2.3091521679781497, 48.879518571185834), 4326)),
(5, 'Coffre qui necessite pierres', null, 'coffre.png', 18, False, 6, True, ST_SetSRID(ST_MakePoint(2.298507655860395, 48.85578060681327), 4326)),
(6, 'Code à 4 chiffres', 'Il y a un autre coffre, à deux pas d''ici, sous le symbole de Paris... Peut-être que ce code pourra t''être utile...', 'code_4_chiffres.png', 18, False, 7, False, ST_SetSRID(ST_MakePoint(2.298507655860395, 48.85578060681327), 4326)),
(7, 'Coffre qui necessite code à 4 chiffres', null, 'coffre.png', 18, False, 8, True, ST_SetSRID(ST_MakePoint(2.294435404975033, 48.85847053148979), 4326)),
(8, 'Gant', null, 'gant.png', 18, False, -1, False, ST_SetSRID(ST_MakePoint(2.294435404975033, 48.85847053148979), 4326));


-- ###############################################

CREATE TABLE enigme (
    id SERIAL PRIMARY KEY,
    saisie boolean,
    question text,
    reponse text
);

INSERT INTO enigme(id, saisie, question, reponse) VALUES
(1, True, 'Le coffre est verouillé mais le mot de passe pour l''ouvrir est le nom du musée dans lequel tu te trouves :', 'Le Louvre;Louvre'),
(7, True, 'Le coffre est verouillé par le code à 4 chiffres que tu viens de récupérer :', '0369'),
(5, False, null, '0;2;3;4');

-- ###############################################

CREATE TABLE score (
    id SERIAL PRIMARY KEY,
    nom TEXT,
    temps TIME
);

-- Insérer des données exemples
INSERT INTO score (nom, temps) VALUES
('Jules', '00:01:12'),
('Mathéo', '00:01:07');