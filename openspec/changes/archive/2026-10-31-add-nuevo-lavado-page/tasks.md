# Tasks

## 1. Backend

- [x] 1.1 Agregar el filtro `vehi` a `buildListOptions` en `src/backend/services/lavadoService.js` (combinable con `estado`). Verificar con pruebas de `GET /api/lavados?vehi=`.
- [x] 1.2 Crear `src/backend/services/utileriaService.js` y `src/backend/routes/utilerias.js` (`PUT /api/utilerias/:id` con `estadoUtileria` y `descripcionUtileria`), montar la ruta en `routes/index.js` y cubrir con pruebas de actualización y `404`.
- [x] 1.3 Agregar el seed de catálogos en `src/backend/services/catalogSeedService.js` (Auxilio, Balizas, Matafuegos; Basico, Completo, Premium; En Espera, Lavando, Terminado) e invocarlo desde `scripts/seed.js`, sin duplicar ni sobrescribir. Verificar ejecutando el seed dos veces.

## 2. Frontend

- [x] 2.1 Crear `src/frontend/src/services/lavadoService.js` con `listByVehiculo`, `listUtileria`, `listCategoriasLavado`, `listEstadosLavado`, `createLavado` y `updateUtileria`, y agregar `fetchSessionData` a `authService.js`. Verificar con pruebas de los servicios.
- [x] 2.2 Crear `src/frontend/src/pages/NuevoLavadoPage.jsx` y su ruta en `App.jsx`: patente del vehículo, checkboxes de utilerías, toggles de categoría (uno solo), `Detalles`, combobox de estado, `Registrar Lavado` con `ConfirmPopup` (aceptar registra y vuelve a la información; cancelar restablece el formulario) y `Cancelar`. Verificar con pruebas.
- [x] 2.3 En `ClienteVehiculoInfo.jsx` y `ClienteInfoPage.jsx`, hacer que `LAVAR` consulte `GET /api/lavados?vehi=:id`: si hay un lavado «En Espera», «Lavando» o «Terminado», mostrar el popup de aviso sin navegar; si no, navegar a `/clientes/:id/vehiculos/:vehiculoId/lavar`. Verificar con pruebas ambas rutas.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/backend` y en `src/frontend`, y registrar los resultados. Si la base no está disponible, registrar la limitación y no afirmar que las pruebas de backend pasaron.
- [x] 3.2 Ejecutar `openspec validate add-nuevo-lavado-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio con `/opsx-archive` tras la revisión.
