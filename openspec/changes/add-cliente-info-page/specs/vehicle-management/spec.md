# Spec Delta

## ADDED Requirements

### Requirement: Vehículos con su marca y categoría

`GET /api/vehiculos` SHALL incluir, junto con cada vehículo, su modelo, la marca del
modelo y la categoría de la marca, de modo que la respuesta permita conocer la
categoría, la marca, el modelo y la patente de cada vehículo.

#### Scenario: Listado con marca y categoría

- **WHEN** se solicita `GET /api/vehiculos`
- **THEN** cada vehículo incluye su modelo, la marca del modelo y la categoría de la marca

### Requirement: Filtro de vehículos por cliente

`GET /api/vehiculos` SHALL aceptar un filtro opcional por cliente y, cuando se envía,
devolver solo los vehículos de ese cliente.

#### Scenario: Vehículos de un cliente

- **WHEN** se solicita `GET /api/vehiculos` filtrando por un cliente
- **THEN** la respuesta incluye solo los vehículos de ese cliente

#### Scenario: Sin filtro

- **WHEN** se solicita `GET /api/vehiculos` sin filtro
- **THEN** la respuesta incluye todos los vehículos activos registrados

### Requirement: Solo vehículos activos

`GET /api/vehiculos` SHALL devolver solo los vehículos con `estadoVehi = 1`.

#### Scenario: Vehículos inactivos excluidos

- **WHEN** existen vehículos con `estadoVehi = 0`
- **THEN** no aparecen en la lista
