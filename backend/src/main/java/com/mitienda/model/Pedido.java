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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pedidos")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @CreationTimestamp
    @Column(name = "fecha_creacion", updatable = false)
    private Instant fechaCreacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado = EstadoPedido.CONFIRMADO;

    @Column(name = "fecha_estado_actualizado")
    private Instant fechaEstadoActualizado;

    @Column(name = "numero_seguimiento", length = 100)
    private String numeroSeguimiento;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_envio", nullable = false)
    private MetodoEnvio metodoEnvio;

    @Column(name = "codigo_postal", nullable = false, length = 10)
    private String codigoPostal;

    @Column(name = "env_calle", length = 150)
    @Setter
    private String envCalle;

    @Column(name = "env_numero", length = 20)
    @Setter
    private String envNumero;

    @Column(name = "env_piso", length = 10)
    @Setter
    private String envPiso;

    @Column(name = "env_localidad", length = 100)
    @Setter
    private String envLocalidad;

    @Column(name = "env_provincia", length = 100)
    @Setter
    private String envProvincia;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> items = new ArrayList<>();

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private DatosFacturacion datosFacturacion;

    public static Pedido create(Usuario usuario, MetodoEnvio metodoEnvio, String codigoPostal, BigDecimal total) {
        Pedido pedido = new Pedido();
        pedido.usuario = usuario;
        pedido.estado = EstadoPedido.CONFIRMADO;
        pedido.metodoEnvio = metodoEnvio;
        pedido.codigoPostal = codigoPostal;
        pedido.total = total;
        return pedido;
    }

    public void agregarItem(ItemPedido item) {
        items.add(item);
        item.setPedido(this);
    }

    public void cambiarEstado(EstadoPedido nuevoEstado) {
        this.estado = nuevoEstado;
        this.fechaEstadoActualizado = Instant.now();
    }

    public void setNumeroSeguimiento(String numeroSeguimiento) {
        this.numeroSeguimiento = numeroSeguimiento;
    }

    public void setDatosFacturacion(DatosFacturacion datosFacturacion) {
        this.datosFacturacion = datosFacturacion;
    }
}
