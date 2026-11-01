# Spec Delta

## MODIFIED Requirements

### Requirement: Actualizar vehículo

`PUT /api/vehiculos/:id` SHALL actualizar `patenteVehi`, `estadoVehi`, `cliente` y
`modeloVehi`, con `200` si existe y `404` si no. Si el vehículo tiene un lavado en estado
`En Espera`, `Lavando` o `Terminado`, SHALL responder `409` y no modificarlo.

#### Scenario: Actualización exitosa

- **WHEN** se envía una solicitud válida para un vehículo existente
- **THEN** los datos se actualizan y la respuesta es `200`

#### Scenario: Vehículo inexistente

- **WHEN** se intenta actualizar un vehículo inexistente
- **THEN** la respuesta es `404`

#### Scenario: Vehículo en lavado

- **WHEN** se intenta actualizar un vehículo que tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `409` y el vehículo no se modifica

### Requirement: Eliminar vehículo

`DELETE /api/vehiculos/:id` SHALL eliminar un vehículo existente con `204` y responder `404`
si no existe. Si el vehículo tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`,
SHALL responder `409` y no darlo de baja. Si tiene lavados solo en otros estados, SHALL
aplicar baja lógica (`estadoVehi = 0`) en lugar de eliminarlo.

#### Scenario: Eliminación exitosa

- **WHEN** se elimina un vehículo existente sin lavados asociados
- **THEN** la respuesta es `204` sin contenido y el vehículo se elimina permanentemente

#### Scenario: Vehículo inexistente

- **WHEN** se intenta eliminar un vehículo inexistente
- **THEN** la respuesta es `404`

#### Scenario: Vehículo con lavados asociados

- **WHEN** se intenta eliminar un vehículo que tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `409` y el vehículo permanece sin cambios

#### Scenario: Vehículo con lavados entregados

- **WHEN** se intenta eliminar un vehículo que tiene solo lavados en estado `Entregado`
- **THEN** la respuesta es `204` y el vehículo queda con `estadoVehi = 0` (baja lógica) sin eliminarse
