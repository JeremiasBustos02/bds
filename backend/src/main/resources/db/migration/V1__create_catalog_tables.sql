CREATE TABLE productos (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre              VARCHAR(255) NOT NULL,
    descripcion         TEXT,
    precio_base         NUMERIC(12, 2) NOT NULL,
    categoria           VARCHAR(50) NOT NULL,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    modelo_3d_url       VARCHAR(500),
    fecha_creacion      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_productos_categoria ON productos (categoria);
CREATE INDEX idx_productos_activo ON productos (activo);

CREATE TABLE variantes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id      UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    talle            VARCHAR(10) NOT NULL,
    color            VARCHAR(100) NOT NULL,
    sku              VARCHAR(100) NOT NULL UNIQUE,
    precio_adicional NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

CREATE INDEX idx_variantes_producto_id ON variantes (producto_id);

CREATE TABLE stocks (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variante_id         UUID NOT NULL UNIQUE REFERENCES variantes(id) ON DELETE CASCADE,
    cantidad_disponible INT NOT NULL DEFAULT 0,
    cantidad_reservada  INT NOT NULL DEFAULT 0,
    CONSTRAINT chk_stock_positivo CHECK (cantidad_disponible >= 0),
    CONSTRAINT chk_reserva_positiva CHECK (cantidad_reservada >= 0)
);

CREATE TABLE usuarios (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre        VARCHAR(100) NOT NULL,
    apellido      VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rol           VARCHAR(50) NOT NULL DEFAULT 'CLIENTE'
);

CREATE INDEX idx_usuarios_email ON usuarios (email);

CREATE TABLE carritos (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id    UUID REFERENCES usuarios(id),
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_carritos_usuario_id ON carritos (usuario_id);

CREATE TABLE items_carrito (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrito_id  UUID NOT NULL REFERENCES carritos(id) ON DELETE CASCADE,
    variante_id UUID NOT NULL REFERENCES variantes(id),
    cantidad    INT NOT NULL CHECK (cantidad > 0)
);

CREATE INDEX idx_items_carrito_carrito_id ON items_carrito (carrito_id);
CREATE INDEX idx_items_carrito_variante_id ON items_carrito (variante_id);
