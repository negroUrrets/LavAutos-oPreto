# Spec Delta

## MODIFIED Requirements

### Requirement: Botón Volver

La página SHALL mostrar un botón verde `Volver` que navega a la página de Clientes o, si la
página se abrió desde otra pantalla, a esa pantalla de origen.

#### Scenario: Volver a Clientes

- **WHEN** se hace clic en `Volver`
- **THEN** la aplicación navega a la página de Clientes

#### Scenario: Volver al origen

- **WHEN** se hace clic en `Volver` en una página de información abierta desde el Dashboard
- **THEN** la aplicación regresa a la pantalla de origen con su estado previo
