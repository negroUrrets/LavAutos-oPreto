# Spec Delta

## Purpose

Página «+infoClientes» del frontend que muestra los datos de un cliente y sus
vehículos en cards, con un efecto de hover entre cards y un botón para volver.

## ADDED Requirements

### Requirement: Página de información del cliente

La aplicación SHALL mostrar una página en `/clientes/:id/info` que replica el
prototipo: encabezado con el ícono del auto y `LavAutos oPreto`, una card con los
datos del cliente, una card por cada vehículo y el botón `Volver`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página de información de un cliente con una sesión válida
- **THEN** se muestra el encabezado, la card del cliente, las cards de sus vehículos y el botón `Volver`

### Requirement: Card del cliente

La página SHALL mostrar una card con los datos del cliente: avatar y los valores de
`DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO` y `e-m@il`, junto con los botones
`+VEHICULO`, `Editar` y `Eliminar`, que por ahora no ejecutan ninguna acción.

#### Scenario: Datos del cliente visibles

- **WHEN** se muestra la página
- **THEN** la card del cliente muestra `DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO` y `e-m@il`

#### Scenario: Botones sin acción

- **WHEN** se hace clic en `+VEHICULO`, `Editar` o `Eliminar` de la card del cliente
- **THEN** no ocurre ninguna acción

### Requirement: Card por vehículo

La página SHALL mostrar una card por cada vehículo del cliente con `Vehiculo`
(categoría), `Marca`, `Modelo` y `PATENTE`, y los botones `Editar`, `Eliminar` y
`LAVAR`, que por ahora no ejecutan ninguna acción.

#### Scenario: Vehículos del cliente

- **WHEN** el cliente tiene vehículos registrados
- **THEN** se muestra una card por vehículo con su categoría, marca, modelo y patente

#### Scenario: Solo vehículos activos

- **WHEN** el cliente tiene vehículos activos e inactivos
- **THEN** solo se muestran las cards de los vehículos activos

#### Scenario: Botones sin acción

- **WHEN** se hace clic en `Editar`, `Eliminar` o `LAVAR` de una card de vehículo
- **THEN** no ocurre ninguna acción

### Requirement: Efecto de hover entre cards

Al pasar el mouse sobre una card, esa card SHALL moverse levemente hacia adelante y
las demás cards hacia atrás.

#### Scenario: Card señalada

- **WHEN** el puntero se posiciona sobre una card
- **THEN** esa card se adelanta y las demás se retrasan levemente

### Requirement: Botón Volver

La página SHALL mostrar un botón verde `Volver` que navega a la página de Clientes.

#### Scenario: Volver a Clientes

- **WHEN** se hace clic en `Volver`
- **THEN** la aplicación navega a la página de Clientes

### Requirement: Verificación de sesión en la página de información

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la
página de inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página de información sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
