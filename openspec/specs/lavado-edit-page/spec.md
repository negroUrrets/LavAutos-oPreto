# lavado-edit-page Specification

## Purpose

Permite editar la categoría, la utilería, los detalles y el estado de un lavado ya registrado,
con confirmación de éxito y cancelación sin cambios.

## Requirements

### Requirement: Página Editar Lavado

La aplicación SHALL mostrar la página «Editar Lavado» en `/lavados/:lavadoId/editar` con el
título `Editar Lavado: <patente>`, la patente en modo solo lectura, los datos editables del
lavado y los botones `Registrar` y `Cancelar`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página «Editar Lavado» con una sesión válida
- **THEN** se muestran el título con la patente, los datos editables del lavado y los botones `Registrar` y `Cancelar`

#### Scenario: Patente en solo lectura

- **WHEN** se muestra la página «Editar Lavado»
- **THEN** la patente del vehículo se ve en el título y no se puede modificar

### Requirement: Carga de los datos del lavado

Al abrir la página, la aplicación SHALL obtener el lavado seleccionado y SHALL mostrar su
categoría, su estado, sus detalles y los checkboxes de utilería del catálogo.

#### Scenario: Datos precargados

- **WHEN** se abre la página «Editar Lavado» de un lavado existente
- **THEN** el formulario muestra la categoría, el estado, los detalles y las utilerías del lavado seleccionado

#### Scenario: Lavado inexistente

- **WHEN** se abre la página «Editar Lavado» con un identificador de lavado inexistente
- **THEN** la aplicación vuelve a la página «Lavados» sin mostrar el formulario

### Requirement: Utilerías del lavado editable

La página SHALL mostrar un checkbox por cada fila de `Utileria`, tildado según su
`estadoUtileria`, y al tildarlo o destildarlo SHALL actualizar `estadoUtileria` de esa fila
(`PUT /api/utilerias/:id`).

#### Scenario: Tildar una utilería

- **WHEN** se tilda el checkbox de una utilería
- **THEN** su fila queda con `estadoUtileria = 1`

#### Scenario: Destildar una utilería

- **WHEN** se destilda el checkbox de una utilería
- **THEN** su fila queda con `estadoUtileria = 0`

### Requirement: Categoría del lavado editable

La página SHALL mostrar un toggle por cada fila de `CategoriaLavado` con la categoría del
lavado encendida y SHALL permitir un solo toggle encendido.

#### Scenario: Categoría precargada

- **WHEN** se abre la página «Editar Lavado»
- **THEN** el toggle de la categoría del lavado está encendido y el resto apagado

#### Scenario: Cambiar de categoría

- **WHEN** se enciende el toggle de otra categoría
- **THEN** el toggle anterior se apaga y sólo queda encendido el nuevo

### Requirement: Detalles del lavado editable

La página SHALL ofrecer el campo `Detalles` precargado con `detallesLavado` del lavado y SHALL
guardar su valor en `detallesLavado`.

#### Scenario: Editar detalles

- **WHEN** se modifica el texto de `Detalles`
- **THEN** el nuevo texto se conserva y se envía en `detallesLavado`

### Requirement: Estado del lavado editable

La página SHALL ofrecer un combobox con todas las filas de `EstadoLavado` y SHALL mostrar
seleccionado el estado actual del lavado; el código elegido SHALL enviarse en `estado`.

#### Scenario: Estado precargado

- **WHEN** se abre la página «Editar Lavado»
- **THEN** el combobox muestra seleccionado el estado actual del lavado

#### Scenario: Cambiar estado

- **WHEN** se elige otra opción del combobox de estado
- **THEN** el código de ese estado se envía en `estado`

### Requirement: Registrar la edición

Al presionar `Registrar`, la página SHALL actualizar el lavado (`PUT /api/lavados/:id`) con la
categoría, el estado, la primera utilería tildada y los detalles, SHALL mostrar el popup
`Lavado editado exitosamente` y, al aceptarlo, SHALL volver a la página «Lavados».

#### Scenario: Registrar cambios

- **WHEN** se presiona `Registrar` y la actualización se completa
- **THEN** se muestran el popup `Lavado editado exitosamente` y, al aceptarlo, la aplicación vuelve a la página «Lavados»

#### Scenario: Sin utilería tildada

- **WHEN** se presiona `Registrar` sin ninguna utilería tildada
- **THEN** la aplicación no guarda los cambios y muestra un aviso de que se seleccione al menos una utilería

#### Scenario: Error al guardar

- **WHEN** la actualización del lavado falla
- **THEN** la aplicación permanece en la página «Editar Lavado» y no muestra el popup de éxito

### Requirement: Cancelar la edición

El botón `Cancelar` SHALL volver a la página «Lavados» sin guardar cambios en el lavado.

#### Scenario: Cancelar

- **WHEN** se presiona `Cancelar`
- **THEN** la aplicación vuelve a la página «Lavados» y el lavado queda sin cambios

### Requirement: Verificación de sesión en Editar Lavado

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la página de
inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página «Editar Lavado» sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
