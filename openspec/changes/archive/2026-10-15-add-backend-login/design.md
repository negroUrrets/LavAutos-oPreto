# Design

## Context

Ver `proposal.md - Why`. El backend ya existe (`add-backend-crud-api`): Express con
prefijo `/api`, Sequelize con los modelos `Usuario` y `Login`, manejo centralizado
de errores y pruebas con Jest/Supertest. Este cambio agrega autenticación y protege
los endpoints ya construidos. La documentación (`Diagrama secuencia/inicio sesion
exitoso`, `inicio sesion error`, `Cerrar Sesion` y `Diagrama Flujo Datos/iniciar
sesion usuario`) muestra que las credenciales se verifican en `Usuario` y que el
componente `Login` coordina el inicio y el cierre de sesión.

## Goals / Non-Goals

**Goals:**

- Registrar la cuenta administrador predeterminada de forma idempotente.
- Autenticar contra `Usuario`, iniciar sesión de servidor y registrar el evento en
  `Login`.
- Cerrar sesión y proteger los endpoints existentes.

**Non-Goals:**

- Frontend de login.
- Gestión de usuarios (alta/edición/baja) y auditoría funcional.
- Cambios al esquema de base de datos o tablas de sesión nuevas.
- Recuperación de contraseña o multiusuario.

## Decisions

### Verificación de credenciales y registro del evento

Las credenciales (`nombreUsuario`, `contraseña`) viven en `Usuario`; `Login` es el
registro del evento (`codigoLogin`, `usuario` FK hacia `Usuario.codigoUsuario`). El
login busca el usuario por `nombreUsuario`, compara el hash y, si coincide, crea una
fila en `Login` con `usuario = codigoUsuario` y guarda el `codigoLogin` (y el
`codigoUsuario`) en la sesión. Así, un `Lavado` identifica a su usuario mediante
`Lavado.login -> Login.usuario`.

- Alternativa descartada: mover las credenciales a `Login`, que contradice el
  esquema documentado.
- La respuesta nunca incluye `contraseña`.

### Hash de contraseñas

Se usa `crypto.scrypt` integrado de Node con sal aleatoria por usuario, almacenando
`scrypt$<sal>$<hash>` en `contraseña`. Evita sumar una dependencia de hashing.

- Alternativa descartada: `bcrypt` (dependencia adicional con compilación nativa).
- Alternativa descartada: texto plano, prohibido por AGENTS §11.

### Sesión de servidor con cookie HttpOnly

Se usa `express-session` (nueva dependencia) con cookie `HttpOnly`, `SameSite=Lax`
y `Secure` en HTTPS, y secreto tomado de `SESSION_SECRET`. Es el mecanismo que pide
AGENTS §11 (sesión de servidor con cookie `HttpOnly`).

- Alternativa descartada: token JWT, que contradice la estrategia de sesión de
  servidor con cookie `HttpOnly`.
- El store por defecto (memoria) alcanza para la primera etapa; se documenta su
  limitación para producción.

### Endpoints

| Método y ruta | Descripción |
| --- | --- |
| `POST /api/auth/login` | Valida credenciales, crea la sesión y la fila `Login` |
| `POST /api/auth/logout` | Destruye la sesión |
| `GET /api/auth/session` | Informa el estado de la sesión |

Cuerpo del login: `{ "usuario": "<nombreUsuario>", "contrasena": "<contraseña>" }`.
Se usan claves sin `ñ` en JSON para evitar problemas de codificación; `usuario` mapea
a `nombreUsuario`.

### Protección de endpoints

Un middleware `requireAuth` exige sesión válida y responde `401` sin ella. Se aplica
a los recursos CRUD (clientes, vehículos, catálogos y lavados); `auth` y `health`
quedan públicos. Esto cambia el comportamiento observable de los CRUD, que pasan a
responder `401` sin sesión.

### Errores de credenciales

Ante usuario inexistente o contraseña incorrecta se responde el mismo `401` con un
mensaje genérico, sin distinguir cuál falló, y se compara el hash de forma
consistente para no filtrar información.

### CSRF

Con cookie `SameSite=Lax` y consumo desde el mismo origen, el riesgo de CSRF queda
acotado para la primera etapa. Se documenta que un token CSRF dedicado puede
agregarse en un cambio posterior si el frontend lo requiere.

### Seed del administrador

Un script `scripts/seed.js` ejecutable con `npm run seed` reutiliza los modelos y la
conexión existentes. Busca la cuenta `admin`; si no existe, la crea con la
contraseña `123456` hasheada; si existe, no la modifica (idempotente).

### Sin cambios de esquema ni sincronización destructiva

No se crean migraciones ni tablas nuevas y no se usa
`sequelize.sync({ alter: true })`.

## Risks / Trade-offs

- [Store de sesión en memoria] -> Adecuado para desarrollo; se documenta que no
  escala ni sobrevive reinicios; reemplazarlo es un cambio posterior.
- [Endpoints CRUD pasan a requerir sesión] -> Cambio observable; se cubre con
  pruebas de `401` sin sesión.
- [Secreto de sesión] -> Debe configurarse por entorno; sin él el backend no inicia.
- [Contraseña `123456` débil] -> Es la cuenta predeterminada de la primera etapa;
  cambiarla es responsabilidad operativa, fuera de este cambio.
- [Sin token CSRF dedicado] -> Mitigado con `SameSite`; se documenta como pendiente.

## Migration Plan

- Instalar `express-session`; agregar `SESSION_SECRET` (y `SESSION_COOKIE_SECURE` si
  aplica) a `.env` / `.env.example`.
- Ejecutar `npm run seed` una vez para crear la cuenta administrador.
- Verificación: `npm test` con SQL Server accesible.
- Rollback: revertir los archivos agregados y quitar la protección de rutas; el
  usuario `admin` creado por el seed puede eliminarse manualmente.

## Open Questions

- Store de sesión para producción (memoria vs. persistente) — se resuelve antes de
  exponer el backend fuera de desarrollo.
- El `login` que identifica al usuario en `Lavado` es el `codigoLogin` de la
  sesión; hoy el CRUD de lavados lo recibe en el cuerpo de la petición. Hacer que se
  derive de la sesión es un cambio posterior.
- Token CSRF dedicado si el frontend lo requiere.
