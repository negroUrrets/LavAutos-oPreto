# Proposal

## Why

La página «Nuevo Cliente» acepta cualquier carácter en `DNI`, `Celular`, `Nombre` y
`Apellido`. Este cambio restringe esos campos al tipo de dato correcto mientras se
tipea, con el mismo comportamiento que `Patente`: si se tipea un carácter del tipo
incorrecto, no se ingresa.

## What Changes

- `DNI` y `Celular`: aceptar solo dígitos; descartar letras, símbolos y espacios.
- `Nombre` y `Apellido`: aceptar solo letras (incluidos acentos y `ñ`); descartar
  números, símbolos y espacios.
- El descarte ocurre al tipear (máscara), igual que en `Patente`: el carácter del
  tipo incorrecto no se ingresa.
- **Fuera de alcance**: cambios al backend o al esquema; el formato de otros campos;
  validaciones adicionales al registrar (solo se agregan máscaras de tipo).

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `client-registration-page`: agrega que `DNI` y `Celular` acepten solo números y
  `Nombre` y `Apellido` solo letras, descartando el tipo incorrecto al tipear.

## Impact

- Modifica `src/frontend/src/utils/validators.js` (nuevas utilidades de máscara) y
  `src/frontend/src/pages/NuevoClientePage.jsx` (aplicar las máscaras), con sus
  pruebas.
- No modifica el backend ni la base de datos.
