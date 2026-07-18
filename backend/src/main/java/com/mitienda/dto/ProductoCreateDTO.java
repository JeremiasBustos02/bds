package com.mitienda.dto;

import com.mitienda.model.Categoria;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public record ProductoCreateDTO(
    @NotBlank String nombre,
    @NotBlank String descripcion,
    @NotNull @Positive BigDecimal precioBase,
    @NotNull Categoria categoria,
    String modelo3dUrl,
    @NotEmpty @Valid List<VarianteDTO> variantes
) {}
