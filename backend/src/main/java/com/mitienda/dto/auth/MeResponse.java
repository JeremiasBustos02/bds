package com.mitienda.dto.auth;

import com.mitienda.model.RolUsuario;
import com.mitienda.model.Usuario;

import java.util.UUID;

public record MeResponse(
    UUID id,
    String email,
    String nombre,
    String apellido,
    String telefono,
    RolUsuario rol,
    boolean tienePassword
) {
    public static MeResponse from(Usuario usuario) {
        return new MeResponse(
            usuario.getId(),
            usuario.getEmail(),
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getTelefono(),
            usuario.getRol(),
            usuario.getPasswordHash() != null
        );
    }
}
