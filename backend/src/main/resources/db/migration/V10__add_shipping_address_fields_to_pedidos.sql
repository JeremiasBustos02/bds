ALTER TABLE pedidos
    ADD COLUMN env_calle       VARCHAR(150),
    ADD COLUMN env_numero      VARCHAR(20),
    ADD COLUMN env_piso        VARCHAR(10),
    ADD COLUMN env_localidad   VARCHAR(100),
    ADD COLUMN env_provincia   VARCHAR(100);
