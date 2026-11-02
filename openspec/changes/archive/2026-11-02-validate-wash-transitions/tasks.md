# Tasks

## 1. Transiciones y login

- [x] 1.1 Crear `src/backend/services/lavadoEstadoService.js` con `ESTADOS_INICIALES` y `TRANSICIONES`, y aplicar `assertEstadoInicialPermitido` en `create` de `src/backend/services/lavadoService.js` antes de la verificación de lavado activo; probar en `tests/lavados.test.js` el alta con `En Espera`, `Lavando` y `Terminado` (`201`) y con `Entregado` (`400`).
- [x] 1.2 Aplicar `assertTransicionPermitida` en `update` cuando el estado cambie; probar en `tests/lavados.test.js` el avance, el retroceso de un paso y el mismo estado (`200`), las transiciones inválidas (`409`, sin modificar) y que `Entregado` es terminal (`409` al intentar `Entregado` a `Terminado`).
- [x] 1.3 Crear `src/backend/controllers/lavadosController.js` y usarlo en `src/backend/routes/lavados.js` para inyectar `login` desde `req.session.codigoLogin` y excluir `login` de los campos de actualización; probar que el login de otra sesión se ignora al crear y que el login no cambia al actualizar.
- [x] 1.4 En `src/frontend/src/pages/NuevoLavadoPage.jsx`, filtrar `Entregado` de la lista de estados del combobox; probar en `NuevoLavadoPage.test.jsx` que las opciones son `En Espera`, `Lavando` y `Terminado`.
- [x] 1.5 Migrar las altas y actualizaciones de `tests/lavados.test.js` que usan los estados de fixture (`ids.estadoLavadoId` y `ids.estadoLavadoAltId`) a los estados canónicos (`estadoEnEsperaId`, `estadoLavandoId`, `estadoEntregadoId`), y verificar que la suite completa sigue en verde.

## 2. Verificación final

- [x] 2.1 Ejecutar `npm test` y `npm run lint` en `src/backend` y `npm test` y `npm run lint` en `src/frontend`, y registrar los resultados.
- [x] 2.2 Ejecutar `openspec validate validate-wash-transitions --strict` y verificar que pasa.

## Workflow follow-up

- Archivar este cambio con `/opsx-archive` tras la revisión.
