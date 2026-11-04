# Spec Delta

## MODIFIED Requirements

### Requirement: Ventana de información del lavado

El botón `+info` SHALL abrir una ventana con los datos del vehículo (patente, categoría,
modelo, marca, detalles y utilerías), una línea divisoria y los datos del cliente. `Detalles`
SHALL ser la última fila de la sección del vehículo y SHALL mostrarse aunque sea nulo; debajo
SHALL listarse `Utilerias` con las descripciones de las utilerías del lavado separadas por
` - `. El título `Informacion del Lavado` SHALL mostrarse en verde y un botón `Aceptar` SHALL
cerrar la ventana y volver a la página de Lavados.

#### Scenario: Abrir y cerrar la ventana

- **WHEN** se hace clic en `+info` de un lavado
- **THEN** se abre una ventana con los datos del vehículo y del cliente

#### Scenario: Aceptar

- **WHEN** se hace clic en `Aceptar` de la ventana de información
- **THEN** la ventana se cierra y se permanece en la página de Lavados

#### Scenario: Detalles en la sección del vehículo

- **WHEN** se abre la ventana de información
- **THEN** `Detalles` aparece como la última fila de la sección del vehículo, antes de la línea divisoria, y no en la sección del cliente

#### Scenario: Utilerías del lavado

- **WHEN** el lavado tiene asociadas las utilerías `Balizas` y `Matafuegos`
- **THEN** debajo de `Detalles` se muestra `Utilerias` con el valor `Balizas - Matafuegos`

#### Scenario: Sin utilerías

- **WHEN** el lavado no tiene utilerías asociadas
- **THEN** la fila `Utilerias` se muestra igualmente, con el valor vacío

#### Scenario: Detalles siempre visibles

- **WHEN** se abre la ventana de un lavado cuyo `detallesLavado` es nulo o vacío
- **THEN** la fila `Detalles` se muestra igualmente, con el valor vacío

#### Scenario: Separación vehículo y cliente

- **WHEN** se abre la ventana de información
- **THEN** los datos del vehículo y los del cliente aparecen separados por una línea divisoria

#### Scenario: Título en verde

- **WHEN** se abre la ventana de información
- **THEN** el título `Informacion del Lavado` se muestra en color verde
