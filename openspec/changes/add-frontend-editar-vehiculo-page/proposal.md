# Proposal

## Why

La card de vehículo en la página de información del cliente ya muestra el botón
`Editar`, pero no hace nada y no existe una pantalla para modificar un vehículo. Este
cambio agrega la página «Editar Vehiculo» —fiel al prototipo
`Prototipado/vehiculo/editar_vehiculo_ultimo.jpg`— que precarga los datos del vehículo
seleccionado, los valida, evita patentes duplicadas y guarda la edición con el backend
existente (`PUT /api/vehiculos/:id`); además enlaza el botón `Editar`.

## What Changes

- Crear la página «Editar Vehiculo» en
  `/clientes/:id/vehiculos/:vehiculoId/editar`, con el diseño del prototipo: tarjeta
  rosa titulada `Editar Vehiculo` con un panel azul que contiene los campos `Vehiculo`,
  `Marca`, `Modelo` y `Patente`, y los botones verde `Registrar` y rojo `Cancelar`.
- Precargar el formulario con los datos del vehículo seleccionado (`Vehiculo` como
  categoría, `Marca`, `Modelo` y `Patente`), con los comboboxes en cascada
  (`Vehiculo` → `Marca` → `Modelo`) y la patente editable.
- Mantener los tipos y validaciones: exigir todos los campos y el formato de patente
  `AA-123-AA` (con formateo mientras se tipea); si no se cumple, advertir en la página.
- Antes de guardar, comparar la patente editada con las patentes ya registradas
  (excluyendo el propio vehículo); si coincide, mostrar un popup `Error: vehiculo ya
  registrado` con un botón verde `Aceptar` y, al aceptarlo, restablecer el formulario a
  los datos originales sin guardar.
- Si no hay coincidencia, al presionar `Registrar` actualizar el vehículo del cliente
  (`PUT /api/vehiculos/:id`) y mostrar un popup
  `La edición de datos se efectuó satisfactoriamente.`; al cerrarlo, volver a la
  información del cliente.
- `Cancelar` aborta la edición y vuelve a la información del cliente sin modificar el
  vehículo.
- En `ClienteInfoPage`, el botón `Editar` de la card de vehículo navega a la página
  «Editar Vehiculo» con el vehículo seleccionado.
- Verificar la sesión con `GET /api/auth/session` y redirigir a la página de inicio de
  sesión cuando no haya una sesión válida.
- **Fuera de alcance**: eliminar vehículos, el botón `LAVAR`, otros accesos de las cards,
  el alta de vehículos, cambios al backend, al esquema de la base de datos o al modelo de
  dominio, y cualquier ajuste fuera de lo descrito.

## Capabilities

### New Capabilities

- `vehicle-edit-page`: página «Editar Vehiculo» del frontend que replica el prototipo,
  precarga y valida los datos del vehículo y guarda la edición usando el backend
  existente.

### Modified Capabilities

- `cliente-info-page`: el botón `Editar` de la card de vehículo navega a la página
  «Editar Vehiculo» con el vehículo seleccionado.

## Impact

- Frontend: nueva página y ruta `/clientes/:id/vehiculos/:vehiculoId/editar`, ajuste de
  `ClienteInfoPage` para enlazar `Editar`, y reutilización de `services/vehicleService.js`
  (`getVehiculo`, `updateVehiculo`, `listVehiculos`, `listCategorias`, `listMarcas`,
  `listModelos`) y de `utils/validators.js` (formato de patente).
- Endpoints existentes: `GET /api/vehiculos/:id` y `PUT /api/vehiculos/:id` (servicio
  `crudService.update`), `GET /api/vehiculos`, `GET /api/categorias-vehiculo`,
  `GET /api/marcas-vehiculo`, `GET /api/modelos-vehiculo` y `GET /api/auth/session`.
- No modifica el backend ni la base de datos.
