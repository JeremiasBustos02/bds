ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(30);

CREATE TABLE direcciones (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id        UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    alias             VARCHAR(50) NOT NULL,
    calle             VARCHAR(150) NOT NULL,
    numero            VARCHAR(20) NOT NULL,
    ciudad            VARCHAR(100) NOT NULL,
    provincia         VARCHAR(100) NOT NULL,
    codigo_postal     VARCHAR(10) NOT NULL,
    es_predeterminada BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_direcciones_usuario_id ON direcciones(usuario_id);
