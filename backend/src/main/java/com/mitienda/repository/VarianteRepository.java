package com.mitienda.repository;

import com.mitienda.model.Variante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VarianteRepository extends JpaRepository<Variante, UUID> {

    List<Variante> findByProductoId(UUID productoId);
}
