package com.mitienda.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "datos_facturacion")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DatosFacturacion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false)
    @Setter
    private TipoDocumento tipoDocumento;

    @Column(name = "numero_documento", nullable = false, length = 20)
    @Setter
    private String numeroDocumento;

    @Column(name = "nombre_razon_social", nullable = false, length = 200)
    @Setter
    private String nombreRazonSocial;

    @Column(nullable = false, length = 30)
    @Setter
    private String telefono;

    @Column(name = "email_contacto", nullable = false)
    @Setter
    private String emailContacto;

    @Column(name = "misma_direccion_envio", nullable = false)
    @Setter
    private boolean mismaDireccionEnvio;

    @Column(name = "direccion_calle", length = 150)
    @Setter
    private String direccionCalle;

    @Column(name = "direccion_numero", length = 20)
    @Setter
    private String direccionNumero;

    @Column(name = "direccion_ciudad", length = 100)
    @Setter
    private String direccionCiudad;

    @Column(name = "direccion_provincia", length = 100)
    @Setter
    private String direccionProvincia;

    @Column(name = "direccion_codigo_postal", length = 10)
    @Setter
    private String direccionCodigoPostal;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    public static DatosFacturacion create(
            Pedido pedido,
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
            String direccionCodigoPostal) {
        DatosFacturacion df = new DatosFacturacion();
        df.pedido = pedido;
        df.tipoDocumento = tipoDocumento;
        df.numeroDocumento = numeroDocumento;
        df.nombreRazonSocial = nombreRazonSocial;
        df.telefono = telefono;
        df.emailContacto = emailContacto;
        df.mismaDireccionEnvio = mismaDireccionEnvio;
        df.direccionCalle = direccionCalle;
        df.direccionNumero = direccionNumero;
        df.direccionCiudad = direccionCiudad;
        df.direccionProvincia = direccionProvincia;
        df.direccionCodigoPostal = direccionCodigoPostal;
        return df;
    }
}
