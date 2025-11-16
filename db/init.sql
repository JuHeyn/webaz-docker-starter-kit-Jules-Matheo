-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Créer une table points avec un champ géométrie
CREATE TABLE points (
    id SERIAL PRIMARY KEY,
    name TEXT,
    geom geometry(Point, 4326)
);

-- Insérer des données exemples
INSERT INTO points (name, geom) VALUES
('Paris', ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326)),
('Lyon', ST_SetSRID(ST_MakePoint(4.8357, 45.7640), 4326)),
('Marseille', ST_SetSRID(ST_MakePoint(5.3698, 43.2965), 4326));


CREATE TABLE objets (
    id integer,
    nom text,
    indice text,
    image text,
    min_zoom integer,
    depart boolean,
    obj_avant integer,
    code text,
    PRIMARY KEY (id)
);

SELECT AddGeometryColumn ('objets','geom',4326,'POINT',2);

INSERT INTO objets (id, nom, indice, image, min_zoom, depart, obj_avant, code, geom) VALUES
(0, 'départ', 'La dame de fer', 'tour_eiffel.png', 2, True, null, null, ST_SetSRID(ST_MakePoint(2.2945017931432923, 48.85838086210092), 4326)),
(1, 'louvre', 'braquage', 'pyramide.png', 2, False, 0, null, ST_SetSRID(ST_MakePoint(2.3358647925448355, 48.861053303134874), 4326))