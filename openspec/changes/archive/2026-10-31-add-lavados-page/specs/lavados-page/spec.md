# Spec Delta

## Purpose

Página de seguimiento de lavados que los agrupa por estado, permite avanzar su estado y
muestra el detalle del vehículo y de su cliente en una ventana.

## ADDED Requirements

### Requirement: Página Lavados

La aplicación SHALL mostrar una página «Lavados» en `/lavados` con el botón `Nuevo Lavado`,
tres secciones (`En espera`, `Lavando`, `Terminado`) y el botón `←` de volver.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página «Lavados» con una sesión válida
- **THEN** se muestran el botón `Nuevo Lavado`, las tres secciones y el botón de volver

### Requirement: Botón Nuevo Lavado

El botón verde `Nuevo Lavado` con ícono de mano SHALL navegar a la página de Clientes. El
botón SHALL animarse horizontalmente de izquierda a derecha, de forma repetida, y la
animación SHALL detenerse mientras el puntero está sobre el botón.

#### Scenario: Abrir Clientes

- **WHEN** se hace clic en `Nuevo Lavado`
- **THEN** la aplicación navega a la página de Clientes

### Requirement: Secciones de lavados

La página SHALL mostrar tres secciones: `En espera` (borde rojo, etiqueta roja), `Lavando`
(borde amarillo oscuro, etiqueta amarilla apagada) y `Terminado` (borde verde, etiqueta
verde). Cada sección SHALL poder expandirse y contraerse con un botón a la derecha y SHALL
mostrar un ícono de burbuja con movimiento vertical de tres pasos.

#### Scenario: Expandir y contraer

- **WHEN** se hace clic en el botón de una sección
- **THEN** la sección muestra u oculta sus lavados según su estado

#### Scenario: Etiqueta e ícono por sección

- **WHEN** se muestra una sección
- **THEN** se ve su etiqueta de color (`En espera...`, `Lavando...` o `Terminado...`) y el ícono de burbuja animado

### Requirement: Contenido de cada lavado

Cada lavado SHALL mostrar `N° Lavado`, la hora de creación y la patente del vehículo en modo
solo lectura, junto con los botones `+info` y `Editar`. El botón `Editar` NO SHALL ejecutar
ninguna acción por ahora.

#### Scenario: Datos del lavado

- **WHEN** se muestra un lavado en una sección
- **THEN** se ven su número, su hora de creación y la patente del vehículo, sin poder editarlos

#### Scenario: Editar sin acción

- **WHEN** se hace clic en `Editar`
- **THEN** no ocurre ninguna acción

### Requirement: Ventana de información del lavado

El botón `+info` SHALL abrir una ventana con los datos completos del vehículo y del cliente
del lavado, con un botón `Aceptar` que SHALL cerrarla y volver a la página de Lavados.

#### Scenario: Abrir y cerrar la ventana

- **WHEN** se hace clic en `+info` de un lavado
- **THEN** se abre una ventana con los datos del vehículo y del cliente

#### Scenario: Aceptar

- **WHEN** se hace clic en `Aceptar` de la ventana de información
- **THEN** la ventana se cierra y se permanece en la página de Lavados

### Requirement: Lavar un lavado en espera

La sección `En espera` SHALL ofrecer `Lavar`, que SHALL mostrar el popup `Lavando Vehiculo`.
Al aceptarlo, el lavado SHALL pasar a `Lavando` y la página SHALL recargarse para mostrarlo en
la sección `Lavando`.

#### Scenario: Lavar un lavado en espera

- **WHEN** se presiona `Lavar` y se acepta el popup `Lavando Vehiculo`
- **THEN** el lavado pasa a `Lavando` y se muestra en la sección `Lavando`

### Requirement: Completar un lavado en curso

La sección `Lavando` SHALL ofrecer `Completado`, que SHALL mostrar el popup
`Lavado Terminado`. Al aceptarlo, el lavado SHALL pasar a `Terminado` y la página SHALL
recargarse para mostrarlo en la sección `Terminado`.

#### Scenario: Completar un lavado en curso

- **WHEN** se presiona `Completado` y se acepta el popup `Lavado Terminado`
- **THEN** el lavado pasa a `Terminado` y se muestra en la sección `Terminado`

### Requirement: Entregar un lavado terminado

La sección `Terminado` SHALL ofrecer `Entregar`, que SHALL mostrar el popup
`Vehiculo Entregado`. Al aceptarlo, el lavado SHALL pasar a `Entregado` y SHALL dejar de
mostrarse en la lista.

#### Scenario: Entregar un lavado terminado

- **WHEN** se presiona `Entregar` y se acepta el popup `Vehiculo Entregado`
- **THEN** el lavado pasa a `Entregado` y deja de mostrarse en la lista

### Requirement: Volver al inicio desde Lavados

El botón `←` al final de la página SHALL navegar al home.

#### Scenario: Volver

- **WHEN** se hace clic en `←`
- **THEN** la aplicación navega a `/home`

### Requirement: Verificación de sesión en Lavados

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la página de
inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página «Lavados» sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
