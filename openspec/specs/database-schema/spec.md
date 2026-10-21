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

La base de datos SHALL contener la tabla `Lavado` con clave primaria
`codigoLavado` (bigint), `fechaHoraLavado` (datetime2), `estadoLavado` (varchar) y
las claves foráneas `vehi` hacia `Vehiculo.codigoVehi`, `categoriaLavado` hacia
`CategoriaLavado.codigoCategoriaLavado` y `login` hacia `Login.codigoLogin`.

#### Scenario: Lavado con referencias válidas

- **WHEN** se registra un lavado con vehículo, categoría y login existentes
- **THEN** la fila se almacena en `Lavado` con un `codigoLavado` único

#### Scenario: Lavado con vehículo inexistente

- **WHEN** se intenta registrar un lavado con un `vehi` inexistente
- **THEN** la clave foránea rechaza la operación

### Requirement: Relación Lavado -> Vehiculo -> Cliente

El cliente de un lavado SHALL obtenerse mediante `Lavado -> Vehiculo -> Cliente`;
la tabla `Lavado` NO SHALL tener una clave foránea directa hacia `Cliente`.

#### Scenario: Cliente derivado a través del vehículo

- **WHEN** se consulta el cliente de un lavado
- **THEN** el cliente se obtiene navegando `Lavado -> Vehiculo -> Cliente`, sin una referencia directa `Lavado -> Cliente`

### Requirement: Script sin datos iniciales

El script SHALL crear únicamente el esquema (base, tablas, claves y relaciones) y
NO SHALL insertar datos iniciales ni semilla.

#### Scenario: Base creada sin filas

- **WHEN** el script termina de ejecutarse sobre una base vacía
- **THEN** todas las tablas existen sin filas de datos

### Requirement: Ubicación y versionado del script

El script SQL SHALL versionarse dentro del directorio `src/databaseLavadero/script db/`
del repositorio.

#### Scenario: Script ubicado en el directorio acordado

- **WHEN** se implementa el cambio
- **THEN** el archivo `.sql` existe dentro de `src/databaseLavadero/script db/`
