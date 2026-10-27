# Design

## Context

- `models/Lavado.js` ya declara `fechaHoraLavado`, `estado`, `utileria` y
  `detallesLavado`; falta la marca de terminado.
- `services/lavadoService.js` exige `fechaHoraLavado` al crear y la incluye en `fields`,
  así que hoy la toma del cuerpo.
- Varias pruebas crean lavados directamente con `Lavado.create(...)` y envían
  `fechaHoraLavado`.
- Los specs durables todavía no reflejan `estado`/`utileria`: eso está en
  `add-utileria-estado-lavado`, sin archivar.

## Goals / Non-Goals

**Goals:**

- Registrar `fechaHoraLavadoTerminado` en cada lavado y actualizarla al cambiar de estado.
- Que el backend genere las dos marcas con la hora local, sin entrada manual.
- No romper las creaciones de lavados existentes (API y pruebas).

**Non-Goals:**

- Modificar el script SQL, la base o la documentación (a cargo del usuario).
- Aceptar las marcas por API o configurar la zona horaria.
- Cambiar `crudService` ni el esquema desde el backend.

## Decisions

- **Hook de modelo, no lógica en el servicio.** `Lavado.addHook('beforeCreate', ...)`
  asigna `fechaHoraLavado` y `fechaHoraLavadoTerminado` con `new Date()`.
  `Lavado.addHook('beforeUpdate', ...)` actualiza `fechaHoraLavadoTerminado` sólo cuando
  `lavado.changed('estado')`. Así la regla vale para la API, para las pruebas y para
  cualquier `Lavado.create` directo, sin tocar `crudService`.
- **El cliente no aporta marcas.** Se quita `fechaHoraLavado` de `fields` y de
  `requireFields`; `POST`/`PUT` ya no la leen. `fechaHoraLavado` tampoco se actualiza en
  `PUT`.
- **Hora local**: `new Date()`, la hora del servidor. `DATETIME2` no guarda zona; si el
  servidor no está en la zona de Buenos Aires, la hora de pared diferirá de la home.
- **Pruebas**: crear un lavado y verificar que ambas marcas existen y coinciden; cambiar
  el estado y verificar que `fechaHoraLavadoTerminado` avanza y `fechaHoraLavado` no; hacer
  un cambio que no toca el estado y verificar que la marca se conserva.
- **Dependencia**: los deltas se escriben sobre el estado final de `Lavado` (con `estado` y
  `utileria`). Hay que archivar `add-utileria-estado-lavado` antes que este cambio.

## Risks / Trade-offs

- [`NOT NULL` sobre una tabla con filas] → el `ALTER TABLE` requiere default o backfill; lo
  resuelve el usuario al modificar la base.
- [Hasta que exista la columna] → el modelo la referencia y el backend falla al leer o
  insertar lavados. Se coordina con el punto de control antes de correr pruebas.
- [Hora del servidor vs. Buenos Aires] → si la zona del servidor difiere, la marca no
  coincide con la home. Configurarla queda fuera de alcance.
- [Hooks implícitos] → crean/actualizan valores sin que el llamador lo vea; se documenta
  aquí y se cubre con pruebas.
- [Orden con `add-utileria-estado-lavado`] → archivar ese cambio primero para que el sync
  no se pise.
