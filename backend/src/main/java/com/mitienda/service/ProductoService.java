package com.mitienda.service;

import com.mitienda.dto.ProductoCreateDTO;
import com.mitienda.dto.ProductoResponseDTO;
import com.mitienda.dto.ProductoUpdateDTO;
import com.mitienda.exception.ProductoNotFoundException;
import com.mitienda.model.Categoria;
import com.mitienda.model.Producto;
import com.mitienda.model.Talle;
import com.mitienda.model.Variante;
import com.mitienda.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoService {

    private final ProductoRepository productoRepository;

    public Page<ProductoResponseDTO> listar(Categoria categoria, Pageable pageable) {
        Page<Producto> productos;
        if (categoria != null) {
            productos = productoRepository.findByActivoTrueAndCategoria(pageable, categoria);
        } else {
            productos = productoRepository.findByActivoTrue(pageable);
        }
        return productos.map(ProductoResponseDTO::from);
    }

    public ProductoResponseDTO obtenerPorId(UUID id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ProductoNotFoundException(id));
        return ProductoResponseDTO.from(producto);
    }

    public ProductoResponseDTO obtenerPorSlug(String slug) {
        Producto producto = productoRepository.findBySlugAndActivoTrue(slug)
            .orElseThrow(() -> new ProductoNotFoundException(slug));
        return ProductoResponseDTO.from(producto);
    }

    @Transactional
    public ProductoResponseDTO crear(ProductoCreateDTO dto) {
        String slug = dto.slug() != null ? dto.slug() : generarSlug(dto.nombre());
        Producto producto = Producto.create(
            dto.nombre(),
            dto.descripcion(),
            dto.precioBase(),
            dto.categoria(),
            slug,
            dto.modelo3dUrl()
        );

        producto.agregarDetalles(dto.detalleTela(), dto.detalleCorte(), dto.detalleCostura());

        for (var vDto : dto.variantes()) {
            String sku = generarSku(producto, vDto.talle(), vDto.color());
            Variante variante = Variante.create(vDto.talle(), vDto.color(), sku, vDto.precioAdicional());
            variante.agregarStock(vDto.cantidadInicial());
            producto.agregarVariante(variante);
        }

        Producto guardado = productoRepository.save(producto);
        return ProductoResponseDTO.from(guardado);
    }

    @Transactional
    public ProductoResponseDTO actualizar(UUID id, ProductoUpdateDTO dto) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ProductoNotFoundException(id));
        String slug = dto.slug() != null ? dto.slug() : producto.getSlug();
        producto.actualizar(dto.nombre(), dto.descripcion(), dto.precioBase(),
            dto.categoria(), slug, dto.modelo3dUrl(),
            dto.detalleTela(), dto.detalleCorte(), dto.detalleCostura(),
            dto.activo());
        return ProductoResponseDTO.from(producto);
    }

    @Transactional
    public void desactivar(UUID id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ProductoNotFoundException(id));
        producto.desactivar();
    }

    private String generarSku(Producto producto, Talle talle, String color) {
        String cat = producto.getCategoria().name().substring(0, 3);
        String col = color.toUpperCase().replaceAll("[^A-Z]", "").substring(0, Math.min(3, color.length()));
        return cat + "-" + col + "-" + talle.name();
    }

    private String generarSlug(String nombre) {
        return nombre.toLowerCase()
            .replaceAll("[áäàâ]", "a")
            .replaceAll("[éëèê]", "e")
            .replaceAll("[íïìî]", "i")
            .replaceAll("[óöòô]", "o")
            .replaceAll("[úüùû]", "u")
            .replaceAll("[^a-z0-9\\s-]", "")
            .replaceAll("\\s+", "-")
            .replaceAll("-+", "-")
            .replaceAll("^-|-$", "");
    }
}
