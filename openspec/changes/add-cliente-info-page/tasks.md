# Tasks

## 1. Backend

- [x] 1.1 Ampliar `vehiculoService`: que el `include` de `modelo` incluya su `marca` y esta su `categoria`, y agregar un filtro opcional por `cliente`. Verificar con pruebas: el listado incluye marca y categoría; filtrar por cliente devuelve solo los de ese cliente; sin filtro devuelve todos.
- [x] 1.2 Filtrar por estado en los listados: `GET /api/clientes` (listado y búsqueda) devuelve solo `estadoCliente = 1`, y `GET /api/vehiculos` solo `estadoVehi = 1`. Verificar con pruebas que los registros inactivos quedan excluidos de los listados y que obtener por id sigue devolviéndolos.

## 2. Frontend: base

- [x] 2.1 Agregar la ruta `/clientes/:id/info` en `App.jsx`. Verificar con una prueba que la ruta renderiza la página de información.
- [x] 2.2 Extraer un componente `BrandHeader` (ícono del auto + `LavAutos oPreto`) y usarlo en `AppHeader` y en la nueva página. Verificar con una prueba que el encabezado sigue mostrando el título.
- [x] 2.3 Agregar `getCliente` a `clientService` y `listByCliente` a `vehicleService`. Verificar con pruebas (con `fetch` simulado) que llaman a los endpoints correctos con `credentials: 'include'`.

## 3. Frontend: página de información

- [x] 3.1 Implementar `ClienteInfoPage`: encabezado, card del cliente (avatar y `DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO`, `e-m@il` con los botones `+VEHICULO`, `Editar` y `Eliminar` sin acción), una card por vehículo (`Vehiculo`, `Marca`, `Modelo`, `PATENTE` con `Editar`, `Eliminar`, `LAVAR` sin acción), botón `Volver` y verificación de sesión. Verificar con pruebas: render de la card del cliente y de una card por vehículo, redirección al login sin sesión y `Volver` navega a Clientes.
- [x] 3.2 Implementar el efecto de hover entre cards (la señalada se adelanta y las demás se retrasan). Verificar con una prueba que al pasar el mouse sobre una card esta se adelanta y las demás se retrasan.

## 4. Enlace desde Clientes

- [x] 4.1 Hacer que el botón `+ info` de cada fila de `ClientesPage` navegue a `/clientes/<id>/info`. Verificar con una prueba que al hacer clic navega a la página de información del cliente.

## 5. Verificación final

- [x] 5.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y `npm test` en `src/backend`; registrar los resultados. Si no hay SQL Server accesible, registrar la limitación y no afirmar que las pruebas de backend pasaron.
- [x] 5.2 Ejecutar `openspec validate add-cliente-info-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
