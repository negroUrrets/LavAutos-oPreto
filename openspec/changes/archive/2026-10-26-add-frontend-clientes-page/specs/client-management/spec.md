# Spec Delta

## ADDED Requirements

### Requirement: Búsqueda de clientes

`GET /api/clientes` SHALL aceptar un parámetro de búsqueda opcional y, cuando se
envía, devolver solo los clientes cuyo `nombre`, `apellido` o `dni` contienen el
texto indicado, sin distinguir mayúsculas; sin el parámetro, devuelve todos los
clientes.

#### Scenario: Búsqueda con coincidencias

- **WHEN** se envía una búsqueda que coincide con el nombre, el apellido o el dni de uno o más clientes
- **THEN** la respuesta es `200` con los clientes que coinciden

#### Scenario: Búsqueda sin coincidencias

- **WHEN** se envía una búsqueda que no coincide con ningún cliente
- **THEN** la respuesta es `200` con una lista vacía

#### Scenario: Sin parámetro de búsqueda

- **WHEN** se solicita `GET /api/clientes` sin parámetro de búsqueda
- **THEN** la respuesta es `200` con todos los clientes registrados
