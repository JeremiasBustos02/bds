# BDS — E-Commerce 3D Project

## Stack

### Frontend
- **Build**: Vite 8 + TypeScript 6 (strict mode)
- **UI**: React 18, React Router DOM 7
- **3D**: Three.js, @react-three/fiber 8, @react-three/drei 9
- **Estado**: Zustand 5
- **Estilos**: Tailwind CSS v4 (vía `@tailwindcss/vite` plugin, sin postcss.config.js)
- **Animaciones**: GSAP + ScrollTrigger (scroll) + Framer Motion (transiciones UI)
- **Linting**: ESLint strict TypeScript rules (@typescript-eslint/strict-type-checked) + Prettier

### Backend
- **Runtime**: Java 17, Spring Boot 3.4
- **Build**: Maven 3.9 (wrapper incluido)
- **DB**: PostgreSQL 16 (driver JDBC)
- **DTOs**: records de Java (Request/Response separados)

### Infraestructura
- **Docker**: PostgreSQL 16 alpine en docker-compose.yml

## Estructura del proyecto

```
/
├── frontend/
│   ├── src/
│   │   ├── scene/         # Componentes de Three.js/R3F
│   │   ├── components/    # UI en 2D (HTML/Tailwind)
│   │   ├── store/         # Stores de Zustand
│   │   ├── pages/         # Páginas/rutas
│   │   ├── assets/        # .glb, texturas, imágenes
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilidades (GSAP setup, helpers)
│   ├── vite.config.ts
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── package.json       # npm dev:bg para correr en background
│   └── run-bg.ps1         # Helper: levanta frontend en background + log
├── backend/
│   ├── src/main/java/com/mitienda/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   └── exception/
│   └── src/main/resources/application.yml
│   ├── pom.xml
│   └── run-bg.ps1         # Helper: levanta backend en background + log
├── docker-compose.yml
├── kill-all.ps1           # Mata java + node y verifica puertos libres
└── AGENTS.md
```

## Cómo correr procesos de larga duración — LEER SIEMPRE ANTES DE PROBAR CAMBIOS

`mvnw spring-boot:run` y `npm run dev` son servidores que nunca terminan.
**NUNCA ejecutarlos en foreground** esperando que terminen. Siempre correrlos
en background con salida redirigida a un archivo de log.

### Antes de arrancar: matar procesos viejos

```powershell
.\kill-all.ps1
```

Esto mata todos los procesos java y node, espera 3 segundos y verifica
que los puertos 8080 (backend) y 5173 (frontend) queden libres.

Si preferís verificar manualmente:
```powershell
Get-Process -Name "java","node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3
netstat -ano | Select-String ":8080 "
netstat -ano | Select-String ":5173 "
```

### Backend (con script helper)

```powershell
cd backend
.\run-bg.ps1
```

Esto:
1. Mata cualquier java previo en puerto 8080
2. Setea `DB_PASSWORD` y `JWT_SECRET`
3. Corre `mvnw spring-boot:run` en background
4. Redirige stdout+stderr a `backend/logs/backend.log`
5. Espera 15 segundos y verifica `GET /api/health`

Para ver el log:
```powershell
Get-Content backend/logs/backend.log -Tail 50 -Wait
```

Para personalizar credenciales:
```powershell
.\run-bg.ps1 -DbPassword "miPass" -JwtSecret "base64secret=="
```

### Frontend (con script helper)

```powershell
cd frontend
.\run-bg.ps1
```
O via npm:
```powershell
cd frontend
npm run dev:bg
```

Esto:
1. Mata cualquier node previo en puerto 5173
2. Corre `npx vite --port 5173` en background
3. Redirige stdout+stderr a `frontend/logs/frontend.log`
4. Espera 8 segundos y verifica que HTTP 200 responda

Para ver el log:
```powershell
Get-Content frontend/logs/frontend.log -Tail 30 -Wait
```

### Verificar que ambos están levantados

```powershell
Invoke-RestMethod http://localhost:8080/api/health   # → {"status":"ok"}
Invoke-WebRequest http://localhost:5173/              # → 200
```

## Convenciones

### Animaciones
- **GSAP + ScrollTrigger** para animaciones vinculadas al scroll (parallax, entradas al viewport, etc.)
- **Framer Motion** para transiciones de UI (modales, páginas, hover/tap en componentes 2D)
- GSAP ScrollTrigger está registrado globalmente en `frontend/src/lib/gsap-setup.ts`

### Backend (Arquitectura en Capas)
- Controllers: solo HTTP, sin lógica de negocio, sin acceso directo a repositorios
- Services: toda la lógica de negocio, `@Transactional` aquí
- Repositories: solo datos, sin lógica
- DTOs: records Java, Request/Response separados
- Excepciones: `@RestControllerAdvice`, nunca try/catch en controllers
- Inyección: constructor injection con `@RequiredArgsConstructor`, nunca `@Autowired` field injection

### Frontend
- Cada store de Zustand en su propio archivo dentro de `store/`
- Componentes 3D en `scene/`, UI 2D en `components/`
- Sin `any` implícito — ESLint lo rechaza como error
