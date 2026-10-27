# Spec Delta

## Purpose

Página «Editar Vehiculo» del frontend que precarga y valida los datos de un vehículo,
evita patentes duplicadas y guarda la edición usando el backend existente.

## ADDED Requirements

### Requirement: Página Editar Vehiculo

La aplicación SHALL mostrar una página «Editar Vehiculo» en
`/clientes/:id/vehiculos/:vehiculoId/editar` que replica el prototipo: una tarjeta
titulada `Editar Vehiculo` con un panel de datos del vehículo y los botones verde
`Registrar` y rojo `Cancelar`.

#### Scenario: Acceso a la página

- **WHEN** se accede a la página «Editar Vehiculo» con una sesión válida
- **THEN** se muestra el título `Editar Vehiculo`, los campos del vehículo y los botones `Registrar` y `Cancelar`

### Requirement: Datos precargados

Al abrir la página, el formulario SHALL mostrar los datos del vehículo seleccionado en
`Vehiculo` (categoría), `Marca`, `Modelo` y `Patente`, de forma editable.

#### Scenario: Datos precargados

- **WHEN** se accede a la página de edición de un vehículo existente
- **THEN** los campos `Vehiculo`, `Marca`, `Modelo` y `Patente` muestran los datos actuales del vehículo

### Requirement: Comboboxes en cascada

Los comboboxes SHALL cargarse en cascada: `Vehiculo` desde
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
si no se cumple, NO SHALL guardar y SHALL advertir en la página.

#### Scenario: Campo vacío

- **WHEN** se intenta guardar con algún campo vacío
- **THEN** no se guarda y se muestra un mensaje de advertencia en la página

#### Scenario: Patente inválida

- **WHEN** se ingresa una patente con un formato distinto de `AA-123-AA`
- **THEN** no se guarda y se muestra un mensaje de advertencia en la página

### Requirement: Verificación de patente duplicada

Antes de guardar, la página SHALL comparar la patente normalizada con las patentes ya
registradas, excluyendo el propio vehículo; si coincide, NO SHALL guardar y SHALL mostrar
un popup con `Error: vehiculo ya registrado`.

#### Scenario: Patente de otro vehículo

- **WHEN** se ingresa una patente que ya pertenece a otro vehículo y se presiona `Registrar`
- **THEN** se muestra el popup `Error: vehiculo ya registrado` y no se guarda la edición

#### Scenario: Aceptar restablece los datos originales

- **WHEN** se presiona `Aceptar` en el popup de patente ya registrada
- **THEN** el formulario vuelve a mostrar los datos originales del vehículo

### Requirement: Guardar la edición

Al presionar `Registrar`, si la patente no está registrada, la página SHALL actualizar el
vehículo (`PUT /api/vehiculos/:id`) y SHALL mostrar un popup
`La edición de datos se efectuó satisfactoriamente.`

#### Scenario: Edición exitosa

- **WHEN** se modifican los datos con valores válidos y se presiona `Registrar`
- **THEN** se guarda la edición del vehículo y se muestra el popup `La edición de datos se efectuó satisfactoriamente.`

#### Scenario: Volver a la información del cliente

- **WHEN** se cierra el popup de éxito
- **THEN** la aplicación vuelve a la página de información del cliente

#### Scenario: Error al guardar

- **WHEN** el backend rechaza la actualización del vehículo
- **THEN** se muestra una advertencia en la página y no se navega

### Requirement: Cancelar la edición

El botón `Cancelar` SHALL abortar la edición y volver a la página de información del
cliente sin modificar el vehículo.

#### Scenario: Cancelar

- **WHEN** se presiona `Cancelar`
- **THEN** la aplicación vuelve a la página de información del cliente y el vehículo no se modifica

### Requirement: Verificación de sesión en la página Editar Vehiculo

La página SHALL verificar la sesión con `GET /api/auth/session` y redirigir a la página
de inicio de sesión cuando no haya una sesión válida.

#### Scenario: Sin sesión válida

- **WHEN** se accede a la página «Editar Vehiculo» sin una sesión válida
- **THEN** la aplicación redirige a la página de inicio de sesión
