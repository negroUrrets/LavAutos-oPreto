# Spec Delta

## ADDED Requirements

### Requirement: Aviso de vehículo en estado de lavado en +info Vehiculo

Cuando la edición o la eliminación de un cliente o de un vehículo se rechaza por un lavado en
estado `En Espera`, `Lavando` o `Terminado`, la página SHALL mostrar el popup
`Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado` con el botón `Aceptar` y
SHALL permanecer en la página sin navegar.

#### Scenario: Aviso al editar

- **WHEN** se intenta editar un cliente o el vehículo con un lavado activo
- **THEN** se muestra el popup con el aviso y la aplicación permanece en la página

#### Scenario: Aviso al eliminar

- **WHEN** se intenta eliminar un cliente o el vehículo con un lavado activo
- **THEN** se muestra el popup con el aviso y no se abre la confirmación de eliminación

#### Scenario: Rechazo al confirmar la baja

- **WHEN** la baja confirmada recibe `409` del backend por un lavado activo
- **THEN** se muestra el popup con el aviso y la aplicación no navega

## MODIFIED Requirements

### Requirement: Acciones de la página +info Vehiculo

La página SHALL ofrecer las mismas acciones que la información del cliente: en la card del
cliente `+ VEHICULO`, `Editar` y `Eliminar`; en la card del vehículo `LAVAR`, `Editar` y
`Eliminar`, con las mismas funcionalidades y popups ya desarrollados. Las acciones `Editar` y
`Eliminar` SHALL mostrar el aviso de vehículo en estado de lavado y no ejecutarse cuando el
vehículo o alguno de los vehículos del cliente tenga un lavado en estado `En Espera`,
`Lavando` o `Terminado`.

#### Scenario: Acciones disponibles

- **WHEN** se muestra la página «+info Vehiculo»
- **THEN** la card del cliente muestra `+ VEHICULO`, `Editar` y `Eliminar`, y la card del vehículo muestra `LAVAR`, `Editar` y `Eliminar`

#### Scenario: Editar el vehículo

- **WHEN** se hace clic en `Editar` de la card del vehículo sin lavados activos
- **THEN** la aplicación navega a la página de edición de ese vehículo

#### Scenario: Eliminar el vehículo

- **WHEN** se hace clic en `Eliminar` de la card del vehículo sin lavados activos
- **THEN** se abre el popup de confirmación de eliminación del vehículo

#### Scenario: Editar bloqueado por lavado

- **WHEN** se hace clic en `Editar` con un lavado activo en el vehículo o en otro vehículo del cliente
- **THEN** se muestra el aviso de vehículo en estado de lavado y no se navega

#### Scenario: Eliminar bloqueado por lavado

- **WHEN** se hace clic en `Eliminar` con un lavado activo en el vehículo o en otro vehículo del cliente
- **THEN** se muestra el aviso de vehículo en estado de lavado y no se abre la confirmación
