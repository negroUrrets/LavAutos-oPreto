# Design

## Context

- Ver `proposal.md - Why`.
- `HomePage` dibuja el botón `DASHBOARD` sin `onClick`; las rutas se declaran en `App.jsx`.
- `AppHeader` ya incluye el ícono de usuario `ADMIN` y el popup de cierre de sesión.
- `GET /api/lavados` filtra por `estado` y `vehi` en `lavadoService.buildListOptions` e incluye
  `vehiculo` (con `modelo.marca` y `datosCliente.persona`), `categoria` y `datosEstado`.
- `GET /api/clientes` filtra por `buscar` y devuelve solo clientes activos con
  `codigoPersona`, `nombre`, `apellido`, `dni`, `email` y `celular`.
- `LavadosPage` define localmente una ventana `LavadoInfoPopup` con los datos del lavado, el
  vehículo y el cliente.
- `ClienteInfoPage` navega a `/clientes` desde su botón `Volver`.
- `lavadoService` del frontend no acepta filtros y `clientService` no tiene consulta por fecha.

## Goals / Non-Goals

**Goals:**

- Consultar lavados entregados por rango de entrega y clientes que no vuelven desde una fecha.
- Conservar la búsqueda y sus resultados al volver de la información de un cliente.

**Non-Goals:**

- Cambios de esquema o de base de datos, gráficos, exportaciones y paginación.

## Decisions

- **Ruta**: `/dashboard` con `DashboardPage.jsx`; `HomePage` enlaza `DASHBOARD`.
- **Encabezado**: reutilizar `AppHeader`; la etiqueta `DASHBOARD` es un `span` con estilo de
  píldora, sin `onClick`.
- **Panel de botones**: `REGISTRO LAVADOS` y `REGISTRO CLIENTES` con fondo `#eed8d8` y
  `hover:bg-[#7eb93c]`; el seleccionado queda en `#7eb93c` y el otro en gris.
- **Registros deshabilitados**: cada registro es un `fieldset` con `disabled`; deshabilitado se
  pinta con `#8f8a8a` y habilitado con los colores del prototipo (encabezado verde `#7eb93c`
  para lavados y rojo `#cc0000` para clientes, filas `#2637a2`).
- **Fechas del frontend**: `<input type="date">` con `max` igual a la fecha local de hoy;
  `Hasta` lleva `min` igual a `Desde`.
- **Backend lavados**: en `buildListOptions`, `desde` y `hasta` se combinan con `estado` y
  `vehi` mediante `Op.gte`/`Op.lte` sobre `fechaHoraLavadoTerminado`, con límites locales
  `T00:00:00.000` y `T23:59:59.999`. Una fecha inválida responde `400`.
- **Backend clientes**: `list` acepta `sinLavadosDesde`; busca los lavados con
  `fechaHoraLavado > fin del día` y sus `vehiculo.cliente`, y excluye esos clientes del listado
  de activos con `Op.notIn`, combinable con `buscar`.
- **Estado `Entregado`**: el Dashboard resuelve el código con `listEstadosLavado()` buscando
  `descripcionEstado` igual a `Entregado` (sin distinguir mayúsculas).
- **Servicios del frontend**: `listLavados(filtros = {})` arma la query con `estado`, `vehi`,
  `desde` y `hasta`; `clientService.listClientesSinLavados(desde)` consulta
  `/api/clientes?sinLavadosDesde=`.
- **Estado en la URL**: `useSearchParams` guarda `modo` (`lavados` o `clientes`), `desde`,
  `hasta` y `fecha`; al entrar con parámetros, la página repite la consulta. Así el `+info` del
  cliente puede volver con la misma búsqueda.
- **Volver desde la información del cliente**: el Dashboard navega a
  `/clientes/:id/info` con `state.from` igual a la URL del Dashboard; `ClienteInfoPage` usa
  `location.state?.from ?? '/clientes'` en su botón `Volver`.
- **Ventana `+info` del lavado**: extraer `LavadoInfoPopup` de `LavadosPage` a
  `components/LavadoInfoPopup.jsx` y reutilizarla en ambas páginas.
- **Sesión**: `fetchSession`; sin sesión válida, redirigir a `/login`.

## Risks / Trade-offs

- [Zona horaria de los rangos] → los límites se construyen como hora local del servidor; si el
  servidor no está en UTC-03:00, los bordes del día pueden diferir. Se documenta y se prueba con
  fechas locales.
- [Fechas distintas por registro] → los lavados filtran por `fechaHoraLavadoTerminado` y los
  clientes por `fechaHoraLavado`; son criterios distintos y quedan explícitos en las specs.
- [Extraer la ventana de `LavadosPage`] → se mueve código usado por una pantalla existente; las
  pruebas de `LavadosPage` deben seguir pasando.
- [Filtros visibles en la URL] → no exponen datos sensibles; facilitan restaurar la búsqueda.

## Migration Plan

- Sin cambios de esquema ni de datos.
