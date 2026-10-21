# Spec Delta

## Purpose

Página del frontend que permite buscar y listar los vehículos registrados por modelo o
patente, con el encabezado de la aplicación y el cierre de sesión existente.

## ADDED Requirements

### Requirement: Página Vehiculos

La aplicación SHALL mostrar una página «Vehiculos» en `/vehiculos` con el encabezado de
la aplicación, el pill `VEHICULOS`, un input de búsqueda con `placeholder` `Patente...` y
una tabla con las columnas `TIPO`, `MARCA`, `MODELO` y `PATENTE`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página «Vehiculos» con una sesión válida
- **THEN** se muestra el encabezado, el pill `VEHICULOS`, el input `Patente...` y la tabla con las columnas `TIPO`, `MARCA`, `MODELO` y `PATENTE`

### Requirement: Búsqueda por modelo o patente

Mientras se tipea un término, la página SHALL mostrar los vehículos cuya patente o modelo
contenga ese término, sin distinguir mayúsculas ni exigir el texto completo.

#### Scenario: Coincidencia por parte de la patente

- **WHEN** se tipea `AB`, `122` o `FC` y existe el vehículo con patente `AB-122-FC`
- **THEN** ese vehículo se muestra en la tabla

#### Scenario: Coincidencia por modelo

- **WHEN** se tipea parte del modelo de un vehículo registrado
- **THEN** ese vehículo se muestra en la tabla

### Requirement: Sin parámetros de búsqueda

Cuando el input de búsqueda está vacío, la página NO SHALL mostrar vehículos.

#### Scenario: Input vacío

- **WHEN** el input de búsqueda no tiene parámetros
- **THEN** la tabla no muestra ningún vehículo

### Requirement: Búsqueda sin resultados

Cuando el término no coincide con ningún vehículo, la página SHALL mostrar
`Busqueda sin resultados ...` sin mensajes de error.

#### Scenario: Sin coincidencias

- **WHEN** se tipea un término que no coincide con ningún vehículo
- **THEN** se muestra `Busqueda sin resultados ...` y ningún aviso de error

### Requirement: Filas alternadas

La página SHALL mostrar las filas de resultados con colores de fondo alternados para
facilitar la lectura.

#### Scenario: Varios resultados

- **WHEN** la búsqueda muestra dos o más vehículos
- **THEN** las filas alternan su color de fondo

### Requirement: Botón + info sin acción

Cada fila de resultado SHALL mostrar un botón verde `+ info`; por ahora NO SHALL ejecutar
ninguna acción.

#### Scenario: Clic en + info

- **WHEN** se hace clic en `+ info` de una fila
- **THEN** no ocurre ninguna acción

### Requirement: Volver al inicio

El botón verde `← Volver` SHALL navegar a la página de inicio.

#### Scenario: Volver

- **WHEN** se hace clic en `← Volver`
- **THEN** la aplicación navega a `/home`

### Requirement: Encabezado con cierre de sesión

La página SHALL mostrar el encabezado de la aplicación, cuyo avatar permite cerrar la
sesión.

#### Scenario: Cerrar sesión desde el encabezado

- **WHEN** se hace clic en el avatar del encabezado
- **THEN** se ofrece el cierre de sesión ya existente

### Requirement: Verificación de sesión en la página Vehiculos

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la página
de inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página «Vehiculos» sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
