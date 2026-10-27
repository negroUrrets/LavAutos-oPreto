# Proposal

## Why

La página de Clientes lista clientes, pero su botón `+ info` no hace nada y no existe
una pantalla que muestre los datos de un cliente junto con sus vehículos. Este cambio
agrega la página «+infoClientes» —idéntica al prototipo— con una card de datos del
cliente y una card por vehículo, un efecto de hover entre cards y el botón `Volver`;
además enlaza el botón `+ info`. Para los vehículos, se amplía el backend para
devolver su marca y categoría y para filtrar por cliente.

## What Changes

- Backend: `GET /api/vehiculos` SHALL incluir el modelo, la marca y la categoría del
  vehículo, y SHALL aceptar un filtro opcional por cliente.
- Backend: `GET /api/clientes` (listado y búsqueda) SHALL devolver solo los clientes
  con `estadoCliente = 1`, y `GET /api/vehiculos` SHALL devolver solo los vehículos con
  `estadoVehi = 1`.
- Frontend: nueva página en `/clientes/:id/info` con el diseño del prototipo
  (`Prototipado/cliente/+info clientes.jpg`):
  - Encabezado con el ícono del auto y `LavAutos oPreto` (sin el ícono de usuario).
  - Una card con los datos del cliente (avatar y `DNI`, `NOMBRE`, `APELLIDO`,
    `TELEFONO`, `e-m@il`) y los botones `+VEHICULO`, `Editar` y `Eliminar` (sin
    funcionalidad por ahora).
  - Una card por cada vehículo del cliente con `Vehiculo` (categoría), `Marca`,
    `Modelo` y `PATENTE`, y los botones `Editar`, `Eliminar` y `LAVAR` (sin
    funcionalidad por ahora).
  - Efecto al pasar el mouse: la card señalada se mueve levemente hacia adelante y las
    demás hacia atrás.
  - Botón verde `Volver` que regresa a la página de Clientes.
- Verificar la sesión con `GET /api/auth/session` y redirigir al login si no hay una
  sesión válida.
- En la página de Clientes: el botón `+ info` de cada fila navega a la página del
  cliente correspondiente.
- **Fuera de alcance**: la funcionalidad de los botones de las cards (`+VEHICULO`,
  `Editar`, `Eliminar`, `LAVAR`); editar o eliminar clientes/vehículos; otras
  pantallas; y cualquier ajuste fuera de lo descrito.

## Capabilities

### New Capabilities

- `cliente-info-page`: página «+infoClientes» del frontend que muestra los datos de un
  cliente y sus vehículos, con el efecto de hover entre cards.

### Modified Capabilities

- `client-management`: `GET /api/clientes` (listado y búsqueda) devuelve solo clientes
  activos (`estadoCliente = 1`).
- `vehicle-management`: `GET /api/vehiculos` incluye la marca y la categoría del
  vehículo, acepta filtrar por cliente y devuelve solo vehículos activos
  (`estadoVehi = 1`).
- `clients-page`: el botón `+ info` navega a la página de información del cliente.

## Impact

- Backend: `services/vehiculoService.js` (incluir modelo→marca→categoría y filtrar por
  cliente) y sus pruebas.
- Frontend: nueva página y componentes de card, servicio de vehículos del cliente, la
  ruta `/clientes/:id/info` y el enlace desde `ClientesPage`.
- No modifica el esquema de la base de datos.
