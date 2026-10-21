# Design

## Context

Ver `proposal.md - Why`. La página «Nuevo Cliente» (`src/frontend/src/pages/NuevoClientePage.jsx`)
ya registra el cliente y su vehículo con validación de campos obligatorios y
pre-chequeo de dni. Este cambio agrega la validación del formato de `e-mail` y el
formato y la máscara de `Patente`. La spec durable `client-registration-page` aún no
existe (el cambio previo no está archivado), por lo que este cambio la modifica.

## Goals / Non-Goals

**Goals:**

- Validar el formato del `e-mail` antes de registrar.
- Exigir el formato de `Patente` `AA-123-AA` y facilitarlo con una máscara.

**Non-Goals:**

- Cambios al backend o al esquema.
- Validar el formato de otros campos.
- Normalizar la patente al guardarla (se guarda tal como se muestra, con guiones).

## Decisions

### Utilidades de validación

Se agregan funciones puras en `src/frontend/src/utils/validators.js`:

- `isValidEmail(texto)`: formato de correo básico (`algo@dominio.algo`).
- `formatPatente(texto)`: aplica la máscara (mayúsculas, solo letras/números, descarta
  el tipo incorrecto y agrega los guiones).
- `isValidPatente(texto)`: verifica `AA-123-AA` (2 letras, guion, 3 números, guion, 2 letras).

Centralizarlas permite probarlas de forma unitaria.

### Máscara de patente

La máscara procesa el texto tipeado así:

1. Pasa a mayúsculas y descarta todo lo que no sea letra o número.
2. Recorre los caracteres contra el patrón `L L N N N L L` (letra, letra, número,
   número, número, letra, letra) y **descarta** el carácter cuyo tipo no corresponde a
   la posición (por ejemplo un número donde va una letra).
3. Inserta los guiones: tras las 2 primeras letras y tras los 3 números.

Ejemplo: `ab254mc` → `AB-254-MC`; `A1B254MC` → `AB-254-MC`; tipear un número primero
no agrega nada.

### Validación al registrar

El orden en `handleSubmit` pasa a ser: campos obligatorios → formato de `e-mail` →
formato de `Patente` → pre-chequeo de `dni` → registro. Si el `e-mail` o la `Patente`
no cumplen, se muestra una advertencia en la página (mismo estilo que las ya
existentes) y no se registra.

Mensajes: `El e-mail no tiene un formato válido.` y
`La patente debe tener el formato AA-123-AA.`

### Patente almacenada con guiones

El vehículo se crea con `patenteVehi` igual al valor mostrado (con guiones), por
decisión del usuario.

## Risks / Trade-offs

- [Regex de e-mail] -> Un formato básico; casos límite poco frecuentes podrían
  requerir ajustes. No se valida en el backend (queda para un cambio posterior).
- [Máscara que descarta caracteres] -> Tipear en un orden distinto al esperado
  descarta el carácter; es el comportamiento pedido.
- [Sin validación en el backend] -> El backend acepta cualquier patente/e-mail; la
  restricción es de la interfaz.

## Migration Plan

- Frontend: agregar `validators.js`, ajustar `NuevoClientePage.jsx` y sus pruebas;
  ejecutar `npm run lint` y `npm test`.
- Verificación: `openspec validate add-cliente-field-validation --strict`.
- Rollback: revertir los archivos modificados/agregados.

## Open Questions

- Validar e-mail/patente también en el backend.
- Normalizar la patente (por ejemplo, sin guiones) para búsquedas futuras.
