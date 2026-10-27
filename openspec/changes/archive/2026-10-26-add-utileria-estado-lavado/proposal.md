# Proposal

## Why

El modelo de datos documentado (`Modelo de Datos.png` y `esquema base datos agregacion 1.jpg`)
agrega dos catálogos, `Utileria` y `EstadoLavado`, y reemplaza el texto libre
`estadoLavado` de `Lavado` por referencias a esos catálogos. El script
`src/databaseLavadero/script db/DataBaseLavadero.sql` y el backend de lavados todavía
reflejan el modelo anterior, por lo que ambos deben alinearse con el diseño aprobado.

## What Changes

Este cambio se ejecuta en dos fases con un punto de control entre ambas.

**Fase 1 — script de base de datos (se aplica primero):**

- Script `DataBaseLavadero.sql`:
  - Agregar `dbo.EstadoLavado` (`codigoEstado` BIGINT identidad PK, `descripcionEstado`
    VARCHAR(200) NOT NULL, `estadoLavado` BIT NOT NULL).
  - Agregar `dbo.Utileria` (`codigoUtileria` BIGINT identidad PK, `descripcionUtileria`
    VARCHAR(200) NOT NULL, `estadoUtileria` BIT NOT NULL).
  - Modificar `dbo.Lavado`: quitar la columna `estadoLavado`; agregar `estado` BIGINT NOT
    NULL con FK a `EstadoLavado.codigoEstado` y `utileria` BIGINT NOT NULL con FK a
    `Utileria.codigoUtileria`; agregar `detallesLavado` VARCHAR(255) NULL. Se mantienen
    `codigoLavado`, `fechaHoraLavado` (DATETIME2), `vehi`, `categoriaLavado` y `login`.
  - Crear ambos catálogos antes de `Lavado`.
- Las demás tablas no se modifican.
- Imagen `src/documentacion/Esquema Base Datos/Esquema Base Datos.png`: regenerarla desde
  el script final.

**Punto de control:** el usuario recrea la base `DataBaseLavadero` ejecutando el script
sobre una instancia vacía y confirma que terminó. El agente no ejecuta el script contra la
base existente.

**Fase 2 — backend de lavados (se aplica sólo después del punto de control):**

- Modelos Sequelize `EstadoLavado` y `Utileria`; `Lavado` con `estado`, `utileria` y
  `detallesLavado`; asociaciones en `models/index.js`.
- `lavadoService` y pruebas. La API de lavados usa `estado` y `utileria` (códigos) en lugar
  de `estadoLavado`, y el filtro de listado pasa a `?estado=<codigoEstado>`.
- Las pruebas de backend se ejecutan contra la base recreada desde el script nuevo.

**Decisiones registradas**:

- Sólo se modifica el script en la Fase 1. La base ya creada por el usuario no se altera ni
  se migra; los datos existentes de `estadoLavado` no se transforman.
- Como el script es idempotente (`IF OBJECT_ID IS NULL`), los cambios de `CREATE TABLE`
  sólo aplican a una base nueva. Una base creada con el script anterior conserva la tabla
  `Lavado` antigua.
- `estado` y `utileria` son NOT NULL.
- `fechaHoraLavado` se mantiene como DATETIME2, como indica la especificación vigente,
  aunque el diagrama lo rotula `date`.
- La base de pruebas es la misma base `DataBaseLavadero` que el usuario recrea desde el
  script; no se configura una base de pruebas separada.
- **Regla de negocio preservada**: un cliente o un vehículo con uno o más lavados no se
  elimina físicamente; la baja es lógica (`estadoCliente = 0` en `Cliente` y
  `estadoVehi = 0` en `Vehiculo`, incluidos los vehículos del cliente). Esto aplica a
  lavados en cualquier `estado`. El cambio de esquema no altera esa regla.

**Fuera de alcance**: migración o modificación de la base existente; migración de datos de
`estadoLavado`; inserción de filas en los catálogos (el esquema no contiene datos
iniciales); endpoints CRUD para `EstadoLavado` y `Utileria`; cambios de frontend.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `database-schema`: la tabla `Lavado` cambia y se agregan las tablas `Utileria` y
  `EstadoLavado` (Fase 1).
- `wash-management`: la API de lavados usa `estado` y `utileria` y filtra por `estado`
  (Fase 2). Se agrega el requisito de baja con lavados asociados, que se mantiene sin
  cambios de comportamiento.
- `data-persistence`: los modelos incluyen `EstadoLavado` y `Utileria`, y `Lavado` se
  asocia con ambos (Fase 2).

## Impact

- Base de datos: `src/databaseLavadero/script db/DataBaseLavadero.sql` y
  `src/documentacion/Esquema Base Datos/Esquema Base Datos.png`.
- Backend: `src/backend/models/` (`Lavado.js`, nuevos `EstadoLavado.js` y `Utileria.js`,
  `index.js`), `src/backend/services/lavadoService.js` y pruebas que crean lavados
  (`lavados`, `clientes`, `vehiculos`, `models` y `tests/helpers/fixtures.js`).
- Bajas de cliente y vehículo: `services/clienteService.js` (`remove`) y
  `services/vehiculoService.js` (`remove`) cuentan los lavados por `Lavado.vehi`. No se
  modifican, pero la Fase 2 verifica con pruebas que el conteo sigue correcto con el nuevo
  `estado`.
- Frontend: sin cambios, porque no consume la API de lavados.
- **Secuencia**: mientras la base no sea recreada, el backend actual (que usa
  `estadoLavado`) no funciona contra la base existente. Esto es esperado y se resuelve con
  el punto de control de la Fase 2; no se ejecutan pruebas de backend antes de ese punto.
