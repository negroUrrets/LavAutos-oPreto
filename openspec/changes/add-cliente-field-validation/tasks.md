# Tasks

## 1. Utilidades de validación

- [x] 1.1 Crear `src/frontend/src/utils/validators.js` con `isValidEmail`, `formatPatente` y `isValidPatente`. Verificar con pruebas unitarias: `isValidEmail` acepta `fernando@gmail.com` y rechaza `fernando@`; `formatPatente` transforma `ab254mc` en `AB-254-MC` y descarta el tipo incorrecto; `isValidPatente` acepta `AB-254-MC` y rechaza `AB-254-M`.

## 2. Página Nuevo Cliente

- [x] 2.1 Aplicar la máscara de patente al input `Patente` (mientras se tipea). Verificar con una prueba que al tipear `ab254mc` el campo queda en `AB-254-MC`.
- [x] 2.2 Validar el formato del `e-mail` y de la `Patente` en el registro (advertencia en la página y sin registrar cuando no cumplen). Verificar con pruebas: e-mail inválido no registra y advierte; patente inválida no registra y advierte; con ambos válidos continúa el registro.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y registrar los resultados.
- [x] 3.2 Ejecutar `openspec validate add-cliente-field-validation --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
