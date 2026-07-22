package com.mitienda.controller;

import com.mitienda.dto.ProductoResponseDTO;
import com.mitienda.dto.admin.MetricasResponse;
import com.mitienda.dto.pedido.CambiarEstadoRequest;
import com.mitienda.dto.pedido.PedidoDetalleResponse;
import com.mitienda.dto.pedido.PedidoResponse;
import com.mitienda.model.EstadoPedido;
import com.mitienda.service.PedidoService;
import com.mitienda.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PedidoService pedidoService;
    private final ProductoService productoService;

    @GetMapping("/pedidos")
    public ResponseEntity<Page<PedidoResponse>> listarPedidos(
            @RequestParam(required = false) EstadoPedido estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PedidoResponse> pedidos = pedidoService.listarTodos(estado, desde, hasta, pageable);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/pedidos/{id}")
    public ResponseEntity<PedidoDetalleResponse> detallePedido(@PathVariable UUID id) {
        PedidoDetalleResponse detalle = pedidoService.detalleAdmin(id);
        return ResponseEntity.ok(detalle);
    }

    @PatchMapping("/pedidos/{id}/estado")
    public ResponseEntity<PedidoResponse> cambiarEstado(
            @PathVariable UUID id,
            @Valid @RequestBody CambiarEstadoRequest request) {
        PedidoResponse response = pedidoService.cambiarEstado(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/metricas")
    public ResponseEntity<MetricasResponse> metricas(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta) {
        MetricasResponse metricas = pedidoService.metricas(desde, hasta);
        return ResponseEntity.ok(metricas);
    }

    @GetMapping("/productos")
    public ResponseEntity<List<ProductoResponseDTO>> listarTodosLosProductos() {
        List<ProductoResponseDTO> productos = productoService.listarTodos();
        return ResponseEntity.ok(productos);
    }
}
