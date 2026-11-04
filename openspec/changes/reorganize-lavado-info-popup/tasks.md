# Tasks

## 1. Ventana +info

- [x] 1.1 En `src/frontend/src/components/LavadoInfoPopup.jsx`, mover la fila `DETALLES` al final de la sección del vehículo (después de `MARCA`) y agregar debajo una fila `UTILERIAS` con `(lavado.utilerias ?? []).map((u) => u.descripcionUtileria).filter(Boolean).join(' - ')`, manteniendo el separador, los datos del cliente y el título verde
- [x] 1.2 Actualizar `src/frontend/src/pages/LavadosPage.test.jsx`: agregar `utilerias` al fixture, verificar que `DETALLES` queda antes del separador con su valor, que `UTILERIAS` muestra las descripciones unidas por ` - ` y que sin utilerías la fila queda vacía; verificar con `npx vitest run src/pages/LavadosPage.test.jsx`
- [x] 1.3 Ejecutar `npm test` y `npm run lint` en `src/frontend`; registrar los resultados
- [x] 1.4 Ejecutar `openspec validate reorganize-lavado-info-popup --strict` y registrar el resultado

## Workflow follow-up

- Archivar `add-lavado-utilerias` antes de sincronizar o archivar este cambio, para que la especificación principal ya incluya `Detalles`, el separador y el título verde.
- Archivar este cambio después de la revisión del proyecto y verificar el resultado.
