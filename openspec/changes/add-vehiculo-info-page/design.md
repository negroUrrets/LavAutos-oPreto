# Design

## Context

- `VehiculosPage` lista y filtra vehículos; el botón `+ info` todavía no tiene acción.
- `ClienteInfoPage` ya renderiza la card del cliente, las cards de vehículo, el hover, los
  popups de eliminación y el botón de volver.
- `GET /api/vehiculos/:id` devuelve el vehículo con `datosCliente` y su `persona`.
- `getVehiculo`, `deleteVehiculo`, `deleteCliente` y `listByCliente` ya existen en los
  servicios del frontend.

## Goals / Non-Goals

**Goals:**

- Abrir el detalle de un vehículo desde `+ info`, mostrando sólo ese vehículo y los datos
  de su cliente, con las mismas acciones que la información del cliente.
- Reutilizar el layout existente y agregar el botón `+ Vehiculo` en Vehiculos.

**Non-Goals:**

- Cambios al backend, al esquema o al modelo de dominio.
- Funcionalidad de `LAVAR` y mostrar todos los vehículos del cliente en el detalle.

## Decisions

- **Componente compartido** `src/frontend/src/components/ClienteVehiculoInfo.jsx`: se
  extrae la estructura presentacional de `ClienteInfoPage` (encabezado, card del cliente,
  cards de vehículo, hover y botón de volver). Recibe `cliente`, `vehiculos`, `onVolver` y
  las acciones (`onNuevoVehiculo`, `onEditarCliente`, `onEliminarCliente`,
  `onEditarVehiculo`, `onEliminarVehiculo`). Así ambas páginas comparten el mismo layout
  sin duplicarlo.
- **`ClienteInfoPage`** conserva su carga de datos y popups, y renderiza el componente
  compartido con todos los vehículos y volver a `/clientes`.
- **`VehiculoInfoPage`** en `/vehiculos/:vehiculoId/info`: carga `getVehiculo`, arma el
  cliente desde `datosCliente.persona` y renderiza el componente con `[vehiculo]` y volver
  a `/vehiculos`. Reutiliza el popup de eliminación del cliente y del vehículo.
- **Acciones**: `+ VEHICULO` → `/clientes/:clienteId/vehiculos/nuevo`; `Editar` cliente →
  `/clientes/:clienteId/editar`; `Editar` vehículo →
  `/clientes/:clienteId/vehiculos/:vehiculoId/editar`; `Eliminar` usan los popups y
  servicios existentes. Al eliminar el vehículo mostrado se vuelve a `/vehiculos`; al
  eliminar el cliente se vuelve a `/clientes`.
- **`VehiculosPage`**: `+ info` navega a `/vehiculos/:vehiculoId/info`; se agrega el botón
  verde `+ Vehiculo` en la esquina superior derecha del panel, en la fila del pill, que
  navega a `/clientes`. El `← Volver` existente ya navega a `/home`.

## Risks / Trade-offs

- [Extraer el layout toca una página ya probada] → se mantienen los `data-testid` y los
  textos, y las pruebas existentes de `ClienteInfoPage` deben seguir pasando.
- [El detalle carga el cliente desde `datosCliente.persona`] → se mapea al mismo formato
  que `getCliente` para que el componente compartido reciba una estructura uniforme.
- [`LAVAR` sigue sin funcionalidad] → queda igual que en la información del cliente.
