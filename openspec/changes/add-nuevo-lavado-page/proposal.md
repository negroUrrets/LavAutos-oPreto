# Proposal

## Why

El botón `LAVAR` de la card de vehículo no hace nada y no existe una pantalla para registrar un
lavado. Este cambio agrega la página «Nuevo Lavado» (prototipo
`Prototipado/lavado/Nuevo Lavado.jpg`), registra el lavado del vehículo seleccionado con el
backend existente y evita iniciar un segundo lavado para un vehículo que ya tiene uno en curso.

## What Changes

- `LAVAR` de la card de vehículo: antes de navegar consulta los lavados del vehículo
  (`GET /api/lavados?vehi=:id`); si alguno está «En Espera», «Lavando» o «Terminado» muestra un
  popup de aviso y permanece en la información del cliente; si no, navega a «Nuevo Lavado».
- Página «Nuevo Lavado» en `/clientes/:id/vehiculos/:vehiculoId/lavar`: muestra la patente del
  vehículo y el formulario del prototipo.
  - Checkboxes de utilerías (`Utileria`): al tildar o destildar se actualiza `estadoUtileria`
    (1/0) de esa fila.
  - Toggles de categoría (`CategoriaLavado`): uno solo activo; al seleccionar otro, el anterior
    vuelve a su posición original.
  - `Detalles` (letras, números y espacios) → `detallesLavado`.
  - Combobox de estado (`EstadoLavado`) → `estado`.
- `Registrar Lavado` muestra `ConfirmPopup` con la patente; al aceptar registra el lavado
  (`POST /api/lavados`) con el `login` de la sesión y vuelve a la información del cliente; al
  cancelar cierra el popup y restablece el formulario a su estado original.
- `Cancelar` vuelve a la información del cliente sin registrar.
- Backend: `GET /api/lavados` acepta el filtro `vehi`; nuevo `PUT /api/utilerias/:id` para
  actualizar `estadoUtileria`; el seed agrega los catálogos base (Auxilio, Balizas, Matafuegos;
  Basico, Completo, Premium; En Espera, Lavando, Terminado) si faltan.
- **Fuera de alcance**: edición y listado de lavados, el `LAVAR` de otras pantallas, cambios al
  esquema, y guardar varias utilerías por lavado (se guarda la primera tildada).

## Capabilities

### New Capabilities

- `lavado-registration-page`: página «Nuevo Lavado» del frontend.
- `utileria-management`: actualización del estado de una utilería.

### Modified Capabilities

- `cliente-info-page`: el botón `LAVAR` verifica el lavado en curso y navega.
- `wash-management`: `GET /api/lavados` acepta el filtro `vehi`.

## Impact

- Backend: `services/lavadoService.js` (filtro `vehi`), nuevo `services/utileriaService.js` y
  `routes/utilerias.js`, seed de catálogos, y pruebas.
- Frontend: nueva `NuevoLavadoPage.jsx` y ruta, `ClienteVehiculoInfo.jsx`/`ClienteInfoPage.jsx`
  para `LAVAR`, servicios de lavados/utilerías/sesión y pruebas.
- No cambia el esquema ni la base de datos.
