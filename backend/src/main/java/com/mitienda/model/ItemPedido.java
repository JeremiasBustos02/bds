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

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "items_pedido")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    @Setter(AccessLevel.PACKAGE)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variante_id", nullable = false)
    private Variante variante;

    @Column(nullable = false)
    private int cantidad;

    @Column(name = "precio_unitario_al_momento", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioUnitarioAlMomento;

    public static ItemPedido create(Variante variante, int cantidad, BigDecimal precioUnitarioAlMomento) {
        ItemPedido item = new ItemPedido();
        item.variante = variante;
        item.cantidad = cantidad;
        item.precioUnitarioAlMomento = precioUnitarioAlMomento;
        return item;
    }
}
