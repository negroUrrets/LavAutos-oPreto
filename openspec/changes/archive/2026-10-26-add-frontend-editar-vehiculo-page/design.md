# Design

## Context

- `ClienteInfoPage` ya lista los vehículos con `listByCliente(id)` y la card de vehículo
  tiene un botón `Editar` sin acción.
- `EditarClientePage` ya implementa el patrón de edición: carga los datos actuales,
  precarga el formulario, verifica duplicados, muestra popup de éxito y restablece los
  datos originales al chocar con un duplicado.
- `GET /api/vehiculos/:id` devuelve el vehículo con `modelo → marca → categoria`, y
  `PUT /api/vehiculos/:id` (`crudService.update`) acepta `patenteVehi`, `estadoVehi`,
  `cliente` y `modeloVehi`. No requiere cambios.
- `listVehiculos()` (`GET /api/vehiculos`) devuelve sólo vehículos activos.

## Goals / Non-Goals

**Goals:**

- Editar el vehículo seleccionado desde `ClienteInfoPage` con los datos precargados,
  validados y sin patentes duplicadas.
- Volver a la información del cliente al guardar o cancelar.

**Non-Goals:**

- Cambios al backend, al esquema o al modelo de dominio.
- Eliminar vehículos, `LAVAR` y el alta de vehículos.

## Decisions

- **Página nueva** `src/frontend/src/pages/EditarVehiculoPage.jsx` en la ruta
  `/clientes/:id/vehiculos/:vehiculoId/editar`; el cliente y el vehículo salen de
  `useParams`. Se prefiere la ruta anidada por la misma razón que en el alta.
- **Reutilizar el patrón de `EditarClientePage`**: estados `form`/`original`, popup con
  `clear`/`navigate`, advertencia en página y botones `Registrar`/`Cancelar`.
- **Precargar desde `getVehiculo`**: `categoria` = `modelo.marca.categoria.codigoCategoriaVehi`,
  `marca` = `modelo.marca.codigoMarcaVehi`, `modelo` = `modelo.codigoModeloVehi` y
  `patente` = `patenteVehi`. Los catálogos se cargan con
  `listCategorias`/`listMarcas`/`listModelos` para los comboboxes en cascada.
- **Agregar `getVehiculo` y `updateVehiculo` a `services/vehicleService.js`** y reutilizar
  `listVehiculos` y `components/Popup.jsx`.
- **Verificación de patente duplicada**: `listVehiculos()`, comparar la patente
  normalizada (mayúsculas y sin espacios) excluyendo el propio `codigoVehi`; si coincide,
  popup `Error: vehiculo ya registrado` y `Aceptar` restablece `form` a `original` sin
  guardar.
- **Guardar**: `PUT /api/vehiculos/:id` con `patenteVehi`, `estadoVehi: true`,
  `cliente` de la ruta y `modeloVehi`; popup
  `La edición de datos se efectuó satisfactoriamente.` y, al cerrarlo, navegar a
  `/clientes/:id/info`.
- **Cancelar**: navega a `/clientes/:id/info` sin llamar a la API.
- **Botones del prototipo**: verde `Registrar` y rojo `Cancelar`; el verde es el «Aceptar»
  al que se refiere el pedido.
- **`Editar` de la card de vehículo** navega a la página de edición con `codigoVehi`.

## Risks / Trade-offs

- [El pedido separa «Error» y «vehiculo ya registrado»] → se muestran juntos en el popup
  como `Error: vehiculo ya registrado`.
- [`listVehiculos` sólo devuelve vehículos activos] → la verificación cubre patentes
  vigentes; ampliar el backend queda fuera de alcance.
- [Vehículo inexistente] → `getVehiculo` falla y la página sigue el manejo de
  `EditarClientePage` (redirige al login); se puede ajustar en un cambio posterior.
