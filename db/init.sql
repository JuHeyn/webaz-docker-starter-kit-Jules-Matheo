-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE objets (
    id integer,
    nom text,
    indice text,
    image text,
    min_zoom integer,
    depart boolean,
    obj_apres integer,
    code text,
    PRIMARY KEY (id)
);

SELECT AddGeometryColumn ('objets','geom',4326,'POINT',2);

INSERT INTO objets (id, nom, indice, image, min_zoom, depart, obj_apres, code, geom) VALUES
(0, 'départ', 'La dame de fer', 'tour_eiffel.png', 2, True, null, null, ST_SetSRID(ST_MakePoint(2.2945017931432923, 48.85838086210092), 4326)),
(1, 'louvre', 'braquage', 'pyramide.png', 2, False, 0, null, ST_SetSRID(ST_MakePoint(2.3358647925448355, 48.861053303134874), 4326));


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