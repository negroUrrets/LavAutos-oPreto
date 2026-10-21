# Tasks

## 1. Backend

- [x] 1.1 Ajustar `clienteService.remove`: si el cliente tiene lavados, aplicar baja lógica (`estadoCliente = 0` y `estadoVehi = 0` de todos sus vehículos); si no tiene lavados, eliminarlo permanentemente junto con sus vehículos. Verificar con pruebas: cliente sin lavados se elimina (`204`), cliente con lavados no se elimina y queda con estado inactivo (`204`), y cliente inexistente responde `404`.

## 2. Frontend: popup de eliminación

- [x] 2.1 Crear el componente de confirmación (modal) con el encabezado `!!! AVISO !!!`, el mensaje `¿ Desea eliminar permanentemente el <nombre> seleccionado ?` y los botones `ACEPTAR` y `CANCELAR`. Verificar con una prueba que se muestra el mensaje con el nombre y los dos botones.
- [x] 2.2 Agregar `deleteCliente` a `clientService` (DELETE `/api/clientes/:id`). Verificar con una prueba (con `fetch` simulado) que llama al endpoint correcto con `credentials: 'include'`.
- [x] 2.3 En `ClienteInfoPage`, hacer que el botón `Eliminar` de la card del cliente abra el popup; `ACEPTAR` llama a `deleteCliente` y navega a `/clientes`; `CANCELAR` cierra el popup y permanece en la página. Verificar con pruebas ambas rutas.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y `npm test` en `src/backend`; registrar los resultados. Si no hay SQL Server accesible, registrar la limitación y no afirmar que las pruebas de backend pasaron.
- [x] 3.2 Ejecutar `openspec validate add-eliminar-cliente-popup --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
