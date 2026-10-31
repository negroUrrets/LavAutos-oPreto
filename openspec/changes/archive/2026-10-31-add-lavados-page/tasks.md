# Tasks

## 1. Backend

- [x] 1.1 Agregar `Entregado` a `ESTADOS` en `src/backend/services/catalogSeedService.js`. Verificar con `tests/catalogSeed.test.js` y ejecutando el seed dos veces (idempotente).

## 2. Frontend

- [x] 2.1 Agregar `listLavados` y `updateLavado` a `src/frontend/src/services/lavadoService.js`. Verificar con pruebas de los servicios.
- [x] 2.2 Crear `src/frontend/src/pages/LavadosPage.jsx` y su ruta `/lavados` en `App.jsx`: botón `Nuevo Lavado` (navega a Clientes y anima, pausando en hover), tres secciones colapsables con borde/etiqueta/ícono animado, filas con `N°`, hora y patente, `+info` en ventana con `Aceptar`, `Editar` sin acción, avance de estado con popups y recarga, y `←` al home. Verificar con pruebas.
- [x] 2.3 Agregar los `@keyframes` de animación horizontal y vertical en `src/frontend/src/index.css`. Verificar revisando el CSS y que las pruebas de la página pasen.
- [x] 2.4 En `src/frontend/src/pages/HomePage.jsx`, hacer que `LAVADOS` navegue a `/lavados`. Verificar con prueba.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y `npm test` en `src/backend`, y registrar los resultados. Si la base no está disponible, registrar la limitación.
- [x] 3.2 Ejecutar `openspec validate add-lavados-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio con `/opsx-archive` tras la revisión.
