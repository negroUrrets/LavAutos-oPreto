# Design

## Context

- `ClienteVehiculoInfo` dibuja el botón `LAVAR` sin acción; `ClienteInfoPage` concentra la
  navegación y los popups.
- `lavadoService.buildListOptions` sólo filtra por `estado`; `Lavado.utileria` es una única FK.
- `GET /api/auth/session` devuelve `codigoLogin`, pero el `fetchSession` del frontend sólo
  devuelve un booleano.
- `Utileria`, `CategoriaLavado` y `EstadoLavado` no tienen datos iniciales.
- Ya existen `ConfirmPopup` (ACEPTAR/CANCELAR) y `Popup` (Aceptar).

## Goals / Non-Goals

**Goals:**

- Registrar un lavado desde la card del vehículo con la interfaz del prototipo.
- Evitar un segundo lavado para un vehículo que ya tiene uno en curso.

**Non-Goals:**

- Cambios al esquema o a la base.
- Guardar varias utilerías por lavado (se guarda la primera tildada).
- Editar o listar lavados, y el `LAVAR` de otras pantallas.

## Decisions

- **Filtro por vehículo**: agregar `vehi` a `buildListOptions`; si vienen `estado` y `vehi`, se
  combinan en el `where`.
- **Utileria**: nuevo `services/utileriaService.js` con `createCrudService` y campos
  `['descripcionUtileria', 'estadoUtileria']`; ruta `/api/utilerias` detrás del middleware de
  sesión. El frontend actualiza `estadoUtileria` al tildar o destildar.
- **Seed de catálogos**: `services/catalogSeedService.js` con un `ensureRows(model, field,
  values)` idempotente (no sobrescribe). `scripts/seed.js` lo invoca junto con la cuenta admin.
- **Página**: `NuevoLavadoPage.jsx` en `/clientes/:id/vehiculos/:vehiculoId/lavar`; carga el
  vehículo con `getVehiculo` (patente) y los catálogos de utilerías, categorías y estados.
  - Utilerías: checkbox por fila; al cambiar, `PUT /api/utilerias/:id` con `estadoUtileria`.
  - Categorías: toggles con selección única; el estado local apaga el anterior.
  - `Detalles`: textarea libre (letras, números, espacios).
  - Estado: combobox con `descripcionEstado`.
  - `Registrar Lavado`: `ConfirmPopup` con la patente. `ACEPTAR` crea el lavado con
    `utileria` = primera tildada, `categoriaLavado`, `estado`, `detallesLavado` y
    `login` = `codigoLogin` de la sesión; luego navega a `/clientes/:id/info`.
    `CANCELAR` cierra el popup y restablece el formulario al estado inicial.
  - `Cancelar`: vuelve a `/clientes/:id/info` sin registrar.
- **`LAVAR`**: `ClienteVehiculoInfo` recibe `onLavar(vehiculo)`. `ClienteInfoPage` consulta
  `GET /api/lavados?vehi=:id`; si algún `datosEstado.descripcionEstado` es «En Espera»,
  «Lavando» o «Terminado» (sin distinguir mayúsculas), muestra `Popup` de aviso y no navega; si
  no, navega a la página nueva.
- **Sesión**: agregar `fetchSessionData()` que devuelve el cuerpo de `/api/auth/session` o
  `null`, para obtener `codigoLogin`; se mantiene `fetchSession` para el resto de las pantallas.
- **Validación**: exigir categoría, estado y al menos una utilería; `Detalles` es opcional.

## Risks / Trade-offs

- [«Terminado» bloquea un nuevo lavado] → es lo pedido; un vehículo con un lavado terminado no
  puede lavarse de nuevo hasta un cambio futuro.
- [`estadoUtileria` se guarda al tildar] → cancelar la página deja los flags del catálogo como
  quedaron; es consecuencia de la regla pedida.
- [Catálogos vacíos] → sin el seed, los toggles y el combo no tienen opciones; la tarea de seed
  lo cubre.
- [Una sola utilería por lavado] → las demás tildadas sólo quedan reflejadas en el catálogo.
- [Fechas] → las genera el backend (hooks de `Lavado`); el frontend no las envía.
