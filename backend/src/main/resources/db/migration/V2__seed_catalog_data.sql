-- Producto 1: Remera básica negra
INSERT INTO productos (id, nombre, descripcion, precio_base, categoria, activo)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Remera Básica Negra',
        'Remera de algodón peinado 24.1, corte regular. Ideal para uso diario.',
        14999.99, 'REMERAS', TRUE);

INSERT INTO variantes (id, producto_id, talle, color, sku, precio_adicional)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'S', 'Negro', 'REM-NEG-S', 0.00),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'M', 'Negro', 'REM-NEG-M', 0.00),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'L', 'Negro', 'REM-NEG-L', 0.00);

INSERT INTO stocks (id, variante_id, cantidad_disponible)
VALUES
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000001', 50),
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000002', 80),
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000003', 60);

-- Producto 2: Remera oversize blanca
INSERT INTO productos (id, nombre, descripcion, precio_base, categoria, activo)
VALUES ('a0000000-0000-0000-0000-000000000002', 'Remera Oversize Blanca',
        'Remera corte oversize en algodón orgánico. Costuras reforzadas.',
        18999.99, 'REMERAS', TRUE);

INSERT INTO variantes (id, producto_id, talle, color, sku, precio_adicional)
VALUES
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'M', 'Blanco', 'REM-OVS-M', 0.00),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'L', 'Blanco', 'REM-OVS-L', 0.00),
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000002', 'XL', 'Blanco', 'REM-OVS-XL', 500.00);

INSERT INTO stocks (id, variante_id, cantidad_disponible)
VALUES
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000004', 40),
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000005', 55),
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000006', 25);

-- Producto 3: Buzo canguro gris
INSERT INTO productos (id, nombre, descripcion, precio_base, categoria, activo)
VALUES ('a0000000-0000-0000-0000-000000000003', 'Buzo Canguro Gris',
        'Buzo con capucha y bolsillo canguro. Interior cepillado para mayor calidez.',
        34999.99, 'BUZOS', TRUE);

INSERT INTO variantes (id, producto_id, talle, color, sku, precio_adicional)
VALUES
    ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', 'S', 'Gris Melange', 'BUZ-GRI-S', 0.00),
    ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000003', 'M', 'Gris Melange', 'BUZ-GRI-M', 0.00),
    ('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000003', 'L', 'Gris Melange', 'BUZ-GRI-L', 0.00);

INSERT INTO stocks (id, variante_id, cantidad_disponible)
VALUES
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000007', 30),
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000008', 45),
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000009', 35);

-- Producto 4: Buzo universitario azul marino
INSERT INTO productos (id, nombre, descripcion, precio_base, categoria, activo)
VALUES ('a0000000-0000-0000-0000-000000000004', 'Buzo Universitario Azul Marino',
        'Buzo clásico universitario con cuello redondo. Algodón premium 320gsm.',
        39999.99, 'BUZOS', TRUE);

INSERT INTO variantes (id, producto_id, talle, color, sku, precio_adicional)
VALUES
    ('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000004', 'M', 'Azul Marino', 'BUZ-AZU-M', 0.00),
    ('b0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000004', 'L', 'Azul Marino', 'BUZ-AZU-L', 1000.00);

INSERT INTO stocks (id, variante_id, cantidad_disponible)
VALUES
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000010', 35),
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000011', 20);

-- Producto 5: Pantalón cargo beige
INSERT INTO productos (id, nombre, descripcion, precio_base, categoria, activo)
VALUES ('a0000000-0000-0000-0000-000000000005', 'Pantalón Cargo Beige',
        'Pantalón cargo con múltiples bolsillos. Tela de sarga resistente con弹性.',
        45999.99, 'PANTALONES', TRUE);

INSERT INTO variantes (id, producto_id, talle, color, sku, precio_adicional)
VALUES
    ('b0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000005', 'M', 'Beige', 'PAN-BEI-M', 0.00),
    ('b0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000005', 'L', 'Beige', 'PAN-BEI-L', 0.00),
    ('b0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000005', 'XL', 'Beige', 'PAN-BEI-XL', 2000.00);

INSERT INTO stocks (id, variante_id, cantidad_disponible)
VALUES
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000012', 25),
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000013', 30),
    (gen_random_uuid(), 'b0000000-0000-0000-0000-000000000014', 15);
