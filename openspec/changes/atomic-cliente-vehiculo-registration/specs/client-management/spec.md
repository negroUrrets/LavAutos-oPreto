# Spec Delta

## ADDED Requirements

### Requirement: Alta conjunta de cliente y vehículo

`POST /api/clientes` SHALL aceptar un objeto opcional `vehiculo`. Cuando se envía, SHALL crear la persona, el cliente y el vehículo en una única transacción, asociar el vehículo al cliente resultante y responder `201` con los datos de ambos. Si la creación o reactivación del vehículo falla, SHALL revertir toda la operación y responder el error correspondiente, sin dejar registros parciales.

#### Scenario: Alta conjunta exitosa

- **WHEN** se envía una persona válida junto con un vehículo válido en `POST /api/clientes`
- **THEN** la respuesta es `201`, se crean la persona, el cliente y el vehículo, y el vehículo queda asociado al cliente creado

#### Scenario: Falla el vehículo

- **WHEN** la patente del vehículo pertenece a un vehículo activo y se envía el alta conjunta
- **THEN** la respuesta es `409` con el mensaje `La patente ya esta registrada.` y no existe persona, cliente ni vehículo nuevos

#### Scenario: Sin vehículo

- **WHEN** se envía `POST /api/clientes` solo con los datos de la persona
- **THEN** la respuesta es `201` y se crea únicamente el cliente, sin vehículo

#### Scenario: Patente de un vehículo dado de baja

- **WHEN** la patente del alta conjunta pertenece a un vehículo con `estadoVehi = 0`
- **THEN** la respuesta es `201`, se reactiva ese vehículo con el mismo `codigoVehi` y queda asociado al cliente resultante
