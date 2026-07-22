package com.mitienda.dto.pedido;

import com.mitienda.model.Categoria;
import com.mitienda.model.EstadoPedido;
import com.mitienda.model.MetodoEnvio;
import com.mitienda.model.Pedido;
import com.mitienda.model.Talle;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PedidoResponse(
    UUID id,
    UUID usuarioId,
    Instant fechaCreacion,
    EstadoPedido estado,
    Instant fechaEstadoActualizado,
    String numeroSeguimiento,
    BigDecimal total,
    MetodoEnvio metodoEnvio,
    String codigoPostal,
    String envCalle,
    String envNumero,
    String envPiso,
    String envLocalidad,
    String envProvincia,
    List<ItemPedidoResponse> items,
    DatosFacturacionResponse datosFacturacion
) {
    public static PedidoResponse from(Pedido pedido) {
        return new PedidoResponse(
            pedido.getId(),
            pedido.getUsuario() != null ? pedido.getUsuario().getId() : null,
            pedido.getFechaCreacion(),
            pedido.getEstado(),
            pedido.getFechaEstadoActualizado(),
            pedido.getNumeroSeguimiento(),
            pedido.getTotal(),
            pedido.getMetodoEnvio(),
            pedido.getCodigoPostal(),
            pedido.getEnvCalle(),
            pedido.getEnvNumero(),
            pedido.getEnvPiso(),
            pedido.getEnvLocalidad(),
            pedido.getEnvProvincia(),
            pedido.getItems().stream()
                .map(ItemPedidoResponse::from)
                .toList(),
            pedido.getDatosFacturacion() != null
                ? DatosFacturacionResponse.from(pedido.getDatosFacturacion())
                : null
        );
    }

    public record ItemPedidoResponse(
        UUID id,
        UUID varianteId,
        String sku,
        Talle talle,
        String color,
        String productoNombre,
        Categoria categoria,
        int cantidad,
        BigDecimal precioUnitarioAlMomento
    ) {
        public static ItemPedidoResponse from(com.mitienda.model.ItemPedido item) {
            return new ItemPedidoResponse(
                item.getId(),
                item.getVariante().getId(),
                item.getVariante().getSku(),
                item.getVariante().getTalle(),
                item.getVariante().getColor(),
                item.getVariante().getProducto().getNombre(),
                item.getVariante().getProducto().getCategoria(),
                item.getCantidad(),
                item.getPrecioUnitarioAlMomento()
            );
        }
    }
}
