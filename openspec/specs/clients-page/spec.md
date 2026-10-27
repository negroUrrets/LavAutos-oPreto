# clients-page Specification

## Purpose

Página de Clientes del frontend que replica el prototipo, permite buscar clientes en
vivo por nombre, apellido o dni, muestra el estado sin resultados, permite cerrar
sesión y verifica la sesión antes de mostrarse.

## Requirements

### Requirement: Página de Clientes

La aplicación SHALL mostrar una página de Clientes en `/clientes` que replica el
prototipo: encabezado con el ícono del auto y `LavAutos oPreto`, la etiqueta de
sección `CLIENTES`, el panel de búsqueda, el panel de resultados y el botón `Volver`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página de Clientes con una sesión válida
- **THEN** se muestra el encabezado, la etiqueta `CLIENTES`, el panel de búsqueda, el panel de resultados y el botón `Volver`

### Requirement: Etiqueta de sección

La página SHALL mostrar el texto `CLIENTES` como una etiqueta, no como un botón.

#### Scenario: Etiqueta no interactiva

- **WHEN** se muestra la página de Clientes
- **THEN** `CLIENTES` se muestra como una etiqueta y no como un botón

### Requirement: Buscador de clientes

La página SHALL mostrar un campo de búsqueda (fondo `#f4e6e6`) sin botón de búsqueda,
que permite buscar por `nombre`, `apellido` o `dni`.

#### Scenario: Campo de búsqueda visible

- **WHEN** se muestra la página de Clientes
- **THEN** se ve el campo de búsqueda y no hay un botón de búsqueda

### Requirement: Búsqueda en vivo

A partir del cuarto carácter tipeado, la página SHALL consultar los clientes que
coincidan y mostrar los resultados, sin requerir una acción adicional.

#### Scenario: Búsqueda desde el cuarto carácter

- **WHEN** el usuario tipea al menos cuatro caracteres en el buscador
- **THEN** se consultan y muestran los clientes que coinciden por nombre, apellido o dni

#### Scenario: Menos de cuatro caracteres

- **WHEN** el usuario tipea menos de cuatro caracteres
- **THEN** no se realiza la búsqueda

### Requirement: Sin búsqueda no se muestran registros

Cuando no hay una búsqueda activa, la página NO SHALL listar todos los clientes; en su
lugar SHALL mostrar el estado sin resultados.

#### Scenario: Sin parámetros de búsqueda

- **WHEN** el buscador está vacío o tiene menos de cuatro caracteres
- **THEN** no se listan clientes y se muestra el estado sin resultados

### Requirement: Estado sin resultados

Cuando no hay una búsqueda activa o la búsqueda no encuentra coincidencias, el panel
de resultados SHALL mostrar los encabezados de la tabla y el texto
`Busqueda sin resultados ...`, sin mostrar un mensaje de error.

#### Scenario: Búsqueda sin coincidencias

- **WHEN** la búsqueda no encuentra clientes
- **THEN** el panel muestra `Busqueda sin resultados ...` y ningún mensaje de error

#### Scenario: Sin búsqueda activa

- **WHEN** no hay una búsqueda activa
- **THEN** el panel muestra `Busqueda sin resultados ...`

### Requirement: Panel de resultados

La página SHALL mostrar los resultados en un panel azul `#2637a2` con una tabla de
columnas `DNI`, `NOMBRE`, `APELLIDO` y `CELULAR`, con el color de fondo de las filas
alternado entre `#f4e6e6` y `#b4b2b2`.

#### Scenario: Resultados con filas alternadas

- **WHEN** la búsqueda devuelve dos o más clientes
- **THEN** las filas se muestran con el color de fondo alternado entre `#f4e6e6` y `#b4b2b2`

### Requirement: Botón Volver

La página SHALL mostrar un botón verde `#7eb93c` con el texto `← Volver` (con la
flecha del tamaño de las letras) que navega a la página Home (`/home`).

#### Scenario: Volver al home

- **WHEN** se hace clic en `Volver`
- **THEN** la aplicación navega a la página Home

### Requirement: Cierre de sesión desde la página de Clientes

El ícono de usuario de la página SHALL abrir la ventana emergente de cierre de
sesión; confirmar `CERRAR SESION` SHALL cerrar la sesión y redirigir al login, y la
`X` SHALL cerrar el popup sin acción.

#### Scenario: Cierre de sesión confirmado

- **WHEN** se hace clic en `CERRAR SESION` desde la página de Clientes
- **THEN** se cierra la sesión y la aplicación redirige a la página de inicio de sesión

#### Scenario: Cancelar el cierre

- **WHEN** se hace clic en la `X` del popup de cierre
- **THEN** el popup se cierra sin cerrar la sesión

### Requirement: Verificación de sesión en la página de Clientes

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la
página de inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página de Clientes sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión

### Requirement: Navegación del botón + info

Cada fila de resultados de la página de Clientes SHALL mostrar un botón verde `#7eb93c`
con el texto `+ info` que navega a la página de información del cliente correspondiente.

#### Scenario: Acceso a la información del cliente

- **WHEN** se hace clic en el botón `+ info` de una fila de clientes
- **THEN** la aplicación navega a la página de información de ese cliente

### Requirement: Navegación del botón + CLIENTE

La página SHALL mostrar un botón verde `#7eb93c` con el texto `+ CLIENTE` que navega a la
página «Nuevo Cliente» (`/clientes/nuevo`).

#### Scenario: Acceso a Nuevo Cliente

- **WHEN** se hace clic en el botón `+ CLIENTE` de la página de Clientes
- **THEN** la aplicación navega a la página «Nuevo Cliente»
