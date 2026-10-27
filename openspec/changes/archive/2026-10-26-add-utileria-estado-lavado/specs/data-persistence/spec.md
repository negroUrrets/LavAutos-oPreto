# Spec Delta

## MODIFIED Requirements

### Requirement: Un modelo por tabla

El backend SHALL definir un modelo Sequelize por cada tabla del esquema:
`Persona`, `Cliente`, `Vehiculo`, `ModeloVehiculo`, `MarcaVehiculo`,
`CategoriaVehiculo`, `CategoriaLavado`, `EstadoLavado`, `Utileria`, `Lavado`, `Login` y
`Usuario`, mapeando los nombres de tabla y de columnas documentados.

#### Scenario: Mapeo de tabla y columnas

- **WHEN** se opera sobre una entidad a través de su modelo
- **THEN** se usa el nombre de tabla y las columnas documentados (por ejemplo `Persona` con `codigoPersona`, `nombre`, `apellido`, `dni`, `email`, `celular`)

#### Scenario: Catálogos de lavado mapeados

- **WHEN** se opera sobre `EstadoLavado` o `Utileria`
- **THEN** se usan las tablas `EstadoLavado` y `Utileria` con sus claves primarias `codigoEstado` y `codigoUtileria`

### Requirement: Asociaciones de lavados

El backend SHALL definir las asociaciones `Vehiculo 1:N Lavado`,
`CategoriaLavado 1:N Lavado`, `Usuario 1:N Login`, `Login 1:N Lavado`,
`EstadoLavado 1:N Lavado` y `Utileria 1:N Lavado`.

#### Scenario: Cliente del lavado por navegación

- **WHEN** se consulta un lavado con sus asociaciones
- **THEN** el cliente del lavado se obtiene mediante `Lavado -> Vehiculo -> Cliente`

#### Scenario: Estado y utilería del lavado

- **WHEN** se consulta un lavado con sus asociaciones
- **THEN** se obtienen su estado desde `EstadoLavado` y su utilería desde `Utileria`
