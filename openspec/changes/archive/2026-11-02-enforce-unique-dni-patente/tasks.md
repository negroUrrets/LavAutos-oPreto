# Tasks

## 1. DNI

- [x] 1.1 Crear `src/backend/utils/normalizers.js` y aplicar en `src/backend/services/clienteService.js` la unicidad de DNI en `create`/`update`, la reactivación de un cliente con `estadoCliente = 0` y el mapeo de errores únicos a `409`; probar en `tests/clientes.test.js` dos altas con el mismo DNI activo (`409`), la reactivación de un cliente dado de baja (`201`, mismo `codigoPersona`), la edición con el DNI de otro cliente (`409`) y el mismo DNI (`200`).

## 2. Patente

- [x] 2.1 Normalizar la patente y validar su unicidad en `create`/`update` de `src/backend/services/vehiculoService.js`, con mapeo de errores únicos; probar en `tests/vehiculos.test.js` dos vehículos con la misma patente normalizada (`409`), la edición con la patente de otro vehículo (`409`), la misma patente (`200`), el guardado normalizado (`ab123cd` → `AB-123-CD`) y la reactivación de un vehículo dado de baja con la patente, asignándolo al mismo cliente y a un cliente distinto (`201`, mismo `codigoVehi`).

## 3. Base de datos

- [x] 3.1 Actualizar `src/databaseLavadero/script db/DataBaseLavadero.sql` con `UQ_Persona_Dni`, la columna persistida `Vehiculo.patenteClave` y `UQ_Vehiculo_PatenteClave`; verificar en una base temporal que el script corre dos veces, que rechaza un DNI y una patente duplicados y que las restricciones quedan creadas.
- [x] 3.2 Crear `src/databaseLavadero/script db/Migracion_Unicidad_DNI_Patente.sql`, verificar que no haya duplicados en la base actual y ejecutarlo; comprobar que los índices existen y que es idempotente.
- [x] 3.3 Ajustar `src/backend/tests/helpers/fixtures.js` para usar un DNI único por fixture y verificar que las suites de backend siguen en verde.

## 4. Frontend

- [x] 4.1 Propagar el mensaje del backend en `src/frontend/src/services/clientService.js` y `vehicleService.js` y mostrarlo en las páginas de alta y edición; probar el mensaje en las pruebas de los servicios y en una página.

## 5. Verificación final

- [x] 5.1 Ejecutar `npm test` y `npm run lint` en `src/backend` y `npm test` y `npm run lint` en `src/frontend`, y registrar los resultados.
- [x] 5.2 Ejecutar `openspec validate enforce-unique-dni-patente --strict` y verificar que pasa.

## Workflow follow-up

- Archivar este cambio con `/opsx-archive` tras la revisión.
