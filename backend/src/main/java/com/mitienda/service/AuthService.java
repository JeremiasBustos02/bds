package com.mitienda.service;

import com.mitienda.dto.auth.AuthResponse;
import com.mitienda.dto.auth.LoginRequest;
import com.mitienda.dto.auth.MeResponse;
import com.mitienda.dto.auth.PasswordChangeRequest;
import com.mitienda.dto.auth.PerfilUpdateRequest;
import com.mitienda.dto.auth.RegisterRequest;
import com.mitienda.exception.EmailAlreadyExistsException;
import com.mitienda.model.RolUsuario;
import com.mitienda.model.Usuario;
import com.mitienda.repository.UsuarioRepository;
import com.mitienda.security.JwtService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(request.email());
        usuario.setPasswordHash(passwordEncoder.encode(request.password()));
        usuario.setNombre(request.nombre());
        usuario.setApellido(request.apellido());
        usuario.cambiarRol(RolUsuario.CLIENTE);

        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(
                usuario.getId(), usuario.getEmail(), usuario.getRol().name());

        return new AuthResponse(
                usuario.getId(),
                token,
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getRol()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        if (usuario.getPasswordHash() == null) {
            throw new IllegalArgumentException("Esta cuenta solo puede iniciar sesión con Google");
        }

        if (!passwordEncoder.matches(request.password(), usuario.getPasswordHash())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        String token = jwtService.generateToken(
                usuario.getId(), usuario.getEmail(), usuario.getRol().name());

        return new AuthResponse(
                usuario.getId(),
                token,
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getRol()
        );
    }

    @Transactional(readOnly = true)
    public MeResponse me(UUID userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        return MeResponse.from(usuario);
    }

    public MeResponse updateProfile(UUID userId, PerfilUpdateRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        usuario.setNombre(request.nombre());
        usuario.setApellido(request.apellido());
        usuario.setTelefono(request.telefono());

        return MeResponse.from(usuario);
    }

    public void changePassword(UUID userId, PasswordChangeRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        if (usuario.getPasswordHash() == null) {
            throw new IllegalArgumentException(
                "Tu cuenta fue creada con Google. El cambio de contraseña no aplica.");
        }

        if (!passwordEncoder.matches(request.passwordActual(), usuario.getPasswordHash())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        usuario.setPasswordHash(passwordEncoder.encode(request.passwordNueva()));
    }
}
