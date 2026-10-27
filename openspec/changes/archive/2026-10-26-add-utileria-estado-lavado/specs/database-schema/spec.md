# Spec Delta

## MODIFIED Requirements

### Requirement: Tabla Lavado

La base de datos SHALL contener la tabla `Lavado` con clave primaria `codigoLavado`
(bigint), `fechaHoraLavado` (datetime2) y `detallesLavado` (varchar, opcional), y las
claves foráneas `vehi` hacia `Vehiculo.codigoVehi`, `categoriaLavado` hacia
`CategoriaLavado.codigoCategoriaLavado`, `login` hacia `Login.codigoLogin`, `estado` hacia
`EstadoLavado.codigoEstado` y `utileria` hacia `Utileria.codigoUtileria`. `estado` y
`utileria` SHALL ser obligatorias. La tabla NO SHALL contener la columna `estadoLavado`.

#### Scenario: Lavado con referencias válidas

- **WHEN** se registra un lavado con vehículo, categoría, login, estado y utilería existentes
- **THEN** la fila se almacena en `Lavado` con un `codigoLavado` único

#### Scenario: Lavado con vehículo inexistente

- **WHEN** se intenta registrar un lavado con un `vehi` inexistente
- **THEN** la clave foránea rechaza la operación

#### Scenario: Lavado con estado o utilería inexistentes

- **WHEN** se intenta registrar un lavado con un `estado` o una `utileria` inexistentes
- **THEN** la clave foránea correspondiente rechaza la operación

#### Scenario: Lavado sin estado textual

- **WHEN** se inspecciona la estructura de la tabla `Lavado`
- **THEN** no existe la columna `estadoLavado` y el estado se obtiene mediante la clave foránea `estado`

## ADDED Requirements

### Requirement: Tabla Utileria

La base de datos SHALL contener la tabla `Utileria` con clave primaria
`codigoUtileria` (bigint), el atributo `descripcionUtileria` (varchar, obligatorio) y el
atributo `estadoUtileria` (bit, obligatorio).

#### Scenario: Utilería almacenada

- **WHEN** se registra una utilería
- **THEN** la fila se almacena en `Utileria` con un `codigoUtileria` único

### Requirement: Tabla EstadoLavado

La base de datos SHALL contener la tabla `EstadoLavado` con clave primaria `codigoEstado`
(bigint), el atributo `descripcionEstado` (varchar, obligatorio) y el atributo
`estadoLavado` (bit, obligatorio).

#### Scenario: Estado de lavado almacenado

- **WHEN** se registra un estado de lavado
- **THEN** la fila se almacena en `EstadoLavado` con un `codigoEstado` único
