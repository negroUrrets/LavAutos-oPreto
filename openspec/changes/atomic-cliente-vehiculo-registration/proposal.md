# Proposal

## Why

El alta de cliente con vehículo (RF-06) se ejecuta hoy en dos peticiones independientes:
`NuevoClientePage` crea primero el cliente (`POST /api/clientes`) y después el vehículo
(`POST /api/vehiculos`). La transacción de `clienteService.create` solo cubre `Persona` y
`Cliente`. Si falla la segunda petición, el cliente queda persistido aunque la pantalla
informe un error, dejando datos parciales y una inconsistencia entre lo guardado y lo
comunicado al usuario.

## What Changes

- `POST /api/clientes` acepta un objeto opcional `vehiculo` y crea `Persona`, `Cliente` y
  `Vehiculo` en una única transacción de base de datos.
- Si la creación o reactivación del vehículo falla, se revierte toda la operación: no queda
  persona, cliente ni vehículo creados a medias.
- La creación/reactivación de vehículo se extrae a una función reutilizable que recibe la
  transacción, usada tanto por `POST /api/clientes` como por `POST /api/vehiculos`.
- Se mantiene sin cambios el alta de vehículo para un cliente existente:
  `POST /api/vehiculos` y la página `Nuevo Vehiculo` conservan su contrato, validaciones y
  respuesta actuales.
- `NuevoClientePage` envía una sola petición con los datos de la persona y del vehículo;
  muestra el popup de bienvenida solo si la operación completa tuvo éxito.
- Se agrega una prueba de error que provoca la falla del vehículo y verifica que no quede un
  cliente creado a medias.
- **Sin cambios de esquema**: se reutilizan las restricciones de unicidad de DNI y patente ya
  existentes.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `client-management`: nuevo requisito de alta conjunta de cliente y vehículo en una sola
  operación transaccional sobre `POST /api/clientes`.
- `client-registration-page`: el registro de cliente y vehículo pasa a una única petición y
  se agrega el escenario de falla con reversión total.

`vehicle-management` no se modifica: agregar un vehículo a un cliente existente sigue
disponible mediante `POST /api/vehiculos` con su contrato actual.

## Impact

- Backend: `src/backend/services/clienteService.js` (alta conjunta y mapeo de errores
  únicos), `src/backend/services/vehiculoService.js` (creación transaccional reutilizable).
  Rutas y controllers existentes no cambian de forma.
- Frontend: `src/frontend/src/pages/NuevoClientePage.jsx` (una sola petición) y
  `src/frontend/src/services/clientService.js` (payload compuesto).
- API: `POST /api/clientes` incorpora el campo opcional `vehiculo`; la respuesta mantiene los
  datos del cliente y agrega el vehículo creado o reactivado. Se preserva sin cambios el alta
  de vehículo para un cliente existente: `POST /api/vehiculos` conserva su contrato,
  validaciones y respuesta, y la página `Nuevo Vehiculo` sigue usando esa operación.
- Pruebas: `src/backend/tests/clientes.test.js` (alta conjunta exitosa y reversión) y
  `src/frontend/src/pages/NuevoClientePage.test.jsx` (una sola petición y error).
- Base de datos: sin migraciones ni cambios de esquema.
- Fuera de alcance: gestión de usuarios, auditoría funcional, cambios en el modelo de datos,
  y modificar, reemplazar o quitar el alta de vehículo para un cliente existente
  (`POST /api/vehiculos` y `Nuevo Vehiculo`).

## Risks and Open Decisions

- La respuesta de `POST /api/clientes` agrega `vehiculo`; se mantienen los campos del cliente
  en el nivel superior para no romper consumidores existentes.
- La detección de patente duplicada dentro de la transacción depende de las restricciones
  únicas ya aplicadas en SQL Server; si la base no las tiene, la validación previa del
  servicio sigue rechazando duplicados activos.
