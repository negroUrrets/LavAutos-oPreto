# Spec Delta

## MODIFIED Requirements

### Requirement: Eliminar vehículo

`DELETE /api/vehiculos/:id` SHALL eliminar un vehículo existente con `204` y responder
`404` si no existe. Si el vehículo tiene lavados asociados, SHALL aplicar baja lógica
(`estadoVehi = 0`) en lugar de eliminarlo.

#### Scenario: Eliminación exitosa

- **WHEN** se elimina un vehículo existente sin lavados asociados
- **THEN** la respuesta es `204` sin contenido y el vehículo se elimina permanentemente

#### Scenario: Vehículo inexistente

- **WHEN** se intenta eliminar un vehículo inexistente
- **THEN** la respuesta es `404`

#### Scenario: Vehículo con lavados asociados

- **WHEN** se intenta eliminar un vehículo que tiene lavados asociados
- **THEN** la respuesta es `204` y el vehículo queda con `estadoVehi = 0` (baja lógica) sin eliminarse
