# Tasks

## 1. Fase 1: script de base de datos (aplicar primero)

- [x] 1.1 En `src/databaseLavadero/script db/DataBaseLavadero.sql`, agregar `dbo.EstadoLavado` (`codigoEstado` BIGINT identidad PK `PK_EstadoLavado`, `descripcionEstado` VARCHAR(200) NOT NULL, `estadoLavado` BIT NOT NULL) y `dbo.Utileria` (`codigoUtileria` BIGINT identidad PK `PK_Utileria`, `descripcionUtileria` VARCHAR(200) NOT NULL, `estadoUtileria` BIT NOT NULL), con guardas `IF OBJECT_ID`, antes de `Lavado`. Verificar revisando el script: ambas tablas aparecen antes de `Lavado` y no insertan filas.
- [x] 1.2 Modificar `dbo.Lavado` en el script: quitar `estadoLavado`; agregar `estado` BIGINT NOT NULL con `FK_Lavado_EstadoLavado` hacia `EstadoLavado.codigoEstado`, `utileria` BIGINT NOT NULL con `FK_Lavado_Utileria` hacia `Utileria.codigoUtileria` y `detallesLavado` VARCHAR(255) NULL; mantener `codigoLavado`, `fechaHoraLavado` DATETIME2, `vehi`, `categoriaLavado` y `login`. Verificar con un diff del script que sólo cambian estas tablas.
- [x] 1.3 Confirmar con el diff que las demás tablas del script (`Persona`, `Cliente`, `CategoriaVehiculo`, `MarcaVehiculo`, `ModeloVehiculo`, `Vehiculo`, `Usuario`, `Login`, `CategoriaLavado`) no cambian.
- [x] 1.4 Regenerar la imagen `src/documentacion/Esquema Base Datos/Esquema Base Datos.png` desde el script final. Si no hay herramienta para renderizar PNG, entregar la fuente del diagrama y pedir la exportación manual; no declarar la imagen actualizada sin verificarla.
- [x] 1.5 Punto de control: el usuario ejecuta el script sobre una instancia SQL Server vacía, recrea `DataBaseLavadero` y confirma que terminó. El agente no ejecuta el script contra la base existente. No avanzar al grupo 2 sin esta confirmación. Si no hay SQL Server accesible, registrar la limitación.

## 2. Fase 2: backend de lavados (sólo después del punto de control 1.5)

- [x] 2.1 Verificar, con la confirmación del usuario, que `src/backend/.env` apunta a la base recreada desde el script nuevo (sin versionar credenciales). Verificar que la base contiene `EstadoLavado`, `Utileria` y la nueva forma de `Lavado`.
- [x] 2.2 Crear `src/backend/models/EstadoLavado.js` y `src/backend/models/Utileria.js`, y actualizar `src/backend/models/Lavado.js` (quitar `estadoLavado`; agregar `estado`, `utileria` y `detallesLavado`) y `src/backend/models/index.js` con las asociaciones `datosEstado` y `datosUtileria`. Verificar con `tests/models.test.js`.
- [x] 2.3 Actualizar `src/backend/services/lavadoService.js`: campos, obligatoriedad al crear, `assertExists` para `estado` y `utileria`, validación en actualización, `include` y filtro `estado`. Verificar con pruebas de creación exitosa, `400` por estado o utilería inexistentes y filtro por `estado`.
- [x] 2.4 Actualizar `src/backend/tests/helpers/fixtures.js` para crear y eliminar filas de `EstadoLavado` y `Utileria`, y las pruebas que crean lavados (`lavados.test.js`, `clientes.test.js`, `vehiculos.test.js`, `models.test.js`) para usar `estado` y `utileria`. Verificar que `npm test` del backend pasa.
- [x] 2.5 Verificar que el frontend no usa la API de lavados (búsqueda en `src/frontend/src`). No debe haber cambios de frontend.
- [x] 2.6 Verificar la regla de baja con lavados sin cambiar `clienteService.js` ni `vehiculoService.js`: agregar en `tests/vehiculos.test.js` y `tests/clientes.test.js` una prueba con un lavado en un `estado` distinto del activo que confirme `estadoVehi = 0` (y `estadoCliente = 0` en el cliente) y que el registro sigue existiendo, y mantener las pruebas de baja física sin lavados. Verificar con `npm test` del backend que todas pasan.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/backend` y registrar los resultados. Si la base no está disponible, registrar la limitación y no afirmar que las pruebas pasaron.
- [x] 3.2 Ejecutar `openspec validate add-utileria-estado-lavado --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
- Pendiente fuera de este cambio: migrar bases creadas con el script anterior, si se autoriza en un cambio aparte.
- Archivar antes `add-eliminar-cliente-popup` y `add-eliminar-vehiculo-popup`, que actualizan la baja con lavados en las especificaciones durables (ver `design.md`).
