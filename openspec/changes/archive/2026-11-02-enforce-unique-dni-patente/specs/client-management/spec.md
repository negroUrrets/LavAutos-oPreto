# Spec Delta

## ADDED Requirements

### Requirement: Unicidad de DNI

El backend SHALL rechazar con `409` un alta o edición cuyo `dni` pertenezca a otro cliente
activo, con el mensaje `El DNI ya esta registrado.` Una edición SHALL rechazar también el DNI de
un cliente dado de baja. El mismo DNI del propio cliente NO SHALL considerarse duplicado.

#### Scenario: Alta con DNI activo

- **WHEN** se registra un cliente con el `dni` de un cliente activo
- **THEN** la respuesta es `409` con el mensaje `El DNI ya esta registrado.` y no se crea el cliente

#### Scenario: Edición con DNI de otro cliente

- **WHEN** se edita un cliente con el `dni` de otro cliente, activo o dado de baja
- **THEN** la respuesta es `409` y el cliente no se modifica

#### Scenario: Mismo DNI

- **WHEN** se actualiza un cliente conservando su propio `dni`
- **THEN** la respuesta es `200` y no se considera duplicado

### Requirement: Reutilización de DNI de un cliente dado de baja

Al registrar un cliente con un `dni` que pertenece a un cliente con `estadoCliente = 0`, el
backend SHALL reutilizar esa persona y ese cliente, actualizar sus datos, reactivarlo
(`estadoCliente = 1`) y responder `201`, sin crear otra persona.

#### Scenario: Alta con DNI de un cliente dado de baja

- **WHEN** se registra un cliente con el `dni` de un cliente dado de baja
- **THEN** la respuesta es `201` con el mismo `codigoPersona`, el cliente queda activo y se actualizan sus datos

#### Scenario: Sin duplicar la persona

- **WHEN** se reutiliza el DNI de un cliente dado de baja
- **THEN** existe una sola fila en `Persona` con ese `dni`
