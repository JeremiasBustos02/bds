package com.mitienda.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record PerfilUpdateRequest(
    @NotBlank String nombre,
    @NotBlank String apellido,
    String telefono
) {}
