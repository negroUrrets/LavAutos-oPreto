# Spec Delta

## Purpose

Página «Nuevo Cliente» del frontend que replica el prototipo, valida los datos, evita
duplicar el dni y registra el cliente y su vehículo usando el backend, comunicando el
resultado con popups.

## ADDED Requirements

### Requirement: Página Nuevo Cliente

La aplicación SHALL mostrar una página «Nuevo Cliente» en `/clientes/nuevo` que
replica el prototipo: una tarjeta titulada `Nuevo Cliente` con un panel de datos de la
persona, un panel del vehículo y los botones `Registrar` (verde) y `Cancelar` (rojo).

#### Scenario: Acceso a la página

- **WHEN** se accede a la página «Nuevo Cliente» con una sesión válida
- **THEN** se muestra el título `Nuevo Cliente`, los campos de la persona, los del vehículo y los botones `Registrar` y `Cancelar`

### Requirement: Datos de la persona

La página SHALL ofrecer inputs para `DNI`, `Nombre`, `Apellido`, `Celular` y `e-mail`.

#### Scenario: Campos de la persona visibles

- **WHEN** se muestra la página «Nuevo Cliente»
- **THEN** se ven los campos `DNI`, `Nombre`, `Apellido`, `Celular` y `e-mail`

### Requirement: Datos del vehículo

La página SHALL ofrecer comboboxes para `Tipo Vehiculo`, `Marca Vehiculo` y
`Modelo Vehiculo`, y un input para `Patente`.

#### Scenario: Campos del vehículo visibles

- **WHEN** se muestra la página «Nuevo Cliente»
- **THEN** se ven los comboboxes `Tipo Vehiculo`, `Marca Vehiculo` y `Modelo Vehiculo`, y el input `Patente`

### Requirement: Comboboxes en cascada

Los comboboxes SHALL cargarse en cascada desde el backend: `Tipo Vehiculo` desde
`CategoriaVehiculo.categoriaVehi`, `Marca Vehiculo` desde `MarcaVehiculo.marcaVehi`
filtrado por el tipo elegido, y `Modelo Vehiculo` desde `ModeloVehiculo.modeloVehi`
filtrado por la marca elegida.

#### Scenario: Marca depende del tipo

- **WHEN** se elige un `Tipo Vehiculo`
- **THEN** el combobox `Marca Vehiculo` muestra solo las marcas de ese tipo

#### Scenario: Modelo depende de la marca

- **WHEN** se elige una `Marca Vehiculo`
- **THEN** el combobox `Modelo Vehiculo` muestra solo los modelos de esa marca

### Requirement: Campos obligatorios

La página SHALL exigir todos los campos; si alguno queda vacío, NO SHALL registrar y
SHALL advertir en la página, de la misma forma que la página de login.

#### Scenario: Campo vacío

- **WHEN** se intenta registrar con algún campo vacío
- **THEN** no se registra y se muestra un mensaje de advertencia en la página

### Requirement: Verificación de dni duplicado

Antes de registrar, la página SHALL comparar el `dni` ingresado con los clientes
registrados; si coincide con uno existente, SHALL mostrar un popup indicando que el
cliente ya se encuentra registrado, con un botón verde `Aceptar`, y al aceptarlo SHALL
limpiar el formulario.

#### Scenario: DNI ya registrado

- **WHEN** se ingresa un `dni` que ya pertenece a un cliente registrado y se presiona `Registrar`
- **THEN** se muestra un popup indicando que el cliente ya se encuentra registrado con un botón verde `Aceptar`

#### Scenario: Limpiar tras aceptar

- **WHEN** se presiona `Aceptar` en el popup de cliente ya registrado
- **THEN** el formulario queda vacío

### Requirement: Registro de cliente y vehículo

Si el `dni` no coincide con ningún cliente registrado, al presionar `Registrar` la
página SHALL crear el cliente (`POST /api/clientes`) y su vehículo
(`POST /api/vehiculos`) y SHALL mostrar un popup `Bienvenido <nombre>`.

#### Scenario: Registro exitoso

- **WHEN** se completa el formulario con un `dni` no registrado y se presiona `Registrar`
- **THEN** se crean el cliente y su vehículo y se muestra un popup `Bienvenido <nombre>` con el nombre del cliente nuevo

#### Scenario: Navegación tras la bienvenida

- **WHEN** se acepta el popup `Bienvenido <nombre>`
- **THEN** la aplicación navega a la página de Clientes

### Requirement: Cancelar el registro

El botón `Cancelar` SHALL navegar a la página de Clientes sin registrar.

#### Scenario: Cancelar

- **WHEN** se presiona `Cancelar`
- **THEN** la aplicación navega a la página de Clientes y no se registra ningún cliente

### Requirement: Verificación de sesión en la página Nuevo Cliente

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la
página de inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página «Nuevo Cliente» sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
