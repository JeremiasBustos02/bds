package com.mitienda.dto.auth;

import com.mitienda.model.RolUsuario;

import java.util.UUID;

public record AuthResponse(
    UUID id,
    String token,
    String email,
    String nombre,
    String apellido,
    RolUsuario rol
) {}
