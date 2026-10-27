# Spec Delta

## MODIFIED Requirements

### Requirement: Listar clientes

`GET /api/clientes` SHALL devolver solo los clientes con `estadoCliente = 1`, tanto en
el listado como en la búsqueda, con `200`.

#### Scenario: Listado con resultados

- **WHEN** existen clientes con `estadoCliente = 1`
- **THEN** la respuesta es `200` con la lista de clientes activos

#### Scenario: Clientes inactivos excluidos

- **WHEN** existen clientes con `estadoCliente = 0`
- **THEN** no aparecen en el listado ni en la búsqueda

#### Scenario: Listado vacío

- **WHEN** no existen clientes con `estadoCliente = 1`
- **THEN** la respuesta es `200` con una lista vacía
