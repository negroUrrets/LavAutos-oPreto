# Tasks

## 1. Backend

- [x] 1.1 Crear `src/backend/services/lavadoActivoService.js` con `ESTADOS_BLOQUEANTES` y `assertSinLavadoActivo`, y aplicarlo en `update` y `remove` de `src/backend/services/vehiculoService.js`; probar en `tests/vehiculos.test.js` que `PUT` y `DELETE` con un lavado `En Espera` responden `409` sin modificar el vehículo, y que un lavado `Entregado` mantiene la baja lógica.
- [x] 1.2 Aplicar el guard en `update` y `remove` de `src/backend/services/clienteService.js`; probar en `tests/clientes.test.js` que `PUT` y `DELETE` con un vehículo del cliente en lavado `En Espera` responden `409` sin modificar el cliente, y que un lavado `Entregado` mantiene la baja lógica.

## 2. Frontend

- [x] 2.1 Agregar `tieneLavadoActivo(vehiculoIds)` y `MENSAJE_LAVADO_ACTIVO` a `src/frontend/src/services/lavadoService.js`; probar en `lavadoService.test.js` que detecta un lavado en `En Espera`, `Lavando` o `Terminado` y no un `Entregado`.
- [x] 2.2 Hacer que `deleteCliente` y `deleteVehiculo` adjunten el estado HTTP al `Error`; probar en `clientService.test.js` y `vehicleService.test.js` que un `409` produce un error con `status` 409.
- [x] 2.3 En `src/frontend/src/pages/ClienteInfoPage.jsx`, bloquear `Editar` y `Eliminar` de cliente y vehículo con un lavado activo mostrando el popup `Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado`, y manejar el `409` al confirmar la baja; probar los cuatro casos en `ClienteInfoPage.test.jsx`.
- [x] 2.4 En `src/frontend/src/pages/VehiculoInfoPage.jsx`, aplicar el mismo bloqueo para el vehículo y para los vehículos del cliente, y manejar el `409` al confirmar; probar en `VehiculoInfoPage.test.jsx`.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y `npm test` en `src/backend`, y registrar los resultados.
- [x] 3.2 Ejecutar `openspec validate block-edit-delete-active-wash --strict` y verificar que pasa.

## Workflow follow-up

- Archivar este cambio con `/opsx-archive` tras la revisión.
