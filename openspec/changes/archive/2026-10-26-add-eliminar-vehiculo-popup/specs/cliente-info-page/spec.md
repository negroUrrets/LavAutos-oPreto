# Spec Delta

## ADDED Requirements

### Requirement: Popup de eliminación de vehículo

El botón `Eliminar` de la card de vehículo SHALL abrir `ConfirmPopup` con el aviso
`¿ Desea eliminar el vehiculo "<patente>" ?` y los botones `ACEPTAR` y `CANCELAR`.

#### Scenario: Abrir el popup

- **WHEN** se hace clic en `Eliminar` de una card de vehículo
- **THEN** se abre el popup con la patente del vehículo y los botones `ACEPTAR` y `CANCELAR`

#### Scenario: Cancelar

- **WHEN** se hace clic en `CANCELAR`
- **THEN** el popup se cierra y se vuelve a la página de información del cliente sin modificar el vehículo

### Requirement: Confirmar la eliminación de vehículo

Al presionar `ACEPTAR`, la página SHALL solicitar la baja del vehículo
(`DELETE /api/vehiculos/:id`) y, al procesarse, SHALL volver a la página de información
del cliente mostrando la lista de vehículos actualizada.

#### Scenario: Confirmar

- **WHEN** se hace clic en `ACEPTAR`
- **THEN** se solicita la baja del vehículo y la página muestra la lista de vehículos sin el vehículo eliminado
