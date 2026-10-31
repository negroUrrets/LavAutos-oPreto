# Spec Delta

## Purpose

Pantalla de consulta con un registro de lavados entregados por rango de fechas y un registro de
clientes que no vuelven desde una fecha, con detalle del lavado en ventana y del cliente en su
página de información.

## ADDED Requirements

### Requirement: Página Dashboard

La aplicación SHALL mostrar la página «Dashboard» en `/dashboard` con el encabezado de usuario,
la etiqueta `DASHBOARD`, el panel de botones, los dos registros y el botón `← Volver`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página «Dashboard» con una sesión válida
- **THEN** se muestran el encabezado, la etiqueta, el panel de botones, los dos registros y el botón de volver

#### Scenario: Etiqueta de pantalla

- **WHEN** se muestra la página «Dashboard»
- **THEN** la etiqueta `DASHBOARD` se ve sin comportarse como botón

### Requirement: Botones de registro

El panel SHALL mostrar `REGISTRO LAVADOS` y `REGISTRO CLIENTES` con fondo `#eed8d8`, que pasa a
`#7eb93c` con el puntero sobre el botón y queda así en el botón seleccionado.

#### Scenario: Resaltar al pasar el mouse

- **WHEN** el puntero se posiciona sobre un botón del panel
- **THEN** el botón se muestra en `#7eb93c`

#### Scenario: Seleccionar un botón

- **WHEN** se hace clic en un botón del panel
- **THEN** ese botón queda en `#7eb93c` y el otro vuelve a su color gris

### Requirement: Registros deshabilitados

Al entrar, ambos registros SHALL mostrarse deshabilitados con todos sus componentes en
`#8f8a8a`; al seleccionar un botón SHALL habilitarse su registro y deshabilitarse el otro.

#### Scenario: Estado inicial

- **WHEN** se abre la página «Dashboard»
- **THEN** los dos registros se ven deshabilitados y en gris `#8f8a8a`

#### Scenario: Cambiar de registro

- **WHEN** se selecciona `REGISTRO CLIENTES` después de `REGISTRO LAVADOS`
- **THEN** el registro de clientes se habilita y el de lavados se deshabilita

### Requirement: Filtro de lavados por fechas

El registro de lavados SHALL ofrecer los calendarios `Desde...` y `Hasta...`, con fecha máxima
el día actual y `Hasta` no anterior a `Desde`; al elegir ambos SHALL consultar los lavados
`Entregado` entregados en ese rango.

#### Scenario: Calendarios limitados

- **WHEN** se abre el calendario `Desde...` o `Hasta...`
- **THEN** no se pueden elegir fechas posteriores al día actual y `Hasta` no permite fechas anteriores a `Desde`

#### Scenario: Consulta al elegir ambas fechas

- **WHEN** se eligen `Desde...` y `Hasta...`
- **THEN** el registro muestra solo los lavados en estado `Entregado` entregados en ese rango de fechas

### Requirement: Resultados de lavados

El registro de lavados SHALL mostrar una fila por lavado con `N° Lavado`, `Categoria` y
`Patente` en modo solo lectura y un botón `+info`.

#### Scenario: Filas de lavados

- **WHEN** la consulta devuelve lavados
- **THEN** se ve una fila por lavado con su número, categoría y patente, y su botón `+info`

#### Scenario: Sin lavados

- **WHEN** la consulta no devuelve lavados
- **THEN** el registro no muestra filas

### Requirement: Ventana de información del lavado

El botón `+info` de un lavado SHALL abrir una ventana con la patente, la categoría, el modelo,
la marca y los datos del cliente, con `Aceptar` para cerrarla y volver al Dashboard con los
mismos resultados.

#### Scenario: Abrir la ventana

- **WHEN** se hace clic en `+info` de un lavado
- **THEN** se abre una ventana con los datos del lavado, del vehículo y del cliente

#### Scenario: Aceptar

- **WHEN** se hace clic en `Aceptar` de la ventana de información
- **THEN** la ventana se cierra y el registro conserva los mismos resultados

### Requirement: Filtro de clientes

El registro de clientes SHALL ofrecer el calendario `Seleccione...` con fecha máxima el día
actual y, al elegir una fecha, SHALL consultar los clientes activos sin lavados posteriores a
esa fecha.

#### Scenario: Calendario limitado

- **WHEN** se abre el calendario `Seleccione...`
- **THEN** no se pueden elegir fechas posteriores al día actual

#### Scenario: Consulta al elegir la fecha

- **WHEN** se elige una fecha en `Seleccione...`
- **THEN** el registro muestra solo los clientes activos que no tienen lavados posteriores a esa fecha

### Requirement: Resultados de clientes

El registro de clientes SHALL mostrar una fila por cliente con `Nombre`, `Apellido` y `Celular`
en modo solo lectura y un botón `+info`.

#### Scenario: Filas de clientes

- **WHEN** la consulta devuelve clientes
- **THEN** se ve una fila por cliente con su nombre, apellido y celular, y su botón `+info`

#### Scenario: Sin clientes

- **WHEN** la consulta no devuelve clientes
- **THEN** el registro no muestra filas

### Requirement: Información del cliente

El botón `+info` de un cliente SHALL abrir la página de información del cliente y, al presionar
`Volver` en esa página, la aplicación SHALL regresar al Dashboard con la búsqueda y los
resultados previos.

#### Scenario: Abrir la información

- **WHEN** se hace clic en `+info` de un cliente
- **THEN** la aplicación abre la página de información de ese cliente

#### Scenario: Volver con los mismos resultados

- **WHEN** se presiona `Volver` en la página de información abierta desde el Dashboard
- **THEN** la aplicación regresa al Dashboard mostrando la misma búsqueda y sus resultados

### Requirement: Volver al inicio desde Dashboard

El botón `← Volver` SHALL navegar a la página de inicio.

#### Scenario: Volver

- **WHEN** se hace clic en `← Volver`
- **THEN** la aplicación navega a `/home`

### Requirement: Verificación de sesión en Dashboard

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la página de
inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página «Dashboard» sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
