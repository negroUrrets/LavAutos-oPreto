# Design

## Context

- Ver `proposal.md - Why`.
- `LavadosPage.jsx` dibuja el botón `Editar` sin `onClick`.
- `NuevoLavadoPage.jsx` ya implementa el formulario análogo: checkbox de utilería que actualiza
  `estadoUtileria` (`PUT /api/utilerias/:id`), toggles de categoría con selección única,
  `Detalles` y combobox de estado.
- `GET /api/lavados/:id` devuelve el lavado con `vehiculo`, `categoria`, `datosEstado` y
  `datosUtileria`; `PUT /api/lavados/:id` actualiza `categoriaLavado`, `estado`, `utileria` y
  `detallesLavado`, y regenera `fechaHoraLavadoTerminado` si cambia el estado.
- `lavadoService.js` del frontend expone `listLavados` y `updateLavado`, pero no `getLavado`.
- Existen `fetchSession` (booleano) y `Popup` (botón `Aceptar`).
- El delta `MODIFIED` de `lavados-page` requiere que `add-lavados-page` esté archivado.

## Goals / Non-Goals

**Goals:**

- Editar los datos de un lavado existente reutilizando el patrón visual y de estado de
  `NuevoLavadoPage`.
- Confirmar el éxito de la edición antes de volver al listado.

**Non-Goals:**

- Cambios al backend, al esquema o a la base.
- Editar el vehículo o el cliente del lavado.
- Guardar más de una utilería por lavado.

## Decisions

- **Ruta**: `/lavados/:lavadoId/editar` con `EditarLavadoPage.jsx`; `LavadosPage` pasa el
  `codigoLavado` al navegar desde `Editar`.
- **Servicio**: agregar `getLavado(id)` a `lavadoService.js` (`GET /api/lavados/:id`, `null` si
  no existe) y reutilizar `updateLavado`, `listUtileria`, `listCategoriasLavado` y
  `listEstadosLavado`.
- **Carga**: `Promise.all([getLavado(id), listUtileria(), listCategoriasLavado(),
  listEstadosLavado()])`; si el lavado no existe, navegar a `/lavados`. La categoría se
  preselecciona con `lavado.categoriaLavado` y el estado con `lavado.estado`; los checkboxes se
  tildan según `estadoUtileria` del catálogo, igual que en «Nuevo Lavado».
- **Utileria**: mismo comportamiento que «Nuevo Lavado» (actualiza el catálogo al tildar y
  envía la primera tildada como `utileria`), para no cambiar el modelo de datos ni la API.
- **Estado**: el combobox lista todas las filas de `EstadoLavado`, incluida `Entregado`, tal
  como en «Nuevo Lavado»; un lavado guardado como `Entregado` deja de mostrarse en el listado.
- **Validación**: exigir categoría, estado y al menos una utilería tildada; `Detalles` es
  opcional. Se replica el aviso en línea de `NuevoLavadoPage`.
- **Guardar**: `updateLavado(lavadoId, { categoriaLavado, estado, utileria: seleccion[0],
  detallesLavado })`; si falla, permanecer en la página con un aviso y sin popup de éxito. Si
  funciona, mostrar `Popup` con `Lavado editado exitosamente`; al aceptar, navegar a
  `/lavados`.
- **Cancelar**: navegar a `/lavados` sin enviar la actualización.
- **Sesión**: `fetchSession`; si no hay sesión válida, redirigir a `/login`.

## Risks / Trade-offs

- [El delta `MODIFIED` de `lavados-page` no tiene spec base] → archivar `add-lavados-page` antes
  de aplicar este cambio.
- [`estadoUtileria` es global] → tildar una utilería modifica el catálogo aunque se cancele la
  edición; es la misma consecuencia aceptada en «Nuevo Lavado».
- [Una sola utilería por lavado] → sólo la primera tildada se guarda en `Lavado.utileria`; el
  resto queda reflejado únicamente en el catálogo.
- [Editar el estado a `Entregado`] → el lavado sale del listado sin pasar por el popup
  `Vehiculo Entregado`; se acepta porque el combobox replica el de «Nuevo Lavado».

## Migration Plan

- Sin cambios de esquema ni de datos.
- Prerrequisito de despliegue: archivar `add-lavados-page` para que exista
  `openspec/specs/lavados-page/spec.md` antes de archivar este cambio.
