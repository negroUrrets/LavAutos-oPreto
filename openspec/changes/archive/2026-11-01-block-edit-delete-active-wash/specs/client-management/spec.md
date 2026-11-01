# Spec Delta

## MODIFIED Requirements

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

`DELETE /api/clientes/:id` SHALL procesar la baja de un cliente existente. Si alguno de sus
vehículos tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`, SHALL responder
`409` y no dar de baja el cliente. Si tiene lavados solo en otros estados, SHALL aplicar una
baja lógica (`estadoCliente = 0` y `estadoVehi = 0` de todos sus vehículos) sin eliminarlo;
si no tiene lavados, SHALL eliminarlo permanentemente junto con sus vehículos. Responde `204`
en las bajas y `404` si el cliente no existe.

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
