# Proposal

## Why

La página «Nuevo Cliente» acepta cualquier `e-mail` y cualquier `Patente`. Este
cambio valida el formato del `e-mail` antes de registrar y exige el formato de
patente `AA-123-AA` (2 letras, 3 números, 2 letras), con una máscara que va agregando
los guiones y restringe el tipo de carácter mientras se tipea.

## What Changes

- Validar el `e-mail` antes de registrar: si no cumple un formato de correo válido
  (por ejemplo `fernando@gmail.com`), advertir en la página y no registrar.
- Exigir que `Patente` cumpla el formato de 2 letras, 3 números y 2 letras separados
  por guiones (por ejemplo `AB-254-MC`); al registrar, si no cumple, advertir en la
  página y no registrar.
- Máscara del campo `Patente`: mientras se tipea, agregar automáticamente los
  guiones, convertir a mayúsculas y descartar los caracteres del tipo incorrecto
  (letra donde va número o viceversa).
- Guardar la `Patente` con los guiones (`AB-254-MC`).
- **Fuera de alcance**: cambios al backend o al esquema; el formato de otros campos;
  y cualquier ajuste fuera de lo descrito.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `client-registration-page`: agrega la validación del formato de `e-mail` y el
  formato y la máscara de `Patente`.

## Impact

- Modifica `src/frontend/src/pages/NuevoClientePage.jsx` (validaciones y máscara) y
  sus pruebas.
- No modifica el backend ni la base de datos.
