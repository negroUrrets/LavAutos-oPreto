# Tasks

## 1. Backend transaccional

- [x] 1.1 Extraer `crearEnTransaccion(payload, transaction)` en `src/backend/services/vehiculoService.js`, hacer que `create` la use con su propia transacción y aceptar la transacción en las validaciones (`assertExists`/`validarCreacion`); exportar la función y el mensaje de patente duplicada, y verificar que `src/backend/tests/vehiculos.test.js` sigue en verde con `npm test -- tests/vehiculos.test.js`, incluida la prueba de alta de vehículo para un cliente existente (`POST /api/vehiculos`)
- [x] 1.2 Extender `create` de `src/backend/services/clienteService.js` para aceptar un `vehiculo` opcional y crearlo o reactivarlo dentro de la misma transacción, mapeando los errores únicos por restricción (`UQ_Persona_Dni` / `UQ_Vehiculo_PatenteClave`); agregar a `src/backend/tests/clientes.test.js` la prueba de alta conjunta exitosa (persona, cliente y vehículo creados, vehículo asociado) usando `createBaseFixtures()` y `suffix()` para la patente, y verificarla con `npm test -- tests/clientes.test.js`
- [x] 1.3 Agregar a `src/backend/tests/clientes.test.js` la prueba de reversión: alta conjunta con la patente de un vehículo activo responde `409` y no existen `Persona`, `Cliente` ni `Vehiculo` nuevos con el DNI/patente enviados; verificar con `npm test -- tests/clientes.test.js`

## 2. Frontend de una sola petición

- [x] 2.1 Actualizar `handleSubmit` de `src/frontend/src/pages/NuevoClientePage.jsx` para enviar una única petición a `createCliente` con `vehiculo: { patenteVehi, modeloVehi }`, eliminar el import y la llamada a `createVehiculo`, y verificar que la prueba de registro exitoso espera un solo `POST /api/clientes` y ningún `POST /api/vehiculos`
- [x] 2.2 Agregar a `src/frontend/src/pages/NuevoClientePage.test.jsx` la prueba de falla del alta conjunta (respuesta `409` del backend): la página muestra el mensaje del backend, no muestra el popup `Bienvenido` y no envía una petición a `/api/vehiculos`; verificar con `npm test` en `src/frontend`
- [x] 2.3 Verificar que `NuevoVehiculoPage` y `createVehiculo` no cambian y que el alta de vehículo para un cliente existente sigue usando `POST /api/vehiculos`; ejecutar `src/frontend/src/pages/NuevoVehiculoPage.test.jsx` con `npm test`

## 3. Verificación

- [x] 3.1 Ejecutar `npm test` y `npm run lint` en `src/backend` y en `src/frontend`; registrar los resultados y corregir cualquier fallo
- [x] 3.2 Ejecutar `openspec validate atomic-cliente-vehiculo-registration --strict` y registrar el resultado

## Workflow follow-up

- Archivar el cambio cuando la revisión del proyecto lo requiera.
- Verificar el resultado archivado y sincronizar las especificaciones principales.
