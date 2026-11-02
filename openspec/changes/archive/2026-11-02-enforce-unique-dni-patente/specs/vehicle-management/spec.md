# Spec Delta

## ADDED Requirements

### Requirement: Normalización de patente

El backend SHALL normalizar la patente a mayúsculas y sin espacios antes de comparar y guardar.
Si la patente normalizada tiene el formato `AA123AA`, SHALL guardarla con guiones (`AA-123-AA`).

#### Scenario: Mayúsculas y guiones

- **WHEN** se registra una patente `ab123cd`
- **THEN** se guarda como `AB-123-CD`

#### Scenario: Sin espacios

- **WHEN** se registra una patente con espacios
- **THEN** se comparan y guardan los caracteres sin espacios

### Requirement: Unicidad de patente

El backend SHALL rechazar con `409` un alta cuya patente normalizada pertenezca a un vehículo
activo, y una edición cuya patente pertenezca a cualquier otro vehículo, activo o dado de baja,
con el mensaje `La patente ya esta registrada.` La misma patente del propio vehículo NO SHALL
considerarse duplicada.

#### Scenario: Alta con patente activa

- **WHEN** se registra un vehículo con la patente de un vehículo activo
- **THEN** la respuesta es `409` con el mensaje `La patente ya esta registrada.` y no se crea el vehículo

#### Scenario: Edición con patente de otro vehículo

- **WHEN** se edita un vehículo con la patente de otro vehículo, activo o dado de baja
- **THEN** la respuesta es `409` y el vehículo no se modifica

#### Scenario: Misma patente

- **WHEN** se actualiza un vehículo conservando su propia patente
- **THEN** la respuesta es `200` y no se considera duplicada

### Requirement: Reutilización de patente de un vehículo dado de baja

Al registrar un vehículo con una patente que pertenece a un vehículo con `estadoVehi = 0`, el
backend SHALL reutilizar ese vehículo, actualizar su `cliente`, `modeloVehi` y patente
normalizada, reactivarlo (`estadoVehi = 1`) y responder `201` con el mismo `codigoVehi`, sin
crear otro vehículo.

#### Scenario: Alta con patente de un vehículo dado de baja

- **WHEN** se registra un vehículo con la patente de un vehículo dado de baja
- **THEN** la respuesta es `201` con el mismo `codigoVehi` y el vehículo queda activo

#### Scenario: Mismo cliente o cliente distinto

- **WHEN** la patente se asigna al mismo cliente o a un cliente distinto
- **THEN** el vehículo reactivado queda asociado al cliente enviado

#### Scenario: Sin duplicar el vehículo

- **WHEN** se reutiliza la patente de un vehículo dado de baja
- **THEN** existe una sola fila en `Vehiculo` con esa `patenteClave`
