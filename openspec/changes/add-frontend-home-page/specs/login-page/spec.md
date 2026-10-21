# Spec Delta

## MODIFIED Requirements

### Requirement: Inicio de sesión exitoso

Cuando el backend responde con éxito, la página SHALL mostrar una ventana emergente
con el texto `!Bienvenid@!`.

#### Scenario: Login correcto

- **WHEN** el backend responde `200` al login
- **THEN** se muestra un popup con el mensaje `!Bienvenid@!`

## ADDED Requirements

### Requirement: Navegación al home tras el login

Al cerrar el popup de éxito, la página SHALL navegar a la pantalla home.

#### Scenario: Cierre del popup de éxito

- **WHEN** el usuario cierra el popup de éxito mostrado tras un login correcto
- **THEN** la aplicación navega a la pantalla home
