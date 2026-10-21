# Spec Delta

## Purpose

Permite gestionar lavados y la categoría de lavado a través de la API REST,
preservando la relación `Lavado -> Vehiculo -> Cliente`.

## ADDED Requirements

### Requirement: Crear lavado

`POST /api/lavados` SHALL crear un lavado con `fechaHoraLavado`, `vehi`,
`categoriaLavado`, `estadoLavado` y `login`, y responder `201` con el lavado
creado.

#### Scenario: Creación exitosa

- **WHEN** se envía una solicitud válida con vehículo, categoría y login existentes
- **THEN** se crea el lavado y la respuesta es `201` con los datos creados

#### Scenario: Vehículo inexistente

- **WHEN** se envía un lavado con un `vehi` inexistente
- **THEN** la respuesta es `400` indicando que el vehículo no existe

#### Scenario: Categoría inexistente

- **WHEN** se envía un lavado con una `categoriaLavado` inexistente
- **THEN** la respuesta es `400` indicando que la categoría no existe

### Requirement: Listar lavados

`GET /api/lavados` SHALL devolver la lista de lavados con `200` y permitir filtrar
por estado mediante el parámetro de consulta `estadoLavado`.

#### Scenario: Listado con resultados

- **WHEN** existen lavados registrados
- **THEN** la respuesta es `200` con la lista de lavados

#### Scenario: Filtrar lavados activos

- **WHEN** se consulta el listado con el filtro de estado activo
- **THEN** la respuesta incluye únicamente los lavados cuyo estado coincide con el filtro

### Requirement: Obtener lavado

`GET /api/lavados/:id` SHALL devolver un lavado por su identificador, con `200` si
existe y `404` si no.

#### Scenario: Lavado existente

- **WHEN** se solicita un lavado con un identificador existente
- **THEN** la respuesta es `200` con los datos del lavado

#### Scenario: Lavado inexistente

- **WHEN** se solicita un lavado con un identificador inexistente
- **THEN** la respuesta es `404`

### Requirement: Actualizar lavado

`PUT /api/lavados/:id` SHALL actualizar los datos del lavado, incluido
`estadoLavado`, con `200` si existe y `404` si no.

#### Scenario: Actualización exitosa

- **WHEN** se envía una solicitud válida para un lavado existente
- **THEN** los datos y el estado se actualizan y la respuesta es `200`

#### Scenario: Lavado inexistente

- **WHEN** se intenta actualizar un lavado inexistente
- **THEN** la respuesta es `404`

### Requirement: Eliminar lavado no permitido

El backend NO SHALL permitir eliminar lavados. Una solicitud `DELETE /api/lavados/:id`
SHALL ser rechazada y el lavado SHALL permanecer almacenado.

#### Scenario: Eliminación rechazada

- **WHEN** se envía una solicitud `DELETE` sobre un lavado
- **THEN** la respuesta es `405` y el lavado permanece almacenado

### Requirement: Cliente del lavado por el vehículo

La representación de un lavado NO SHALL incluir una referencia directa a
`Cliente`; el cliente SHALL obtenerse mediante `Lavado -> Vehiculo -> Cliente`.

#### Scenario: Cliente derivado

- **WHEN** se consulta un lavado
- **THEN** el cliente se obtiene navegando por su vehículo, sin un campo directo de cliente en el lavado

### Requirement: CRUD de categoría de lavado

El backend SHALL exponer operaciones CRUD para `CategoriaLavado` en
`/api/categorias-lavado`.

#### Scenario: Crear categoría de lavado

- **WHEN** se envía una solicitud válida con `descripcionLavado`
- **THEN** se crea la categoría y la respuesta es `201`

#### Scenario: Eliminar categoría inexistente

- **WHEN** se intenta eliminar una categoría de lavado inexistente
- **THEN** la respuesta es `404`

#### Scenario: Categoría con lavados asociados

- **WHEN** se intenta eliminar una categoría de lavado que tiene lavados asociados
- **THEN** la respuesta es `409` indicando que no puede eliminarse por tener dependencias
