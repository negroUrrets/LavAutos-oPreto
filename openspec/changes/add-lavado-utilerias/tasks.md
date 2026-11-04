# Tasks

## 1. Base de datos y migración

- [x] 1.1 Actualizar `src/databaseLavadero/script db/DataBaseLavadero.sql`: quitar `utileria` y su clave foránea de `Lavado` y crear `DetalleUtileria` con clave primaria compuesta y claves foráneas; verificar en una base scratch que `Lavado` no tiene la columna `utileria`, que `DetalleUtileria` existe y que el script se ejecuta dos veces sin error
- [x] 1.2 Crear `src/databaseLavadero/script db/Migracion_LavadoUtileria.sql` con la copia de `Lavado.utileria` a `DetalleUtileria`, la verificación previa y la eliminación de la columna; revisar el script, respaldar la base y ejecutarlo en `DataBaseLavadero`, verificando que los lavados existentes (códigos 1, 2 y 234) tengan su fila y que `Lavado.utileria` ya no exista

## 2. Backend

- [x] 2.1 Agregar `src/backend/models/DetalleUtileria.js` y las asociaciones `belongsToMany` `Lavado.utilerias`/`Utileria.lavados` en `src/backend/models/index.js`, quitando `utileria` del modelo `Lavado`; actualizar `src/backend/tests/models.test.js` y verificar con `npm test -- tests/models.test.js`
- [x] 2.2 Actualizar `src/backend/services/lavadoService.js` para recibir `utilerias` como arreglo (validar existencia, deduplicar y reemplazar el conjunto en la transacción) e incluir `utilerias` en las respuestas; actualizar `src/backend/tests/lavados.test.js` con alta de varias utilerías, dos lavados con selecciones distintas, catálogo sin cambios, reemplazo del conjunto y utilería inexistente, y verificar con `npm test -- tests/lavados.test.js`
- [x] 2.3 Actualizar `src/backend/tests/clientes.test.js`, `src/backend/tests/vehiculos.test.js` y las creaciones directas de `Lavado` para crear sus filas de `DetalleUtileria` en lugar de enviar `utileria`; verificar con `npm test` en `src/backend`

## 3. Frontend

- [x] 3.1 Actualizar `src/frontend/src/pages/NuevoLavadoPage.jsx` para seleccionar varias utilerías solo en el estado local, sin llamar a `PUT /api/utilerias/:id`, y enviar `utilerias` con todas las seleccionadas; actualizar `src/frontend/src/pages/NuevoLavadoPage.test.jsx` y verificar que no se llama al endpoint del catálogo
- [x] 3.2 Actualizar `src/frontend/src/pages/EditarLavadoPage.jsx` para precargar la selección desde `lavado.utilerias`, no desde `estadoUtileria`, y enviar el conjunto completo sin actualizar el catálogo; actualizar `src/frontend/src/pages/EditarLavadoPage.test.jsx` y verificar con `npm test`
- [x] 3.3 Actualizar `src/frontend/src/components/LavadoInfoPopup.jsx` para mostrar `Detalles` aunque sea nulo, separar vehículo y cliente con una línea y mostrar el título en verde; actualizar `src/frontend/src/pages/LavadosPage.test.jsx` y verificar con `npm test`

## 4. Verificación

- [x] 4.1 Ejecutar `npm test` y `npm run lint` en `src/backend` y en `src/frontend`; registrar los resultados y corregir cualquier fallo
- [x] 4.2 Ejecutar `openspec validate add-lavado-utilerias --strict` y registrar el resultado

## Workflow follow-up

- Archivar el cambio cuando la revisión del proyecto lo requiera.
- Verificar el resultado archivado y sincronizar las especificaciones principales.
