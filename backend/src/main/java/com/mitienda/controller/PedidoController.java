package com.mitienda.controller;

import com.mitienda.dto.pedido.CrearPedidoRequest;
import com.mitienda.dto.pedido.PedidoResponse;
import com.mitienda.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponse> crear(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody CrearPedidoRequest request) {
        PedidoResponse response = pedidoService.crear(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mios")
    public ResponseEntity<Page<PedidoResponse>> misPedidos(
            @AuthenticationPrincipal UUID userId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PedidoResponse> pedidos = pedidoService.listarMios(userId, pageable);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> detalle(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id) {
        PedidoResponse response = pedidoService.detallePorId(id, userId);
        return ResponseEntity.ok(response);
    }
}
