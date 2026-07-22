package com.mitienda.dto.pedido;

import com.mitienda.model.DatosFacturacion;
import com.mitienda.model.TipoDocumento;

public record DatosFacturacionResponse(
    TipoDocumento tipoDocumento,
    String numeroDocumento,
    String nombreRazonSocial,
    String telefono,
    String emailContacto,
    boolean mismaDireccionEnvio,
    String direccionCalle,
    String direccionNumero,
    String direccionCiudad,
    String direccionProvincia,
    String direccionCodigoPostal
) {
    public static DatosFacturacionResponse from(DatosFacturacion df) {
        return new DatosFacturacionResponse(
            df.getTipoDocumento(),
            df.getNumeroDocumento(),
            df.getNombreRazonSocial(),
            df.getTelefono(),
            df.getEmailContacto(),
            df.isMismaDireccionEnvio(),
            df.getDireccionCalle(),
            df.getDireccionNumero(),
            df.getDireccionCiudad(),
            df.getDireccionProvincia(),
            df.getDireccionCodigoPostal()
        );
    }
}
