package com.mitienda.repository;

import com.mitienda.model.Categoria;
import com.mitienda.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductoRepository extends JpaRepository<Producto, UUID> {

    @EntityGraph(attributePaths = {"variantes", "variantes.stock"})
    Page<Producto> findByActivoTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"variantes", "variantes.stock"})
    Page<Producto> findByActivoTrueAndCategoria(Pageable pageable, Categoria categoria);

    @EntityGraph(attributePaths = {"variantes", "variantes.stock"})
    Optional<Producto> findById(UUID id);
}
