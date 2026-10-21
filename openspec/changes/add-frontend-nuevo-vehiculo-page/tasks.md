# Tasks

## 1. Página Agregar Vehiculo

- [x] 1.1 Crear `src/frontend/src/pages/NuevoVehiculoPage.jsx` y su ruta `/clientes/:id/vehiculos/nuevo` en `App.jsx`, con verificación de sesión, título `Nuevo Vehiculo`, comboboxes `Vehiculo`/`Marca`/`Modelo`, input `Patente` y botones `Registrar`/`Cancelar`. Verificar con pruebas: render con sesión válida muestra título, campos y botones; sin sesión redirige al login.
- [x] 1.2 Cargar los catálogos en cascada con `listCategorias`/`listMarcas`/`listModelos`, y validar campos obligatorios y patente `AA-123-AA` con `formatPatente`/`isValidPatente` y advertencia en página. Verificar con pruebas el filtrado de marca/modelo y las advertencias de campo vacío y patente inválida.
- [x] 1.3 Agregar `listVehiculos` a `src/frontend/src/services/vehicleService.js` (`GET /api/vehiculos`). Antes de registrar, comparar la patente normalizada con las de esa lista; si coincide, mostrar el `Popup` `Ese vehículo ya está registrado.` y, al aceptar, limpiar el formulario sin llamar a `createVehiculo`. Verificar con pruebas que se muestra el popup, no se registra y el formulario queda vacío.
- [x] 1.4 En `Registrar`, llamar a `createVehiculo` con el `cliente` de la ruta, el `modeloVehi` elegido, la patente y `estadoVehi: true`; mostrar el `Popup` de éxito y navegar a `/clientes/:id/info` al cerrarlo; ante error, advertir sin navegar. `Cancelar` navega a `/clientes/:id/info` sin llamar a la API. Verificar con pruebas ambas rutas y el error.

## 2. Enlace desde la información del cliente

- [x] 2.1 En `src/frontend/src/pages/ClienteInfoPage.jsx`, hacer que `+ VEHICULO` navegue a `/clientes/:id/vehiculos/nuevo`. Verificar con prueba que el botón navega con el id del cliente.
- [x] 2.2 Verificar que al volver a `ClienteInfoPage` la lista de vehículos se refresca con `listByCliente` y muestra el vehículo agregado. Verificar con una prueba que la página vuelve a solicitar los vehículos al montarse.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y registrar los resultados.
- [x] 3.2 Ejecutar `openspec validate add-frontend-nuevo-vehiculo-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
