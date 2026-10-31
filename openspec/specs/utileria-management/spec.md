# utileria-management Specification

## Purpose

Permite consultar y actualizar el estado de las utilerías del lavadero a través de la API REST.

## Requirements

### Requirement: Listar utilerías

`GET /api/utilerias` SHALL devolver la lista de utilerías con `200`.

#### Scenario: Listado de utilerías

- **WHEN** se solicita la lista de utilerías
- **THEN** la respuesta es `200` con las utilerías y su `estadoUtileria`

### Requirement: Actualizar utilería

`PUT /api/utilerias/:id` SHALL actualizar `estadoUtileria` y, si se envía,
`descripcionUtileria`, con `200` si la utilería existe y `404` si no.

#### Scenario: Actualización exitosa

- **WHEN** se envía un `estadoUtileria` válido para una utilería existente
- **THEN** la utilería se actualiza y la respuesta es `200`

#### Scenario: Utilería inexistente

- **WHEN** se intenta actualizar una utilería inexistente
- **THEN** la respuesta es `404`
