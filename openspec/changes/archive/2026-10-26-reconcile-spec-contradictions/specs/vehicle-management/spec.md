# Spec Delta

## MODIFIED Requirements

### Requirement: Listar vehículos

`GET /api/vehiculos` SHALL devolver solo los vehículos con `estadoVehi = 1`, con `200`.

#### Scenario: Listado con resultados

- **WHEN** existen vehículos con `estadoVehi = 1`
- **THEN** la respuesta es `200` con la lista de vehículos activos

#### Scenario: Vehículos inactivos excluidos

- **WHEN** existen vehículos con `estadoVehi = 0`
- **THEN** no aparecen en la lista

#### Scenario: Listado vacío

- **WHEN** no existen vehículos con `estadoVehi = 1`
- **THEN** la respuesta es `200` con una lista vacía

## REMOVED Requirements

### Requirement: Solo vehículos activos

**Reason**: Duplicaba el filtro por estado activo, que ahora describe «Listar vehículos».

**Migration**: Usar «Listar vehículos», que incluye el escenario de vehículos inactivos
excluidos.
