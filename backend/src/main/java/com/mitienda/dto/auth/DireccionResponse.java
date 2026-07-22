package com.mitienda.dto.auth;

import com.mitienda.model.Direccion;

import java.util.UUID;

public record DireccionResponse(
    UUID id,
    String alias,
    String calle,
    String numero,
    String ciudad,
    String provincia,
    String codigoPostal,
    boolean esPredeterminada
) {
    public static DireccionResponse from(Direccion d) {
        return new DireccionResponse(
            d.getId(),
            d.getAlias(),
            d.getCalle(),
            d.getNumero(),
            d.getCiudad(),
            d.getProvincia(),
            d.getCodigoPostal(),
            d.isEsPredeterminada()
        );
    }
}
