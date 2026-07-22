-- Ampliar constraint CHECK del enum de estado
ALTER TABLE pedidos DROP CONSTRAINT IF EXISTS pedidos_estado_check;
ALTER TABLE pedidos ADD CONSTRAINT pedidos_estado_check
    CHECK (estado IN ('CONFIRMADO', 'PREPARANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'));

-- Migrar datos existentes: PENDIENTE -> CONFIRMADO
UPDATE pedidos SET estado = 'CONFIRMADO' WHERE estado = 'PENDIENTE';

-- Nuevas columnas
ALTER TABLE pedidos ADD COLUMN fecha_estado_actualizado TIMESTAMP WITH TIME ZONE;
ALTER TABLE pedidos ADD COLUMN numero_seguimiento VARCHAR(100);

-- Inicializar fecha_estado_actualizado con fecha_creacion para registros existentes
UPDATE pedidos SET fecha_estado_actualizado = fecha_creacion;
