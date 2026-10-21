# Design

## Context

Ver `proposal.md - Why`. El frontend tiene clientes y React Router. El backend expone
`GET /api/clientes/:id` (cliente) y `GET /api/vehiculos` (todos los vehículos, con su
`modelo` y su cliente, pero sin marca ni categoría y sin filtro por cliente). El diseño
visual proviene de `Prototipado/cliente/+info clientes.jpg`. La spec durable
`vehicle-management` existe, por lo que este cambio la modifica; también modifica
`clients-page`.

## Goals / Non-Goals

**Goals:**

- Mostrar los datos del cliente y sus vehículos en cards.
- Ampliar el backend para devolver los vehículos con marca/categoría y filtrar por
  cliente.
- Enlazar el botón `+ info` y agregar el efecto de hover.

**Non-Goals:**

- Funcionalidad de los botones de las cards (`+VEHICULO`, `Editar`, `Eliminar`, `LAVAR`).
- Editar o eliminar clientes/vehículos.
- Otras pantallas; cambios al esquema.

## Decisions

### Ampliación del backend (vehicle-management)

En `vehiculoService` se amplía el `include` para que `modelo` incluya su `marca` y
esta su `categoria`, y se agrega `buildListOptions` para filtrar por `cliente` cuando
llega `GET /api/vehiculos?cliente=<id>`. Sin filtro, devuelve todos.

- Alternativa descartada: resolver marca/categoría en el frontend con los catálogos
  (más llamadas y lógica duplicada).

### Filtro por estado

Los listados devuelven solo registros activos: `GET /api/clientes` (listado y
búsqueda) filtra por `estadoCliente = 1` y `GET /api/vehiculos` por `estadoVehi = 1`.
Obtener por id sigue devolviendo el registro aunque esté inactivo. El filtro se aplica
en el service correspondiente (mismo código para listado y búsqueda).

### Ruteo y encabezado

Se agrega la ruta `/clientes/:id/info`. El encabezado muestra solo el ícono del auto y
`LavAutos oPreto` (sin el ícono de usuario). Para reutilizar código, se extrae un
componente `BrandHeader` (ícono + título) que usa también `AppHeader`.

### Datos de la página

Al montar, la página verifica la sesión, obtiene el cliente (`GET /api/clientes/:id`) y
sus vehículos (`GET /api/vehiculos?cliente=<id>`), y arma la card del cliente y una
card por vehículo con `categoriaVehi`, `marcaVehi`, `modeloVehi` y `patenteVehi`.

### Cards

- Card del cliente: avatar y los valores `DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO` y
  `e-m@il`, con los botones `+VEHICULO`, `Editar` y `Eliminar` (sin acción).
- Card por vehículo: ícono del auto, `Vehiculo` (categoría), `Marca`, `Modelo`,
  `PATENTE`, con los botones `Editar`, `Eliminar` y `LAVAR` (sin acción).

### Efecto de hover

Se guarda el id de la card señalada (`hoveredId`). La card señalada se adelanta
(`scale-105` y `z-10`) y las demás se retrasan (`scale-95`), con una transición suave.

### Volver y enlace desde Clientes

`Volver` navega a `/clientes`. En `ClientesPage`, el botón `+ info` de cada fila
navega a `/clientes/<codigoPersona>/info`.

### Servicios

Se agrega `getCliente(id)` a `clientService` y `listByCliente(cliente)` a
`vehicleService` (con `credentials: 'include'`).

## Risks / Trade-offs

- [Dos llamadas en la página] -> Cliente y vehículos se piden por separado; no hay
  endpoint combinado (se documenta).
- [Hover con estado] -> Debe limpiarse el `hoveredId` al salir para no dejar una card
  adelantada.
- [Sin paginación] -> `GET /api/vehiculos?cliente=` devuelve todos los del cliente;
  aceptable para la primera etapa.

## Migration Plan

- Backend: ampliar `vehiculoService` y sumar pruebas de include/filtro.
- Frontend: agregar la ruta, la página y los servicios; ajustar `ClientesPage`;
  ejecutar `npm run lint` y `npm test`.
- Verificación: `openspec validate add-cliente-info-page --strict`.
- Rollback: revertir los archivos modificados/agregados.

## Open Questions

- Un endpoint combinado que devuelva cliente y vehículos en una sola llamada.
- Funcionalidad de los botones de las cards (`+VEHICULO`, `Editar`, `Eliminar`, `LAVAR`).
