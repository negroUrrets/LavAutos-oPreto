# Tasks

## 1. Utilidades de máscara

- [x] 1.1 Agregar `onlyDigits` y `onlyLetters` a `src/frontend/src/utils/validators.js`. Verificar con pruebas unitarias: `onlyDigits('12a3')` devuelve `123`; `onlyLetters('Muñoz 1')` devuelve `Muñoz`; `onlyLetters('Ángel')` devuelve `Ángel`.

## 2. Página Nuevo Cliente

- [x] 2.1 Aplicar `onlyDigits` a los campos `DNI` y `Celular`, y `onlyLetters` a `Nombre` y `Apellido`. Verificar con pruebas: tipear una letra en `DNI` no la ingresa; tipear un número en `Nombre` no lo ingresa; tipear `Muñoz` se ingresa completo.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y registrar los resultados.
- [x] 3.2 Ejecutar `openspec validate add-cliente-field-type-masks --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
