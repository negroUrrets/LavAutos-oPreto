# Proposal

## Why

El botón `Eliminar` de la card del cliente en la página de información no hace nada y
el backend hoy rechaza con `409` la baja de un cliente con lavados. Este cambio agrega
la ventana emergente de confirmación de eliminación y ajusta la baja del cliente:
cuando tiene lavados se aplica una baja lógica (estado inactivo) y, cuando no los
tiene, se elimina de forma permanente.

## What Changes

- Backend: `DELETE /api/clientes/:id` SHALL procesar la baja así:
  - si el cliente tiene algún lavado asociado, NO SHALL eliminarlo: SHALL poner
    `estadoCliente = 0` y `estadoVehi = 0` de todos sus vehículos (baja lógica);
  - si el cliente no tiene lavados, SHALL eliminarlo permanentemente junto con sus
    vehículos;
  - en ambos casos responde `204`, y `404` si el cliente no existe.
- Frontend: el botón `Eliminar` de la card del cliente en la página de información SHALL
  abrir una ventana emergente (modal) con el aviso
  `¿ Desea eliminar permanentemente el <nombre> seleccionado ?` y los botones verde
  `ACEPTAR` y rojo `CANCELAR`.
  - Al presionar `ACEPTAR`: solicitar la baja (`DELETE /api/clientes/:id`) y, al
    completarse, redirigir a la página de Clientes.
  - Al presionar `CANCELAR`: cerrar el popup y permanecer en la página de información
    del cliente.
- **Fuera de alcance**: el botón `Eliminar` de las cards de vehículo; los demás botones;
  reactivar clientes/vehículos dados de baja lógica; y cualquier ajuste fuera de lo
  descrito.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `client-management`: `DELETE /api/clientes/:id` aplica baja lógica si el cliente tiene
  lavados y baja permanente si no.
- `cliente-info-page`: el botón `Eliminar` abre el popup de confirmación y ejecuta la
  baja del cliente.

## Impact

- Backend: `services/clienteService.js` (baja lógica o permanente según los lavados) y
  sus pruebas.
- Frontend: componente del popup de eliminación, servicio `deleteCliente` y ajuste de
  `ClienteInfoPage` para enlazar el botón `Eliminar`.
- No modifica el esquema de la base de datos.
