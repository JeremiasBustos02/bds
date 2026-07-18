package com.mitienda.dto;

import com.mitienda.model.Categoria;
import com.mitienda.model.Producto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProductoResponseDTO(
    UUID id,
    String nombre,
    String descripcion,
    BigDecimal precioBase,
    Categoria categoria,
    boolean activo,
    String modelo3dUrl,
    Instant fechaCreacion,
    List<VarianteConStockDTO> variantes
) {
    public static ProductoResponseDTO from(Producto producto) {
        return new ProductoResponseDTO(
            producto.getId(),
            producto.getNombre(),
            producto.getDescripcion(),
            producto.getPrecioBase(),
            producto.getCategoria(),
            producto.isActivo(),
            producto.getModelo3dUrl(),
            producto.getFechaCreacion(),
            producto.getVariantes().stream()
                .map(VarianteConStockDTO::from)
                .toList()
        );
    }
}
