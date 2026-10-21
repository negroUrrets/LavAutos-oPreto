# Proposal

## Why

La página de información del cliente ya muestra el botón `+ VEHICULO`, pero no permite
dar de alta un vehículo para ese cliente. Este cambio agrega la página «Agregar
Vehiculo» —fiel al prototipo `Prototipado/vehiculo/registrar_vehiculo_ultimo.jpg`— que
registra el vehículo del cliente seleccionado con el backend existente
(`POST /api/vehiculos`) y comunica el resultado con un popup; además enlaza el botón
`+ VEHICULO` a la nueva página.

También evita registrar dos veces la misma patente: antes de crear el vehículo compara
la patente con las ya registradas y, si coincide, avisa con un popup.

## What Changes

- Crear la página «Agregar Vehiculo» en `/clientes/:id/vehiculos/nuevo`, con el diseño
  del prototipo: tarjeta rosa titulada `Nuevo Vehiculo` con un panel azul que contiene
  los campos `Vehiculo`, `Marca`, `Modelo` y `Patente`, y los botones verde `Registrar`
  y rojo `Cancelar`.
- Cargar los comboboxes en cascada desde el backend: `Vehiculo` desde
  `CategoriaVehiculo.categoriaVehi`, `Marca` desde `MarcaVehiculo.marcaVehi` filtrado por
  el vehículo elegido, y `Modelo` desde `ModeloVehiculo.modeloVehi` filtrado por la marca
  elegida; `Patente` es un input con formato `AA-123-AA`.
- Exigir todos los campos: si alguno queda vacío o la patente no tiene el formato
  válido, advertir en la página (igual que las otras pantallas) y no registrar.
- Antes de registrar, comparar la patente con las patentes ya registradas; si coincide,
  mostrar un popup `Ese vehículo ya está registrado.` con un botón verde `Aceptar` y, al
  aceptarlo, limpiar el formulario sin registrar.
- Al presionar el botón verde `Registrar`: registrar el vehículo con
  `POST /api/vehiculos` (`patenteVehi`, `estadoVehi: true`, `cliente` seleccionado y
  `modeloVehi` elegido) y mostrar un popup informando que el vehículo se agregó
  satisfactoriamente; al cerrar el popup, volver a la página de información del cliente.
- Al presionar el botón rojo `Cancelar`: abortar y volver a la página de información del
  cliente sin registrar nada.
- En `ClienteInfoPage`, el botón `+ VEHICULO` de la card del cliente navega a la página
  «Agregar Vehiculo» con el cliente seleccionado; al volver, la página muestra la lista
  de vehículos actualizada.
- Verificar la sesión con `GET /api/auth/session` y redirigir a la página de inicio de
  sesión cuando no haya una sesión válida.
- **Fuera de alcance**: editar o eliminar vehículos, el botón `LAVAR`, otros accesos de
  las cards, cambios al backend, al esquema de la base de datos o al modelo de dominio,
  y cualquier ajuste fuera de lo descrito.

## Capabilities

### New Capabilities

- `vehicle-registration-page`: página «Agregar Vehiculo» del frontend que replica el
  prototipo, valida los datos y registra un vehículo para un cliente seleccionado usando
  el backend existente.

### Modified Capabilities

- `cliente-info-page`: el botón `+ VEHICULO` de la card del cliente navega a la página
  «Agregar Vehiculo» con el cliente seleccionado.

## Impact

- Frontend: nueva página y ruta `/clientes/:id/vehiculos/nuevo`, ajuste de
  `ClienteInfoPage` para enlazar `+ VEHICULO`, y reutilización de
  `services/vehicleService.js` (`listCategorias`, `listMarcas`, `listModelos`,
  `listVehiculos` —nueva— y `createVehiculo`) y de `utils/validators.js` (formato de
  patente).
- Endpoints existentes: `POST /api/vehiculos` (servicio `vehiculoService.js`),
  `GET /api/categorias-vehiculo`, `GET /api/marcas-vehiculo`,
  `GET /api/modelos-vehiculo`, `GET /api/vehiculos` (con o sin `cliente=:id`) y
  `GET /api/auth/session`.
- No modifica el backend ni la base de datos.
