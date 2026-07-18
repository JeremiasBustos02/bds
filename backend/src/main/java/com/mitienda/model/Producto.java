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

    @Column(name = "slug", nullable = false)
    private String slug;

    @Column(name = "modelo_3d_url")
    private String modelo3dUrl;

    @Column(name = "detalle_tela", columnDefinition = "TEXT")
    private String detalleTela;

    @Column(name = "detalle_corte", columnDefinition = "TEXT")
    private String detalleCorte;

    @Column(name = "detalle_costura", columnDefinition = "TEXT")
    private String detalleCostura;

    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private Instant fechaActualizacion;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Variante> variantes = new ArrayList<>();

    public static Producto create(String nombre, String descripcion, BigDecimal precioBase,
                                  Categoria categoria, String slug, String modelo3dUrl) {
        Producto producto = new Producto();
        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precioBase = precioBase;
        producto.categoria = categoria;
        producto.slug = slug;
        producto.modelo3dUrl = modelo3dUrl;
        return producto;
    }

    public void agregarDetalles(String detalleTela, String detalleCorte, String detalleCostura) {
        this.detalleTela = detalleTela;
        this.detalleCorte = detalleCorte;
        this.detalleCostura = detalleCostura;
    }

    public void agregarVariante(Variante variante) {
        variantes.add(variante);
        variante.setProducto(this);
    }

    public void actualizar(String nombre, String descripcion, BigDecimal precioBase,
                           Categoria categoria, String slug, String modelo3dUrl,
                           String detalleTela, String detalleCorte, String detalleCostura,
                           boolean activo) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioBase = precioBase;
        this.categoria = categoria;
        this.slug = slug;
        this.modelo3dUrl = modelo3dUrl;
        this.detalleTela = detalleTela;
        this.detalleCorte = detalleCorte;
        this.detalleCostura = detalleCostura;
        this.activo = activo;
    }

    public void desactivar() {
        this.activo = false;
    }
}
