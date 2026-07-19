package com.mitienda.dto.auth;

import com.mitienda.model.RolUsuario;

public record AuthResponse(
    String token,
    String email,
    String nombre,
    String apellido,
    RolUsuario rol
) {}
