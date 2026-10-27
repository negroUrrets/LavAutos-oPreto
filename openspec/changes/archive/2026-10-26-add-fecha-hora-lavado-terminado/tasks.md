# Tasks

## 1. Backend

- [x] 1.1 Agregar `fechaHoraLavadoTerminado` (`DataTypes.DATE`, `allowNull: false`) a `src/backend/models/Lavado.js` y hooks: `beforeCreate` asigna `fechaHoraLavado` y `fechaHoraLavadoTerminado` con `new Date()`; `beforeUpdate` actualiza `fechaHoraLavadoTerminado` cuando `estado` cambió. Verificar con pruebas.
- [x] 1.2 En `src/backend/services/lavadoService.js`, quitar `fechaHoraLavado` de `fields` y de `requireFields`, para que el cliente no aporte las marcas. Verificar que `POST`/`PUT` las ignoran.
- [x] 1.3 Actualizar/agregar pruebas en `src/backend/tests/lavados.test.js`: al crear, ambas marcas existen y coinciden; al cambiar `estado`, `fechaHoraLavadoTerminado` avanza y `fechaHoraLavado` no cambia; al actualizar sin cambiar estado, la marca se conserva. Verificar con `npm test` del backend.

## 2. Punto de control

- [x] 2.1 El usuario agrega `fechaHoraLavadoTerminado DATETIME2(7) NOT NULL` a la tabla `Lavado` en el script, la base y la documentación, y confirma que terminó. Sin esta confirmación no se ejecutan las pruebas del backend ni se avanza al grupo 3. Si la tabla tiene filas, indicar cómo se completa el valor (default o backfill).

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/backend` y registrar los resultados. Si la columna no está disponible, registrar la limitación y no afirmar que las pruebas pasaron.
- [x] 3.2 Ejecutar `openspec validate add-fecha-hora-lavado-terminado --strict` y verificar que pasa.

## Workflow follow-up

- Archivar primero `add-utileria-estado-lavado`: ambos cambios modifican los mismos requisitos de `Lavado`.
- Luego archivar este cambio con `/opsx-archive`.
