# Design

## Context

- Los cambios archivados agregaron requisitos de navegación a `clients-page`,
  `vehiculos-page` y `cliente-info-page` como `ADDED`, mientras los requisitos anteriores
  de esos botones seguían diciendo «no ejecuta ninguna acción». El resultado son
  afirmaciones contradictorias en la misma main spec.
- `client-management` quedo con «Listar clientes» limitado a activos y «Búsqueda de
  clientes» diciendo «todos los clientes».
- `vehicle-management` tiene «Listar vehículos» y «Solo vehículos activos» describiendo
  el mismo filtro.
- El código ya implementa el comportamiento de los requisitos de navegación, popups y
  listado activo; este cambio no modifica código.

## Goals / Non-Goals

**Goals:**

- Dejar cada main spec sin afirmaciones contradictorias ni requisitos duplicados.
- Conservar la información visual de los botones y los datos de las cards.

**Non-Goals:**

- Cambiar comportamiento, API, esquema o frontend.
- Reescribir requisitos no afectados por las contradicciones.

## Decisions

- **Conservar el requisito de navegación y eliminar el obsoleto**, en lugar de modificar
  el obsoleto. El requisito viejo se llama, por ejemplo, «Botón de alta de cliente» y su
  escenario es «Botón visible sin acción»; un `MODIFIED` debe mantener los nombres de
  escenario, así que no puede quitar la conducta obsoleta sin dejar un nombre engañoso.
  Se traslada la descripción visual (color y texto del botón) al requisito de navegación.
- **`cliente-info-page`: `REMOVED` + `ADDED`.** «Card del cliente» y «Card por vehículo»
  incluyen el escenario «Botones sin acción», que `MODIFIED` no puede descartar. Se
  reemplazan por «Contenido de la card del cliente» y «Contenido de la card del vehículo»,
  que describen datos y botones sin afirmar que no actúan; las acciones quedan en los
  requisitos específicos ya existentes.
- **`vehicle-management`:** «Listar vehículos» absorbe el escenario «Vehículos inactivos
  excluidos» y se elimina «Solo vehículos activos».
- **`client-management`:** «Búsqueda de clientes» pasa a decir «clientes activos», igual
  que «Listar clientes».
- **Riesgo controlado:** un `REMOVED` pierde el texto exacto del requisito. La
  información útil se traslada antes de eliminar. No hay cambios de datos ni de código.

## Risks / Trade-offs

- [Eliminar requisitos puede perder matices] → se copian los datos y la descripción
  visual relevantes a los requisitos que quedan.
- [Deltas con `REMOVED` requieren `Reason` y `Migration`] → cada bloque los incluye.
- [El cambio no toca código] → la verificación es `openspec validate --strict` y una
  búsqueda de afirmaciones obsoletas, no una suite de pruebas.
