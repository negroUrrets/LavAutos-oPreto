# Proposal

## Why

La página de Vehiculos ya permite buscar vehículos, pero el botón `+ info` no hace nada
y no existe una pantalla de detalle. Este cambio le da funcionalidad: abre una página
«+info Vehiculo» idéntica a la información del cliente, mostrando sólo el vehículo
encontrado junto con los datos de su cliente; además agrega el botón `+ Vehiculo` en la
página de Vehiculos.

## What Changes

- Dar funcionalidad al botón `+ info` de cada fila de Vehiculos: navega a
  `/vehiculos/:vehiculoId/info`.
- Crear la página «+info Vehiculo» reutilizando el layout de `ClienteInfoPage`: la card
  del cliente (`DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO`, `e-m@il`) con sus botones
  `+ VEHICULO`, `Editar` y `Eliminar`, y una única card del vehículo encontrado
  (`VEHICULO`, `MARCA`, `MODELO`, `PATENTE`) con sus botones `LAVAR`, `Editar` y
  `Eliminar`, con las mismas funcionalidades y popups ya desarrollados.
- El botón `← Volver` de la página «+info Vehiculo» navega a la página de Vehiculos.
- Extraer el layout de cards de `ClienteInfoPage` a un componente reutilizable que usen
  ambas páginas, para evitar duplicar la estructura y los estilos.
- Confirmar que el botón verde `← Volver` de Vehiculos navega a la página de inicio
  (comportamiento ya implementado).
- Agregar en Vehiculos un botón verde `+ Vehiculo` en la esquina superior derecha del
  panel, que navega a la página de Clientes.
- **Fuera de alcance**: la funcionalidad de `LAVAR`; cambios al backend, al esquema o al
  modelo de dominio; y mostrar todos los vehículos del cliente en la página de +info
  (sólo se muestra el vehículo encontrado).

## Capabilities

### New Capabilities

- `vehiculo-info-page`: página de detalle que muestra un vehículo y los datos de su
  cliente, con las mismas acciones que la información del cliente.

### Modified Capabilities

- `vehiculos-page`: el botón `+ info` navega a la página de detalle y se agrega el botón
  `+ Vehiculo` que navega a Clientes.

## Impact

- Frontend: nueva página y ruta `/vehiculos/:vehiculoId/info`, un componente compartido
  extraído de `ClienteInfoPage`, ajuste de `VehiculosPage` (`+ info` y `+ Vehiculo`) y
  reutilización de `getVehiculo`/`deleteVehiculo` y de los popups existentes.
- Endpoints existentes: `GET /api/vehiculos/:id` (incluye `datosCliente` y su `persona`),
  `DELETE /api/vehiculos/:id`, `GET /api/clientes/:id`, `DELETE /api/clientes/:id` y
  `GET /api/auth/session`.
- No modifica el backend ni la base de datos.
