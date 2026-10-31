# Spec Delta

## ADDED Requirements

### Requirement: Filtro de clientes sin lavados recientes

`GET /api/clientes` SHALL aceptar el parámetro `sinLavadosDesde` y, cuando se envía, devolver
solo los clientes activos que no tienen lavados con `fechaHoraLavado` posterior a esa fecha.

#### Scenario: Clientes sin lavados posteriores

- **WHEN** se consulta el listado con `sinLavadosDesde` y un cliente no tiene lavados posteriores a esa fecha
- **THEN** el cliente aparece en la respuesta

#### Scenario: Cliente con lavado posterior

- **WHEN** se consulta el listado con `sinLavadosDesde` y un cliente tiene un lavado posterior a esa fecha
- **THEN** el cliente no aparece en la respuesta
