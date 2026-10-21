# Proposal

## Why

La primera etapa exige que la aplicación comience en el login cuando no hay sesión
válida, pero el backend todavía no tiene autenticación: los endpoints CRUD están
expuestos y no existe una cuenta administradora. Este cambio agrega la
autenticación de backend —cuenta administrador predeterminada, inicio y cierre de
sesión, y protección de los endpoints— para que el frontend de login (cambio
posterior) tenga un servicio real contra el cual autenticar.

## What Changes

- Agregar un script de seed (`npm run seed`) que registra la cuenta administrador
  predeterminada (`nombreUsuario = admin`) si no existe, guardando la contraseña
  con hash (nunca en texto plano).
- Implementar el inicio de sesión: `POST /api/auth/login` valida que el usuario y la
  contraseña coincidan con `Usuario` y, si coinciden, registra una fila en `Login`
  (`usuario = codigoUsuario`) e inicia una sesión de servidor con cookie `HttpOnly`;
  ese `Login` identifica al usuario en `Lavado`.
- Implementar el cierre de sesión: `POST /api/auth/logout` destruye la sesión.
- Exponer el estado de sesión para el cliente: `GET /api/auth/session`.
- Proteger con un middleware de autenticación los endpoints CRUD existentes
  (clientes, vehículos, catálogos, lavados); el login y la salud quedan públicos.
- Devolver un error genérico `401` ante usuario o contraseña incorrectos, sin
  revelar cuál de los dos falló.
- **Fuera de alcance**: frontend de login; gestión de usuarios (alta/edición/baja de
  usuarios); auditoría funcional; cambios al esquema de base de datos; registro de
  sesiones en una tabla nueva.

## Capabilities

### New Capabilities

- `user-auth`: autenticación de la aplicación — cuenta administrador
  predeterminada, inicio de sesión contra `Usuario`, registro del evento en
  `Login`, sesión de servidor con cookie `HttpOnly`, cierre de sesión y protección
  de los endpoints.

### Modified Capabilities

- Ninguna. No hay especificaciones durables registradas todavía; la protección de
  los endpoints CRUD se describe dentro de `user-auth`.

## Impact

- Archivos nuevos bajo `src/backend/` (servicio y controlador de autenticación,
  rutas `auth`, middleware de sesión, utilidad de hash de contraseñas y script de
  seed) y ajustes en `routes/index.js` y `app.js`.
- Dependencias nuevas: `express-session` (sesión de servidor). El hash de
  contraseñas puede resolverse con el módulo `crypto` integrado de Node, sin sumar
  otra dependencia.
- Los endpoints CRUD existentes pasan a requerir sesión; esto cambia su
  comportamiento observable (pasan a responder `401` sin sesión).
- El seed escribe una fila en `Usuario` (y opcionalmente su `Login` al iniciar
  sesión); no modifica el esquema ni elimina datos.
- Requiere SQL Server accesible y la base `DataBaseLavadero`; las credenciales de
  conexión y el secreto de sesión se configuran por variables de entorno.
