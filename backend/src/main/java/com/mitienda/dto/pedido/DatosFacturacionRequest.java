package com.mitienda.dto.pedido;

import com.mitienda.model.TipoDocumento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record DatosFacturacionRequest(
    @NotNull TipoDocumento tipoDocumento,
    @NotBlank @Pattern(
        regexp = "^[0-9]{7,11}$",
        message = "DNI: 7-8 dígitos, CUIT: 11 dígitos"
    ) String numeroDocumento,
    @NotBlank String nombreRazonSocial,
    @NotBlank String telefono,
    @NotBlank @Email String emailContacto,
    boolean mismaDireccionEnvio,
    String direccionCalle,
    String direccionNumero,
    String direccionCiudad,
    String direccionProvincia,
    String direccionCodigoPostal
) {}
