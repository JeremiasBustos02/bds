package com.mitienda.service;

import com.mitienda.dto.auth.DireccionRequest;
import com.mitienda.dto.auth.DireccionResponse;
import com.mitienda.model.Direccion;
import com.mitienda.model.Usuario;
import com.mitienda.repository.DireccionRepository;
import com.mitienda.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class DireccionService {

    private final DireccionRepository direccionRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<DireccionResponse> listar(UUID userId) {
        return direccionRepository.findByUsuarioIdOrderByEsPredeterminadaDesc(userId)
                .stream()
                .map(DireccionResponse::from)
                .toList();
    }

    public DireccionResponse crear(UUID userId, DireccionRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        if (request.esPredeterminada()) {
            desmarcarPredeterminadas(userId);
        }

        Direccion direccion = new Direccion(usuario);
        direccion.setAlias(request.alias());
        direccion.setCalle(request.calle());
        direccion.setNumero(request.numero());
        direccion.setCiudad(request.ciudad());
        direccion.setProvincia(request.provincia());
        direccion.setCodigoPostal(request.codigoPostal());
        direccion.setEsPredeterminada(request.esPredeterminada());

        return DireccionResponse.from(direccionRepository.save(direccion));
    }

    public DireccionResponse actualizar(UUID userId, UUID direccionId, DireccionRequest request) {
        Direccion direccion = direccionRepository.findById(direccionId)
                .orElseThrow(() -> new EntityNotFoundException("Dirección no encontrada"));

        if (!direccion.getUsuario().getId().equals(userId)) {
            throw new IllegalArgumentException("No tenés acceso a esta dirección");
        }

        if (request.esPredeterminada() && !direccion.isEsPredeterminada()) {
            desmarcarPredeterminadas(userId);
        }

        direccion.setAlias(request.alias());
        direccion.setCalle(request.calle());
        direccion.setNumero(request.numero());
        direccion.setCiudad(request.ciudad());
        direccion.setProvincia(request.provincia());
        direccion.setCodigoPostal(request.codigoPostal());
        direccion.setEsPredeterminada(request.esPredeterminada());

        return DireccionResponse.from(direccionRepository.save(direccion));
    }

    public void eliminar(UUID userId, UUID direccionId) {
        Direccion direccion = direccionRepository.findById(direccionId)
                .orElseThrow(() -> new EntityNotFoundException("Dirección no encontrada"));

        if (!direccion.getUsuario().getId().equals(userId)) {
            throw new IllegalArgumentException("No tenés acceso a esta dirección");
        }

        direccionRepository.delete(direccion);
    }

    private void desmarcarPredeterminadas(UUID userId) {
        direccionRepository.findByUsuarioIdOrderByEsPredeterminadaDesc(userId)
                .stream()
                .filter(Direccion::isEsPredeterminada)
                .forEach(d -> d.setEsPredeterminada(false));
    }
}
