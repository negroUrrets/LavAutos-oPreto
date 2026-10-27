# Tasks

## 1. Alta idempotente del administrador

- [x] 1.1 Crear `src/backend/services/adminService.js` con `ensureDefaultAdmin({ nombreUsuario = 'admin', contrasena = '123456' } = {})`: busca por `nombreUsuario`, crea con `hashPassword` si falta, no modifica si existe y devuelve `{ created, codigoUsuario }`. Verificar con pruebas de alta y de idempotencia.
- [x] 1.2 Actualizar `src/backend/scripts/seed.js` para delegar en `ensureDefaultAdmin()` e informar si creó o ya existía la cuenta. Verificar ejecutando `npm run seed` dos veces y observando los mensajes.
- [x] 1.3 Actualizar `src/backend/server.js` para llamar a `ensureDefaultAdmin()` después de `sequelize.authenticate()` y antes de `app.listen`, terminando con un mensaje claro si falla. Verificar revisando el flujo de arranque.

## 2. Pruebas

- [x] 2.1 Agregar `src/backend/tests/adminBootstrap.test.js`: con un usuario único, `ensureDefaultAdmin` crea la cuenta, el hash valida la contraseña, el login por API responde `200` y una segunda ejecución no duplica ni sobrescribe. Limpiar el usuario y su `Login` al final. Verificar con `npm test` del backend.
- [x] 2.2 Ejecutar `npm run seed` sobre la base actual y verificar que `admin` existe y que su contraseña valida `123456`. No usar el usuario `admin` en las pruebas automáticas para no pisar la cuenta real.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/backend` y registrar los resultados.
- [x] 3.2 Ejecutar `openspec validate ensure-default-admin-on-startup --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio con `/opsx-archive` tras la revisión.
