-- Seed admin user for testing
-- Email: admin@bds.com / Password: admin123
INSERT INTO usuarios (email, password_hash, nombre, apellido, rol)
VALUES (
    'admin@bds.com',
    '$2b$10$2qW2M8dBon.Q95hPJeOpIekeHT/WhD4UzM1RZUsFh/QKG5a8ZRdnK',
    'Admin',
    'BDS',
    'ADMIN'
);
