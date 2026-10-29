# Spec Delta

## MODIFIED Requirements

### Requirement: Listar lavados

`GET /api/lavados` SHALL devolver la lista de lavados con `200` y permitir filtrar por estado
mediante el parámetro de consulta `estado`, que indica el código de `EstadoLavado`, y por
vehículo mediante el parámetro `vehi`.

#### Scenario: Listado con resultados

- **WHEN** existen lavados registrados
- **THEN** la respuesta es `200` con la lista de lavados

#### Scenario: Filtrar lavados activos

- **WHEN** se consulta el listado con `estado` igual al código del estado activo
- **THEN** la respuesta incluye únicamente los lavados cuyo `estado` coincide con ese código

#### Scenario: Filtrar por vehículo

- **WHEN** se consulta el listado con `vehi` igual al código de un vehículo
- **THEN** la respuesta incluye únicamente los lavados de ese vehículo

## ADDED Requirements

### Requirement: Listar estados de lavado

`GET /api/estados-lavado` SHALL devolver la lista de estados de lavado con `200`.

#### Scenario: Listado de estados

- **WHEN** se solicita la lista de estados de lavado
- **THEN** la respuesta es `200` con los estados y su `descripcionEstado`
