# Spec Delta

## Purpose

Página «Agregar Vehiculo» del frontend que replica el prototipo, valida los datos y
registra un vehículo para un cliente seleccionado usando el backend existente.

## ADDED Requirements

### Requirement: Página Agregar Vehiculo

La aplicación SHALL mostrar una página «Agregar Vehiculo» en
`/clientes/:id/vehiculos/nuevo` que replica el prototipo: una tarjeta titulada
`Nuevo Vehiculo` con un panel de datos del vehículo y los botones verde `Registrar` y
rojo `Cancelar`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página «Agregar Vehiculo» con una sesión válida
- **THEN** se muestra el título `Nuevo Vehiculo`, los campos del vehículo y los botones `Registrar` y `Cancelar`

### Requirement: Campos del vehículo

La página SHALL ofrecer comboboxes para `Vehiculo`, `Marca` y `Modelo`, y un input para
`Patente`.

#### Scenario: Campos visibles

- **WHEN** se muestra la página «Agregar Vehiculo»
- **THEN** se ven los comboboxes `Vehiculo`, `Marca` y `Modelo`, y el input `Patente`

### Requirement: Comboboxes en cascada

Los comboboxes SHALL cargarse en cascada desde el backend: `Vehiculo` desde
`CategoriaVehiculo.categoriaVehi`, `Marca` desde `MarcaVehiculo.marcaVehi` filtrado por
el vehículo elegido, y `Modelo` desde `ModeloVehiculo.modeloVehi` filtrado por la marca
elegida.

#### Scenario: Marca depende del vehículo

- **WHEN** se elige un `Vehiculo`
- **THEN** el combobox `Marca` muestra solo las marcas de ese vehículo

#### Scenario: Modelo depende de la marca

- **WHEN** se elige una `Marca`
- **THEN** el combobox `Modelo` muestra solo los modelos de esa marca

### Requirement: Campos obligatorios y patente válida

La página SHALL exigir todos los campos y que la patente tenga el formato `AA-123-AA`;
si no se cumple, NO SHALL registrar y SHALL advertir en la página.

#### Scenario: Campo vacío

- **WHEN** se intenta registrar con algún campo vacío
- **THEN** no se registra y se muestra un mensaje de advertencia en la página

#### Scenario: Patente inválida

- **WHEN** se ingresa una patente con un formato distinto de `AA-123-AA`
- **THEN** no se registra y se muestra un mensaje de advertencia en la página

### Requirement: Verificación de patente duplicada

Antes de registrar, la página SHALL comparar la patente con las patentes ya registradas;
si coincide, NO SHALL registrar y SHALL mostrar un popup informando que el vehículo ya
está registrado, con un botón verde `Aceptar`.

#### Scenario: Patente ya registrada

- **WHEN** se ingresa una patente que ya pertenece a un vehículo registrado y se presiona `Registrar`
- **THEN** se muestra un popup indicando que el vehículo ya está registrado con un botón verde `Aceptar`, y no se registra

#### Scenario: Limpiar tras aceptar

- **WHEN** se presiona `Aceptar` en el popup de vehículo ya registrado
- **THEN** el formulario queda vacío

### Requirement: Registro del vehículo

Al presionar `Registrar`, la página SHALL crear el vehículo (`POST /api/vehiculos`) para
el cliente seleccionado con la patente, el modelo elegido y estado activo, y SHALL
mostrar un popup informando que el vehículo se agregó satisfactoriamente.

#### Scenario: Registro exitoso

- **WHEN** se completa el formulario con datos válidos y se presiona `Registrar`
- **THEN** se crea el vehículo del cliente seleccionado y se muestra un popup informando que el vehículo se agregó satisfactoriamente

#### Scenario: Volver a la información del cliente

- **WHEN** se cierra el popup de éxito
- **THEN** la aplicación vuelve a la página de información del cliente

#### Scenario: Error de registro

- **WHEN** el backend rechaza la creación del vehículo
- **THEN** se muestra una advertencia en la página y no se navega

### Requirement: Cancelar el registro del vehículo

El botón `Cancelar` SHALL volver a la página de información del cliente sin registrar
ningún vehículo.

#### Scenario: Cancelar

- **WHEN** se presiona `Cancelar`
- **THEN** la aplicación vuelve a la página de información del cliente y no se registra ningún vehículo

### Requirement: Verificación de sesión en la página Agregar Vehiculo

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la página
de inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página «Agregar Vehiculo» sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
