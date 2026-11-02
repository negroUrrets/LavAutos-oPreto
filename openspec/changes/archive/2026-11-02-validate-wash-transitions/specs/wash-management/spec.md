# Spec Delta

## ADDED Requirements

### Requirement: Estado inicial del lavado

Al crear un lavado, el backend SHALL aceptar solo los estados `En Espera`, `Lavando` o
`Terminado`; con `Entregado` u otro estado SHALL responder `400` sin crear el lavado.

#### Scenario: Alta en un estado permitido

- **WHEN** se crea un lavado con estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `201` y el lavado queda creado con ese estado

#### Scenario: Alta en Entregado

- **WHEN** se crea un lavado con estado `Entregado`
- **THEN** la respuesta es `400` y no se crea el lavado

### Requirement: Login del lavado desde la sesión

`POST /api/lavados` SHALL asignar `login` con el `codigoLogin` de la sesión autenticada y SHALL
ignorar cualquier `login` enviado en el cuerpo.

#### Scenario: Login de la propia sesión

- **WHEN** se crea un lavado sin `login` en el cuerpo
- **THEN** el lavado queda asociado al `codigoLogin` de la sesión autenticada

#### Scenario: Login de otra sesión

- **WHEN** se crea un lavado enviando en el cuerpo el `login` de otra sesión
- **THEN** ese valor se ignora y el lavado queda asociado al `codigoLogin` de la sesión autenticada

### Requirement: Transiciones de estado permitidas

El backend SHALL permitir solo las transiciones `En Espera → Lavando`, `Lavando → En Espera`,
`Lavando → Terminado`, `Terminado → Lavando` y `Terminado → Entregado`; `Entregado` es
terminal y el mismo estado no es una transición. Cualquier otra transición SHALL responder
`409` sin modificar el lavado.

#### Scenario: Avance permitido

- **WHEN** se actualiza un lavado de `En Espera` a `Lavando`, de `Lavando` a `Terminado` o de `Terminado` a `Entregado`
- **THEN** la respuesta es `200` y el estado se actualiza

#### Scenario: Retroceso de un paso

- **WHEN** se actualiza un lavado de `Lavando` a `En Espera` o de `Terminado` a `Lavando`
- **THEN** la respuesta es `200` y el estado se actualiza

#### Scenario: Transición no permitida

- **WHEN** se intenta una transición distinta de las permitidas, como `En Espera` a `Terminado`, `En Espera` a `Entregado` o `Entregado` a `Terminado`
- **THEN** la respuesta es `409` y el lavado no se modifica

#### Scenario: Mismo estado

- **WHEN** se actualiza un lavado enviando su mismo estado
- **THEN** la respuesta es `200` y no se considera una transición

#### Scenario: Entregado es terminal

- **WHEN** se intenta actualizar un lavado en estado `Entregado` hacia `Terminado` o cualquier otro estado
- **THEN** la respuesta es `409` y el lavado no se modifica

### Requirement: Login no modificable al actualizar

`PUT /api/lavados/:id` SHALL ignorar el campo `login` del cuerpo y conservar el login original
del lavado.

#### Scenario: Login ignorado al actualizar

- **WHEN** se actualiza un lavado enviando un `login` distinto en el cuerpo
- **THEN** la respuesta es `200` y el lavado conserva su login original
