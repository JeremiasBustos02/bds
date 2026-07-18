package com.mitienda.dto;

import com.mitienda.model.Categoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ProductoUpdateDTO(
    @NotBlank String nombre,
    @NotBlank String descripcion,
    @NotNull @Positive BigDecimal precioBase,
    @NotNull Categoria categoria,
    String slug,
    String modelo3dUrl,
    String detalleTela,
    String detalleCorte,
    String detalleCostura,
    boolean activo
) {}
