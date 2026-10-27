# Design

## Context

Ver `proposal.md - Why`. La página de información del cliente tiene un botón `Eliminar`
sin acción. El backend `clienteService.remove` hoy elimina el cliente y sus vehículos y
devuelve `409` si un vehículo tiene lavados. El modelo relaciona `Lavado -> Vehiculo ->
Cliente`. El diseño visual del aviso proviene de `Prototipado/varios/eliminar.jpg`. La
spec durable `client-management` existe, por lo que este cambio la modifica; también
modifica `cliente-info-page`.

## Goals / Non-Goals

**Goals:**

- Confirmar la eliminación con un popup y procesar la baja del cliente.
- Aplicar baja lógica cuando el cliente tiene lavados y baja permanente cuando no.

**Non-Goals:**

- Reactivar clientes/vehículos dados de baja lógica.
- El botón `Eliminar` de las cards de vehículo.
- Cambios al esquema.

## Decisions

### Baja del cliente en el backend

`remove(id)` determina si el cliente tiene algún lavado: obtiene sus vehículos y
consulta si alguno tiene un `Lavado` asociado.

- Si tiene lavados: **baja lógica** — actualiza `Cliente.estadoCliente = false` y
  `Vehiculo.estadoVehi = false` de todos sus vehículos.
- Si no tiene lavados: **baja permanente** — elimina los vehículos, el cliente y la
  persona.

Todo dentro de una transacción; el endpoint responde `204`. Se reemplaza el `409`
anterior por la baja lógica.

### Popup de confirmación

Se agrega un componente de confirmación (modal) con el encabezado `!!! AVISO !!!`, el
mensaje `¿ Desea eliminar permanentemente el <nombre> seleccionado ?` y los botones
verde `ACEPTAR` y rojo `CANCELAR`. Se muestra como modal sobre la página de información
(según la imagen), sin una ruta nueva.

### Enlace y comportamiento

En `ClienteInfoPage`, el botón `Eliminar` de la card del cliente abre el popup. Al
presionar `ACEPTAR`, se llama a `deleteCliente(id)` (`DELETE /api/clientes/:id`) y, al
completarse, se navega a `/clientes`. Al presionar `CANCELAR`, el popup se cierra y se
permanece en la página de información.

### Servicio

Se agrega `deleteCliente(id)` a `clientService` (DELETE con `credentials: 'include'`).

## Risks / Trade-offs

- [Baja lógica sin reactivación] -> Un cliente/vehículo inactivo no se puede reactivar
  todavía; se documenta como cambio posterior.
- [Detección de lavados] -> Se consulta por los vehículos del cliente; aceptable para la
  primera etapa.
- [Popup sobre la página] -> Estado local en `ClienteInfoPage`; debe limpiarse al cerrar.

## Migration Plan

- Backend: ajustar `remove` y sus pruebas; ejecutar `npm test` en `src/backend`.
- Frontend: agregar el popup, `deleteCliente` y el enlace; ejecutar `npm run lint` y
  `npm test`.
- Verificación: `openspec validate add-eliminar-cliente-popup --strict`.
- Rollback: revertir los archivos modificados/agregados.

## Open Questions

- Reactivar clientes/vehículos dados de baja lógica.
- Funcionalidad del botón `Eliminar` de las cards de vehículo.
