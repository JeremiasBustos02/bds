package com.mitienda.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "direcciones")
@Getter
@NoArgsConstructor
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    @Setter
    private String alias;

    @Column(nullable = false)
    @Setter
    private String calle;

    @Column(nullable = false)
    @Setter
    private String numero;

    @Column(nullable = false)
    @Setter
    private String ciudad;

    @Column(nullable = false)
    @Setter
    private String provincia;

    @Column(name = "codigo_postal", nullable = false)
    @Setter
    private String codigoPostal;

    @Column(name = "es_predeterminada", nullable = false)
    @Setter
    private boolean esPredeterminada;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    public Direccion(Usuario usuario) {
        this.usuario = usuario;
    }
}
