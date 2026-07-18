package com.mitienda.exception;

import java.util.UUID;

public class ProductoNotFoundException extends RuntimeException {

    public ProductoNotFoundException(UUID id) {
        super("Producto no encontrado con id: " + id);
    }

    public ProductoNotFoundException(String slug) {
        super("Producto no encontrado con slug: " + slug);
    }
}
