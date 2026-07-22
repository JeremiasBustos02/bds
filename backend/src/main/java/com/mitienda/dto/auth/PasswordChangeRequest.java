package com.mitienda.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordChangeRequest(
    @NotBlank String passwordActual,
    @NotBlank @Size(min = 6, max = 100) String passwordNueva
) {}
