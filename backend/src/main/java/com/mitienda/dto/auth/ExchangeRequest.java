package com.mitienda.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record ExchangeRequest(
    @NotBlank String code
) {}
