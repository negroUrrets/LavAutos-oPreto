# Design

## Context

- `ClienteInfoPage` lista los vehículos del cliente con `listByCliente(id)` y la card de
  vehículo tiene un botón `Eliminar` sin acción.
- `crudService.remove` elimina el registro de forma permanente; `vehiculoService` se arma
  con `createCrudService` y hoy no personaliza la baja.
- `ConfirmPopup` ya renderiza un aviso, un mensaje y los botones `ACEPTAR`/`CANCELAR`.
- `Lavado` referencia al vehículo mediante `vehi`.

## Goals / Non-Goals

**Goals:**

- Confirmar y procesar la baja del vehículo desde la card, con baja lógica cuando tiene
  lavados y baja permanente cuando no.
- Volver a la información del cliente con la lista actualizada.

**Non-Goals:**

- Cambios al esquema de la base de datos o al modelo de dominio.
- Alta/edición de vehículos, `LAVAR` y el `Eliminar` de la card del cliente.

## Decisions

- **Backend**: implementar `remove` en `src/backend/services/vehiculoService.js` y
  exportar `{ ...servicioBase, remove }`. Dentro de una transacción se busca el vehículo
  (`404` si no existe), se cuenta `Lavado` por `vehi`; si hay lavados se actualiza
  `estadoVehi = false`, si no se destruye el registro. No se cambia `crudService`, que
  sigue siendo genérico.
- **Frontend**: agregar `deleteVehiculo(id)` a `services/vehicleService.js`
  (`DELETE /api/vehiculos/:id`, `credentials: 'include'`).
- **Popup en `ClienteInfoPage`**: un estado con el vehículo seleccionado abre
  `ConfirmPopup` desde el botón `Eliminar` de su card, con el aviso
  `¿ Desea eliminar el vehiculo "<patente>" ?`.
- **ACEPTAR**: `deleteVehiculo(codigoVehi)`, luego volver a pedir la lista
  (`listByCliente(id)`) y actualizar el estado, y volver a `/clientes/:id/info`. Así se
  ve la lista sin el vehículo eliminado sin recargar la aplicación.
- **CANCELAR**: cerrar el popup y volver a `/clientes/:id/info` sin llamar a la API.
- **Rótulos**: `ConfirmPopup` mantiene su título por defecto y los botones `ACEPTAR` y
  `CANCELAR` (mayúsculas); el aviso usa la patente del vehículo.

## Risks / Trade-offs

- [El pedido dice «Aceptar»/«Cancelar» y el componente usa mayúsculas] → se reutiliza el
  componente tal cual; si se prefiere otro rótulo, se ajusta en un cambio posterior.
- [Vehículo con lavados] → no se borra; queda inactivo y deja de listarse, conforme a la
  baja lógica.
- [Fallo al eliminar] → la página recarga la lista y permanece en la información del
  cliente; no se exponen detalles internos.
