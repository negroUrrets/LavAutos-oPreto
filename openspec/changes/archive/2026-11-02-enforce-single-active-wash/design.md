# Design

## Context

- Ver `proposal.md - Why`.
- `lavadoService.js` usa `createCrudService`, cuyo `create` y `update` no abren transacción ni
  bloquean filas; solo validan existencia de claves.
- `lavadoActivoService.js` ya define `ESTADOS_BLOQUEANTES = ['En Espera', 'Lavando',
  'Terminado']` y `assertSinLavadoActivo(vehiculoIds, transaction)`, usado por clientes y
  vehículos.
- `POST /api/lavados` valida `vehi`, categoría, login, estado y utilería, pero no consulta
  lavados existentes.
- `PUT /api/lavados/:id` actualiza campos y regenera `fechaHoraLavadoTerminado` cuando cambia el
  estado.
- La tabla `Vehiculo` tiene PK `codigoVehi`, lo que permite usarla como punto de bloqueo por
  vehículo.

## Goals / Non-Goals

**Goals:**

- Rechazar con `409` un segundo lavado activo del mismo vehículo al crear y al actualizar.
- Garantizar la regla frente a dos solicitudes simultáneas.

**Non-Goals:**

- Cambios de esquema, frontend o mensajes de UI; lavados en estados no activos.

## Decisions

- **Transacción por operación**: `create` y `update` de `lavadoService` se redefinen para abrir
  `sequelize.transaction` y ejecutar validación, verificación y escritura dentro de la misma
  transacción.
- **Bloqueo por vehículo**: dentro de la transacción se ejecuta
  `SELECT codigoVehi FROM dbo.Vehiculo WITH (UPDLOCK, ROWLOCK) WHERE codigoVehi = :vehi`. Dos
  solicitudes para el mismo vehículo se serializan en esa fila; la segunda espera el commit de
  la primera y luego ve el lavado recién creado.
- **Orden de bloqueo**: cuando una actualización puede cambiar de vehículo, se bloquean el
  vehículo actual y el destino en orden ascendente de código para evitar interbloqueos.
- **Estado activo**: se amplía `lavadoActivoService` con `esEstadoBloqueante(codigoEstado,
  transaction)`, que busca la descripción del estado y la compara con `ESTADOS_BLOQUEANTES`.
- **Exclusión del propio lavado**: `assertSinLavadoActivo` acepta `{ excluirLavadoId }` para que
  una actualización del mismo lavado no se detecte a sí misma como conflicto.
- **Crear**: se validan los campos, se bloquea el vehículo y, si el estado nuevo es activo, se
  verifica que no haya otro lavado activo; luego se inserta en la transacción. Si el estado es
  no activo (`Entregado`), no se aplica la restricción.
- **Actualizar**: se carga el lavado (`404` si no existe), se validan los campos, se calculan el
  vehículo y el estado resultantes, se bloquean los vehículos y, si el estado resultante es
  activo, se verifica que no exista otro lavado activo en ese vehículo excluyendo el actual.
- **Respuesta**: `409` con el mensaje `Vehiculo en estado de Lavado.`, consistente con el guard
  de clientes y vehículos, sin guardar cambios.
- **Reutilización**: se mantiene `createCrudService` para listar, obtener y eliminar (no
  permitido) y se reutilizan `pickFields` y los validadores existentes.

## Risks / Trade-offs

- [Contención de bloqueos] → las altas y ediciones del mismo vehículo se serializan; las
  operaciones son cortas y el volumen de la primera etapa es bajo.
- [Interbloqueos] → el orden ascendente de bloqueo de vehículos los evita.
- [Espera sin timeout] → no se fija `LOCK_TIMEOUT`; una transacción anormalmente larga haría
  esperar a las demás. Se acepta por simplicidad y se documenta.
- [Solo backend] → la regla se aplica aunque se llame a la API directamente; el frontend sigue
  bloqueando `LAVAR` como primera barrera.
- [Lavados no activos] → crear o actualizar un lavado `Entregado` no se bloquea, porque no
  genera un segundo lavado activo.

## Migration Plan

- Sin cambios de esquema ni de datos.
