# Tasks

## 1. Control de lavado activo

- [x] 1.1 Ampliar `src/backend/services/lavadoActivoService.js` con `esEstadoBloqueante(codigoEstado, transaction)` y la opción `{ excluirLavadoId }` en `assertSinLavadoActivo`; verificar su comportamiento con las pruebas de creación y actualización de la tarea 1.2 y 1.3.
- [x] 1.2 Redefinir `create` en `src/backend/services/lavadoService.js` para abrir una transacción, bloquear la fila del vehículo (`UPDLOCK, ROWLOCK`) y rechazar con `409` si el estado nuevo es activo y el vehículo ya tiene un lavado activo; probar en `tests/lavados.test.js` el alta normal (`201`) y la segunda alta (`409`) con un solo lavado activo.
- [x] 1.3 Redefinir `update` en `src/backend/services/lavadoService.js` con transacción, bloqueo de los vehículos actual y destino en orden ascendente y rechazo con `409` cuando el resultado queda activo sobre un vehículo con otro lavado activo (excluyendo el propio); probar el conflicto, el cambio de estado sobre el mismo vehículo (`200`) y el cambio a un estado no activo (`200`).
- [x] 1.4 Agregar en `tests/lavados.test.js` una prueba de dos altas simultáneas con `Promise.all` sobre el mismo vehículo; verificar que exactamente una responde `201`, la otra `409` y que queda un solo lavado activo.

## 2. Verificación final

- [x] 2.1 Ejecutar `npm test` y `npm run lint` en `src/backend` y registrar los resultados.
- [x] 2.2 Ejecutar `openspec validate enforce-single-active-wash --strict` y verificar que pasa.

## Workflow follow-up

- Archivar este cambio con `/opsx-archive` tras la revisión.
