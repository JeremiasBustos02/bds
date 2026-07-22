CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    estado VARCHAR(20) NOT NULL DEFAULT 'CONFIRMADO',
    total DECIMAL(12, 2) NOT NULL,
    metodo_envio VARCHAR(20) NOT NULL,
    codigo_postal VARCHAR(10) NOT NULL
);

CREATE TABLE items_pedido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    variante_id UUID NOT NULL REFERENCES variantes(id),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario_al_momento DECIMAL(12, 2) NOT NULL
);

CREATE INDEX idx_pedidos_usuario_id ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_fecha_creacion ON pedidos(fecha_creacion);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_items_pedido_pedido_id ON items_pedido(pedido_id);
