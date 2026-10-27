# Spec Delta

## ADDED Requirements

### Requirement: Popup de eliminación de cliente

El botón `Eliminar` de la card del cliente SHALL abrir un popup de confirmación con el
aviso `¿ Desea eliminar permanentemente el <nombre> seleccionado ?` (con el nombre del
cliente) y los botones verde `ACEPTAR` y rojo `CANCELAR`.

#### Scenario: Abrir el popup

- **WHEN** se hace clic en `Eliminar` de la card del cliente
- **THEN** se abre el popup con el nombre del cliente y los botones `ACEPTAR` y `CANCELAR`

#### Scenario: Cancelar

- **WHEN** se hace clic en `CANCELAR`
- **THEN** el popup se cierra y se permanece en la página de información del cliente

### Requirement: Confirmar la eliminación

Al presionar `ACEPTAR`, la página SHALL solicitar la baja del cliente
(`DELETE /api/clientes/:id`) y, al completarse, SHALL redirigir a la página de Clientes.

#### Scenario: Confirmar

- **WHEN** se hace clic en `ACEPTAR`
- **THEN** se solicita la baja del cliente y la aplicación redirige a la página de Clientes
