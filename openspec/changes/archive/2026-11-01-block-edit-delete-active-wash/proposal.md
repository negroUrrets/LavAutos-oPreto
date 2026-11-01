# Proposal

## Why

Hoy se puede editar o dar de baja un cliente o un vehículo aunque tenga un lavado en curso,
lo que deja lavados apuntando a datos modificados o a registros dados de baja. Falta validar
ese estado desde el backend y avisar al usuario en las pantallas de información.

## What Changes

- Backend: `PUT` y `DELETE` de `/api/clientes/:id` y `/api/vehiculos/:id` rechazan la
  operación con `409` cuando el vehículo (o alguno de los vehículos del cliente) tiene un
  lavado en estado `En Espera`, `Lavando` o `Terminado`.
- La baja lógica existente se mantiene solo para vehículos o clientes con lavados en otros
  estados (por ejemplo `Entregado`); sin lavados se sigue eliminando físicamente.
- Frontend: en `ClienteInfoPage` y `VehiculoInfoPage`, los botones `Editar` y `Eliminar` de
  cliente y vehículo consultan el estado al backend antes de navegar o abrir la confirmación.
  Si hay un lavado activo, muestran el popup
  `Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado` y permanecen en la página.
- Si la baja confirmada recibe `409` del backend, se muestra el mismo aviso y no se navega.
- **Fuera de alcance**: cambios al esquema o a la base, al flujo de `LAVAR`, a las pantallas de
  edición (`EditarClientePage`/`EditarVehiculoPage`) y a la creación de clientes o vehículos.

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `client-management`: actualizar y eliminar un cliente se rechaza si alguno de sus vehículos
  tiene un lavado activo.
- `vehicle-management`: actualizar y eliminar un vehículo se rechaza si tiene un lavado activo.
- `wash-management`: la baja con lavados activos pasa de baja lógica a rechazo `409`; la baja
  lógica queda solo para lavados no activos.
- `cliente-info-page`: `Editar` y `Eliminar` de cliente y vehículo se bloquean con el aviso.
- `vehiculo-info-page`: las acciones de la página se bloquean con el mismo aviso.

## Impact

- Backend: `services/clienteService.js`, `services/vehiculoService.js` y un servicio compartido
  de validación de lavados activos, con pruebas de integración.
- Frontend: `services/lavadoService.js` (consulta de lavados activos), `clientService.js` y
  `vehicleService.js` (error con estado HTTP), `ClienteInfoPage.jsx`, `VehiculoInfoPage.jsx` y
  sus pruebas.
- Sin cambios al esquema ni a la base de datos.
