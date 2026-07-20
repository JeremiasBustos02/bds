# BDS — E-Commerce 3D

Plataforma de e-commerce con experiencia de navegación 3D interactiva (React Three Fiber), catálogo de indumentaria, carrito de compras y autenticación JWT + OAuth2 (Google).

## Stack

| Capa       | Tecnología                                                   |
| ---------- | ------------------------------------------------------------ |
| Frontend   | React 18, Vite 8, TypeScript 6, Three.js, R3F, Tailwind CSS 4 |
| Backend    | Java 17, Spring Boot 3.4, Maven, PostgreSQL 16               |
| Auth       | Spring Security, JWT (jjwt 0.12), OAuth2 Google              |
| Migraciones| Flyway                                                        |
| Infra      | Docker (solo PostgreSQL)                                      |

## Requisitos previos

- **Java** 17 (JDK)
- **Node.js** 18+ (recomendado 20 LTS)
- **Docker** (para PostgreSQL)
- **PowerShell 5.1+** (Windows, el equipo usa Windows; en Mac/Linux los comandos cambian ligeramente)

## Setup paso a paso

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd bds
```

### 2. Iniciar PostgreSQL

```bash
docker compose up -d
```

Esto levanta PostgreSQL 16 en `localhost:5432`, base `mitienda`, usuario `postgres`, contraseña `postgres`.

Para verificar que el contenedor está corriendo:

```bash
docker ps --filter name=bds-postgres
```

### 3. Variables de entorno del backend

Renombrar `backend/.env.example` a `backend/.env` y completar los valores:

```bash
# Windows PowerShell
Copy-Item backend\.env.example backend\.env
```

Editar `backend/.env`:

```env
# Contraseña de PostgreSQL (coincide con docker-compose.yml)
SPRING_DATASOURCE_PASSWORD=postgres123

# JWT secret — cambiar en producción
JWT_SECRET=a291bHVtcGlhbmFzYWx0YW1hcmVjYWxscXVlamFkZXZzdWVsb3M=

# Obligatorio para login con Google (crear credenciales en Google Cloud)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**Nota:** El backend lee `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` directo de variables de entorno. Si no se configuran, el login con Google fallará, pero la autenticación local por JWT sigue funcionando.

### 4. Correr el backend

Las migraciones de Flyway se ejecutan automáticamente al iniciar el backend (crean tablas y seed de datos).

```powershell
# Windows (PowerShell)
cd backend
$env:SPRING_DATASOURCE_PASSWORD='postgres123'
$env:GOOGLE_CLIENT_ID=''
$env:GOOGLE_CLIENT_SECRET=''
.\mvnw.cmd spring-boot:run
```

```bash
# Mac / Linux
cd backend
GOOGLE_CLIENT_ID="" GOOGLE_CLIENT_SECRET="" ./mvnw spring-boot:run
```

Health check:

```bash
curl http://localhost:8080/api/health
```

### 5. Correr el frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend se abre en `http://localhost:5173`. Las llamadas a `/api/*` y `/oauth2/*` se redirigen automáticamente al backend por proxy de Vite.

## URLs finales

| Servicio  | URL                          |
| --------- | ---------------------------- |
| Frontend  | http://localhost:5173         |
| Backend   | http://localhost:8080         |
| Health    | http://localhost:8080/api/health |

## Credenciales de prueba

| Rol    | Email          | Contraseña | Creado por                |
| ------ | -------------- | ---------- | ------------------------- |
| ADMIN  | admin@bds.com  | admin123   | Flyway V4 (seed)          |

> La migración V5 hace nullable `password_hash` para soportar usuarios OAuth2 (Google). Los usuarios creados por OAuth2 no tienen contraseña local.

## Estructura del proyecto

```
bds/
├── frontend/               # React + Vite + R3F
│   ├── src/
│   │   ├── components/     # UI 2D (Tailwind)
│   │   ├── scene/          # Componentes 3D (R3F)
│   │   ├── store/          # Zustand stores
│   │   ├── pages/          # Páginas/rutas
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilidades (GSAP, helpers)
│   ├── vite.config.ts
│   └── package.json
├── backend/                # Spring Boot
│   ├── src/main/java/com/mitienda/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   └── exception/
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/   # Flyway migrations
│   ├── pom.xml
│   └── mvnw.cmd
├── docker-compose.yml      # PostgreSQL 16
├── AGENTS.md               # Convenciones del equipo
└── backend/.env.example    # Template de variables de entorno
```

## Resetear la base de datos

Si necesitás empezar de cero:

```bash
# Bajar y eliminar el volumen de datos
docker compose down -v
# Volver a levantar
docker compose up -d
```

Luego reiniciar el backend para que Flyway ejecute las migraciones desde V1.

## Notas adicionales

- El proyecto usa el **Maven Wrapper** (`mvnw.cmd`), no es necesario tener Maven instalado globalmente.
- El backend está configurado con `spring.jpa.hibernate.ddl-auto: validate` — Flyway es el único responsable del esquema.
- Para login con Google, crear un proyecto en [Google Cloud Console](https://console.cloud.google.com), habilitar la API de Google OAuth2, y configurar las URIs de redirección apuntando a `http://localhost:8080/login/oauth2/code/google`.
