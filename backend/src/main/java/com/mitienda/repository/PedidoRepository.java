package com.mitienda.repository;

import com.mitienda.model.Categoria;
import com.mitienda.model.EstadoPedido;
import com.mitienda.model.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    @EntityGraph(attributePaths = {"items", "items.variante", "items.variante.producto"})
    Page<Pedido> findByUsuarioIdOrderByFechaCreacionDesc(UUID usuarioId, Pageable pageable);

    @EntityGraph(attributePaths = {"items", "items.variante", "items.variante.producto", "usuario"})
    Page<Pedido> findAllByOrderByFechaCreacionDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"items", "items.variante", "items.variante.producto", "usuario"})
    Page<Pedido> findByEstadoOrderByFechaCreacionDesc(EstadoPedido estado, Pageable pageable);

    @EntityGraph(attributePaths = {"items", "items.variante", "items.variante.producto", "usuario"})
    Page<Pedido> findByFechaCreacionBetweenOrderByFechaCreacionDesc(Instant desde, Instant hasta, Pageable pageable);

    @EntityGraph(attributePaths = {"items", "items.variante", "items.variante.producto", "usuario"})
    Page<Pedido> findByEstadoAndFechaCreacionBetweenOrderByFechaCreacionDesc(
        EstadoPedido estado, Instant desde, Instant hasta, Pageable pageable);

    @EntityGraph(attributePaths = {"items", "items.variante", "items.variante.producto", "usuario"})
    Optional<Pedido> findDetalleById(UUID id);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.estado != 'CANCELADO'")
    java.math.BigDecimal totalVentas();

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Pedido p WHERE p.estado != 'CANCELADO' " +
           "AND p.fechaCreacion >= :desde AND p.fechaCreacion <= :hasta")
    java.math.BigDecimal totalVentasPorRango(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    long countByEstadoNot(EstadoPedido estado);

    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.fechaCreacion >= :desde AND p.fechaCreacion <= :hasta")
    long countPedidosPorRango(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.estado = 'CANCELADO' " +
           "AND p.fechaCreacion >= :desde AND p.fechaCreacion <= :hasta")
    long countCanceladosPorRango(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query("SELECT ip.variante.producto.nombre AS nombre, SUM(ip.cantidad) AS cantidad " +
           "FROM ItemPedido ip JOIN ip.pedido p WHERE p.estado != 'CANCELADO' " +
           "GROUP BY ip.variante.producto.id, ip.variante.producto.nombre " +
           "ORDER BY cantidad DESC")
    List<Object[]> topProductosVendidos(@Param("limit") org.springframework.data.domain.Pageable pageable);

    @Query("SELECT ip.variante.producto.nombre AS nombre, SUM(ip.cantidad) AS cantidad " +
           "FROM ItemPedido ip JOIN ip.pedido p WHERE p.estado != 'CANCELADO' " +
           "AND p.fechaCreacion >= :desde AND p.fechaCreacion <= :hasta " +
           "GROUP BY ip.variante.producto.id, ip.variante.producto.nombre " +
           "ORDER BY cantidad DESC")
    List<Object[]> topProductosVendidosPorRango(@Param("desde") Instant desde, @Param("hasta") Instant hasta, Pageable pageable);

    @Query("SELECT FUNCTION('DATE', p.fechaCreacion) AS dia, SUM(p.total) AS total " +
           "FROM Pedido p WHERE p.estado != 'CANCELADO' AND p.fechaCreacion >= :desde " +
           "GROUP BY FUNCTION('DATE', p.fechaCreacion) ORDER BY dia")
    List<Object[]> ventasPorDia(@Param("desde") Instant desde);

    @Query("SELECT FUNCTION('DATE', p.fechaCreacion) AS dia, SUM(p.total) AS total " +
           "FROM Pedido p WHERE p.estado != 'CANCELADO' " +
           "AND p.fechaCreacion >= :desde AND p.fechaCreacion <= :hasta " +
           "GROUP BY FUNCTION('DATE', p.fechaCreacion) ORDER BY dia")
    List<Object[]> ventasPorDiaRango(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query("SELECT ip.variante.producto.categoria AS cat, SUM(ip.cantidad * ip.precioUnitarioAlMomento) AS total " +
           "FROM ItemPedido ip JOIN ip.pedido p WHERE p.estado != 'CANCELADO' " +
           "AND p.fechaCreacion >= :desde AND p.fechaCreacion <= :hasta " +
           "GROUP BY ip.variante.producto.categoria ORDER BY total DESC")
    List<Object[]> ventasPorCategoria(@Param("desde") Instant desde, @Param("hasta") Instant hasta);

    @Query("SELECT p.estado AS estado, COUNT(p) AS cantidad " +
           "FROM Pedido p WHERE p.fechaCreacion >= :desde AND p.fechaCreacion <= :hasta " +
           "GROUP BY p.estado")
    List<Object[]> pedidosPorEstado(@Param("desde") Instant desde, @Param("hasta") Instant hasta);
}
