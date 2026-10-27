# Spec Delta

## MODIFIED Requirements

### Requirement: Enlace + info del vehículo

Cada fila de resultados SHALL mostrar un botón verde `+ info` que navega a la página
«+info Vehiculo» del vehículo seleccionado.

#### Scenario: Abrir +info Vehiculo

- **WHEN** se hace clic en `+ info` de una fila
- **THEN** la aplicación navega a `/vehiculos/:vehiculoId/info` para ese vehículo

## REMOVED Requirements

### Requirement: Botón + info sin acción

**Reason**: Describía el botón `+ info` como sin acción, pero el botón ya navega al
detalle del vehículo.

**Migration**: Usar «Enlace + info del vehículo», que describe el botón y su navegación.
