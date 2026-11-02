# Proposal

## Why

El backend acepta cualquier cambio de estado de un lavado y el alta toma el `login` del cuerpo
si existe en la base, así que una llamada directa a la API puede saltar estados o atribuir un
lavado a otra sesión. Las transiciones no están definidas en el servidor y el login no se
deriva de la sesión autenticada.

## What Changes

- **Estados iniciales**: al crear un lavado, el backend solo acepta `En Espera`, `Lavando` o
  `Terminado`; `Entregado` u otro estado responde `400` sin crear.
- **Transiciones**: al actualizar, el backend solo permite el avance y el retroceso de un paso:
  `En Espera → Lavando`, `Lavando → En Espera`, `Lavando → Terminado`,
  `Terminado → Lavando` y `Terminado → Entregado`. `Entregado` es terminal: no admite volver a
  `Terminado` ni a otro estado. El mismo estado no es una transición. Cualquier otra responde
  `409` sin modificar.
- **Login**: `POST /api/lavados` asigna `login` con el `codigoLogin` de la sesión autenticada e
  ignora el `login` del cuerpo. `PUT /api/lavados/:id` ignora `login` y conserva el original.
- **Frontend**: el combobox de estado de «Nuevo Lavado» ofrece solo `En Espera`, `Lavando` y
  `Terminado` (excluye `Entregado`).
- **Pruebas**: alta en estado no permitido, transiciones válidas e inválidas, retroceso de un
  paso, carácter terminal de `Entregado`, login de otra sesión ignorado y login no modificable
  al actualizar.
- **Fuera de alcance**: cambios de esquema o base, restringir el combobox de la página de
  edición y otros campos del lavado.

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `wash-management`: estados iniciales, transiciones permitidas y login derivado de la sesión.
- `lavado-registration-page`: el combobox de estado del alta excluye `Entregado`.

## Impact

- Backend: `services/lavadoEstadoService.js` (nuevo), `services/lavadoService.js`,
  `controllers/lavadosController.js` (nuevo), `routes/lavados.js` y `tests/lavados.test.js`.
- Frontend: `pages/NuevoLavadoPage.jsx` y su prueba.
- Sin cambios de esquema, modelos ni migraciones.

## Dependencias

- `enforce-single-active-wash` está archivado; este cambio se apoya en su cláusula de `409` por
  lavado activo y no la reemplaza.
