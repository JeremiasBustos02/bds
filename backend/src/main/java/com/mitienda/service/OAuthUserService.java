package com.mitienda.service;

import com.mitienda.model.RolUsuario;
import com.mitienda.model.Usuario;
import com.mitienda.repository.UsuarioRepository;
import com.mitienda.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class OAuthUserService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public String loginOrCreateWithGoogle(String email, String givenName, String familyName) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    Usuario newUser = new Usuario();
                    newUser.setEmail(email);
                    newUser.setPasswordHash(null);
                    newUser.setNombre(givenName != null ? givenName : "");
                    newUser.setApellido(familyName != null ? familyName : "");
                    newUser.setRol(RolUsuario.CLIENTE);
                    return usuarioRepository.save(newUser);
                });

        return jwtService.generateToken(
                usuario.getId(), usuario.getEmail(), usuario.getRol().name());
    }
}
