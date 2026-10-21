# Tasks

## 1. Base de la página

- [x] 1.1 Agregar la ruta `/clientes/nuevo` en `App.jsx`. Verificar con una prueba que la ruta renderiza la página «Nuevo Cliente».
- [x] 1.2 Agregar `createCliente` a `clientService` y crear `vehicleService` con `createVehiculo`, `listCategorias`, `listMarcas` y `listModelos`. Verificar con pruebas (con `fetch` simulado) que cada función llama al endpoint correcto con `credentials: 'include'`.

## 2. Formulario

- [x] 2.1 Implementar la página «Nuevo Cliente» con el diseño del prototipo (título `Nuevo Cliente`, panel de la persona con `DNI`, `Nombre`, `Apellido`, `Celular` y `e-mail`, panel del vehículo con `Tipo Vehiculo`, `Marca Vehiculo`, `Modelo Vehiculo` y `Patente`, y botones `Registrar` y `Cancelar`). Verificar con una prueba de render que se muestran los campos y los botones.
- [x] 2.2 Implementar la exigencia de todos los campos con advertencia en la página (sin registrar) cuando alguno queda vacío. Verificar con una prueba que con un campo vacío no se registra y se muestra la advertencia.
- [x] 2.3 Implementar los comboboxes en cascada (categorías al montar; marcas filtradas por el tipo elegido; modelos filtrados por la marca elegida). Verificar con pruebas que las marcas dependen del tipo y los modelos de la marca.

## 3. Registro y popups

- [x] 3.1 Implementar el pre-chequeo de `dni` duplicado (con `GET /api/clientes?buscar=<dni>` y coincidencia exacta): si existe, mostrar el popup de cliente ya registrado con botón verde `Aceptar` y, al aceptarlo, limpiar el formulario. Verificar con pruebas.
- [x] 3.2 Implementar el registro: si el `dni` no existe, crear el cliente (`POST /api/clientes`) y el vehículo (`POST /api/vehiculos`) y mostrar el popup `Bienvenido <nombre>`; al aceptarlo, navegar a `/clientes`. Verificar con pruebas.
- [x] 3.3 Implementar `Cancelar` para navegar a `/clientes` sin registrar. Verificar con una prueba.
- [x] 3.4 Implementar la verificación de sesión con `GET /api/auth/session` y la redirección al login sin sesión válida. Verificar con una prueba.

## 4. Enlace desde Clientes

- [x] 4.1 Hacer que el botón `+ CLIENTE` de `ClientesPage` navegue a `/clientes/nuevo`. Verificar con una prueba que al hacer clic navega a la página «Nuevo Cliente».

## 5. Verificación final

- [x] 5.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y registrar los resultados.
- [x] 5.2 Ejecutar `openspec validate add-frontend-nuevo-cliente-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
