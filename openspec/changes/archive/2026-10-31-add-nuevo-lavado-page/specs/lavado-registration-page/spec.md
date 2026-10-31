# Spec Delta

## Purpose

Página «Nuevo Lavado» del frontend que replica el prototipo, permite elegir utilerías,
categoría, detalles y estado, y registra el lavado del vehículo seleccionado con confirmación.

## ADDED Requirements

### Requirement: Página Nuevo Lavado

La aplicación SHALL mostrar una página «Nuevo Lavado» en
`/clientes/:id/vehiculos/:vehiculoId/lavar` con el título `Nuevo Lavado` y la patente del
vehículo, el panel de utilerías y categorías, el campo `Detalles`, el combobox de estado y los
botones `Registrar Lavado` y `Cancelar`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página «Nuevo Lavado» con una sesión válida
- **THEN** se muestra el título con la patente del vehículo, los paneles del prototipo y los botones `Registrar Lavado` y `Cancelar`

### Requirement: Utilerías del lavado

La página SHALL mostrar un checkbox por cada fila de `Utileria` y, al tildarlo o destildarlo,
SHALL actualizar `estadoUtileria` de esa fila a `1` o `0` (`PUT /api/utilerias/:id`).

#### Scenario: Tildar una utilería

- **WHEN** se tilda el checkbox de una utilería
- **THEN** su fila queda con `estadoUtileria = 1`

#### Scenario: Destildar una utilería

- **WHEN** se destilda el checkbox de una utilería
- **THEN** su fila queda con `estadoUtileria = 0`

### Requirement: Categoría del lavado

La página SHALL mostrar un toggle por cada fila de `CategoriaLavado`, todos apagados al
entrar, y SHALL permitir un solo toggle encendido: al encender uno, el anterior SHALL volver a
su posición y color original.

#### Scenario: Seleccionar una categoría

- **WHEN** se enciende el toggle de una categoría
- **THEN** esa categoría queda seleccionada y el resto apagado

#### Scenario: Cambiar de categoría

- **WHEN** se enciende el toggle de otra categoría
- **THEN** el toggle anterior se apaga y sólo queda encendido el nuevo

### Requirement: Detalles del lavado

La página SHALL ofrecer un campo `Detalles` que acepta letras, números y espacios en blanco y
que se guarda en `detallesLavado`.

#### Scenario: Escribir detalles

- **WHEN** se tipea texto con letras, números y espacios en `Detalles`
- **THEN** el texto se conserva y se envía en `detallesLavado`

### Requirement: Estado del lavado

La página SHALL ofrecer un combobox con las filas de `EstadoLavado` (`descripcionEstado`) y
SHALL guardar el código elegido en `estado`.

#### Scenario: Elegir estado

- **WHEN** se elige una opción del combobox de estado
- **THEN** el código de ese estado se envía en `estado`

### Requirement: Registrar el lavado

Al presionar `Registrar Lavado`, la página SHALL mostrar un popup de confirmación indicando que
se registrará el lavado del vehículo con su patente. Al aceptar SHALL crear el lavado
(`POST /api/lavados`) con el vehículo, la categoría, el estado, la primera utilería tildada, los
detalles y el `login` de la sesión, y SHALL volver a la información del cliente. Al cancelar
SHALL cerrar el popup y restablecer el formulario a su estado original, sin registrar.

#### Scenario: Confirmar el registro

- **WHEN** se presiona `Registrar Lavado` y luego `ACEPTAR` en el popup
- **THEN** se crea el lavado del vehículo y la aplicación vuelve a la información del cliente

#### Scenario: Cancelar en el popup

- **WHEN** se presiona `CANCELAR` en el popup de confirmación
- **THEN** no se registra el lavado y el formulario vuelve a su estado original en la misma página

### Requirement: Cancelar la página

El botón `Cancelar` SHALL volver a la información del cliente sin registrar el lavado.

#### Scenario: Cancelar

- **WHEN** se presiona `Cancelar`
- **THEN** la aplicación vuelve a la información del cliente y no se registra ningún lavado

### Requirement: Verificación de sesión en Nuevo Lavado

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la página de inicio
de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página «Nuevo Lavado» sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
