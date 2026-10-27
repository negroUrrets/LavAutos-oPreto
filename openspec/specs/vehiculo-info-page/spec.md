# vehiculo-info-page Specification

## Purpose

Página de detalle que muestra un vehículo y los datos del cliente al que pertenece, con
las mismas acciones y el mismo layout que la información del cliente.

## Requirements

### Requirement: Página +info Vehiculo

La aplicación SHALL mostrar una página «+info Vehiculo» en
`/vehiculos/:vehiculoId/info` con el mismo layout que la información del cliente: la card
del cliente, la card del vehículo encontrado y el botón `← Volver`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página «+info Vehiculo» con una sesión válida
- **THEN** se muestra la card del cliente, la card del vehículo seleccionado y el botón `← Volver`

### Requirement: Datos del vehículo y su cliente

La página SHALL mostrar el vehículo encontrado (`VEHICULO`, `MARCA`, `MODELO`,
`PATENTE`) y los datos de su cliente (`DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO`,
`e-m@il`).

#### Scenario: Vehículo con cliente

- **WHEN** se abre la página de un vehículo existente
- **THEN** se muestran los datos del vehículo y los datos del cliente al que pertenece

### Requirement: Sólo el vehículo encontrado

La página SHALL mostrar únicamente el vehículo seleccionado, aunque el cliente tenga más
vehículos.

#### Scenario: Cliente con varios vehículos

- **WHEN** el cliente del vehículo seleccionado tiene otros vehículos
- **THEN** la página muestra sólo la card del vehículo encontrado

### Requirement: Acciones de la página +info Vehiculo

La página SHALL ofrecer las mismas acciones que la información del cliente: en la card
del cliente `+ VEHICULO`, `Editar` y `Eliminar`; en la card del vehículo `LAVAR`,
`Editar` y `Eliminar`, con las mismas funcionalidades y popups ya desarrollados.

#### Scenario: Acciones disponibles

- **WHEN** se muestra la página «+info Vehiculo»
- **THEN** la card del cliente muestra `+ VEHICULO`, `Editar` y `Eliminar`, y la card del vehículo muestra `LAVAR`, `Editar` y `Eliminar`

#### Scenario: Editar el vehículo

- **WHEN** se hace clic en `Editar` de la card del vehículo
- **THEN** la aplicación navega a la página de edición de ese vehículo

#### Scenario: Eliminar el vehículo

- **WHEN** se hace clic en `Eliminar` de la card del vehículo
- **THEN** se abre el popup de confirmación de eliminación del vehículo

### Requirement: Volver desde +info Vehiculo

El botón `← Volver` SHALL navegar a la página de Vehiculos.

#### Scenario: Volver

- **WHEN** se hace clic en `← Volver`
- **THEN** la aplicación navega a `/vehiculos`

### Requirement: Verificación de sesión en +info Vehiculo

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la página
de inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página «+info Vehiculo» sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
