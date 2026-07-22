package com.mitienda.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ProductoNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleProductoNotFound(ProductoNotFoundException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(Map.of(
                "error", "Producto no encontrado",
                "mensaje", ex.getMessage()
            ));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleEntityNotFound(EntityNotFoundException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(Map.of(
                "error", "No encontrado",
                "mensaje", ex.getMessage()
            ));
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of(
                "error", "Email duplicado",
                "mensaje", ex.getMessage()
            ));
    }

    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<Map<String, Object>> handleStockInsuficiente(StockInsuficienteException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                "error", "Stock insuficiente",
                "sku", ex.getSku(),
                "solicitado", ex.getSolicitado(),
                "disponible", ex.getDisponible(),
                "mensaje", ex.getMessage()
            ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                "error", "Solicitud inválida",
                "mensaje", ex.getMessage()
            ));
    }

    @ExceptionHandler(TransicionEstadoInvalidaException.class)
    public ResponseEntity<Map<String, String>> handleTransicionInvalida(TransicionEstadoInvalidaException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                "error", "Transición de estado inválida",
                "mensaje", ex.getMessage()
            ));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthentication(AuthenticationException ex) {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(Map.of(
                "error", "No autenticado",
                "mensaje", "Token inválido o expirado"
            ));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(Map.of(
                "error", "Acceso denegado",
                "mensaje", "No tenés permisos para acceder a este recurso"
            ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationError(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        String campo = fieldError != null ? fieldError.getField() : "desconocido";
        String mensaje = fieldError != null ? fieldError.getDefaultMessage() : "Error de validación";
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                "error", "Validación fallida",
                "campo", campo,
                "mensaje", mensaje
            ));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(DataIntegrityViolationException ex) {
        String mensaje = ex.getMessage() != null && ex.getMessage().contains("variantes_sku_key")
            ? "Ya existe una variante con esa combinación de categoría, color y talle. Intentá de nuevo."
            : "Error de integridad de datos. Verificá que los datos no estén duplicados.";
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of(
                "error", "Conflicto de datos",
                "mensaje", mensaje
            ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralError(Exception ex) {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of(
                "error", "Error interno del servidor",
                "mensaje", ex.getMessage()
            ));
    }
}
