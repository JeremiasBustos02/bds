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
│   └── .prettierrc
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
├── docker-compose.yml
└── AGENTS.md
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

## Cómo correr servicios de larga duración

`spring-boot:run` es un proceso servidor que nunca termina. No ejecutarlo en foreground esperando que termine.

### Backend (background + log a archivo)

```powershell
# Iniciar
cd backend
$env:SPRING_DATASOURCE_PASSWORD='postgres123'
Start-Process -PassThru -NoNewWindow -FilePath 'cmd.exe' -ArgumentList '/c "mvnw.cmd" spring-boot:run'
# El proceso PID se muestra; guardarlo si se necesita matar después

# Verificar que levantó
Start-Sleep -Seconds 15
Invoke-RestMethod http://localhost:8080/api/health
```

### Frontend

```powershell
cd frontend
Start-Process -PassThru -NoNewWindow -FilePath 'cmd.exe' -ArgumentList '/c "npx.cmd" vite'
Start-Sleep -Seconds 5
```

### Matar procesos viejos antes de reiniciar

```powershell
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# Verificar puertos libres
netstat -ano | Select-String ":8080 "
netstat -ano | Select-String ":5173 "
```
