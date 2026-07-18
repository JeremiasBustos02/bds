package com.mitienda.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "variantes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Variante {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    @Setter(AccessLevel.PACKAGE)
    private Producto producto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Talle talle;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(name = "precio_adicional", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioAdicional = BigDecimal.ZERO;

    @OneToOne(mappedBy = "variante", cascade = CascadeType.ALL, orphanRemoval = true)
    private Stock stock;

    public static Variante create(Talle talle, String color, String sku, BigDecimal precioAdicional) {
        Variante variante = new Variante();
        variante.talle = talle;
        variante.color = color;
        variante.sku = sku;
        variante.precioAdicional = precioAdicional != null ? precioAdicional : BigDecimal.ZERO;
        return variante;
    }

    public void agregarStock(int cantidadDisponible) {
        this.stock = Stock.create(this, cantidadDisponible);
    }
}
