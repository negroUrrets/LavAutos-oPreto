# user-auth Specification

## Purpose

Provee la autenticación de la aplicación: la cuenta administrador predeterminada,
el inicio y cierre de sesión con sesión de servidor y cookie `HttpOnly`, y la
protección de los endpoints, verificando las credenciales contra `Usuario` y
registrando el evento en `Login`.

## Requirements

### Requirement: Cuenta administrador predeterminada

El backend SHALL garantizar la cuenta administrador (`nombreUsuario = admin`, contraseña
predeterminada `123456`) tanto al iniciar como en el seed: si no existe, SHALL crearla
almacenando la contraseña con un algoritmo de hash y nunca en texto plano; si existe, NO
SHALL duplicarla ni sobrescribir su contraseña.

#### Scenario: Cuenta creada

- **WHEN** el backend inicia o se ejecuta el seed y no existe la cuenta administrador
- **THEN** se crea el usuario `admin` con la contraseña almacenada como hash

#### Scenario: Cuenta ya existente

- **WHEN** el backend inicia o se ejecuta el seed y la cuenta administrador ya existe
- **THEN** no se crea un duplicado ni se sobrescribe la contraseña existente

#### Scenario: Login tras recrear la base

- **WHEN** se recrea `DataBaseLavadero` con el script y luego se inicia el backend
- **THEN** la cuenta `admin` existe y `admin` / `123456` inicia sesión correctamente

### Requirement: Inicio de sesión exitoso

`POST /api/auth/login` SHALL validar que el usuario y la contraseña coincidan con
`nombreUsuario` y `contraseña` de `Usuario` y, si coinciden, iniciar una sesión de
servidor y registrar una fila en `Login` con `usuario = codigoUsuario`,
respondiendo `200` sin exponer la contraseña.

#### Scenario: Credenciales válidas

- **WHEN** se envían el usuario y la contraseña correctos
- **THEN** se inicia la sesión, se registra el evento en `Login` con `usuario = codigoUsuario` y la respuesta es `200` con los datos del usuario sin contraseña

### Requirement: Inicio de sesión fallido

`POST /api/auth/login` SHALL rechazar credenciales inválidas con `401` y un mensaje
genérico, sin revelar si el usuario o la contraseña son incorrectos, y sin iniciar
sesión.

#### Scenario: Usuario inexistente

- **WHEN** se envía un usuario que no existe
- **THEN** la respuesta es `401` con un mensaje genérico y no se inicia sesión

#### Scenario: Contraseña incorrecta

- **WHEN** se envía un usuario existente con una contraseña incorrecta
- **THEN** la respuesta es `401` con el mismo mensaje genérico y no se inicia sesión

### Requirement: Sesión con cookie HttpOnly

La sesión SHALL mantenerse en el servidor y su identificador SHALL viajar en una
cookie `HttpOnly` con `SameSite`, sin exponer el identificador de sesión al
JavaScript del cliente.

#### Scenario: Cookie de sesión

- **WHEN** el inicio de sesión es exitoso
- **THEN** la respuesta establece una cookie de sesión `HttpOnly` con `SameSite`

### Requirement: Identificación del usuario para lavados

La sesión SHALL conservar el `codigoLogin` del evento de login; la fila `Login` SHALL
referenciar al usuario mediante `usuario = codigoUsuario`, de modo que un `Lavado`
identifique a su usuario a través de `Lavado -> Login -> Usuario`.

#### Scenario: Login asociado al usuario

- **WHEN** un usuario inicia sesión correctamente
- **THEN** la fila creada en `Login` referencia al usuario mediante `usuario = codigoUsuario`

#### Scenario: Lavado identifica al usuario por el login

- **WHEN** se registra un lavado con el `login` de la sesión
- **THEN** el usuario del lavado se obtiene mediante `Lavado -> Login -> Usuario`

### Requirement: Sin sesión autenticada automática

La existencia de la cuenta administrador NO SHALL considerarse una sesión
autenticada; el acceso SHALL comenzar en el login.

#### Scenario: Acceso sin autenticar

- **WHEN** se consulta un endpoint protegido sin haber iniciado sesión
- **THEN** la respuesta es `401`

### Requirement: Estado de sesión

`GET /api/auth/session` SHALL informar si hay una sesión autenticada, con `200` y el
usuario cuando existe, y `401` cuando no.

#### Scenario: Con sesión activa

- **WHEN** se consulta el estado con una sesión iniciada
- **THEN** la respuesta es `200` con el usuario autenticado, sin contraseña

#### Scenario: Sin sesión

- **WHEN** se consulta el estado sin una sesión iniciada
- **THEN** la respuesta es `401`

### Requirement: Cierre de sesión

`POST /api/auth/logout` SHALL destruir la sesión del servidor y responder `204`.

#### Scenario: Cierre exitoso

- **WHEN** se cierra la sesión estando autenticado
- **THEN** la sesión se destruye y la respuesta es `204`

#### Scenario: Acceso posterior rechazado

- **WHEN** se consulta un endpoint protegido después de cerrar sesión
- **THEN** la respuesta es `401`

### Requirement: Protección de endpoints

Los endpoints CRUD existentes SHALL requerir una sesión válida y responder `401`
sin ella; el login y la salud SHALL ser públicos.

#### Scenario: Endpoint protegido sin sesión

- **WHEN** se solicita un endpoint CRUD sin sesión
- **THEN** la respuesta es `401`

#### Scenario: Endpoint público

- **WHEN** se solicita el login o la salud sin sesión
- **THEN** la solicitud se procesa sin exigir sesión

### Requirement: Configuración de sesión por entorno

El secreto de sesión SHALL configurarse por variable de entorno, sin valores
secretos en el repositorio.

#### Scenario: Secreto faltante

- **WHEN** el backend inicia sin el secreto de sesión configurado
- **THEN** falla al iniciar con un mensaje que indica la variable faltante
