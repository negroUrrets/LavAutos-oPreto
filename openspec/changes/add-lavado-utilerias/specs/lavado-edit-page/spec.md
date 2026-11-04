# Spec Delta

## MODIFIED Requirements

### Requirement: Carga de los datos del lavado

Al abrir la página, la aplicación SHALL obtener el lavado seleccionado y SHALL mostrar su
categoría, su estado, sus detalles y los checkboxes de utilería, tildados según las utilerías
asociadas al lavado.

#### Scenario: Datos precargados

- **WHEN** se abre la página `Editar Lavado` de un lavado existente
- **THEN** el formulario muestra la categoría, el estado, los detalles y las utilerías asociadas al lavado seleccionado

#### Scenario: Lavado inexistente

- **WHEN** se abre la página `Editar Lavado` con un identificador de lavado inexistente
- **THEN** la aplicación vuelve a la página `Lavados` sin mostrar el formulario

### Requirement: Utilerías del lavado editable

La página SHALL mostrar un checkbox por cada fila de `Utileria`, tildado si la utilería está
asociada al lavado, y al tildarlo o destildarlo SHALL modificar solo la selección de este
lavado, sin actualizar `estadoUtileria` del catálogo ni llamar a `PUT /api/utilerias/:id`.

#### Scenario: Tildar una utilería

- **WHEN** se tilda el checkbox de una utilería
- **THEN** la utilería queda seleccionada para este lavado y su `estadoUtileria` en el catálogo no cambia

#### Scenario: Destildar una utilería

- **WHEN** se destilda el checkbox de una utilería asociada
- **THEN** la utilería deja de estar seleccionada para este lavado y su `estadoUtileria` en el catálogo no cambia

#### Scenario: Asociación independiente del catálogo

- **WHEN** se abre un lavado cuya utilería tiene `estadoUtileria = 1` o `0`
- **THEN** el checkbox se tilda según la asociación con el lavado, no según el estado del catálogo

### Requirement: Registrar la edición

Al presionar `Registrar`, la página SHALL actualizar el lavado (`PUT /api/lavados/:id`) con la
categoría, el estado, todas las utilerías tildadas (`utilerias`) y los detalles, SHALL mostrar
el popup `Lavado editado exitosamente` y, al aceptarlo, SHALL volver a la página `Lavados`.

#### Scenario: Registrar cambios

- **WHEN** se presiona `Registrar` y la actualización se completa
- **THEN** se actualizan los datos con todas las utilerías tildadas, se muestra el popup `Lavado editado exitosamente` y, al aceptarlo, la aplicación vuelve a la página `Lavados`

#### Scenario: Sin utilería tildada

- **WHEN** se presiona `Registrar` sin ninguna utilería tildada
- **THEN** la aplicación no guarda los cambios y muestra un aviso de que se seleccione al menos una utilería

#### Scenario: Error al guardar

- **WHEN** la actualización del lavado falla
- **THEN** la aplicación permanece en la página `Editar Lavado` y no muestra el popup de éxito
