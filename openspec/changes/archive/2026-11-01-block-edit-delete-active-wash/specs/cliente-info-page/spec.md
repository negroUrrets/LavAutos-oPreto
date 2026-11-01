# Spec Delta

## ADDED Requirements

### Requirement: Aviso de vehículo en estado de lavado

Cuando la edición o la eliminación de un cliente o de un vehículo se rechaza por un lavado en
estado `En Espera`, `Lavando` o `Terminado`, la página SHALL mostrar el popup
`Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado` con el botón `Aceptar` y
SHALL permanecer en la página sin navegar.

#### Scenario: Aviso al editar

- **WHEN** se intenta editar un cliente o un vehículo con un lavado activo
- **THEN** se muestra el popup con el aviso y la aplicación permanece en la página de información

#### Scenario: Aviso al eliminar

- **WHEN** se intenta eliminar un cliente o un vehículo con un lavado activo
- **THEN** se muestra el popup con el aviso y no se abre la confirmación de eliminación

#### Scenario: Rechazo al confirmar la baja

- **WHEN** la baja confirmada recibe `409` del backend por un lavado activo
- **THEN** se muestra el popup con el aviso y la aplicación no navega

## MODIFIED Requirements

### Requirement: Popup de eliminación de cliente

El botón `Eliminar` de la card del cliente SHALL abrir un popup de confirmación con el
aviso `¿ Desea eliminar permanentemente el <nombre> seleccionado ?` (con el nombre del
cliente) y los botones verde `ACEPTAR` y rojo `CANCELAR`, salvo que el cliente tenga un
vehículo con un lavado en estado `En Espera`, `Lavando` o `Terminado`, en cuyo caso SHALL
mostrar el aviso de vehículo en estado de lavado sin abrir la confirmación.

#### Scenario: Abrir el popup

- **WHEN** se hace clic en `Eliminar` de la card del cliente sin lavados activos
- **THEN** se abre el popup con el nombre del cliente y los botones `ACEPTAR` y `CANCELAR`

#### Scenario: Cancelar

- **WHEN** se hace clic en `CANCELAR`
- **THEN** el popup se cierra y se permanece en la página de información del cliente

#### Scenario: Cliente con vehículo en lavado

- **WHEN** se hace clic en `Eliminar` de un cliente que tiene un vehículo con un lavado activo
- **THEN** se muestra el aviso de vehículo en estado de lavado y no se abre la confirmación

### Requirement: Navegación del botón Editar

El botón `Editar` de la card del cliente en la página de información SHALL navegar a
la página «Editar Cliente» (`/clientes/:id/editar`), salvo que el cliente tenga un vehículo
con un lavado en estado `En Espera`, `Lavando` o `Terminado`, en cuyo caso SHALL mostrar el
aviso de vehículo en estado de lavado sin navegar.

#### Scenario: Acceso a Editar Cliente

- **WHEN** se hace clic en el botón `Editar` de la card del cliente sin lavados activos
- **THEN** la aplicación navega a la página «Editar Cliente» de ese cliente

#### Scenario: Cliente con vehículo en lavado

- **WHEN** se hace clic en `Editar` de un cliente que tiene un vehículo con un lavado activo
- **THEN** se muestra el aviso de vehículo en estado de lavado y no se navega

### Requirement: Enlace a Editar Vehiculo

El botón `Editar` de la card de vehículo SHALL navegar a la página «Editar Vehiculo» con
el vehículo seleccionado, salvo que el vehículo tenga un lavado en estado `En Espera`,
`Lavando` o `Terminado`, en cuyo caso SHALL mostrar el aviso de vehículo en estado de lavado
sin navegar.

#### Scenario: Abrir Editar Vehiculo

- **WHEN** se hace clic en `Editar` de una card de vehículo sin lavados activos
- **THEN** la aplicación navega a `/clientes/:id/vehiculos/:vehiculoId/editar` para ese vehículo

#### Scenario: Vehículo en lavado

- **WHEN** se hace clic en `Editar` de un vehículo con un lavado activo
- **THEN** se muestra el aviso de vehículo en estado de lavado y no se navega

### Requirement: Popup de eliminación de vehículo

El botón `Eliminar` de la card de vehículo SHALL abrir `ConfirmPopup` con el aviso
`¿ Desea eliminar el vehiculo "<patente>" ?` y los botones `ACEPTAR` y `CANCELAR`, salvo que
el vehículo tenga un lavado en estado `En Espera`, `Lavando` o `Terminado`, en cuyo caso SHALL
mostrar el aviso de vehículo en estado de lavado sin abrir la confirmación.

#### Scenario: Abrir el popup

- **WHEN** se hace clic en `Eliminar` de una card de vehículo sin lavados activos
- **THEN** se abre el popup con la patente del vehículo y los botones `ACEPTAR` y `CANCELAR`

#### Scenario: Cancelar

- **WHEN** se hace clic en `CANCELAR`
- **THEN** el popup se cierra y se vuelve a la página de información del cliente sin modificar el vehículo

#### Scenario: Vehículo en lavado

- **WHEN** se hace clic en `Eliminar` de un vehículo con un lavado activo
- **THEN** se muestra el aviso de vehículo en estado de lavado y no se abre la confirmación
