package com.mitienda.dto.admin;

import com.mitienda.model.Categoria;
import com.mitienda.model.EstadoPedido;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record MetricasResponse(
    BigDecimal ventasTotales,
    long cantidadPedidos,
    BigDecimal ticketPromedio,
    List<ProductoTop> topProductos,
    Map<String, BigDecimal> ventasPorDia,
    Map<Categoria, BigDecimal> ventasPorCategoria,
    Map<EstadoPedido, Long> pedidosPorEstado,
    BigDecimal tasaCancelacion,
    List<StockBajo> stockBajo
) {
    public record ProductoTop(
        String nombre,
        long cantidadVendida
    ) {}

    public record StockBajo(
        UUID id,
        String nombre,
        String slug,
        Categoria categoria,
        int stockTotal
    ) {}
}
