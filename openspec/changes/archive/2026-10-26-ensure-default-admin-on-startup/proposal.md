# Proposal

## Why

Tras recrear `DataBaseLavadero` con el script, la tabla `Usuario` queda vacía porque el
script crea solo el esquema. `server.js` no ejecuta el seed, así que no existe la cuenta
`admin` y el login responde `401` aunque el usuario y la contraseña sean correctos.
Verificado en la base actual: `Usuario` tiene 0 filas y `admin` no existe. La comparación
de credenciales está bien (`scrypt`, y el frontend envía `usuario` y `contrasena`).

## What Changes

- El backend SHALL garantizar la cuenta administrador (`admin` / `123456`) al iniciar: si
  no existe, la crea con la contraseña hasheada; si existe, no la duplica ni sobrescribe su
  contraseña.
- Extraer el alta idempotente a `services/adminService.js` y reutilizarla desde
  `scripts/seed.js` y desde el arranque del servidor.
- `server.js` SHALL ejecutar esa verificación después de conectar a la base y antes de
  escuchar; si falla, SHALL terminar con un mensaje claro.
- Agregar pruebas del alta idempotente y del login posterior.
- **Fuera de alcance**: mover las credenciales iniciales a variables de entorno (hardening
  aparte), agregar un índice único a `Usuario.nombreUsuario`, cambios al esquema, cambios al
  frontend y cambios a la pantalla de login.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `user-auth`: la cuenta administrador predeterminada se garantiza al iniciar el backend y
  en el seed; el login funciona en una base recién recreada.

## Impact

- Backend: nuevo `src/backend/services/adminService.js`; ajustes en
  `src/backend/scripts/seed.js` y `src/backend/server.js`; pruebas nuevas en
  `src/backend/tests/`.
- Operación: el arreglo se aplica al reiniciar el backend; para la base actual, ejecutar
  `npm run seed` una vez.
- No cambia el esquema, la API pública ni el frontend.
