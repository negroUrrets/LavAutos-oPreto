# Spec Delta

## ADDED Requirements

### Requirement: Enlace a Editar Vehiculo

El botón `Editar` de la card de vehículo SHALL navegar a la página «Editar Vehiculo» con
el vehículo seleccionado.

#### Scenario: Abrir Editar Vehiculo

- **WHEN** se hace clic en `Editar` de una card de vehículo
- **THEN** la aplicación navega a `/clientes/:id/vehiculos/:vehiculoId/editar` para ese vehículo
