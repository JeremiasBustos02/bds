package com.mitienda.dto;

import com.mitienda.model.Talle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record VarianteDTO(
    @NotNull Talle talle,
    @NotBlank String color,
    BigDecimal precioAdicional,
    @PositiveOrZero int cantidadInicial
) {}
