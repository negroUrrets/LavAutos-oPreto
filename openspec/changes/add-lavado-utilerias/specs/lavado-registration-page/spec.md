# Spec Delta

## MODIFIED Requirements

### Requirement: Utilerías del lavado

La página SHALL mostrar un checkbox por cada fila de `Utileria` y SHALL permitir seleccionar
una o varias utilerías para el lavado. Tildar o destildar SHALL modificar solo la selección de
este lavado y NO SHALL actualizar `estadoUtileria` del catálogo ni llamar a
`PUT /api/utilerias/:id`.

#### Scenario: Tildar una utilería

- **WHEN** se tilda el checkbox de una utilería
- **THEN** la utilería queda seleccionada para este lavado y su `estadoUtileria` en el catálogo no cambia

#### Scenario: Destildar una utilería

- **WHEN** se destilda el checkbox de una utilería
- **THEN** la utilería deja de estar seleccionada para este lavado y su `estadoUtileria` en el catálogo no cambia

#### Scenario: Varias utilerías

- **WHEN** se tildan varias utilerías
- **THEN** todas quedan seleccionadas para el mismo lavado sin modificar el catálogo

### Requirement: Registrar el lavado

Al presionar `Registrar Lavado`, la página SHALL mostrar un popup de confirmación indicando que
se registrará el lavado del vehículo con su patente. Al aceptar SHALL crear el lavado
(`POST /api/lavados`) con el vehículo, la categoría, el estado, todas las utilerías tildadas
(`utilerias`), los detalles y el `login` de la sesión, y SHALL volver a la información del
cliente. Al cancelar SHALL cerrar el popup y restablecer el formulario a su estado original,
sin registrar.

#### Scenario: Confirmar el registro

- **WHEN** se presiona `Registrar Lavado` y luego `ACEPTAR` en el popup
- **THEN** se crea el lavado del vehículo con todas las utilerías tildadas y la aplicación vuelve a la información del cliente

#### Scenario: Cancelar en el popup

- **WHEN** se presiona `CANCELAR` en el popup de confirmación
- **THEN** no se registra el lavado y el formulario vuelve a su estado original en la misma página

#### Scenario: Sin utilerías tildadas

- **WHEN** se presiona `Registrar Lavado` sin ninguna utilería tildada
- **THEN** no se abre el popup de confirmación, no se registra el lavado y se muestra un aviso para seleccionar al menos una utilería
