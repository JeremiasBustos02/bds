package com.mitienda.repository;

import com.mitienda.model.ItemCarrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, UUID> {
}
