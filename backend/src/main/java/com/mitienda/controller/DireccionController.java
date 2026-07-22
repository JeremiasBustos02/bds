package com.mitienda.controller;

import com.mitienda.dto.auth.DireccionRequest;
import com.mitienda.dto.auth.DireccionResponse;
import com.mitienda.service.DireccionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth/direcciones")
@RequiredArgsConstructor
public class DireccionController {

    private final DireccionService direccionService;

    @GetMapping
    public ResponseEntity<List<DireccionResponse>> listar(@AuthenticationPrincipal UUID userId) {
        return ResponseEntity.ok(direccionService.listar(userId));
    }

    @PostMapping
    public ResponseEntity<DireccionResponse> crear(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody DireccionRequest request) {
        DireccionResponse response = direccionService.crear(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DireccionResponse> actualizar(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id,
            @Valid @RequestBody DireccionRequest request) {
        return ResponseEntity.ok(direccionService.actualizar(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID id) {
        direccionService.eliminar(userId, id);
        return ResponseEntity.noContent().build();
    }
}
