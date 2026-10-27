# Tasks

## 1. Deltas de especificación

- [x] 1.1 Revisar `specs/clients-page/spec.md`: 2 `MODIFIED` (botones `+ info` y `+ CLIENTE` con su descripción visual) y 2 `REMOVED` (requisitos «sin acción») con `Reason` y `Migration`. Verificar que no queda ningún requisito con «no ejecuta ninguna acción» para esos botones.
- [x] 1.2 Revisar `specs/vehiculos-page/spec.md`: 1 `MODIFIED` («Enlace + info del vehículo» con botón y navegación) y 1 `REMOVED` («Botón + info sin acción»). Verificar que el botón queda descripto una sola vez.
- [x] 1.3 Revisar `specs/cliente-info-page/spec.md`: 2 `ADDED` («Contenido de la card del cliente» y «del vehículo») y 2 `REMOVED` («Card del cliente» y «Card por vehículo»). Verificar que los datos (`DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO`, `e-m@il`) y la descripción de las cards se conservan.
- [x] 1.4 Revisar `specs/vehicle-management/spec.md`: `MODIFIED` «Listar vehículos» con el escenario «Vehículos inactivos excluidos» y `REMOVED` «Solo vehículos activos». Verificar que el listado activo queda en un solo requisito.
- [x] 1.5 Revisar `specs/client-management/spec.md`: `MODIFIED` «Búsqueda de clientes» con «clientes activos» y sus tres escenarios. Verificar que no dice «todos los clientes» sin calificar.

## 2. Verificación

- [x] 2.1 Ejecutar `openspec validate reconcile-spec-contradictions --strict` y verificar que pasa.
- [x] 2.2 Verificar que el cambio no modifica código: revisar que no haya archivos bajo `src/` asociados a este cambio.

## Workflow follow-up

- Archivar el cambio con `/opsx-archive`; el sync aplica estos deltas a las main specs.
- Tras archivar, ejecutar `openspec validate clients-page --type spec --strict`, `openspec validate vehiculos-page --type spec --strict`, `openspec validate cliente-info-page --type spec --strict`, `openspec validate vehicle-management --type spec --strict` y `openspec validate client-management --type spec --strict`, y confirmar que no quedan requisitos con «sin acción» ni listados duplicados de vehículos.
