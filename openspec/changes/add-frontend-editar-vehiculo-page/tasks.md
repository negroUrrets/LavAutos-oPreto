# Tasks

## 1. Página Editar Vehiculo

- [x] 1.1 Agregar `getVehiculo` a `src/frontend/src/services/vehicleService.js` y crear `src/frontend/src/pages/EditarVehiculoPage.jsx` con su ruta `/clientes/:id/vehiculos/:vehiculoId/editar` en `App.jsx`: verificación de sesión, carga del vehículo con sus datos precargados en `Vehiculo`/`Marca`/`Modelo`/`Patente`, título `Editar Vehiculo` y botones `Registrar`/`Cancelar`. Verificar con pruebas la precarga y la redirección al login sin sesión.
- [x] 1.2 Cargar los catálogos en cascada con `listCategorias`/`listMarcas`/`listModelos` y validar campos obligatorios y patente `AA-123-AA` con `formatPatente`/`isValidPatente`, con advertencia en página. Verificar con pruebas el filtrado de marca/modelo y las advertencias de campo vacío y patente inválida.
- [x] 1.3 Antes de guardar, comparar la patente normalizada con `listVehiculos` excluyendo el propio vehículo; si coincide, mostrar el `Popup` `Error: vehiculo ya registrado` y, al aceptar, restablecer el formulario a los datos originales sin llamar a la API. Verificar con pruebas que se muestra el popup, no se guarda y se restablecen los datos.
- [x] 1.4 Agregar `updateVehiculo` y, en `Registrar`, actualizar el vehículo (`PUT /api/vehiculos/:id`) con la patente, el modelo, el cliente de la ruta y `estadoVehi: true`; mostrar el popup de éxito y navegar a `/clientes/:id/info` al cerrarlo; ante error, advertir sin navegar. `Cancelar` navega a `/clientes/:id/info` sin llamar a la API. Verificar con pruebas ambas rutas y el error.

## 2. Enlace desde la información del cliente

- [x] 2.1 En `src/frontend/src/pages/ClienteInfoPage.jsx`, hacer que `Editar` de cada card de vehículo navegue a `/clientes/:id/vehiculos/:vehiculoId/editar`. Verificar con prueba que el botón navega con el vehículo seleccionado.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y registrar los resultados.
- [x] 3.2 Ejecutar `openspec validate add-frontend-editar-vehiculo-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
