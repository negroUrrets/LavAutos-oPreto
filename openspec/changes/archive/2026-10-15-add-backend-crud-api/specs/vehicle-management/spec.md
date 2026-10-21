# Spec Delta

## Purpose

Permite gestionar vehículos y sus catálogos (categoría, marca y modelo) a través
de la API REST, con cada vehículo asociado a un cliente.

## ADDED Requirements

### Requirement: Crear vehículo

`POST /api/vehiculos` SHALL crear un vehículo con `patenteVehi`, `estadoVehi`,
`cliente` y `modeloVehi`, y responder `201` con el vehículo creado.

#### Scenario: Creación exitosa

- **WHEN** se envía una solicitud válida con un cliente y un modelo existentes
- **THEN** se crea el vehículo y la respuesta es `201` con los datos creados

#### Scenario: Cliente inexistente

- **WHEN** se envía un vehículo con un `cliente` inexistente
- **THEN** la respuesta es `400` indicando que el cliente no existe

#### Scenario: Modelo inexistente

- **WHEN** se envía un vehículo con un `modeloVehi` inexistente
- **THEN** la respuesta es `400` indicando que el modelo no existe

### Requirement: Listar vehículos

`GET /api/vehiculos` SHALL devolver la lista de vehículos registrados con `200`.

#### Scenario: Listado con resultados

- **WHEN** existen vehículos registrados
- **THEN** la respuesta es `200` con la lista de vehículos

#### Scenario: Listado vacío

- **WHEN** no existen vehículos registrados
- **THEN** la respuesta es `200` con una lista vacía

### Requirement: Obtener vehículo

`GET /api/vehiculos/:id` SHALL devolver un vehículo por su identificador, con `200`
si existe y `404` si no.

#### Scenario: Vehículo existente

- **WHEN** se solicita un vehículo con un identificador existente
- **THEN** la respuesta es `200` con los datos del vehículo

#### Scenario: Vehículo inexistente

- **WHEN** se solicita un vehículo con un identificador inexistente
- **THEN** la respuesta es `404`

### Requirement: Actualizar vehículo

`PUT /api/vehiculos/:id` SHALL actualizar `patenteVehi`, `estadoVehi`, `cliente` y
`modeloVehi`, con `200` si existe y `404` si no.

#### Scenario: Actualización exitosa

- **WHEN** se envía una solicitud válida para un vehículo existente
- **THEN** los datos se actualizan y la respuesta es `200`

#### Scenario: Vehículo inexistente

- **WHEN** se intenta actualizar un vehículo inexistente
- **THEN** la respuesta es `404`

### Requirement: Eliminar vehículo

`DELETE /api/vehiculos/:id` SHALL eliminar un vehículo existente con `204` y
responder `404` si no existe.

#### Scenario: Eliminación exitosa

- **WHEN** se elimina un vehículo existente
- **THEN** la respuesta es `204` sin contenido

#### Scenario: Vehículo inexistente

- **WHEN** se intenta eliminar un vehículo inexistente
- **THEN** la respuesta es `404`

#### Scenario: Vehículo con lavados asociados

- **WHEN** se intenta eliminar un vehículo que tiene lavados asociados
- **THEN** la respuesta es `409` indicando que no puede eliminarse por tener dependencias

### Requirement: CRUD de categoría de vehículo

El backend SHALL exponer operaciones CRUD para `CategoriaVehiculo` en
`/api/categorias-vehiculo`.

#### Scenario: Crear categoría de vehículo

- **WHEN** se envía una solicitud válida con `categoriaVehi`
- **THEN** se crea la categoría y la respuesta es `201`

#### Scenario: Eliminar categoría inexistente

- **WHEN** se intenta eliminar una categoría de vehículo inexistente
- **THEN** la respuesta es `404`

#### Scenario: Categoría con marcas asociadas

- **WHEN** se intenta eliminar una categoría de vehículo que tiene marcas asociadas
- **THEN** la respuesta es `409` indicando que no puede eliminarse por tener dependencias

### Requirement: CRUD de marca de vehículo

El backend SHALL exponer operaciones CRUD para `MarcaVehiculo` en
`/api/marcas-vehiculo`, requiriendo una `categoriaVehi` existente.

#### Scenario: Crear marca de vehículo

- **WHEN** se envía una solicitud válida con `marcaVehi` y una categoría existente
- **THEN** se crea la marca y la respuesta es `201`

#### Scenario: Categoría inexistente

- **WHEN** se envía una marca con una `categoriaVehi` inexistente
- **THEN** la respuesta es `400` indicando que la categoría no existe

#### Scenario: Marca con modelos asociados

- **WHEN** se intenta eliminar una marca de vehículo que tiene modelos asociados
- **THEN** la respuesta es `409` indicando que no puede eliminarse por tener dependencias

### Requirement: CRUD de modelo de vehículo

El backend SHALL exponer operaciones CRUD para `ModeloVehiculo` en
`/api/modelos-vehiculo`, requiriendo una `marcaVehi` existente.

#### Scenario: Crear modelo de vehículo

- **WHEN** se envía una solicitud válida con `modeloVehi` y una marca existente
- **THEN** se crea el modelo y la respuesta es `201`

#### Scenario: Marca inexistente

- **WHEN** se envía un modelo con una `marcaVehi` inexistente
- **THEN** la respuesta es `400` indicando que la marca no existe

#### Scenario: Modelo con vehículos asociados

- **WHEN** se intenta eliminar un modelo de vehículo que tiene vehículos asociados
- **THEN** la respuesta es `409` indicando que no puede eliminarse por tener dependencias
