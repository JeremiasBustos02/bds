package com.mitienda.dto.pedido;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CrearPedidoRequest(
    @NotEmpty @Valid List<ItemPedidoRequest> items,
    @NotNull com.mitienda.model.MetodoEnvio metodoEnvio,
    String codigoPostal,
    String envCalle,
    String envNumero,
    String envPiso,
    String envLocalidad,
    String envProvincia,
    @NotNull @Valid DatosFacturacionRequest datosFacturacion
) {}
