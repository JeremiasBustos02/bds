# Frontend Security Audit

## Hallazgos — Estado actual

### CRÍTICO: JWT en localStorage (aceptado)

El token JWT se almacena en localStorage mediante Zustand persist (store `bds-auth`, parcializado solo al token). Esto es inherentemente vulnerable a XSS: un atacante que logre ejecutar script en el contexto de la página puede leer el token.

**Decisión:** Se acepta este riesgo por ahora. Migrar a cookie httpOnly + Secure para el JWT principal implica:
- Cambiar el backend para emitir un cookie en vez del token en el body de login/registro
- Agregar CSRF protection (hoy deshabilitado)
- Ajustar CORS para allowCredentials + origen explícito (ya configurado)
- El frontend no podría leer el JWT para validaciones client-side (habría que delegar al backend)

Eso amerita un refactor independiente. Por ahora se mantiene localStorage, con la mitigación parcial de que:
- El token se valida contra `/api/auth/me` al restore de sesión
- `ProtectedRoute` verifica expiración client-side antes de dejar pasar
- El flujo OAuth2 con Google ya no expone el JWT en la URL (usa exchange code)
