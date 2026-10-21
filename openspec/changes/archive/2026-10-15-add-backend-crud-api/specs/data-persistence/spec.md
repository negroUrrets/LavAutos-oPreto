# Spec Delta

## Purpose

Define los modelos Sequelize y las asociaciones que mapean el esquema físico de
`DataBaseLavadero`, incluidas la herencia `Cliente`/`Persona` y las relaciones del
dominio del lavadero.

## ADDED Requirements

### Requirement: Un modelo por tabla

El backend SHALL definir un modelo Sequelize por cada tabla del esquema:
`Persona`, `Cliente`, `Vehiculo`, `ModeloVehiculo`, `MarcaVehiculo`,
`CategoriaVehiculo`, `CategoriaLavado`, `Lavado`, `Login` y `Usuario`, mapeando los
nombres de tabla y de columnas documentados.

#### Scenario: Mapeo de tabla y columnas

- **WHEN** se opera sobre una entidad a través de su modelo
- **THEN** se usa el nombre de tabla y las columnas documentados (por ejemplo `Persona` con `codigoPersona`, `nombre`, `apellido`, `dni`, `email`, `celular`)

### Requirement: Claves primarias y ausencia de timestamps

Cada modelo SHALL mapear su clave primaria documentada (por ejemplo
`codigoPersona`) y NO SHALL agregar columnas de timestamp (`createdAt`/`updatedAt`)
que no existen en el esquema.

#### Scenario: Identificador documentado

- **WHEN** se recupera una fila a través de un modelo
- **THEN** su identificador corresponde a la clave primaria documentada de la tabla

#### Scenario: Sin columnas de timestamp

- **WHEN** se persiste o consulta una entidad
- **THEN** no se generan ni requieren columnas `createdAt` ni `updatedAt`

### Requirement: Herencia Cliente/Persona

`Cliente` SHALL modelarse como una `Persona` mediante una asociación uno a uno
sobre la clave compartida `codigoPersona` (tabla por tipo) y agregar
`estadoCliente`.

#### Scenario: Cliente reutiliza la identidad de la persona

- **WHEN** se crea un cliente
- **THEN** su `codigoPersona` es el mismo identificador de la persona asociada

#### Scenario: Cliente accede a los datos de persona

- **WHEN** se consulta un cliente
- **THEN** se obtienen sus datos personales a través de la asociación con `Persona`

### Requirement: Asociaciones del dominio de vehículos

El backend SHALL definir las asociaciones `Cliente 1:N Vehiculo`,
`ModeloVehiculo 1:N Vehiculo`, `MarcaVehiculo 1:N ModeloVehiculo` y
`CategoriaVehiculo 1:N MarcaVehiculo`.

#### Scenario: Vehículo asociado a cliente y modelo

- **WHEN** se consulta un vehículo con sus asociaciones
- **THEN** se obtienen su cliente y su modelo, y desde el modelo se navega a marca y categoría

### Requirement: Asociaciones de lavados

El backend SHALL definir las asociaciones `Vehiculo 1:N Lavado`,
`CategoriaLavado 1:N Lavado`, `Usuario 1:N Login` y `Login 1:N Lavado`.

#### Scenario: Cliente del lavado por navegación

- **WHEN** se consulta un lavado con sus asociaciones
- **THEN** el cliente del lavado se obtiene mediante `Lavado -> Vehiculo -> Cliente`

### Requirement: Sin relación directa Lavado -> Cliente

El modelo `Lavado` NO SHALL declarar una asociación directa hacia `Cliente`; el
cliente se obtiene a través del vehículo.

#### Scenario: Sin asociación directa

- **WHEN** se inspeccionan las asociaciones del modelo `Lavado`
- **THEN** no existe una asociación directa `Lavado -> Cliente`
