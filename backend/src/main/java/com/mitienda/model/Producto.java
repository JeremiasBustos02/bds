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
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "productos")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "precio_base", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioBase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(name = "modelo_3d_url")
    private String modelo3dUrl;

    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private Instant fechaActualizacion;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Variante> variantes = new ArrayList<>();

    public static Producto create(String nombre, String descripcion, BigDecimal precioBase,
                                  Categoria categoria, String modelo3dUrl) {
        Producto producto = new Producto();
        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precioBase = precioBase;
        producto.categoria = categoria;
        producto.modelo3dUrl = modelo3dUrl;
        return producto;
    }

    public void agregarVariante(Variante variante) {
        variantes.add(variante);
        variante.setProducto(this);
    }

    public void actualizar(String nombre, String descripcion, BigDecimal precioBase,
                           Categoria categoria, String modelo3dUrl, boolean activo) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioBase = precioBase;
        this.categoria = categoria;
        this.modelo3dUrl = modelo3dUrl;
        this.activo = activo;
    }

    public void desactivar() {
        this.activo = false;
    }
}
