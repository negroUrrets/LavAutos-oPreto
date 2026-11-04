# Spec Delta

## MODIFIED Requirements

### Requirement: Registro de cliente y vehículo

Si el `dni` no coincide con ningún cliente registrado, al presionar `Registrar` la
página SHALL enviar una única petición `POST /api/clientes` con los datos de la
persona y del vehículo, y SHALL mostrar un popup `Bienvenido <nombre>` solo si la
operación completa tuvo éxito.

#### Scenario: Registro exitoso

- **WHEN** se completa el formulario con un `dni` no registrado y se presiona `Registrar`
- **THEN** se crean el cliente y su vehículo con una sola petición `POST /api/clientes` y se muestra un popup `Bienvenido <nombre>` con el nombre del cliente nuevo

#### Scenario: Navegación tras la bienvenida

- **WHEN** se acepta el popup `Bienvenido <nombre>`
- **THEN** la aplicación navega a la página de Clientes

#### Scenario: Falla el alta conjunta

- **WHEN** el backend rechaza la petición conjunta, por ejemplo por una patente duplicada
- **THEN** la página muestra el mensaje de error del backend, NO muestra el popup `Bienvenido <nombre>` y NO envía una petición separada a `/api/vehiculos` desde esta página
