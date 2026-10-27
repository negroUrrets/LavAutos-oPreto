# Proposal

## Why

`Lavado` necesita registrar cuándo terminó cada lavado. Se agrega la columna
`fechaHoraLavadoTerminado` (DATETIME2(7) NOT NULL), hermana de `fechaHoraLavado`. Para que
las marcas sean confiables, el backend las genera con la hora local en lugar de tomarlas
del cliente: `fechaHoraLavado` al crear, y `fechaHoraLavadoTerminado` al crear y cada vez
que cambia el estado.

## What Changes

- Modelo `Lavado`: nueva columna `fechaHoraLavadoTerminado` (`DATE`, obligatoria), además
  de `fechaHoraLavado`.
- `POST /api/lavados`: el backend establece `fechaHoraLavado` y
  `fechaHoraLavadoTerminado` con la hora local; no se leen ni se exigen del cuerpo.
- `PUT /api/lavados/:id`: si el `estado` cambia, el backend actualiza
  `fechaHoraLavadoTerminado` con la hora local; `fechaHoraLavado` no se modifica y ninguna
  de las dos se acepta del cliente.
- Pruebas del alta y del cambio de estado.
- **Fuera de alcance (a cargo del usuario)**: script SQL, base de datos y
  documentación/diagramas.
- **Fuera de alcance (técnico)**: aceptar las marcas por API, configurar zona horaria y
  endpoints de lavados en el frontend.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `database-schema`: la tabla `Lavado` suma `fechaHoraLavadoTerminado`.
- `wash-management`: crear y actualizar lavado generan las marcas de tiempo.

## Impact

- Backend: `src/backend/models/Lavado.js`, `src/backend/services/lavadoService.js` y las
  pruebas que crean o actualizan lavados.
- Base de datos y documentación: las modifica el usuario; el backend no crea ni migra
  esquema.
- **Dependencia**: este cambio toca `Lavado` igual que `add-utileria-estado-lavado`, que
  sigue sin archivar. Conviene archivar ese cambio antes que éste.
- **Aviso**: hasta que la columna exista en la base, el backend falla al leer o insertar
  lavados. Además, agregar una columna `NOT NULL` a una tabla con filas requiere un valor
  por defecto o un backfill.
