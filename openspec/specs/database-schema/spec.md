# database-schema Specification

## Purpose

Definir el esquema físico de la base de datos `DataBaseLavadero` en Microsoft SQL
Server a partir del modelo de datos documentado, con las tablas del dominio del
lavadero, sus claves y relaciones, incluida la herencia `Cliente`/`Persona`.

## Requirements

### Requirement: Base de datos DataBaseLavadero

El esquema SHALL definir la base de datos `DataBaseLavadero` en Microsoft SQL
Server, creada por el script solo cuando no exista.

#### Scenario: Creación inicial

- **WHEN** el script se ejecuta sobre una instancia de SQL Server sin la base
- **THEN** se crea la base de datos `DataBaseLavadero` con el esquema documentado

#### Scenario: Base ya existente

- **WHEN** el script se ejecuta y la base `DataBaseLavadero` ya existe
- **THEN** el script no elimina la base ni sus datos existentes

### Requirement: Tabla Persona

La base de datos SHALL contener la tabla `Persona` con clave primaria
`codigoPersona` (bigint) y los atributos `nombre`, `apellido`, `dni` (bigint),
`email` y `celular` (bigint).

#### Scenario: Persona persistida

- **WHEN** se registra una persona con sus datos personales
- **THEN** la fila se almacena en `Persona` con un `codigoPersona` único

### Requirement: Herencia Cliente/Persona

`Cliente` SHALL representar a una `Persona` mediante herencia tabla por tipo: la
tabla `Cliente` comparte la clave primaria `codigoPersona` de `Persona` a través
de una clave foránea y agrega el atributo `estadoCliente`.

#### Scenario: Cliente reutiliza la identidad de la persona

- **WHEN** se registra un cliente
- **THEN** su `codigoPersona` es el mismo identificador de la persona asociada

#### Scenario: Cliente sin persona válida

- **WHEN** se intenta registrar un cliente con un `codigoPersona` inexistente en `Persona`
- **THEN** la clave foránea rechaza la operación

### Requirement: Tabla CategoriaVehiculo

La base de datos SHALL contener la tabla `CategoriaVehiculo` con clave primaria
`codigoCategoriaVehi` (bigint) y el atributo `categoriaVehi` (varchar).

#### Scenario: Categoría de vehículo almacenada

- **WHEN** se registra una categoría de vehículo
- **THEN** la fila se almacena en `CategoriaVehiculo` con un `codigoCategoriaVehi` único

### Requirement: Tabla MarcaVehiculo

La base de datos SHALL contener la tabla `MarcaVehiculo` con clave primaria
`codigoMarcaVehi` (bigint), el atributo `marcaVehi` (varchar) y la clave foránea
`categoriaVehi` hacia `CategoriaVehiculo`.

#### Scenario: Marca asociada a una categoría

- **WHEN** se registra una marca de vehículo
- **THEN** queda asociada a una categoría existente de `CategoriaVehiculo`

### Requirement: Tabla ModeloVehiculo

La base de datos SHALL contener la tabla `ModeloVehiculo` con clave primaria
`codigoModeloVehi` (bigint), el atributo `modeloVehi` (varchar) y la clave foránea
`marcaVehi` hacia `MarcaVehiculo`.

#### Scenario: Modelo asociado a una marca

- **WHEN** se registra un modelo de vehículo
- **THEN** queda asociado a una marca existente de `MarcaVehiculo`

### Requirement: Tabla Vehiculo

La base de datos SHALL contener la tabla `Vehiculo` con clave primaria
`codigoVehi` (bigint), el atributo `patenteVehi` (varchar), `estadoVehi` (bit) y
las claves foráneas `cliente` hacia `Cliente.codigoPersona` y `modeloVehi` hacia
`ModeloVehiculo.codigoModeloVehi`.

#### Scenario: Vehículo asociado a un cliente

- **WHEN** se intenta registrar un vehículo con un cliente inexistente
- **THEN** la clave foránea rechaza la operación

#### Scenario: Vehículo con modelo válido

- **WHEN** se registra un vehículo con un `modeloVehi` existente
- **THEN** la fila se almacena en `Vehiculo` con un `codigoVehi` único

### Requirement: Tabla CategoriaLavado

La base de datos SHALL contener la tabla `CategoriaLavado` con clave primaria
`codigoCategoriaLavado` (bigint) y el atributo `descripcionLavado` (varchar).

#### Scenario: Categoría de lavado almacenada

- **WHEN** se registra una categoría de lavado
- **THEN** la fila se almacena en `CategoriaLavado` con un `codigoCategoriaLavado` único

### Requirement: Tabla Usuario

La base de datos SHALL contener la tabla `Usuario` con clave primaria
`codigoUsuario` (bigint), el atributo `nombreUsuario` (varchar) y `contraseña`
(varchar).

#### Scenario: Usuario almacenado

- **WHEN** se registra un usuario
- **THEN** la fila se almacena en `Usuario` con un `codigoUsuario` único

### Requirement: Tabla Login

La base de datos SHALL contener la tabla `Login` con clave primaria
`codigoLogin` (bigint) y la clave foránea `usuario` hacia `Usuario.codigoUsuario`.

#### Scenario: Login asociado a un usuario

- **WHEN** se intenta registrar un login con un usuario inexistente
- **THEN** la clave foránea rechaza la operación

### Requirement: Tabla Lavado

La base de datos SHALL contener la tabla `Lavado` con clave primaria `codigoLavado`
(bigint), `fechaHoraLavado` (datetime2) y `fechaHoraLavadoTerminado` (datetime2(7)),
ambas obligatorias, `detallesLavado` (varchar, opcional) y las claves foráneas `vehi`
hacia `Vehiculo.codigoVehi`, `categoriaLavado` hacia
`CategoriaLavado.codigoCategoriaLavado`, `login` hacia `Login.codigoLogin`, `estado`
hacia `EstadoLavado.codigoEstado` y `utileria` hacia `Utileria.codigoUtileria`. `estado`
y `utileria` SHALL ser obligatorias. La tabla NO SHALL contener la columna `estadoLavado`.

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

#### Scenario: Fechas obligatorias

- **WHEN** se intenta registrar un lavado sin `fechaHoraLavado` o sin `fechaHoraLavadoTerminado`
- **THEN** la restricción `NOT NULL` rechaza la operación

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

### Requirement: Relación Lavado -> Vehiculo -> Cliente

El cliente de un lavado SHALL obtenerse mediante `Lavado -> Vehiculo -> Cliente`;
la tabla `Lavado` NO SHALL tener una clave foránea directa hacia `Cliente`.

#### Scenario: Cliente derivado a través del vehículo

- **WHEN** se consulta el cliente de un lavado
- **THEN** el cliente se obtiene navegando `Lavado -> Vehiculo -> Cliente`, sin una referencia directa `Lavado -> Cliente`

### Requirement: Script con datos iniciales

El script SHALL crear el esquema y, al finalizar, SHALL insertar los datos iniciales de los
catálogos documentados, sin modificar tablas, claves ni relaciones y sin eliminar ni
sobrescribir filas existentes.

#### Scenario: Esquema con datos iniciales

- **WHEN** el script termina de ejecutarse sobre una base vacía
- **THEN** existen las tablas con el esquema documentado y las filas iniciales de los catálogos

#### Scenario: Idempotencia

- **WHEN** el script se ejecuta dos veces
- **THEN** no se duplican las filas iniciales ni se modifican las existentes

### Requirement: Datos iniciales de Utileria

El script SHALL insertar en `Utileria` las filas `Auxilio` con `estadoUtileria = 1`, `Balizas`
con `estadoUtileria = 0` y `Matafuegos` con `estadoUtileria = 0`.

#### Scenario: Filas de utilería

- **WHEN** el script termina de ejecutarse
- **THEN** `Utileria` contiene `Auxilio` con estado `1`, `Balizas` con estado `0` y `Matafuegos` con estado `0`

### Requirement: Datos iniciales de CategoriaLavado

El script SHALL insertar en `CategoriaLavado` las filas `Basico`, `Completo` y `Premium`.

#### Scenario: Filas de categoría de lavado

- **WHEN** el script termina de ejecutarse
- **THEN** `CategoriaLavado` contiene `Basico`, `Completo` y `Premium`

### Requirement: Datos iniciales de EstadoLavado

El script SHALL insertar en `EstadoLavado` las filas `En Espera`, `Lavando`, `Terminado` y
`Entregado`, todas con `estadoLavado = 1`.

#### Scenario: Filas de estado de lavado

- **WHEN** el script termina de ejecutarse
- **THEN** `EstadoLavado` contiene `En Espera`, `Lavando`, `Terminado` y `Entregado`, todas con estado `1`

### Requirement: Datos iniciales de CategoriaVehiculo

El script SHALL insertar en `CategoriaVehiculo` los códigos `43` `Camion`, `44` `Automovil` y
`45` `Utilitario`.

#### Scenario: Filas de categoría de vehículo

- **WHEN** el script termina de ejecutarse
- **THEN** `CategoriaVehiculo` contiene el código `43` `Camion`, el `44` `Automovil` y el `45` `Utilitario`

### Requirement: Datos iniciales de MarcaVehiculo

El script SHALL insertar en `MarcaVehiculo` los códigos `38` `Iveco`, `39` `Mercedes Benz` y
`40` `VolksWagen` con categoría `43`; `41` `Renault`, `42` `Ford` y `43` `Nissan` con
categoría `44`; y `44` `Toyota`, `45` `Peugeot` y `46` `Citroen` con categoría `45`.

#### Scenario: Filas de marca de vehículo

- **WHEN** el script termina de ejecutarse
- **THEN** `MarcaVehiculo` contiene las nueve marcas con sus códigos y categorías documentados

### Requirement: Datos iniciales de ModeloVehiculo

El script SHALL insertar en `ModeloVehiculo` los códigos `43` `Daily` (marca `38`), `44`
`Atego` (`39`), `45` `Worker` (`40`), `46` `Duster` (`41`), `47` `Fiesta` (`42`), `48` `Versa`
(`43`), `49` `Hilux` (`44`), `50` `Partner` (`45`) y `51` `Berlingo` (`46`).

#### Scenario: Filas de modelo de vehículo

- **WHEN** el script termina de ejecutarse
- **THEN** `ModeloVehiculo` contiene los nueve modelos con sus códigos y marcas documentados

### Requirement: Ubicación y versionado del script

El script SQL SHALL versionarse dentro del directorio `src/databaseLavadero/script db/`
del repositorio.

#### Scenario: Script ubicado en el directorio acordado

- **WHEN** se implementa el cambio
- **THEN** el archivo `.sql` existe dentro de `src/databaseLavadero/script db/`

### Requirement: Restricciones de unicidad de DNI y patente

El esquema SHALL incluir un índice único en `Persona.dni` y una columna persistida
`Vehiculo.patenteClave` (mayúsculas, sin guiones ni espacios) con índice único. El script SHALL
crear las restricciones de forma idempotente y una migración SHALL aplicarlas a una base
existente.

#### Scenario: DNI duplicado rechazado por la base

- **WHEN** se intenta insertar una `Persona` con un `dni` ya existente
- **THEN** la base rechaza la inserción

#### Scenario: Patente duplicada rechazada por la base

- **WHEN** se intenta insertar un `Vehiculo` cuya `patenteClave` ya existe
- **THEN** la base rechaza la inserción

#### Scenario: Restricciones idempotentes

- **WHEN** el script se ejecuta dos veces sobre la misma base
- **THEN** las restricciones existen una sola vez y la ejecución no falla
