# Spec Delta

## MODIFIED Requirements

### Requirement: Ventana de información del lavado

El botón `+info` SHALL abrir una ventana con los datos del vehículo, una línea divisoria, los
datos del cliente y el campo `Detalles` del lavado, aunque su valor sea nulo. El título
`Informacion del Lavado` SHALL mostrarse en color verde y un botón `Aceptar` SHALL cerrar la
ventana y volver a la página de Lavados.

#### Scenario: Abrir y cerrar la ventana

- **WHEN** se hace clic en `+info` de un lavado
- **THEN** se abre una ventana con los datos del vehículo y del cliente

#### Scenario: Aceptar

- **WHEN** se hace clic en `Aceptar` de la ventana de información
- **THEN** la ventana se cierra y se permanece en la página de Lavados

#### Scenario: Detalles siempre visibles

- **WHEN** se abre la ventana de un lavado cuyo `detallesLavado` es nulo o vacío
- **THEN** la fila `Detalles` se muestra igualmente, con el valor vacío

#### Scenario: Separación vehículo y cliente

- **WHEN** se abre la ventana de información
- **THEN** los datos del vehículo y los del cliente aparecen separados por una línea divisoria

#### Scenario: Título en verde

- **WHEN** se abre la ventana de información
- **THEN** el título `Informacion del Lavado` se muestra en color verde
