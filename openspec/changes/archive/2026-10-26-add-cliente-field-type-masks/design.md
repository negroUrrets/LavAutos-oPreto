# Design

## Context

Ver `proposal.md - Why`. La página «Nuevo Cliente» ya aplica una máscara a `Patente`
(mayúsculas, descarta el tipo incorrecto y agrega guiones). Este cambio agrega máscaras
de tipo a `DNI`, `Celular`, `Nombre` y `Apellido`. La spec durable
`client-registration-page` aún no existe (el cambio previo no está archivado), por lo
que este cambio la modifica.

## Goals / Non-Goals

**Goals:**

- Restringir `DNI` y `Celular` a números.
- Restringir `Nombre` y `Apellido` a letras (con acentos y `ñ`).
- Descartar el tipo incorrecto al tipear, como en `Patente`.

**Non-Goals:**

- Cambios al backend o al esquema.
- Validar el formato de otros campos.
- Limitar la longitud de los campos.
- Permitir espacios en nombres/apellidos (por decisión del usuario).

## Decisions

### Utilidades de máscara

Se agregan funciones puras en `src/frontend/src/utils/validators.js`:

- `onlyDigits(texto)`: descarta todo lo que no sea dígito.
- `onlyLetters(texto)`: descarta todo lo que no sea letra, conservando acentos y `ñ`
  (`A-Z a-z ÁÉÍÓÚÜÑ áéíóúüñ`); descarta números, símbolos y espacios.

Centralizarlas permite probarlas de forma unitaria y reutilizarlas en los campos.

### Aplicación en el formulario

En `NuevoClientePage`, los `onChange` de `DNI` y `Celular` aplican `onlyDigits`, y los
de `Nombre` y `Apellido` aplican `onlyLetters`. No se convierten a mayúsculas (a
diferencia de `Patente`) y no se agrega límite de longitud.

### Sin validación al registrar

Las restricciones son máscaras de entrada; no se agregan validaciones de tipo en el
registro (los valores que llegan al submit ya cumplen el tipo). El formato de `e-mail`
y `Patente` se sigue validando al registrar, como hasta ahora.

## Risks / Trade-offs

- [Descartar espacios en nombres] -> Nombres compuestos con espacio no se podrán
  tipear; es la decisión del usuario (se documenta).
- [Sin límite de longitud] -> `DNI`/`Celular` podrían tipearse largos; el backend valida
  el tipo numérico. Un límite podría agregarse en un cambio posterior.
- [Sin validación en el backend] -> La restricción es de la interfaz.

## Migration Plan

- Frontend: agregar `onlyDigits`/`onlyLetters`, aplicarlas en `NuevoClientePage` y
  sumar pruebas; ejecutar `npm run lint` y `npm test`.
- Verificación: `openspec validate add-cliente-field-type-masks --strict`.
- Rollback: revertir los archivos modificados/agregados.

## Open Questions

- Permitir espacios en nombres/apellidos (nombres compuestos).
- Limitar la longitud de `DNI` y `Celular`.
- Validar el tipo también en el backend.
