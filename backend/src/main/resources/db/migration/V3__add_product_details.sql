-- Add slug, detalle_tela, detalle_corte, detalle_costura to productos
ALTER TABLE productos
    ADD COLUMN slug VARCHAR(255),
    ADD COLUMN detalle_tela TEXT,
    ADD COLUMN detalle_corte TEXT,
    ADD COLUMN detalle_costura TEXT;

-- Populate slugs for existing products
-- Known seed products by UUID
UPDATE productos SET slug = 'remera-basica-negra'              WHERE id = 'a0000000-0000-0000-0000-000000000001';
UPDATE productos SET slug = 'remera-oversize-blanca'           WHERE id = 'a0000000-0000-0000-0000-000000000002';
UPDATE productos SET slug = 'buzo-canguro-gris'                WHERE id = 'a0000000-0000-0000-0000-000000000003';
UPDATE productos SET slug = 'buzo-universitario-azul-marino'   WHERE id = 'a0000000-0000-0000-0000-000000000004';
UPDATE productos SET slug = 'pantalon-cargo-beige'             WHERE id = 'a0000000-0000-0000-0000-000000000005';

-- Fallback: generate slug from nombre for any other products (e.g. test data)
UPDATE productos SET slug = lower(regexp_replace(nombre, '[^a-zA-Z0-9\s-]', '', 'g'))
WHERE slug IS NULL;
UPDATE productos SET slug = regexp_replace(slug, '\s+', '-', 'g')
WHERE slug IS NULL;

-- Populate detalle fields for existing products
-- Producto 1: Remera Básica Negra
UPDATE productos SET
    detalle_tela    = 'Algodón peinado de fibra larga 24.1 con tejido jersey de 240 g/m². Suavidad y durabilidad en cada puntada.',
    detalle_corte   = 'Corte regular clásico. Hombros naturales y silueta recta que se adapta a todo tipo de cuerpo.',
    detalle_costura = 'Costuras reforzadas con doble aguja en mangas y dobladillos. Remaches internos de alta resistencia.'
WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- Producto 2: Remera Oversize Blanca
UPDATE productos SET
    detalle_tela    = 'Algodón orgánico certificado GOTS con tejido jersey de 260 g/m². Más peso, mejor caída.',
    detalle_corte   = 'Corte oversize con hombros caídos y silueta relajada. Pensado para el movimiento sin perder estructura.',
    detalle_costura = 'Costuras planas que eliminan rozaduras. Doble pespunte en dobladillos y mangas.'
WHERE id = 'a0000000-0000-0000-0000-000000000002';

-- Producto 3: Buzo Canguro Gris
UPDATE productos SET
    detalle_tela    = 'Fleece cepillado por dentro de 320 g/m². Algodón ring-spun con mezcla de poliéster para retención térmica.',
    detalle_corte   = 'Corte relaxed con capucha ajustable. Bolsillo canguro delantero con acceso lateral para dispositivos.',
    detalle_costura = 'Costuras termo-selladas en zonas críticas. Doble aguja en cintura y puños de punto elástico.'
WHERE id = 'a0000000-0000-0000-0000-000000000003';

-- Producto 4: Buzo Universitario Azul Marino
UPDATE productos SET
    detalle_tela    = 'Algodón premium 320 g/m² con acabado cepillado interior. Mezcla de algodón peruano de fibra larga.',
    detalle_corte   = 'Corte clásico universitario con cuello redondo ribeteado. Hombros con costura caída para mejor ajuste.',
    detalle_costura = 'Refuerzos internos en hombros con cinta al bies. Dobladillo inferior con puntada de cobertura.'
WHERE id = 'a0000000-0000-0000-0000-000000000004';

-- Producto 5: Pantalón Cargo Beige
UPDATE productos SET
    detalle_tela    = 'Sarga de algodón resistente de 280 g/m² con acabado stone-wash. Elasticidad controlada para comodidad.',
    detalle_corte   = 'Corte recto con pierna ligeramente holgada. Cintura ajustable con elásticos laterales y pretina con trabillas.',
    detalle_costura = 'Costuras reforzadas en zonas de tensión. Bolsillos cargo con fuelle y cierre de botón de presión.'
WHERE id = 'a0000000-0000-0000-0000-000000000005';

-- Now make slug NOT NULL and add unique constraint
ALTER TABLE productos ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX idx_productos_slug ON productos (slug);
