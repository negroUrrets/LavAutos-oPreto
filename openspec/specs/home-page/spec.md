# home-page Specification

## Purpose

Pantalla home posterior al login que replica el prototipo, muestra la fecha y hora
reales de la zona horaria de Buenos Aires, ofrece el panel de accesos con hover
verde, el popup de cierre de sesión y verifica la sesión.

## Requirements

### Requirement: Pantalla home

La aplicación SHALL mostrar, tras un login válido, una pantalla home que replica el
prototipo: encabezado con el ícono del auto y `LavAutos oPreto`, panel con la tarjeta
rosa de accesos, panel azul con fecha y hora, y el ícono de usuario con la etiqueta
`ADMIN` arriba a la derecha.

#### Scenario: Acceso al home tras el login

- **WHEN** un usuario inicia sesión correctamente y cierra el popup de éxito
- **THEN** se muestra la pantalla home con el encabezado, el panel de accesos, la fecha y hora y el ícono de usuario

### Requirement: Panel de accesos

El home SHALL mostrar cuatro botones de acceso: `CLIENTES`, `LAVADOS`, `VEHICULOS` y
`DASHBOARD`.

#### Scenario: Botones visibles

- **WHEN** se muestra el home
- **THEN** se ven los cuatro botones `CLIENTES`, `LAVADOS`, `VEHICULOS` y `DASHBOARD`

### Requirement: Hover verde de los accesos

Cada botón del panel SHALL cambiar a verde `#5ea014` cuando el puntero del mouse pasa
sobre él.

#### Scenario: Resaltado al pasar el mouse

- **WHEN** el puntero se posiciona sobre un botón del panel
- **THEN** el botón se muestra en verde `#5ea014`

### Requirement: Fecha y hora reales

El home SHALL mostrar la fecha y la hora reales de la zona horaria UTC-03:00 (Ciudad
de Buenos Aires), con el día de la semana y la fecha (por ejemplo `Lunes 06/09/2026`)
y la hora en formato de 12 horas con `am`/`pm` (por ejemplo `10 : 20 pm`), con la hora
en tamaño mayor que los minutos.

#### Scenario: Fecha y hora de Buenos Aires

- **WHEN** se muestra el home
- **THEN** la fecha y la hora corresponden a la zona horaria UTC-03:00 en el formato del prototipo

### Requirement: Botón de usuario

El ícono de usuario del home SHALL ser un botón que, al hacer clic, abre una ventana
emergente pequeña de cierre de sesión.

#### Scenario: Apertura del popup de cierre

- **WHEN** se hace clic en el ícono de usuario
- **THEN** se abre la ventana emergente de cierre de sesión

### Requirement: Ventana emergente de cierre de sesión

La ventana emergente SHALL mostrar la opción `CERRAR SESION` y una `X` para cancelar.

#### Scenario: Opciones del popup

- **WHEN** se abre la ventana emergente de cierre de sesión
- **THEN** se muestra la opción `CERRAR SESION` y una `X`

### Requirement: Cerrar sesión

Al confirmar `CERRAR SESION`, la aplicación SHALL cerrar la sesión en el backend y
redirigir a la landing de inicio de sesión.

#### Scenario: Cierre de sesión confirmado

- **WHEN** se hace clic en `CERRAR SESION`
- **THEN** se cierra la sesión en el backend y la aplicación redirige a la página de inicio de sesión

### Requirement: Cancelar el cierre de sesión

Al hacer clic en la `X`, la ventana emergente SHALL cerrarse sin realizar ninguna
acción.

#### Scenario: Cancelar sin aviso

- **WHEN** se hace clic en la `X` del popup de cierre
- **THEN** el popup se cierra sin cerrar la sesión ni mostrar aviso

### Requirement: Verificación de sesión en el home

El home SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la página
de inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede al home sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión

#### Scenario: Con sesión válida

- **WHEN** se accede al home con una sesión válida
- **THEN** el home se muestra normalmente

### Requirement: Navegación del acceso Clientes

El botón `CLIENTES` del panel de accesos del home SHALL navegar a la página de
Clientes (`/clientes`).

#### Scenario: Acceso a Clientes desde el home

- **WHEN** se hace clic en el botón `CLIENTES` del home
- **THEN** la aplicación navega a la página de Clientes

### Requirement: Enlace a Vehiculos

El botón `VEHICULOS` de la página de inicio SHALL navegar a la página «Vehiculos».

#### Scenario: Abrir Vehiculos

- **WHEN** se hace clic en `VEHICULOS` en la página de inicio
- **THEN** la aplicación navega a `/vehiculos`
