# Proposal

## Why

Al archivar los cambios de navegación, las main specs quedaron con requisitos viejos que
decían «no ejecuta ninguna acción» junto a los nuevos que definen navegación y popups.
Eso produce contradicciones y duplicación en `clients-page`, `vehiculos-page` y
`cliente-info-page`, y una inconsistencia de redacción en `client-management` y
`vehicle-management`. Este cambio reconcilia esas especificaciones con el comportamiento
ya implementado.

## What Changes

- `clients-page`: los requisitos de navegación de `+ info` y `+ CLIENTE` pasan a
  describir también el botón; se eliminan los requisitos obsoletos que los declaraban sin
  acción.
- `vehiculos-page`: «Enlace + info del vehículo» describe el botón; se elimina «Botón
  + info sin acción».
- `cliente-info-page`: se reemplazan «Card del cliente» y «Card por vehículo» —que
  afirmaban que los botones no ejecutan acciones— por requisitos de contenido sin esa
  afirmación. Las acciones siguen especificadas en sus requisitos de navegación y de
  eliminación.
- `vehicle-management`: «Listar vehículos» pasa a describir solo vehículos activos y
  absorbe el escenario de exclusión; se elimina «Solo vehículos activos».
- `client-management`: «Búsqueda de clientes» aclara que devuelve clientes activos, en
  coherencia con «Listar clientes».
- **Fuera de alcance**: cambios de código, de comportamiento, de API o de esquema. Los
  requisitos de navegación, popups y baja lógica ya están implementados y probados.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `clients-page`: se consolidan los requisitos de los botones `+ info` y `+ CLIENTE`.
- `vehiculos-page`: se consolida el requisito del botón `+ info`.
- `cliente-info-page`: se reemplazan los requisitos de las cards para quitar la
  afirmación obsoleta de que los botones no actúan.
- `vehicle-management`: «Listar vehículos» queda como único requisito de listado activo.
- `client-management`: «Búsqueda de clientes» se alinea con la lista de activos.

## Impact

- Sólo `openspec/specs/*`. No cambia código, API, base de datos ni frontend.
- **Riesgo**: eliminar requisitos exige `Reason` y `Migration`; la descripción visual de
  los botones se conserva en los requisitos de navegación, para no perder información.
