package com.mitienda.dto.pedido;

import com.mitienda.model.EstadoPedido;
import jakarta.validation.constraints.NotNull;

public record CambiarEstadoRequest(
    @NotNull EstadoPedido nuevoEstado,
    String numeroSeguimiento
) {}
