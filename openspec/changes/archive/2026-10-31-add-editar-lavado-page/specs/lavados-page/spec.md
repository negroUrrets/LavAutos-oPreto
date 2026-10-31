# Spec Delta

## MODIFIED Requirements

### Requirement: Contenido de cada lavado

Cada lavado SHALL mostrar `N° Lavado`, la hora de creación y la patente del vehículo en modo
solo lectura, junto con los botones `+info` y `Editar`. El botón `Editar` SHALL navegar a la
página «Editar Lavado» del lavado seleccionado.

#### Scenario: Datos del lavado

- **WHEN** se muestra un lavado en una sección
- **THEN** se ven su número, su hora de creación y la patente del vehículo, sin poder editarlos

#### Scenario: Editar sin acción

- **WHEN** se hace clic en `Editar` de un lavado
- **THEN** la aplicación navega a la página «Editar Lavado» de ese lavado, sin editar los datos en la propia lista
