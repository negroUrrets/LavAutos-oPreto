# client-registration-page Specification

## Purpose

Página «Nuevo Cliente» del frontend que replica el prototipo, valida los datos, evita
duplicar el dni y registra el cliente y su vehículo usando el backend, comunicando el
resultado con popups.

## Requirements

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

### Requirement: Validación del formato de e-mail

Antes de registrar, la página SHALL validar que el `e-mail` cumpla un formato de
correo válido; si no lo cumple, NO SHALL registrar y SHALL advertir en la página.

#### Scenario: E-mail inválido

- **WHEN** se presiona `Registrar` con un `e-mail` que no tiene formato de correo válido
- **THEN** no se registra y se muestra un mensaje de advertencia en la página

#### Scenario: E-mail válido

- **WHEN** se presiona `Registrar` con un `e-mail` de formato válido
- **THEN** la validación de e-mail se considera superada

### Requirement: Formato de patente

Al registrar, la página SHALL exigir que `Patente` cumpla el formato de 2 letras, 3
números y 2 letras separados por guiones (por ejemplo `AB-254-MC`); si no lo cumple,
NO SHALL registrar y SHALL advertir en la página.

#### Scenario: Patente inválida

- **WHEN** se presiona `Registrar` con una `Patente` que no cumple el formato `AA-123-AA`
- **THEN** no se registra y se muestra un mensaje de advertencia en la página

#### Scenario: Patente válida

- **WHEN** se presiona `Registrar` con una `Patente` que cumple el formato `AA-123-AA`
- **THEN** la validación de patente se considera superada

### Requirement: Máscara del campo Patente

Mientras se tipea, el campo `Patente` SHALL agregar automáticamente los guiones,
convertir el texto a mayúsculas y descartar los caracteres del tipo incorrecto (letra
donde corresponde un número o número donde corresponde una letra).

#### Scenario: Formato automático

- **WHEN** se tipea `ab254mc` en el campo `Patente`
- **THEN** el campo muestra `AB-254-MC`

#### Scenario: Carácter del tipo incorrecto

- **WHEN** se tipea un número en una posición de letra (o una letra en una posición de número)
- **THEN** ese carácter se descarta

### Requirement: Patente almacenada con guiones

La `Patente` registrada SHALL almacenarse con los guiones del formato (por ejemplo
`AB-254-MC`).

#### Scenario: Patente almacenada

- **WHEN** se registra un cliente con la patente `AB-254-MC`
- **THEN** el vehículo se crea con esa patente, incluyendo los guiones

### Requirement: Campos numéricos (DNI y Celular)

Los campos `DNI` y `Celular` SHALL aceptar solo dígitos; al tipear un carácter que no
sea número (letra, símbolo o espacio), ese carácter SHALL descartarse y no ingresar al
formulario.

#### Scenario: Letra en DNI

- **WHEN** se tipea una letra en el campo `DNI`
- **THEN** esa letra no se ingresa y el campo conserva solo los números

#### Scenario: Letra en Celular

- **WHEN** se tipea una letra en el campo `Celular`
- **THEN** esa letra no se ingresa y el campo conserva solo los números

#### Scenario: Números válidos

- **WHEN** se tipean números en `DNI` o `Celular`
- **THEN** los números se ingresan normalmente

### Requirement: Campos alfabéticos (Nombre y Apellido)

Los campos `Nombre` y `Apellido` SHALL aceptar solo letras, incluidos acentos y `ñ`;
al tipear un carácter que no sea letra (número, símbolo o espacio), ese carácter SHALL
descartarse y no ingresar al formulario.

#### Scenario: Número en Nombre

- **WHEN** se tipea un número en el campo `Nombre`
- **THEN** ese número no se ingresa y el campo conserva solo las letras

#### Scenario: Número en Apellido

- **WHEN** se tipea un número en el campo `Apellido`
- **THEN** ese número no se ingresa y el campo conserva solo las letras

#### Scenario: Letras con acentos y ñ

- **WHEN** se tipean letras con acentos o `ñ` (por ejemplo `Muñoz` o `Ángel`) en `Nombre` o `Apellido`
- **THEN** las letras se ingresan normalmente

#### Scenario: Espacio descartado

- **WHEN** se tipea un espacio en `Nombre` o `Apellido`
- **THEN** el espacio no se ingresa
