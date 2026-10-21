# Spec Delta

## ADDED Requirements

### Requirement: Navegación del botón Editar

El botón `Editar` de la card del cliente en la página de información SHALL navegar a
la página «Editar Cliente» (`/clientes/:id/editar`).

#### Scenario: Acceso a Editar Cliente

- **WHEN** se hace clic en el botón `Editar` de la card del cliente
- **THEN** la aplicación navega a la página «Editar Cliente» de ese cliente

### Requirement: Datos actualizados al volver de la edición

Al mostrarse, la página de información SHALL obtener los datos del cliente, de modo que
al volver tras una edición se vean los datos actualizados del cliente junto con sus
vehículos.

#### Scenario: Volver tras editar

- **WHEN** se vuelve a la página de información después de editar y guardar un cliente
- **THEN** se muestran los datos actualizados del cliente y sus vehículos
