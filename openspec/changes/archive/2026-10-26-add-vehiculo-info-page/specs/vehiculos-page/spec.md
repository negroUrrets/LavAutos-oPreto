# Spec Delta

## ADDED Requirements

### Requirement: Enlace + info del vehículo

El botón `+ info` de cada fila de resultados SHALL navegar a la página «+info Vehiculo»
del vehículo seleccionado.

#### Scenario: Abrir +info Vehiculo

- **WHEN** se hace clic en `+ info` de una fila
- **THEN** la aplicación navega a `/vehiculos/:vehiculoId/info` para ese vehículo

### Requirement: Botón + Vehiculo

La página SHALL mostrar un botón verde `+ Vehiculo` en la esquina superior derecha del
panel, en la misma fila que el pill de la sección, y SHALL navegar a la página de
Clientes.

#### Scenario: Abrir Clientes

- **WHEN** se hace clic en `+ Vehiculo`
- **THEN** la aplicación navega a la página de Clientes
