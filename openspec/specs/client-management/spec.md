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

`PUT /api/clientes/:id` SHALL actualizar los datos personales y el estado del cliente, con
`200` si existe y `404` si no. Si alguno de sus vehículos tiene un lavado en estado
`En Espera`, `Lavando` o `Terminado`, SHALL responder `409` y no modificar el cliente.

#### Scenario: Actualización exitosa

- **WHEN** se envía una solicitud válida para un cliente existente
- **THEN** los datos personales y el estado se actualizan y la respuesta es `200`

#### Scenario: Cliente inexistente

- **WHEN** se intenta actualizar un cliente inexistente
- **THEN** la respuesta es `404`

#### Scenario: Cliente con vehículo en lavado

- **WHEN** se intenta actualizar un cliente que tiene un vehículo con un lavado en estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `409` y el cliente no se modifica

### Requirement: Eliminar cliente

`DELETE /api/clientes/:id` SHALL procesar la baja de un cliente existente: `409` si alguno de
sus vehículos tiene un lavado en `En Espera`, `Lavando` o `Terminado`; baja lógica si tiene
lavados solo en otros estados; eliminación permanente si no tiene lavados. Responde `204` en
las bajas y `404` si el cliente no existe.

#### Scenario: Eliminación exitosa con vehículos

- **WHEN** se elimina un cliente que tiene vehículos asociados sin lavados
- **THEN** se eliminan también sus vehículos y la respuesta es `204`

#### Scenario: Cliente inexistente

- **WHEN** se intenta eliminar un cliente inexistente
- **THEN** la respuesta es `404`

#### Scenario: Cliente con vehículos con lavados

- **WHEN** se intenta eliminar un cliente cuyos vehículos tienen lavados en estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `409` y el cliente y sus vehículos no se modifican

#### Scenario: Cliente con vehículos con lavados entregados

- **WHEN** se intenta eliminar un cliente cuyos vehículos tienen solo lavados en estado `Entregado`
- **THEN** la respuesta es `204` y el cliente queda con `estadoCliente = 0` y sus vehículos con `estadoVehi = 0`

### Requirement: Búsqueda de clientes

`GET /api/clientes` SHALL aceptar un parámetro de búsqueda opcional y, cuando se envía,
devolver los clientes activos cuyo `nombre`, `apellido` o `dni` contienen el texto
indicado, sin distinguir mayúsculas; sin el parámetro, devuelve todos los clientes
activos.

#### Scenario: Búsqueda con coincidencias

- **WHEN** se envía una búsqueda que coincide con el nombre, el apellido o el dni de uno o más clientes
- **THEN** la respuesta es `200` con los clientes que coinciden

#### Scenario: Búsqueda sin coincidencias

- **WHEN** se envía una búsqueda que no coincide con ningún cliente
- **THEN** la respuesta es `200` con una lista vacía

#### Scenario: Sin parámetro de búsqueda

- **WHEN** se solicita `GET /api/clientes` sin parámetro de búsqueda
- **THEN** la respuesta es `200` con todos los clientes activos

### Requirement: Filtro de clientes sin lavados recientes

`GET /api/clientes` SHALL aceptar el parámetro `sinLavadosDesde` y, cuando se envía, devolver
solo los clientes activos que no tienen lavados con `fechaHoraLavado` posterior a esa fecha.

#### Scenario: Clientes sin lavados posteriores

- **WHEN** se consulta el listado con `sinLavadosDesde` y un cliente no tiene lavados posteriores a esa fecha
- **THEN** el cliente aparece en la respuesta

#### Scenario: Cliente con lavado posterior

- **WHEN** se consulta el listado con `sinLavadosDesde` y un cliente tiene un lavado posterior a esa fecha
- **THEN** el cliente no aparece en la respuesta
