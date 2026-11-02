# Proposal

## Why

La regla de un solo lavado activo por vehículo está en el informe, pero `lavadoService.js`
solo comprueba que el vehículo exista. El bloqueo del botón `LAVAR` en el frontend no alcanza:
una llamada directa a la API puede crear un segundo lavado activo, y la verificación y el alta
no son atómicas frente a dos solicitudes simultáneas.

## What Changes

- Al crear un lavado cuyo estado sea activo (`En Espera`, `Lavando` o `Terminado`), el backend
  SHALL verificar que el vehículo no tenga otro lavado activo y responder `409` sin crear nada.
- Al actualizar un lavado, si el resultado lo deja activo sobre un vehículo que ya tiene otro
  lavado activo, el backend SHALL responder `409` sin modificar nada.
- La comprobación y la escritura SHALL ejecutarse en una transacción con bloqueo de la fila del
  vehículo, de modo que dos solicitudes simultáneas no dejen dos lavados activos.
- Se agregan pruebas de alta normal, segunda alta, dos altas simultáneas y conflictos al
  actualizar.
- **Fuera de alcance**: cambios al esquema o a la base, cambios al frontend (el botón `LAVAR`
  ya bloquea) y lavados en estados no activos (`Entregado`).

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `wash-management`: crear y actualizar lavados rechaza con `409` el segundo lavado activo del
  mismo vehículo, con verificación y escritura atómicas.

## Impact

- Backend: `services/lavadoService.js` (`create` y `update` con transacción y bloqueo),
  `services/lavadoActivoService.js` (estado activo y exclusión del propio lavado) y
  `tests/lavados.test.js`.
- Sin cambios en frontend, esquema, modelos ni migraciones.
