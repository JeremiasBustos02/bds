CREATE TYPE tipo_documento AS ENUM ('DNI', 'CUIT');

CREATE TABLE datos_facturacion (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id                UUID NOT NULL UNIQUE REFERENCES pedidos(id) ON DELETE CASCADE,
    tipo_documento           tipo_documento NOT NULL,
    numero_documento         VARCHAR(20) NOT NULL,
    nombre_razon_social      VARCHAR(200) NOT NULL,
    telefono                 VARCHAR(30) NOT NULL,
    email_contacto           VARCHAR(255) NOT NULL,
    misma_direccion_envio    BOOLEAN NOT NULL DEFAULT TRUE,
    direccion_calle          VARCHAR(150),
    direccion_numero         VARCHAR(20),
    direccion_ciudad         VARCHAR(100),
    direccion_provincia      VARCHAR(100),
    direccion_codigo_postal  VARCHAR(10),
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_datos_facturacion_pedido_id ON datos_facturacion(pedido_id);
