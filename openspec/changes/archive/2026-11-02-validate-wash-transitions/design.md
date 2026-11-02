# Design

## Context

- Ver `proposal.md - Why`.
- `routes/lavados.js` usa `createCrudRouter(createCrudController(lavadoService))`, por lo que
  `create`/`update` reciben `req.body` sin intervención.
- `lavadoService.create` y `update` ya abren transacción, bloquean el vehículo y validan el
  lavado activo (`enforce-single-active-wash`).
- `authService.login` guarda `codigoLogin` en la sesión; `requireAuth` valida la sesión.
- Los estados son filas de `EstadoLavado` con descripciones canónicas: `En Espera`, `Lavando`,
  `Terminado` y `Entregado`.
- La página «Nuevo Lavado» lista todas las filas de `EstadoLavado` en su combobox.

## Goals / Non-Goals

**Goals:**

- Definir y validar en el backend los estados iniciales y las transiciones.
- Asociar cada lavado al `codigoLogin` de la sesión, ignorando el cuerpo.

**Non-Goals:**

- Cambios de esquema, restricciones del combobox de edición y otros campos del lavado.

## Decisions

- **Reglas de estado**: nuevo `services/lavadoEstadoService.js` con
  `ESTADOS_INICIALES = ['En Espera', 'Lavando', 'Terminado']` y `TRANSICIONES`:
  `En Espera → Lavando`; `Lavando → En Espera, Terminado`; `Terminado → Lavando, Entregado`;
  `Entregado → []`. Exporta `assertEstadoInicialPermitido(codigoEstado, transaction)`
  (`400`) y `assertTransicionPermitida(codigoActual, codigoNuevo, transaction)` (`409`), que
  resuelven las descripciones por código y permiten el mismo estado.
- **Entregado terminal**: la aplicación no ofrece volver de `Entregado` a `Terminado` (el
  Dashboard no edita estados), por lo que `TRANSICIONES.Entregado` queda vacío y cualquier
  intento de transición desde `Entregado` responde `409`.
- **Crear**: dentro de la transacción ya existente, se valida el estado inicial antes de la
  verificación de lavado activo y del `INSERT`. Un estado inicial no permitido responde `400`.
- **Actualizar**: si el cuerpo trae `estado` distinto del actual, se valida la transición antes
  de la verificación de lavado activo; una transición inválida responde `409`. Si no cambia el
  estado, no hay transición.
- **Campos de actualización**: se separan `CREATE_FIELDS` (incluye `login`) y `UPDATE_FIELDS`
  (excluye `login`), de modo que `PUT` ignore el login del cuerpo.
- **Login de la sesión**: nuevo `controllers/lavadosController.js` que reutiliza el controller
  CRUD y redefine `create` para llamar a `lavadoService.create({ ...req.body, login:
  req.session.codigoLogin })`. `routes/lavados.js` usa ese controller. El `login` del cuerpo
  nunca llega al servicio en el alta.
- **Frontend**: `NuevoLavadoPage` filtra `Entregado` de la lista de estados antes de mostrarla;
  el combobox queda con `En Espera`, `Lavando` y `Terminado`.
- **Pruebas**: se migran las altas y actualizaciones de `tests/lavados.test.js` que usaban
  estados de fixture a los estados canónicos; se agregan pruebas de estado inicial inválido,
  transiciones válidas e inválidas, retroceso, login de otra sesión y login ignorado al
  actualizar.
- **Códigos**: `400` para estado inicial no permitido; `409` para transición no permitida;
  el login ajeno se ignora y responde `201`.

## Risks / Trade-offs

- [Estados fuera de los cuatro canónicos] → la API deja de aceptarlos en el alta y no permite
  transiciones desde ellos; el catálogo de la aplicación solo usa los cuatro y las pruebas con
  estados de fixture insertados por modelo no pasan por la API.
- [Página de edición] → su combobox sigue mostrando todos los estados; una elección inválida
  recibe `409` y la página muestra su aviso genérico. Restringir el combobox queda fuera de
  alcance.
- [Sesión sin `codigoLogin`] → `requireAuth` valida la sesión; si faltara el `codigoLogin`, la
  validación de `login` respondería `400`. En la práctica `authService.login` setea ambos.

## Migration Plan

- Sin cambios de esquema ni de datos.
