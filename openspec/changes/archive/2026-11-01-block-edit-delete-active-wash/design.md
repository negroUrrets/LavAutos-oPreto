# Design

## Context

- Ver `proposal.md - Why`.
- `clienteService.update/remove` y `vehiculoService.update/remove` no consultan los lavados.
- `vehiculoService.remove` aplica baja lógica cuando el vehículo tiene cualquier lavado.
- `lavadoService.buildListOptions` ya permite filtrar lavados por `vehi`; el frontend tiene
  `listByVehiculo` y `ClienteInfoPage` ya valida estados para `LAVAR` con una lista local.
- `clientService.deleteCliente` y `vehicleService.deleteVehiculo` lanzan un `Error` genérico
  sin el estado HTTP.
- Existe `Popup` (botón `Aceptar`) para avisos y `ConfirmPopup` para confirmaciones.

## Goals / Non-Goals

**Goals:**

- Impedir desde el backend la edición y la baja de clientes o vehículos con lavados activos.
- Avisar en las páginas de información antes de navegar o confirmar.

**Non-Goals:**

- Cambios de esquema, del flujo `LAVAR`, de las pantallas de edición o de la creación.

## Decisions

- **Guard compartido**: `src/backend/services/lavadoActivoService.js` con
  `ESTADOS_BLOQUEANTES = ['En Espera', 'Lavando', 'Terminado']` y
  `assertSinLavadoActivo(vehiculoIds, transaction)`. Busca los códigos de esos estados en
  `EstadoLavado` y cuenta los `Lavado` con `vehi IN (...)` y `estado IN (...)`; si hay alguno,
  lanza `AppError('Vehiculo en estado de Lavado.', 409)`.
- **Vehículos**: `vehiculoService.update` busca el vehículo (`404` si no existe), llama al
  guard y delega en el `update` base. `remove` llama al guard antes de la baja lógica o física.
- **Clientes**: `clienteService.update` y `remove` obtienen los `codigoVehi` del cliente y
  llaman al guard antes de modificar o dar de baja.
- **Baja con lavados no activos**: se conserva la baja lógica actual (solo lavados
  `Entregado`); sin lavados se elimina físicamente.
- **Frontend, consulta**: `lavadoService.js` expone `tieneLavadoActivo(vehiculoIds)` (consulta
  `GET /api/lavados?vehi=` por cada vehículo y compara descripciones normalizadas) y
  `MENSAJE_LAVADO_ACTIVO` con el texto `Edicion / Eliminacion cancelada...Vehiculo en estado
  de Lavado`.
- **ClienteInfoPage**: antes de navegar a editar o de abrir la confirmación de baja, consulta
  `tieneLavadoActivo` con los vehículos del cliente (editar/eliminar cliente) o con el
  vehículo (editar/eliminar vehículo). Si hay bloqueo, muestra `Popup` con
  `MENSAJE_LAVADO_ACTIVO` y no navega. `LAVAR` reutiliza el mismo helper.
- **VehiculoInfoPage**: para el vehículo consulta `[vehiculoId]`; para el cliente obtiene sus
  vehículos con `listByCliente` y consulta el helper.
- **Errores del backend**: `deleteCliente` y `deleteVehiculo` lanzan un `Error` con `status`
  igual al HTTP. Si la baja confirmada recibe `409`, la página cierra la confirmación, muestra
  el aviso y no navega.
- **Texto del aviso**: se usa literalmente el pedido, sin acentos.

## Risks / Trade-offs

- [Consulta previa desde el frontend] → son varias llamadas a `GET /api/lavados` (una por
  vehículo); el volumen de la primera etapa lo hace aceptable y el backend vuelve a validar.
- [Carrera entre la consulta y la baja] → si el lavado se inicia entre la consulta y el
  `DELETE`/`PUT`, el backend responde `409` y la página muestra el mismo aviso.
- [Estados por descripción] → el guard depende de las descripciones `En Espera`, `Lavando` y
  `Terminado`; si se renombran, deben actualizarse el guard y las pruebas.
- [Pruebas de backend] → requieren un estado con descripción exacta `En Espera`; se usa el
  seed de catálogos (`ensureLavadoCatalogs`) para garantizarlo.

## Migration Plan

- Sin cambios de esquema ni de datos.
