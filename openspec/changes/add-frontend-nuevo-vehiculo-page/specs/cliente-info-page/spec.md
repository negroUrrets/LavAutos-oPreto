# Spec Delta

## ADDED Requirements

### Requirement: Enlace a Agregar Vehiculo

El botón `+ VEHICULO` de la card del cliente SHALL navegar a la página «Agregar
Vehiculo» con el cliente seleccionado.

#### Scenario: Abrir Agregar Vehiculo

- **WHEN** se hace clic en `+ VEHICULO` de la card del cliente
- **THEN** la aplicación navega a `/clientes/:id/vehiculos/nuevo` para ese cliente

### Requirement: Lista de vehículos actualizada al volver

Al volver a la página de información, la página SHALL mostrar la lista de vehículos
vigente del cliente.

#### Scenario: Vehículo recién agregado

- **WHEN** se vuelve a la página de información después de agregar un vehículo
- **THEN** la card del cliente y la lista de vehículos muestran el vehículo recién agregado
