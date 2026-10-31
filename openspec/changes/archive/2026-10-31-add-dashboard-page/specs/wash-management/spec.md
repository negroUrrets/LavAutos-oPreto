# Spec Delta

## MODIFIED Requirements

### Requirement: Listar lavados

`GET /api/lavados` SHALL devolver la lista de lavados con `200` y permitir filtrar por estado
(`estado`), por vehículo (`vehi`) y por rango de fecha de entrega (`desde` y `hasta`,
inclusive, sobre `fechaHoraLavadoTerminado`).

#### Scenario: Listado con resultados

- **WHEN** existen lavados registrados
- **THEN** la respuesta es `200` con la lista de lavados

#### Scenario: Filtrar lavados activos

- **WHEN** se consulta el listado con `estado` igual al código del estado activo
- **THEN** la respuesta incluye únicamente los lavados cuyo `estado` coincide con ese código

#### Scenario: Filtrar por vehículo

- **WHEN** se consulta el listado con `vehi` igual al código de un vehículo
- **THEN** la respuesta incluye únicamente los lavados de ese vehículo

#### Scenario: Filtrar por rango de entrega

- **WHEN** se consulta el listado con `desde` y `hasta`
- **THEN** la respuesta incluye únicamente los lavados cuya `fechaHoraLavadoTerminado` está dentro del rango, inclusive
