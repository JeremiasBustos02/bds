package com.mitienda.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@Getter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    @Setter
    private String email;

    @Column(name = "password_hash")
    @Setter
    private String passwordHash;

    @Column(nullable = false)
    @Setter
    private String nombre;

    @Column(nullable = false)
    @Setter
    private String apellido;

    @Setter
    private String telefono;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Direccion> direcciones = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "fecha_registro", updatable = false)
    private Instant fechaRegistro;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolUsuario rol = RolUsuario.CLIENTE;

    public void cambiarRol(RolUsuario nuevoRol) {
        this.rol = nuevoRol;
    }

    public void agregarDireccion(Direccion direccion) {
        direcciones.add(direccion);
    }

    public void eliminarDireccion(Direccion direccion) {
        direcciones.remove(direccion);
    }
}
