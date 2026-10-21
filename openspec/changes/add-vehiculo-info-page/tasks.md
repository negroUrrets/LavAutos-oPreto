# Tasks

## 1. Componente compartido y página +info

- [x] 1.1 Extraer el layout de cards de `ClienteInfoPage` a `src/frontend/src/components/ClienteVehiculoInfo.jsx` (encabezado, card del cliente, cards de vehículo, hover, botón de volver y acciones recibidas por props) y hacer que `ClienteInfoPage` lo use. Verificar que las pruebas existentes de `ClienteInfoPage` siguen pasando.
- [x] 1.2 Crear `src/frontend/src/pages/VehiculoInfoPage.jsx` y su ruta `/vehiculos/:vehiculoId/info` en `App.jsx`: verificación de sesión, carga del vehículo con `getVehiculo`, cliente armado desde `datosCliente.persona`, render del componente compartido con ese único vehículo y `← Volver` hacia `/vehiculos`. Verificar con pruebas los datos mostrados, que muestra sólo ese vehículo, la redirección sin sesión y el enlace de volver.

## 2. Página Vehiculos

- [x] 2.1 Hacer que el botón `+ info` de cada fila navegue a `/vehiculos/:vehiculoId/info`. Verificar con prueba.
- [x] 2.2 Agregar el botón verde `+ Vehiculo` en la esquina superior derecha del panel y hacer que navegue a `/clientes`. Verificar con prueba; confirmar que `← Volver` navega a `/home`.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y registrar los resultados.
- [x] 3.2 Ejecutar `openspec validate add-vehiculo-info-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
