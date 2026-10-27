# login-page Specification

## Purpose

Página de inicio de sesión del frontend que replica el prototipo documentado, envía
las credenciales al backend y comunica el resultado mediante una ventana emergente.

## Requirements

### Requirement: Página de inicio de sesión

La aplicación SHALL mostrar una página de inicio de sesión que replica el prototipo
documentado: fondo índigo, tarjeta rosa con esquinas redondeadas, ícono del auto con
burbujas, el título `LavAutos oPreto`, los campos `Usuario` y `Contraseña` y el botón
`Iniciar Sesion`.

#### Scenario: Elementos visibles

- **WHEN** se abre la página de inicio de sesión
- **THEN** se muestran el título, los campos `Usuario` y `Contraseña` y el botón `Iniciar Sesion` con el estilo del prototipo

### Requirement: Campos de usuario y contraseña

La página SHALL ofrecer un campo `Usuario` de texto y un campo `Contraseña` enmascarado.

#### Scenario: Contraseña enmascarada

- **WHEN** el usuario escribe su contraseña
- **THEN** el campo de contraseña no muestra el texto ingresado

### Requirement: Campos obligatorios

La página SHALL impedir el envío cuando `Usuario` o `Contraseña` están vacíos, sin
llamar al backend.

#### Scenario: Envío con campos vacíos

- **WHEN** se intenta iniciar sesión con un campo vacío
- **THEN** no se envía la solicitud al backend y se indica que los campos son obligatorios

### Requirement: Envío de credenciales al backend

Al enviar el formulario, la página SHALL llamar a `POST /api/auth/login` con el
usuario y la contraseña ingresados, incluyendo las cookies de sesión.

#### Scenario: Envío del formulario

- **WHEN** el usuario completa ambos campos y presiona `Iniciar Sesion`
- **THEN** se envía la solicitud de login al backend con las credenciales ingresadas

### Requirement: Inicio de sesión exitoso

Cuando el backend responde con éxito, la página SHALL mostrar una ventana emergente
con el texto `!Bienvenid@!`.

#### Scenario: Login correcto

- **WHEN** el backend responde `200` al login
- **THEN** se muestra un popup con el mensaje `!Bienvenid@!`

### Requirement: Inicio de sesión fallido

Cuando el backend rechaza las credenciales, la página SHALL mostrar una ventana
emergente con el texto `Error al iniciar sesion!!!`.

#### Scenario: Credenciales incorrectas

- **WHEN** el backend responde `401` al login
- **THEN** se muestra un popup con el mensaje `Error al iniciar sesion!!!`

### Requirement: Estilo del popup

La ventana emergente SHALL seguir el mismo estilo y colores que la página de inicio
de sesión.

#### Scenario: Popup coherente con el diseño

- **WHEN** se muestra el popup de éxito o de error
- **THEN** usa la misma paleta y estilo que la página de login

### Requirement: Acceso inicial

La aplicación SHALL iniciar en la página de inicio de sesión cuando no hay una sesión
válida.

#### Scenario: Apertura de la aplicación

- **WHEN** se abre la aplicación sin una sesión válida
- **THEN** se muestra la página de inicio de sesión

### Requirement: Navegación al home tras el login

Al cerrar el popup de éxito, la página SHALL navegar a la pantalla home.

#### Scenario: Cierre del popup de éxito

- **WHEN** el usuario cierra el popup de éxito mostrado tras un login correcto
- **THEN** la aplicación navega a la pantalla home
