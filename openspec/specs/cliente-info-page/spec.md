# cliente-info-page Specification

## Purpose

Página «+infoClientes» del frontend que muestra los datos de un cliente y sus
vehículos en cards, con un efecto de hover entre cards y un botón para volver.

## Requirements

### Requirement: Página de información del cliente

La aplicación SHALL mostrar una página en `/clientes/:id/info` que replica el
prototipo: encabezado con el ícono del auto y `LavAutos oPreto`, una card con los
datos del cliente, una card por cada vehículo y el botón `Volver`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página de información de un cliente con una sesión válida
- **THEN** se muestra el encabezado, la card del cliente, las cards de sus vehículos y el botón `Volver`

### Requirement: Contenido de la card del cliente

La página SHALL mostrar una card con los datos del cliente: avatar y los valores de
`DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO` y `e-m@il`, con los botones `+VEHICULO`,
`Editar` y `Eliminar`. Las acciones de esos botones se detallan en los requisitos de
navegación y de eliminación.

#### Scenario: Datos del cliente visibles

- **WHEN** se muestra la página
- **THEN** la card del cliente muestra `DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO` y `e-m@il`

#### Scenario: Botones de la card del cliente

- **WHEN** se muestra la card del cliente
- **THEN** se ven los botones `+VEHICULO`, `Editar` y `Eliminar`

### Requirement: Contenido de la card del vehículo

La página SHALL mostrar una card por cada vehículo del cliente con `Vehiculo`
(categoría), `Marca`, `Modelo` y `PATENTE`, con los botones `Editar`, `Eliminar` y
`LAVAR`. Las acciones de esos botones se detallan en los requisitos de navegación y de
eliminación.

#### Scenario: Vehículos del cliente

- **WHEN** el cliente tiene vehículos registrados
- **THEN** se muestra una card por vehículo con su categoría, marca, modelo y patente

#### Scenario: Solo vehículos activos

- **WHEN** el cliente tiene vehículos activos e inactivos
- **THEN** solo se muestran las cards de los vehículos activos

#### Scenario: Botones de la card del vehículo

- **WHEN** se muestra la card de un vehículo
- **THEN** se ven los botones `Editar`, `Eliminar` y `LAVAR`

### Requirement: Efecto de hover entre cards

Al pasar el mouse sobre una card, esa card SHALL moverse levemente hacia adelante y
las demás cards hacia atrás.

#### Scenario: Card señalada

- **WHEN** el puntero se posiciona sobre una card
- **THEN** esa card se adelanta y las demás se retrasan levemente

### Requirement: Botón Volver

La página SHALL mostrar un botón verde `Volver` que navega a la página de Clientes o, si la
página se abrió desde otra pantalla, a esa pantalla de origen.

#### Scenario: Volver a Clientes

- **WHEN** se hace clic en `Volver`
- **THEN** la aplicación navega a la página de Clientes

#### Scenario: Volver al origen

- **WHEN** se hace clic en `Volver` en una página de información abierta desde el Dashboard
- **THEN** la aplicación regresa a la pantalla de origen con su estado previo

### Requirement: Verificación de sesión en la página de información

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la
página de inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página de información sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión

### Requirement: Popup de eliminación de cliente

El botón `Eliminar` de la card del cliente SHALL abrir un popup de confirmación con el
aviso `¿ Desea eliminar permanentemente el <nombre> seleccionado ?` (con el nombre del
cliente) y los botones verde `ACEPTAR` y rojo `CANCELAR`, salvo que el cliente tenga un
vehículo con un lavado en estado `En Espera`, `Lavando` o `Terminado`, en cuyo caso SHALL
mostrar el aviso de vehículo en estado de lavado sin abrir la confirmación.

#### Scenario: Abrir el popup

- **WHEN** se hace clic en `Eliminar` de la card del cliente sin lavados activos
- **THEN** se abre el popup con el nombre del cliente y los botones `ACEPTAR` y `CANCELAR`

#### Scenario: Cancelar

- **WHEN** se hace clic en `CANCELAR`
- **THEN** el popup se cierra y se permanece en la página de información del cliente

#### Scenario: Cliente con vehículo en lavado

- **WHEN** se hace clic en `Eliminar` de un cliente que tiene un vehículo con un lavado activo
- **THEN** se muestra el aviso de vehículo en estado de lavado y no se abre la confirmación

### Requirement: Confirmar la eliminación

Al presionar `ACEPTAR`, la página SHALL solicitar la baja del cliente
(`DELETE /api/clientes/:id`) y, al completarse, SHALL redirigir a la página de Clientes.

#### Scenario: Confirmar

- **WHEN** se hace clic en `ACEPTAR`
- **THEN** se solicita la baja del cliente y la aplicación redirige a la página de Clientes

### Requirement: Navegación del botón Editar

El botón `Editar` de la card del cliente en la página de información SHALL navegar a
la página «Editar Cliente» (`/clientes/:id/editar`), salvo que el cliente tenga un vehículo
con un lavado en estado `En Espera`, `Lavando` o `Terminado`, en cuyo caso SHALL mostrar el
aviso de vehículo en estado de lavado sin navegar.

#### Scenario: Acceso a Editar Cliente

- **WHEN** se hace clic en el botón `Editar` de la card del cliente sin lavados activos
- **THEN** la aplicación navega a la página «Editar Cliente» de ese cliente

#### Scenario: Cliente con vehículo en lavado

- **WHEN** se hace clic en `Editar` de un cliente que tiene un vehículo con un lavado activo
- **THEN** se muestra el aviso de vehículo en estado de lavado y no se navega

### Requirement: Datos actualizados al volver de la edición

Al mostrarse, la página de información SHALL obtener los datos del cliente, de modo que
al volver tras una edición se vean los datos actualizados del cliente junto con sus
vehículos.

#### Scenario: Volver tras editar

- **WHEN** se vuelve a la página de información después de editar y guardar un cliente
- **THEN** se muestran los datos actualizados del cliente y sus vehículos

### Requirement: Enlace a Agregar Vehiculo

El botón `+ VEHICULO` de la card del cliente SHALL navegar a la página «Agregar
Vehiculo» con el cliente seleccionado.

#### Scenario: Abrir Agregar Vehiculo

- **WHEN** se hace clic en `+ VEHICULO` de la card del cliente
- **THEN** la aplicación navega a `/clientes/:id/vehiculos/nuevo` para ese cliente

### Requirement: Lista de vehículos actualizada al volver

Al volver a la página de información, la página SHALL mostrar la lista de vehículos
vigente del cliente.

#### Scenario: Vehículo recién agregado

- **WHEN** se vuelve a la página de información después de agregar un vehículo
- **THEN** la card del cliente y la lista de vehículos muestran el vehículo recién agregado

### Requirement: Enlace a Editar Vehiculo

El botón `Editar` de la card de vehículo SHALL navegar a la página «Editar Vehiculo» con
el vehículo seleccionado, salvo que el vehículo tenga un lavado en estado `En Espera`,
`Lavando` o `Terminado`, en cuyo caso SHALL mostrar el aviso de vehículo en estado de lavado
sin navegar.

#### Scenario: Abrir Editar Vehiculo

- **WHEN** se hace clic en `Editar` de una card de vehículo sin lavados activos
- **THEN** la aplicación navega a `/clientes/:id/vehiculos/:vehiculoId/editar` para ese vehículo

#### Scenario: Vehículo en lavado

- **WHEN** se hace clic en `Editar` de un vehículo con un lavado activo
- **THEN** se muestra el aviso de vehículo en estado de lavado y no se navega

### Requirement: Popup de eliminación de vehículo

El botón `Eliminar` de la card de vehículo SHALL abrir `ConfirmPopup` con el aviso
`¿ Desea eliminar el vehiculo "<patente>" ?` y los botones `ACEPTAR` y `CANCELAR`, salvo que
el vehículo tenga un lavado en estado `En Espera`, `Lavando` o `Terminado`, en cuyo caso SHALL
mostrar el aviso de vehículo en estado de lavado sin abrir la confirmación.

#### Scenario: Abrir el popup

- **WHEN** se hace clic en `Eliminar` de una card de vehículo sin lavados activos
- **THEN** se abre el popup con la patente del vehículo y los botones `ACEPTAR` y `CANCELAR`

#### Scenario: Cancelar

- **WHEN** se hace clic en `CANCELAR`
- **THEN** el popup se cierra y se vuelve a la página de información del cliente sin modificar el vehículo

#### Scenario: Vehículo en lavado

- **WHEN** se hace clic en `Eliminar` de un vehículo con un lavado activo
- **THEN** se muestra el aviso de vehículo en estado de lavado y no se abre la confirmación

### Requirement: Confirmar la eliminación de vehículo

Al presionar `ACEPTAR`, la página SHALL solicitar la baja del vehículo
(`DELETE /api/vehiculos/:id`) y, al procesarse, SHALL volver a la página de información
del cliente mostrando la lista de vehículos actualizada.

#### Scenario: Confirmar

- **WHEN** se hace clic en `ACEPTAR`
- **THEN** se solicita la baja del vehículo y la página muestra la lista de vehículos sin el vehículo eliminado

### Requirement: Botón LAVAR del vehículo

El botón `LAVAR` de la card de vehículo SHALL consultar los lavados del vehículo
(`GET /api/lavados?vehi=:id`). Si alguno está en estado «En Espera», «Lavando» o «Terminado»,
SHALL mostrar un popup de aviso y, al aceptarlo, permanecer en la información del cliente. Si
no hay ninguno en esos estados, SHALL navegar a la página «Nuevo Lavado» del vehículo.

#### Scenario: Vehículo con lavado en curso

- **WHEN** se presiona `LAVAR` y el vehículo tiene un lavado en «En Espera», «Lavando» o «Terminado»
- **THEN** se muestra un popup de aviso y, al aceptarlo, se permanece en la información del cliente sin navegar

#### Scenario: Vehículo sin lavado en curso

- **WHEN** se presiona `LAVAR` y el vehículo no tiene lavados en esos estados
- **THEN** la aplicación navega a `/clientes/:id/vehiculos/:vehiculoId/lavar`

### Requirement: Aviso de vehículo en estado de lavado

Cuando la edición o la eliminación de un cliente o de un vehículo se rechaza por un lavado en
estado `En Espera`, `Lavando` o `Terminado`, la página SHALL mostrar el popup
`Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado` con el botón `Aceptar` y
SHALL permanecer en la página sin navegar.

#### Scenario: Aviso al editar

- **WHEN** se intenta editar un cliente o un vehículo con un lavado activo
- **THEN** se muestra el popup con el aviso y la aplicación permanece en la página de información

#### Scenario: Aviso al eliminar

- **WHEN** se intenta eliminar un cliente o un vehículo con un lavado activo
- **THEN** se muestra el popup con el aviso y no se abre la confirmación de eliminación

#### Scenario: Rechazo al confirmar la baja

- **WHEN** la baja confirmada recibe `409` del backend por un lavado activo
- **THEN** se muestra el popup con el aviso y la aplicación no navega
