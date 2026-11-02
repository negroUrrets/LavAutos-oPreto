# Design

## Context

- Ver `proposal.md - Why`.
- `clienteService.create` crea `Persona` y `Cliente` sin consultar el DNI; `update` actualiza
  `Persona` sin verificar duplicados.
- `vehiculoService.create/update` no normalizan ni comparan la patente.
- El formulario de alta/edición consulta `GET /api/clientes?buscar=<dni>`, que solo devuelve
  clientes activos.
- El esquema no tiene índices únicos; `Persona.dni` es `BIGINT NOT NULL` y
  `Vehiculo.patenteVehi` es `VARCHAR(20) NOT NULL` con colación `Modern_Spanish_CI_AS`.
- `tests/helpers/fixtures.js` crea una persona con `dni: 12345678` fijo; con un índice único
  ese valor debe pasar a ser único por fixture.
- La base actual no tiene DNI ni patentes duplicadas (verificado el 2026-11-02).

## Goals / Non-Goals

**Goals:**

- Rechazar DNI y patentes duplicados en la API con mensajes claros.
- Garantizar la unicidad en la base, incluso frente a llamadas concurrentes.
- Normalizar la patente antes de comparar y guardar.

**Non-Goals:**

- Cambiar la búsqueda previa del formulario ni otras modificaciones de esquema.

## Decisions

- **Normalizadores**: `utils/normalizers.js` con `normalizarDni(valor)` (texto recortado),
  `normalizarPatente(valor)` (mayúsculas, sin espacios; si queda `AA123AA` se guarda
  `AA-123-AA`) y `clavePatente(valor)` (mayúsculas, solo letras y números).
- **Alta de cliente**: se busca la `Persona` por DNI. Si existe y su `Cliente` está activo,
  responde `409` con `El DNI ya esta registrado.` Si existe y está dado de baja, se reutiliza la
  persona y el cliente: se actualizan los datos personales, se pone `estadoCliente = 1` y se
  responde `201` con el mismo `codigoPersona`. Si no existe, se crea como hasta ahora.
- **Edición de cliente**: se busca la `Persona` por DNI; si existe y no es la del cliente
  editado (activa o dada de baja), responde `409`. El mismo DNI no es conflicto.
- **Patente**: se normaliza antes de comparar y guardar. La comparación usa `clavePatente` con
  una expresión `UPPER(REPLACE(REPLACE(patenteVehi, '-', ''), ' ', ''))`, de modo que
  `ab123cd`, `AB-123-CD` y `AB 123 CD` colisionan. En el alta, una patente de un vehículo activo
  responde `409`; en la edición, cualquier otro vehículo (activo o dado de baja) responde `409`.
  Se excluye el propio vehículo al editar.
- **Reactivación de vehículo**: si la patente pertenece a un vehículo con `estadoVehi = 0`, el
  alta reutiliza esa fila: actualiza `cliente`, `modeloVehi` y la patente normalizada, pone
  `estadoVehi = 1` y responde `201` con el mismo `codigoVehi`. El cliente puede ser el mismo o
  uno distinto; un vehículo dado de baja no tiene lavados activos por el bloqueo de baja.
- **Errores de unicidad**: además de la comprobación previa, se captura
  `SequelizeUniqueConstraintError` y se traduce a `409` según el índice (`UQ_Persona_Dni` o
  `UQ_Vehiculo_PatenteClave`), para cubrir dos solicitudes simultáneas.
- **Base de datos**: el script principal agrega, con guardas idempotentes, el índice único
  `UQ_Persona_Dni`, la columna persistida `Vehiculo.patenteClave` y el índice único
  `UQ_Vehiculo_PatenteClave`. Se agrega
  `src/databaseLavadero/script db/Migracion_Unicidad_DNI_Patente.sql` para bases existentes:
  verifica duplicados y, si encuentra alguno, aborta con un mensaje sin borrar datos.
- **Fixtures**: `tests/helpers/fixtures.js` usa un DNI único por ejecución para no chocar con el
  índice único entre suites.
- **Frontend**: `clientService` y `vehicleService` adjuntan el mensaje del backend al `Error`
  (y el `status`); las páginas de alta y edición muestran ese mensaje en lugar de un texto
  genérico cuando existe.
- **Códigos**: `409` para duplicados de DNI o patente; `201` para alta y reactivación.

## Risks / Trade-offs

- [Reactivación de un cliente y de un vehículo dados de baja] → se reutilizan sus filas; el
  vehículo reactivado se reasigna al `cliente` enviado, por lo que puede cambiar de dueño. Un
  vehículo dado de baja no tiene lavados activos por el bloqueo de baja.
- [Índice único en `Persona.dni`] → datos existentes con DNI duplicado harían fallar la
  migración; el script de migración los detecta y aborta sin borrar.
- [Columna `patenteClave`] → es una columna calculada persistida; el modelo Sequelize no la
  mapea y las consultas de unicidad usan la expresión equivalente.
- [Búsqueda previa del formulario] → sigue consultando solo clientes y vehículos activos; con un
  DNI o una patente de baja el alta procede y el backend reactiva la fila.
- [Concurrencia] → la comprobación previa puede correr en paralelo; el índice único y el mapeo
  de errores garantizan que no quede el duplicado.

## Migration Plan

- Aplicar `Migracion_Unicidad_DNI_Patente.sql` sobre la base existente (sin duplicados
  detectados) y verificar los índices. El script principal queda actualizado para bases nuevas.
