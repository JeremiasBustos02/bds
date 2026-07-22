package com.mitienda.dto.pedido;

import com.mitienda.model.EstadoPedido;
import com.mitienda.model.MetodoEnvio;
import com.mitienda.model.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PedidoDetalleResponse(
    UUID id,
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
    String usuarioNombre,
    String usuarioEmail,
    List<PedidoResponse.ItemPedidoResponse> items,
    DatosFacturacionResponse datosFacturacion
) {
    public static PedidoDetalleResponse from(Pedido pedido) {
        return new PedidoDetalleResponse(
            pedido.getId(),
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
            pedido.getUsuario().getNombre(),
            pedido.getUsuario().getEmail(),
            pedido.getItems().stream()
                .map(PedidoResponse.ItemPedidoResponse::from)
                .toList(),
            pedido.getDatosFacturacion() != null
                ? DatosFacturacionResponse.from(pedido.getDatosFacturacion())
                : null
        );
    }
}
