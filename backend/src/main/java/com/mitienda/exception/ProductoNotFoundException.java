package com.mitienda.exception;

import java.util.UUID;

public class ProductoNotFoundException extends RuntimeException {

    private final UUID id;

    public ProductoNotFoundException(UUID id) {
        super("Producto no encontrado con id: " + id);
        this.id = id;
    }

    public UUID getId() {
        return id;
    }
}
