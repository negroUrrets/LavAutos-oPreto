# Proposal

## Why

Cada `Lavado` guarda hoy una sola utilería en la columna `Lavado.utileria`, pero las
pantallas de alta y edición muestran varios checkboxes y, al tildarlos, ejecutan
`PUT /api/utilerias/:id` para cambiar `estadoUtileria` del catálogo compartido. Eso produce
dos problemas: solo se persiste la primera utilería seleccionada (`seleccion[0]`) y la
selección de un lavado altera el estado global del catálogo, afectando a los demás lavados.
Además, la ventana `+info` de Lavados no muestra `Detalles`, no separa los datos del vehículo
de los del cliente y el título no está en verde.

El modelo de datos y el esquema de base de datos ya fueron actualizados para representar
una o varias utilerías por lavado mediante la tabla de detalle `DetalleUtileria`; la
implementación debe alinearse con ese diseño.

## What Changes

- **Base de datos**: se agrega `DetalleUtileria` (`codigoLavado`, `codigoUtileria`, clave
  primaria compuesta y claves foráneas hacia `Lavado` y `Utileria`) y se quita
  `Lavado.utileria`. Se actualiza el script de creación y se agrega una migración para las
  bases existentes: copia cada `Lavado.utileria` a `DetalleUtileria`, verifica la copia y
  recién entonces elimina la columna escalar.
- **Backend**: `POST /api/lavados` y `PUT /api/lavados/:id` aceptan `utilerias` como arreglo
  de códigos; validan que existan, deduplican y reemplazan el conjunto dentro de la misma
  transacción. Las respuestas de listar, obtener, crear y actualizar incluyen `utilerias`.
  `GET /api/lavados` y `GET /api/lavados/:id` devuelven la relación.
- **Catálogo**: `Utileria.estadoUtileria` permanece como estado propio del catálogo y NO se
  modifica al asignar o quitar utilerías de un lavado. Las pantallas de lavado dejan de
  llamar a `PUT /api/utilerias/:id`; ese endpoint sigue disponible para la gestión del
  catálogo.
- **Frontend**: las pantallas Nuevo Lavado y Editar Lavado permiten seleccionar una o varias
  utilerías sin tocar el catálogo. Editar precarga la selección del lavado y el alta envía
  todas las seleccionadas. Se actualizan los textos que sugerían una única utilería.
- **Ventana `+info`**: muestra siempre la fila `Detalles` (aunque el valor sea nulo), separa
  con una línea la información del vehículo de la del cliente y muestra el título
  `Informacion del Lavado` en verde.
- **Pruebas**: se agrega la prueba con dos lavados de selecciones distintas, verificando que
  cada uno conserve la suya y que el catálogo no cambie; se actualizan las pruebas de API,
  modelos y frontend.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `wash-management`: alta, actualización y representación de lavados con `utilerias` como
  conjunto; la selección pertenece al lavado y no al catálogo.
- `database-schema`: `Lavado` sin `utileria`; nueva tabla `DetalleUtileria`; migración de
  datos existentes.
- `lavado-registration-page`: selección múltiple de utilerías sin modificar el catálogo y
  envío de todas las seleccionadas.
- `lavado-edit-page`: precarga de las utilerías del lavado, selección múltiple local y envío
  del conjunto completo.
- `lavados-page`: ventana `+info` con `Detalles`, separador vehículo/cliente y título verde.

`utileria-management` no se modifica: el catálogo y su endpoint de actualización siguen
existiendo, pero dejan de usarse para la selección de lavados.

## Impact

- Backend: `src/backend/models/Lavado.js` (quitar `utileria`), nuevo
  `src/backend/models/DetalleUtileria.js`, `src/backend/models/index.js` (asociación
  `belongsToMany`), `src/backend/services/lavadoService.js` (validación y persistencia del
  conjunto), pruebas de `lavados`, `clientes`, `vehiculos` y `models`.
- Base de datos: `src/databaseLavadero/script db/DataBaseLavadero.sql` y nueva migración en
  el mismo directorio.
- Frontend: `NuevoLavadoPage.jsx`, `EditarLavadoPage.jsx`, `LavadoInfoPopup.jsx`,
  `lavadoService.js` y sus pruebas.
- API: **BREAKING** para `POST/PUT /api/lavados`: `utileria` (escalar) se reemplaza por
  `utilerias` (arreglo). El único consumidor es el frontend de este repositorio.
- Documentación: `Modelo de Datos.png` y `Esquema Base Datos.png` ya fueron actualizados por
  el usuario; este cambio no los vuelve a modificar.

## Risks and Open Decisions

- La migración elimina la columna `Lavado.utileria`; se debe ejecutar con respaldo previo y
  verificar que todas las filas se copiaron antes de eliminarla. La tarea de implementación
  debe revisar y autorizar la ejecución.
- La relación permite cero o más filas por lavado a nivel de esquema; la API mantiene la
  regla actual de exigir al menos una utilería en el alta y en la edición cuando se envía el
  conjunto.
- El diagrama de esquema muestra además columnas de `CategoriaLavado` (`precioCategoria`,
  `detalleCategoria`) que no forman parte de este pedido; quedan fuera de alcance y no se
  implementan en este cambio.
