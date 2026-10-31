# Tasks

## 1. Servicio y enlace desde Lavados

- [x] 1.1 Agregar `getLavado(id)` a `src/frontend/src/services/lavadoService.js` (`GET /api/lavados/:id`, `null` si falla) y probar la llamada en `lavadoService.test.js`.
- [x] 1.2 En `src/frontend/src/pages/LavadosPage.jsx`, hacer que `Editar` navegue a `/lavados/:lavadoId/editar` y probar la navegación en `LavadosPage.test.jsx`.

## 2. Página Editar Lavado

- [x] 2.1 Crear `src/frontend/src/pages/EditarLavadoPage.jsx` y su ruta `/lavados/:lavadoId/editar` en `App.jsx`, con verificación de sesión y carga del lavado y catálogos; probar la precarga, la redirección sin sesión y la vuelta a `/lavados` con lavado inexistente.
- [x] 2.2 Implementar en la página los checkboxes de utilería (`PUT /api/utilerias/:id`), los toggles de categoría de selección única, el campo `Detalles` y el combobox de estado con todas las filas; probar cada control en `EditarLavadoPage.test.jsx`.
- [x] 2.3 Implementar `Registrar`: validar categoría, estado y al menos una utilería, ejecutar `PUT /api/lavados/:id` con `categoriaLavado`, `estado`, `utileria` y `detallesLavado`, mostrar el popup `Lavado editado exitosamente` y volver a `/lavados` al aceptarlo; probar el envío, la validación y el error de guardado.
- [x] 2.4 Implementar `Cancelar` para volver a `/lavados` sin enviar la actualización; probar que no se ejecuta el `PUT` y que se navega al listado.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y `npm test` en `src/backend`, y registrar los resultados.
- [x] 3.2 Ejecutar `openspec validate add-editar-lavado-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar `add-lavados-page` antes de este cambio, para que exista la spec base `lavados-page` que el delta `MODIFIED` necesita.
- Archivar este cambio con `/opsx-archive` tras la revisión.
