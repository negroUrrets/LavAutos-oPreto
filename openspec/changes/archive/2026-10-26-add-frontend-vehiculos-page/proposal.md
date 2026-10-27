# Proposal

## Why

La página de inicio ya muestra el botón `VEHICULOS`, pero no existe una página para
consultar los vehículos ni el botón está enlazado. Este cambio agrega la página
«Vehiculos» —fiel al prototipo `Prototipado/vehiculo/buscar_vehiculo_nuevo.jpg`— con
búsqueda en vivo por modelo o patente y la lista de vehículos, y enlaza el botón.

## What Changes

- Crear la página «Vehiculos» en `/vehiculos` con el encabezado de la aplicación (marca y
  avatar con cierre de sesión), el pill `VEHICULOS`, un input de búsqueda con
  `placeholder` `Patente...` y un panel azul con la tabla `TIPO`, `MARCA`, `MODELO` y
  `PATENTE`, más un botón verde `+ info` en cada fila (sin acción por ahora).
- Cargar los vehículos con `GET /api/vehiculos` y filtrar en el frontend por coincidencia
  parcial, sin distinguir mayúsculas, en la patente o en el modelo, a medida que se
  tipea (`AB`, `122` o `FC` encuentran `AB-122-FC`).
- Sin parámetros en el input no se muestran vehículos; si no hay coincidencias se muestra
  `Busqueda sin resultados ...` sin avisos de error.
- Mostrar las filas con colores alternados para facilitar la lectura.
- El botón `← Volver` (con la flecha más grande) navega a la página de inicio.
- Verificar la sesión con `GET /api/auth/session` y ofrecer el cierre de sesión con el
  encabezado existente.
- En `HomePage`, el botón `VEHICULOS` navega a `/vehiculos`.
- **Fuera de alcance**: la funcionalidad de `+ info`; una barra lateral con
  `CLIENTES`/`VEHICULOS`/`LAVADOS`/`DASHBOARD` (se sigue el prototipo nuevo, sin
  sidebar); cambios al backend, al esquema o al modelo de dominio; y el alta, edición o
  eliminación de vehículos.

## Capabilities

### New Capabilities

- `vehiculos-page`: página del frontend para buscar y listar vehículos por modelo o
  patente.

### Modified Capabilities

- `home-page`: el botón `VEHICULOS` navega a la página «Vehiculos».

## Impact

- Frontend: nueva página y ruta `/vehiculos`, ajuste de `HomePage` para enlazar
  `VEHICULOS`, y reutilización de `services/vehicleService.js` (`listVehiculos`) y de
  `components/AppHeader.jsx` (encabezado y logout).
- Endpoints existentes: `GET /api/vehiculos` y `GET /api/auth/session`.
- No modifica el backend ni la base de datos.
