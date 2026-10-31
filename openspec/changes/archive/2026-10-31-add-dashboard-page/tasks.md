# Tasks

## 1. Backend

- [x] 1.1 Agregar `desde` y `hasta` a `buildListOptions` de `src/backend/services/lavadoService.js`, combinables con `estado` y `vehi`, sobre `fechaHoraLavadoTerminado` con límites locales de día; probar el filtro y el `400` por fecha inválida en `tests/lavados.test.js`.
- [x] 1.2 Agregar `sinLavadosDesde` a `list` de `src/backend/services/clienteService.js` para excluir clientes con lavados posteriores a esa fecha, combinable con `buscar`; probar en `tests/clientes.test.js` que incluye clientes sin lavados posteriores y excluye los que tienen uno.

## 2. Servicios y componente compartido

- [x] 2.1 Extender `listLavados(filtros = {})` en `src/frontend/src/services/lavadoService.js` para enviar `estado`, `vehi`, `desde` y `hasta`; probar la query en `lavadoService.test.js`.
- [x] 2.2 Agregar `listClientesSinLavados(desde)` a `src/frontend/src/services/clientService.js` (`GET /api/clientes?sinLavadosDesde=`); probar la llamada en `clientService.test.js`.
- [x] 2.3 Extraer la ventana `+info` de `LavadosPage.jsx` a `src/frontend/src/components/LavadoInfoPopup.jsx` y usarla en `LavadosPage`; verificar que `LavadosPage.test.jsx` sigue pasando.

## 3. Página Dashboard

- [x] 3.1 Crear `src/frontend/src/pages/DashboardPage.jsx` con su ruta `/dashboard` en `App.jsx` y la navegación del botón `DASHBOARD` en `HomePage.jsx`; probar acceso, redirección sin sesión, etiqueta no interactiva y `← Volver` al home.
- [x] 3.2 Implementar el panel de botones `REGISTRO LAVADOS`/`REGISTRO CLIENTES` con `#eed8d8`, hover y selección `#7eb93c`, y los registros deshabilitados en `#8f8a8a` que se habilitan y deshabilitan entre sí; probar los estados y el cambio de registro.
- [x] 3.3 Implementar el registro de lavados: calendarios `Desde...`/`Hasta...` con máximo hoy y `Hasta` no anterior a `Desde`, consulta de lavados `Entregado` por rango de entrega, filas con `N° Lavado`, `Categoria` y `Patente`, y `+info` con la ventana del lavado; probar filtros, resultados y cierre de la ventana.
- [x] 3.4 Implementar el registro de clientes: calendario `Seleccione...` con máximo hoy, consulta de clientes sin lavados posteriores, filas con `Nombre`, `Apellido` y `Celular`, y `+info` que abre la página de información del cliente; probar filtro, resultados y navegación.
- [x] 3.5 Conservar la búsqueda al volver: guardar `modo` y fechas en la URL del Dashboard, navegar a la información del cliente con `state.from` y hacer que `Volver` de `ClienteInfoPage` use ese origen; probar que al volver se repiten los mismos resultados.

## 4. Verificación final

- [x] 4.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y `npm test` en `src/backend`, y registrar los resultados.
- [x] 4.2 Ejecutar `openspec validate add-dashboard-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar este cambio con `/opsx-archive` tras la revisión.
