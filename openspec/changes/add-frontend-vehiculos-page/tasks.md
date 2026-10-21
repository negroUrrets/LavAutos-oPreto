# Tasks

## 1. Página Vehiculos

- [x] 1.1 Crear `src/frontend/src/pages/VehiculosPage.jsx` y su ruta `/vehiculos` en `App.jsx`, con verificación de sesión, `AppHeader`, pill `VEHICULOS`, input de búsqueda con `placeholder` `Patente...`, panel de tabla y botón `← Volver` hacia `/home`. Verificar con pruebas el render, la redirección al login sin sesión y la navegación de `Volver`.
- [x] 1.2 Cargar los vehículos con `listVehiculos` y filtrar en memoria por coincidencia parcial (sin distinguir mayúsculas) en `patenteVehi` o `modelo.modeloVehi`; sin parámetros no mostrar filas; sin coincidencias mostrar `Busqueda sin resultados ...`; filas alternadas y botón `+ info` sin acción. Verificar con pruebas la coincidencia por patente y modelo, el estado vacío y que `+ info` no navega.

## 2. Enlace desde el inicio

- [x] 2.1 En `src/frontend/src/pages/HomePage.jsx`, hacer que el botón `VEHICULOS` navegue a `/vehiculos`. Verificar con prueba.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y registrar los resultados.
- [x] 3.2 Ejecutar `openspec validate add-frontend-vehiculos-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
