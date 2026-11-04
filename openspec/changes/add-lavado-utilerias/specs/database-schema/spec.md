# Spec Delta

## MODIFIED Requirements

### Requirement: Tabla Lavado

La base de datos SHALL contener la tabla `Lavado` con clave primaria `codigoLavado`
(bigint), `fechaHoraLavado` (datetime2) y `fechaHoraLavadoTerminado` (datetime2(7)),
ambas obligatorias, `detallesLavado` (varchar, opcional) y las claves foráneas `vehi`
hacia `Vehiculo.codigoVehi`, `categoriaLavado` hacia
`CategoriaLavado.codigoCategoriaLavado`, `login` hacia `Login.codigoLogin` y `estado`
hacia `EstadoLavado.codigoEstado`. `estado` SHALL ser obligatoria. La tabla NO SHALL
contener las columnas `estadoLavado` ni `utileria`; las utilerías SHALL almacenarse en
`DetalleUtileria`.

#### Scenario: Lavado con referencias válidas

- **WHEN** se registra un lavado con vehículo, categoría, login y estado existentes
- **THEN** la fila se almacena en `Lavado` con un `codigoLavado` único

#### Scenario: Lavado con vehículo inexistente

- **WHEN** se intenta registrar un lavado con un `vehi` inexistente
- **THEN** la clave foránea rechaza la operación

#### Scenario: Lavado con estado o utilería inexistentes

- **WHEN** se intenta registrar un lavado con un `estado` inexistente o un detalle con una `utileria` inexistente
- **THEN** la clave foránea correspondiente rechaza la operación

#### Scenario: Lavado sin estado textual

- **WHEN** se inspecciona la estructura de la tabla `Lavado`
- **THEN** no existe la columna `estadoLavado` y el estado se obtiene mediante la clave foránea `estado`

#### Scenario: Lavado sin columna de utilería

- **WHEN** se inspecciona la estructura de la tabla `Lavado`
- **THEN** no existe la columna `utileria` y las utilerías se obtienen desde `DetalleUtileria`

#### Scenario: Fechas obligatorias

- **WHEN** se intenta registrar un lavado sin `fechaHoraLavado` o sin `fechaHoraLavadoTerminado`
- **THEN** la restricción `NOT NULL` rechaza la operación

### Requirement: Tabla Utileria

La base de datos SHALL contener la tabla `Utileria` con clave primaria
`codigoUtileria` (bigint), el atributo `descripcionUtileria` (varchar, obligatorio) y el
atributo `estadoUtileria` (bit, obligatorio). `estadoUtileria` SHALL ser propio del catálogo
y NO SHALL modificarse al asociar o quitar la utilería de un lavado.

#### Scenario: Utilería almacenada

- **WHEN** se registra una utilería
- **THEN** la fila se almacena en `Utileria` con un `codigoUtileria` único

#### Scenario: Catálogo compartido

- **WHEN** una utilería se asocia o se quita de un lavado
- **THEN** su `estadoUtileria` permanece igual

## ADDED Requirements

### Requirement: Tabla DetalleUtileria

La base de datos SHALL contener la tabla `DetalleUtileria` con `codigoLavado` y
`codigoUtileria` (bigint) como clave primaria compuesta, y claves foráneas hacia
`Lavado.codigoLavado` y `Utileria.codigoUtileria`. La clave foránea del lavado SHALL eliminar
sus detalles al eliminar el lavado; la de utilería SHALL impedir eliminar una utilería
asociada.

#### Scenario: Detalle almacenado

- **WHEN** se asocia una utilería a un lavado
- **THEN** se almacena una fila en `DetalleUtileria` con ese par de códigos

#### Scenario: Par duplicado rechazado

- **WHEN** se intenta insertar dos veces el mismo par `codigoLavado`/`codigoUtileria`
- **THEN** la clave primaria compuesta rechaza la operación

#### Scenario: Lavado o utilería inexistentes

- **WHEN** se intenta insertar un detalle con un lavado o una utilería inexistente
- **THEN** la clave foránea correspondiente rechaza la operación

#### Scenario: Baja del lavado

- **WHEN** se elimina un lavado con detalles asociados
- **THEN** sus filas de `DetalleUtileria` se eliminan en cascada

### Requirement: Migración de utilerías por lavado

La migración SHALL crear `DetalleUtileria`, copiar cada `Lavado.utileria` a una fila de
detalle, verificar que todos los lavados tengan su fila y, solo entonces, eliminar la columna
`Lavado.utileria` y su clave foránea. SHALL versionarse en `src/databaseLavadero/script db/`
y omitir la copia si la columna ya no existe.

#### Scenario: Copia de datos

- **WHEN** se ejecuta la migración sobre una base con `Lavado.utileria`
- **THEN** cada lavado queda con una fila en `DetalleUtileria` con esa utilería

#### Scenario: Verificación antes de eliminar

- **WHEN** algún lavado no pudo copiarse
- **THEN** la migración aborta sin eliminar la columna

#### Scenario: Columna eliminada

- **WHEN** la copia y la verificación terminan correctamente
- **THEN** la columna `Lavado.utileria` y su clave foránea dejan de existir

#### Scenario: Reejecución segura

- **WHEN** la migración se ejecuta sobre una base que ya no tiene `Lavado.utileria`
- **THEN** no intenta copiar ni eliminar nada y no falla
