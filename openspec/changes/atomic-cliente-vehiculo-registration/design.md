# Design

## Context

Ver `proposal.md` — Why. El alta actual de `NuevoClientePage` hace dos peticiones:
`POST /api/clientes` (transacción que solo abarca `Persona` y `Cliente`) y luego
`POST /api/vehiculos` (transacción propia). Si la segunda falla, la primera ya quedó
confirmada. `POST /api/vehiculos` seguirá existiendo para agregar un vehículo a un cliente
existente desde `NuevoVehiculoPage`.

La base ya cuenta con las restricciones únicas `UQ_Persona_Dni` y
`UQ_Vehiculo_PatenteClave` (columna persistida `patenteClave`). No se requieren cambios de
esquema. La validación de DNI y patente en los servicios se mantiene como control previo.

## Goals / Non-Goals

**Goals:**

- Alta de `Persona`, `Cliente` y `Vehiculo` en una única transacción de base de datos.
- Revertir todo si falla cualquier paso, sin filas parciales.
- Una sola petición desde `NuevoClientePage`.
- Reutilizar la normalización y la reactivación de vehículos ya implementadas.

**Non-Goals:**

- Cambiar el esquema, las tablas, las relaciones o las restricciones de unicidad.
- Modificar, reemplazar o quitar el alta de vehículo para un cliente existente:
  `POST /api/vehiculos` y `Nuevo Vehiculo` conservan su contrato, validaciones y comportamiento.
- Cambiar el comportamiento de `POST /api/clientes` cuando no se envía `vehiculo`.
- Gestionar usuarios o auditoría funcional.

## Decisions

### 1. Extender `POST /api/clientes` con un objeto opcional `vehiculo`

Se envía:

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "dni": "12345678",
  "email": "juan@example.com",
  "celular": "5551234",
  "vehiculo": { "patenteVehi": "AB-123-CD", "modeloVehi": 4 }
}
```

El backend deriva `vehiculo.cliente` del cliente creado o reactivado y fuerza
`estadoVehi = true`; si el cliente envía `vehiculo.cliente`, se ignora. La respuesta `201`
mantiene los campos del cliente en el nivel superior y agrega `vehiculo` con
`codigoVehi`, `patenteVehi`, `estadoVehi`, `cliente` y `modeloVehi`. Sin `vehiculo`, la
respuesta y el comportamiento actuales no cambian.

Alternativa descartada: un endpoint nuevo (`POST /api/clientes-con-vehiculo`). Añade una
ruta y un contrato nuevos para un caso que ya pertenece al agregado cliente-vehículo;
extender el alta existente es más simple y compatible.

### 2. Una transacción en `clienteService.create`

`create` abre la transacción, resuelve o crea la persona y el cliente según la lógica actual
(unicidad y reactivación de DNI) y, si hay `vehiculo`, crea o reactiva el vehículo dentro de
la misma transacción. Cualquier `AppError` o error de Sequelize lanzado dentro del callback
provoca el rollback automático de `sequelize.transaction`.

### 3. Extraer la creación de vehículo a `vehiculoService.crearEnTransaccion`

Se mueve la lógica de normalización, validación, reactivación y creación a
`crearEnTransaccion(payload, transaction)`. `vehiculoService.create` pasa a ser un envoltorio
que abre su propia transacción y mapea los errores únicos, preservando el contrato de
`POST /api/vehiculos`: no cambian la ruta, el controller, las validaciones (`estadoVehi`,
`cliente` existente) ni la respuesta. `NuevoVehiculoPage` sigue usando esa operación para
agregar vehículos a un cliente existente. `clienteService` reutiliza la misma función con su
transacción, sin anidar transacciones ni duplicar reglas.

### 4. Validaciones visibles dentro de la transacción

`assertExists` y `validarCreacion` aceptan la transacción para que la verificación del
cliente recién creado y del modelo use la misma conexión. Sin esto, SQL Server (READ
COMMITTED) no vería al cliente aún no confirmado y el alta conjunta respondería `400`.

### 5. Mapear el error único por restricción

`clienteService` reemplaza el mapeo genérico a DNI por un mapeo que inspecciona el nombre de
la restricción (`UQ_Persona_Dni` / `UQ_Vehiculo_PatenteClave`) y, como respaldo, las columnas
del error (`dni` / `patenteClave`). Así una patente duplicada responde
`La patente ya esta registrada.` y un DNI duplicado responde `El DNI ya esta registrado.`.

### 6. Frontend: una sola llamada

`NuevoClientePage` arma un único payload con `nombre`, `apellido`, `dni`, `email`, `celular`
y `vehiculo: { patenteVehi, modeloVehi }`, y llama una sola vez a `createCliente`. Se elimina
la llamada a `createVehiculo` y su import. El popup `Bienvenido <nombre>` se muestra solo
después de la respuesta exitosa; en caso de error se muestra el mensaje del backend mediante
`crearErrorHttp` (ya implementado en `clientService`). La verificación previa de DNI
duplicado con `searchClientes` se conserva.

## Risks / Trade-offs

- La respuesta de `POST /api/clientes` agrega `vehiculo` → se mantienen los campos del
  cliente en el nivel superior para no romper consumidores; el frontend no depende de la
  forma exacta del vehículo devuelto.
- Si la base no tuviera los índices únicos, dos altas concurrentes podrían pasar la
  verificación previa → mitigación: los índices ya existen y la transacción revierte ante
  cualquier violación; el script y la migración siguen siendo la fuente del esquema.
- Un fallo del vehículo consume el `IDENTITY` de `Persona` aunque la fila se revierta →
  aceptable; no afecta la integridad ni la unicidad.
- Mover la validación del vehículo dentro de la transacción cambia el punto de lectura, no
  el contrato de `POST /api/vehiculos` → las pruebas existentes de vehículos deben seguir
  pasando.
- El refactor de `vehiculoService` podría alterar sin intención el alta para un cliente
  existente → mitigación: conservar ruta, controller y contrato, y ejecutar
  `src/backend/tests/vehiculos.test.js`, que incluye `POST /api/vehiculos` con un cliente
  existente.

## Migration Plan

Sin migraciones ni cambios de datos. Se despliega el código: el nuevo campo es opcional y
`POST /api/vehiculos` conserva su contrato. Rollback: revertir el código; no hay datos que
deshacer porque las altas previas no se modifican.

## Open Questions

Ninguna.
