package com.mitienda.repository;

import com.mitienda.model.Categoria;
import com.mitienda.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductoRepository extends JpaRepository<Producto, UUID> {

    @EntityGraph(attributePaths = {"variantes", "variantes.stock"})
    Page<Producto> findByActivoTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"variantes", "variantes.stock"})
    Page<Producto> findByActivoTrueAndCategoria(Pageable pageable, Categoria categoria);

    @EntityGraph(attributePaths = {"variantes", "variantes.stock"})
    Optional<Producto> findById(UUID id);

    @EntityGraph(attributePaths = {"variantes", "variantes.stock"})
    Optional<Producto> findBySlugAndActivoTrue(String slug);

    @EntityGraph(attributePaths = {"variantes", "variantes.stock"})
    List<Producto> findAllByOrderByFechaCreacionDesc();

    @Query("SELECT DISTINCT p.categoria FROM Producto p WHERE p.activo = true")
    List<Categoria> findCategoriasByActivoTrue();

    @Query("SELECT p.id, p.nombre, p.slug, p.categoria, COALESCE(SUM(s.cantidadDisponible), 0) AS stockTotal " +
           "FROM Producto p JOIN p.variantes v JOIN v.stock s " +
           "WHERE p.activo = true " +
           "GROUP BY p.id, p.nombre, p.slug, p.categoria " +
           "HAVING COALESCE(SUM(s.cantidadDisponible), 0) < :umbral " +
           "ORDER BY stockTotal ASC")
    List<Object[]> findProductosStockBajo(@Param("umbral") int umbral);
}
