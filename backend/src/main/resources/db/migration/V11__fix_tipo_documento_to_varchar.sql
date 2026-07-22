-- Fix: cambiar tipo_documento de enum nativo a VARCHAR para compatibilidad
-- con @Enumerated(EnumType.STRING) de Hibernate (patrón del resto del proyecto)

-- 1. Alterar la columna al tipo correcto
ALTER TABLE datos_facturacion
    ALTER COLUMN tipo_documento TYPE VARCHAR(20)
    USING tipo_documento::TEXT;

-- 2. Eliminar el tipo enum nativo (ya no se usa en ninguna parte)
DROP TYPE IF EXISTS tipo_documento;

-- 3. Agregar CHECK constraint consistente con el patrón de V7 (pedidos.estado)
ALTER TABLE datos_facturacion
    ADD CONSTRAINT datos_facturacion_tipo_documento_check
    CHECK (tipo_documento IN ('DNI', 'CUIT'));
