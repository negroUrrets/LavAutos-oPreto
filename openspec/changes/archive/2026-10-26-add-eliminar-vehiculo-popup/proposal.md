# Proposal

## Why

El botón `Eliminar` de la card de vehículo en la página de información del cliente no
hace nada y el backend hoy borra el vehículo de forma permanente sin considerar sus
lavados. Este cambio agrega la ventana de confirmación con `ConfirmPopup` y ajusta la
baja del vehículo: si tiene lavados se aplica una baja lógica (estado inactivo) y, si no
los tiene, se elimina de forma permanente.

## What Changes

- Backend: `DELETE /api/vehiculos/:id` SHALL procesar la baja así:
  - si el vehículo tiene algún lavado asociado, NO SHALL eliminarlo: SHALL poner
    `estadoVehi = 0` (baja lógica);
  - si el vehículo no tiene lavados, SHALL eliminarlo permanentemente;
  - en ambos casos responde `204`, y `404` si el vehículo no existe.
- Frontend: el botón `Eliminar` de la card de vehículo SHALL abrir `ConfirmPopup` con el
  aviso `¿ Desea eliminar el vehiculo "<patente>" ?` y los botones verde `ACEPTAR` y rojo
  `CANCELAR`.
  - Al presionar `ACEPTAR`: solicitar la baja (`DELETE /api/vehiculos/:id`) y, al
    procesarse, volver a la página de información del cliente mostrando la lista de
    vehículos actualizada.
  - Al presionar `CANCELAR`: cerrar el popup y volver a la página de información del
    cliente sin modificar el vehículo.
- **Fuera de alcance**: el alta y la edición de vehículos, el botón `LAVAR`, el botón
  `Eliminar` de la card del cliente, cambios al esquema de la base de datos o al modelo
  de dominio, y cualquier ajuste fuera de lo descrito.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `vehicle-management`: `DELETE /api/vehiculos/:id` aplica baja lógica si el vehículo
  tiene lavados y baja permanente si no.
- `cliente-info-page`: el botón `Eliminar` de la card de vehículo abre el popup de
  confirmación y ejecuta la baja del vehículo.

## Impact

- Backend: `services/vehiculoService.js` (baja lógica o permanente según los lavados) y
  sus pruebas.
- Frontend: `services/vehicleService.js` (`deleteVehiculo`), `ClienteInfoPage` (popup de
  confirmación y recarga de la lista de vehículos) y sus pruebas.
- No modifica el esquema de la base de datos.
