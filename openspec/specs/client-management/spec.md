# client-management Specification

## Purpose

Permite gestionar clientes del lavadero a través de la API REST, considerando que
un cliente es una persona.

## Requirements

### Requirement: Crear cliente

`POST /api/clientes` SHALL crear un cliente con sus datos personales (`nombre`,
`apellido`, `dni`, `email`, `celular`) y responder `201` con el cliente creado.

#### Scenario: Creación exitosa

- **WHEN** se envía una solicitud válida con los datos del cliente
- **THEN** se crean la persona y su registro de cliente, y la respuesta es `201` con los datos creados

#### Scenario: Datos inválidos

- **WHEN** falta un dato obligatorio del cliente
- **THEN** la respuesta es `400` con un error de validación

### Requirement: Listar clientes

`GET /api/clientes` SHALL devolver la lista de clientes registrados con `200`.

#### Scenario: Listado con resultados

- **WHEN** existen clientes registrados
- **THEN** la respuesta es `200` con la lista de clientes

#### Scenario: Listado vacío

- **WHEN** no existen clientes registrados
- **THEN** la respuesta es `200` con una lista vacía

### Requirement: Obtener cliente

`GET /api/clientes/:id` SHALL devolver un cliente por su identificador, con `200`
si existe y `404` si no.

#### Scenario: Cliente existente

- **WHEN** se solicita un cliente con un identificador existente
- **THEN** la respuesta es `200` con los datos del cliente

#### Scenario: Cliente inexistente

- **WHEN** se solicita un cliente con un identificador inexistente
- **THEN** la respuesta es `404`

### Requirement: Actualizar cliente

`PUT /api/clientes/:id` SHALL actualizar los datos personales y el estado del
cliente, con `200` si existe y `404` si no.

#### Scenario: Actualización exitosa

- **WHEN** se envía una solicitud válida para un cliente existente
- **THEN** los datos personales y el estado se actualizan y la respuesta es `200`

#### Scenario: Cliente inexistente

- **WHEN** se intenta actualizar un cliente inexistente
- **THEN** la respuesta es `404`

### Requirement: Eliminar cliente

`DELETE /api/clientes/:id` SHALL eliminar un cliente existente junto con sus
vehículos asociados, con `204`, y responder `404` si no existe.

#### Scenario: Eliminación exitosa con vehículos

- **WHEN** se elimina un cliente que tiene vehículos asociados sin lavados
- **THEN** se eliminan también sus vehículos y la respuesta es `204`

#### Scenario: Cliente inexistente

- **WHEN** se intenta eliminar un cliente inexistente
- **THEN** la respuesta es `404`

#### Scenario: Cliente con vehículos con lavados

- **WHEN** se intenta eliminar un cliente cuyos vehículos tienen lavados asociados
- **THEN** la respuesta es `409` indicando que no puede eliminarse porque los lavados no se eliminan
