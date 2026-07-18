package com.mitienda.dto;

import com.mitienda.model.Talle;
import com.mitienda.model.Variante;

import java.math.BigDecimal;
import java.util.UUID;

public record VarianteConStockDTO(
    UUID id,
    Talle talle,
    String color,
    String sku,
    BigDecimal precioAdicional,
    int stockDisponible
) {
    public static VarianteConStockDTO from(Variante variante) {
        return new VarianteConStockDTO(
            variante.getId(),
            variante.getTalle(),
            variante.getColor(),
            variante.getSku(),
            variante.getPrecioAdicional(),
            variante.getStock() != null ? variante.getStock().getCantidadDisponible() : 0
        );
    }
}
