-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE objets (
    id integer,
    nom text,
    image text,
    min_zoom integer,
    depart boolean,
    obj_apres integer,
    code text,
    PRIMARY KEY (id)
);

SELECT AddGeometryColumn ('objets','geom',4326,'POINT',2);

INSERT INTO objets (id, nom, image, min_zoom, depart, obj_apres, code, geom) VALUES
(0, 'pierre du temps', 'tour_eiffel.png', 2, True, 1, null, ST_SetSRID(ST_MakePoint(2.350021260614442, 48.853232289588526), 4326)),
(1, 'coffre au mot de passe', 'pyramide.png', 2, False, 2, 'Le Louvre', ST_SetSRID(ST_MakePoint(2.3376682017145742, 48.860839625570065), 4326)),
(2, 'pierre de l espace', 'pyramide.png', 2, False, 3, null, ST_SetSRID(ST_MakePoint(2.3376682017145742, 48.860839625570065), 4326)),
(3, 'pierre de l ame', 'pyramide.png', 2, False, 4, null, ST_SetSRID(ST_MakePoint(2.343372638233517, 48.88670984319504), 4326)),
(4, 'pierre du pouvoir', 'pyramide.png', 2, False, 5, null, ST_SetSRID(ST_MakePoint(2.3091521679781497, 48.879518571185834), 4326)),
(5, 'coffre qui necessite pierres', 'pyramide.png', 2, False, 6, null, ST_SetSRID(ST_MakePoint(2.298507655860395, 48.85578060681327), 4326)),
(6, 'code a 4 chiffres', 'pyramide.png', 2, False, 7, null, ST_SetSRID(ST_MakePoint(2.298507655860395, 48.85578060681327), 4326)),
(7, 'coffre qui necessite code a 4 chiffres', 'pyramide.png', 2, False, 8, null, ST_SetSRID(ST_MakePoint(2.294435404975033, 48.85847053148979), 4326)),
(8, 'gant', 'pyramide.png', 2, False, null, null, ST_SetSRID(ST_MakePoint(2.294435404975033, 48.85847053148979), 4326));


-- ###############################################""

CREATE TABLE score (
    id SERIAL PRIMARY KEY,
    nom TEXT,
    temps TIME
);

-- Insérer des données exemples
INSERT INTO score (nom, temps) VALUES
('Jules', '00:15:00'),
('Mathéo', '00:14:59');