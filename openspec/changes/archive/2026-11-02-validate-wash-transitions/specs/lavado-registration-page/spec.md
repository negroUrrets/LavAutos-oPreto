# Spec Delta

## MODIFIED Requirements

### Requirement: Estado del lavado

La página SHALL ofrecer un combobox con los estados `En Espera`, `Lavando` y `Terminado` y
SHALL guardar el código elegido en `estado`. `Entregado` NO SHALL ofrecerse en el alta.

#### Scenario: Elegir estado

- **WHEN** se elige una opción del combobox de estado
- **THEN** el código de ese estado se envía en `estado`

#### Scenario: Entregado no disponible

- **WHEN** se abre el combobox de estado de la página «Nuevo Lavado»
- **THEN** las opciones son `En Espera`, `Lavando` y `Terminado`, sin `Entregado`
