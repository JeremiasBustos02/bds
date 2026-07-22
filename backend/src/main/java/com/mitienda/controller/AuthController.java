package com.mitienda.controller;

import com.mitienda.dto.auth.AuthResponse;
import com.mitienda.dto.auth.ExchangeRequest;
import com.mitienda.dto.auth.ExchangeResponse;
import com.mitienda.dto.auth.LoginRequest;
import com.mitienda.dto.auth.MeResponse;
import com.mitienda.dto.auth.PasswordChangeRequest;
import com.mitienda.dto.auth.PerfilUpdateRequest;
import com.mitienda.dto.auth.RegisterRequest;
import com.mitienda.security.OAuthCodeStore;
import com.mitienda.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OAuthCodeStore oAuthCodeStore;

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/exchange")
    public ResponseEntity<ExchangeResponse> exchange(@Valid @RequestBody ExchangeRequest request) {
        String jwt = oAuthCodeStore.redeem(request.code());
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ExchangeResponse(null));
        }
        return ResponseEntity.ok(new ExchangeResponse(jwt));
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(@AuthenticationPrincipal UUID userId) {
        MeResponse response = authService.me(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/perfil")
    public ResponseEntity<MeResponse> updateProfile(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody PerfilUpdateRequest request) {
        MeResponse response = authService.updateProfile(userId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody PasswordChangeRequest request) {
        authService.changePassword(userId, request);
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada correctamente"));
    }
}
