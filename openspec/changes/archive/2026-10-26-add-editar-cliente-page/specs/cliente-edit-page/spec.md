# Spec Delta

## Purpose

Página «Editar Cliente» del frontend que carga los datos de un cliente, los edita con
las mismas validaciones de tipo que el registro y guarda los cambios en el backend.

## ADDED Requirements

### Requirement: Página Editar Cliente

La aplicación SHALL mostrar una página «Editar Cliente» en `/clientes/:id/editar` que
replica el prototipo: una tarjeta titulada `Editar Cliente` con un panel (avatar e
inputs `DNI`, `Nombre`, `Apellido`, `Celular` y `e-m@il`) y los botones verde
`Registrar` y rojo `Cancelar`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página «Editar Cliente» con una sesión válida
- **THEN** se muestra el título `Editar Cliente`, los campos de la persona y los botones `Registrar` y `Cancelar`

### Requirement: Carga de los datos del cliente

La página SHALL cargar los datos del cliente seleccionado (`GET /api/clientes/:id`) en
el formulario, de manera editable.

#### Scenario: Datos precargados

- **WHEN** se abre la página de edición de un cliente
- **THEN** los campos `DNI`, `Nombre`, `Apellido`, `Celular` y `e-m@il` se muestran precargados con los datos del cliente y son editables

### Requirement: Tipos de datos y validaciones

La página SHALL mantener los tipos de datos del registro: `DNI` y `Celular` solo
números; `Nombre` y `Apellido` solo letras (con acentos y `ñ`); y SHALL validar el
formato de `e-mail` antes de guardar.

#### Scenario: Tipo incorrecto descartado

- **WHEN** se tipea un carácter del tipo incorrecto en `DNI`, `Celular`, `Nombre` o `Apellido`
- **THEN** ese carácter no se ingresa

#### Scenario: E-mail inválido

- **WHEN** se presiona `Registrar` con un `e-mail` de formato inválido
- **THEN** no se guarda y se muestra una advertencia en la página

### Requirement: Guardar la edición

Al presionar `Registrar`, la página SHALL guardar los cambios del cliente
(`PUT /api/clientes/:id`) y SHALL mostrar un popup informando que la edición se
efectuó satisfactoriamente.

#### Scenario: Edición exitosa

- **WHEN** se presiona `Registrar` con datos válidos
- **THEN** se guardan los cambios del cliente y se muestra un popup indicando que la edición se efectuó satisfactoriamente

#### Scenario: Volver tras aceptar

- **WHEN** se acepta el popup de edición satisfactoria
- **THEN** la aplicación vuelve a la página de información del cliente

### Requirement: Cancelar la edición

Al presionar `Cancelar`, la página SHALL abortar la edición sin modificar el cliente y
SHALL volver a la página de información del cliente.

#### Scenario: Cancelar

- **WHEN** se presiona `Cancelar`
- **THEN** el cliente no se modifica y la aplicación vuelve a la página de información del cliente

### Requirement: Verificación de dni duplicado al editar

Al presionar `Registrar`, la página SHALL verificar que el `dni` editado no coincida con
el de otro cliente ya registrado; si coincide, SHALL mostrar un popup advirtiendo que el
cliente ya se encuentra registrado y NO SHALL guardar.

#### Scenario: DNI ya registrado en otro cliente

- **WHEN** se presiona `Registrar` con un `dni` que ya pertenece a otro cliente
- **THEN** no se guarda y se muestra un popup advirtiendo que el cliente ya se encuentra registrado

#### Scenario: Volver con los datos originales

- **WHEN** se acepta el popup de dni ya registrado
- **THEN** la página de edición vuelve a mostrar los datos originales del cliente, descartando los cambios

#### Scenario: DNI propio

- **WHEN** se presiona `Registrar` conservando el `dni` del propio cliente
- **THEN** la verificación no bloquea el guardado

### Requirement: Verificación de sesión en la página de edición

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la
página de inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página de edición sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
