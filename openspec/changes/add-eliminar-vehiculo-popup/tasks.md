# Tasks

## 1. Backend

- [x] 1.1 Ajustar `vehiculoService.remove`: si el vehículo tiene lavados, poner `estadoVehi = false` (baja lógica); si no tiene lavados, eliminarlo permanentemente; `404` si no existe. Verificar con pruebas: vehículo sin lavados se elimina (`204` y ya no existe), vehículo con lavados queda inactivo (`204`, existe con `estadoVehi = false`) y vehículo inexistente responde `404`.

## 2. Frontend: popup de eliminación

- [x] 2.1 Agregar `deleteVehiculo` a `src/frontend/src/services/vehicleService.js` (`DELETE /api/vehiculos/:id`). Verificar con una prueba (con `fetch` simulado) que llama al endpoint con `credentials: 'include'`.
- [x] 2.2 En `ClienteInfoPage`, hacer que `Eliminar` de la card de vehículo abra `ConfirmPopup` con la patente; `ACEPTAR` llama a `deleteVehiculo`, recarga la lista y vuelve a `/clientes/:id/info`; `CANCELAR` cierra el popup y vuelve a la información del cliente sin llamar a la API. Verificar con pruebas ambas rutas.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y `npm test` en `src/backend`; registrar los resultados. Si no hay SQL Server accesible, registrar la limitación y no afirmar que las pruebas de backend pasaron.
- [x] 3.2 Ejecutar `openspec validate add-eliminar-vehiculo-popup --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
