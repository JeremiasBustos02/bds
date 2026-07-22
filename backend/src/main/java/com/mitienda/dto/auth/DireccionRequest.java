package com.mitienda.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record DireccionRequest(
    @NotBlank String alias,
    @NotBlank String calle,
    @NotBlank String numero,
    @NotBlank String ciudad,
    @NotBlank String provincia,
    @NotBlank String codigoPostal,
    boolean esPredeterminada
) {}
