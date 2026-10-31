# Proposal

## Why

La página «Lavados» muestra el botón `Editar` en cada lavado, pero todavía no hace nada. Sin
esa pantalla no es posible corregir la categoría, la utilería, los detalles ni el estado de un
lavado ya registrado.

## What Changes

- En `LavadosPage`, el botón `Editar` de cada lavado navega a la página «Editar Lavado» del
  lavado seleccionado.
- Nueva página «Editar Lavado» (prototipo `Prototipado/lavado/Editar Lavado.jpg`):
  - Título `Editar Lavado: <patente>` con la patente en modo solo lectura.
  - Muestra los datos actuales del lavado en modo editable: checkboxes de utilería, toggles de
    categoría (selección única), campo `Detalles` y combobox de estado.
  - Los checkboxes de utilería se comportan igual que en «Nuevo Lavado»: actualizan
    `estadoUtileria` del catálogo (`PUT /api/utilerias/:id`) y al guardar se envía la primera
    utilería tildada.
  - El combobox de estado ofrece todas las filas de `EstadoLavado`.
  - `Registrar` guarda los cambios con `PUT /api/lavados/:id`, muestra el popup
    `Lavado editado exitosamente` y, al aceptarlo, vuelve a la página «Lavados».
  - `Cancelar` vuelve a la página «Lavados» sin guardar.
- **Fuera de alcance**: cambios al esquema o a la base, cambios a la API de lavados, edición
  del vehículo o del cliente del lavado, y la pantalla de listado en sí.

## Capabilities

### New Capabilities

- `lavado-edit-page`: página «Editar Lavado» con los datos del lavado editables, guardado con
  confirmación de éxito y cancelación sin cambios.

### Modified Capabilities

- `lavados-page`: el botón `Editar` de cada lavado deja de ser inerte y navega a la página de
  edición del lavado.

## Impact

- Frontend: `LavadosPage.jsx` (enlace del botón), nueva `EditarLavadoPage.jsx`, ruta
  `/lavados/:lavadoId/editar` en `App.jsx`, servicio de lavados y pruebas.
- Backend: sin cambios; `PUT /api/lavados/:id` ya actualiza `categoriaLavado`, `estado`,
  `utileria` y `detallesLavado`, y regenera `fechaHoraLavadoTerminado` cuando cambia el estado.
- Sin cambios al esquema ni a la base de datos.

## Dependencias

- El delta de `lavados-page` es `MODIFIED`: requiere que `add-lavados-page` esté archivado para
  que la spec base `openspec/specs/lavados-page/spec.md` exista antes de aplicar este cambio.
