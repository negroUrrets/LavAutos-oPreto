# Design

## Context

- `ClienteInfoPage` (`/clientes/:id/info`) ya lista los vehículos del cliente con
  `listByCliente(id)` (`GET /api/vehiculos?cliente=:id`) y tiene un botón `+ VEHICULO`
  sin acción.
- `NuevoClientePage` ya implementa el panel de vehículo con comboboxes en cascada
  (`Vehiculo`/`Marca`/`Modelo`/`Patente`), la advertencia en página y el `Popup` de
  éxito. El panel y sus validaciones se pueden replicar aquí.
- El backend `POST /api/vehiculos` (`vehiculoService.create`) valida `patenteVehi`,
  `estadoVehi`, `cliente` y `modeloVehi`, y la existencia del cliente y del modelo. No
  requiere cambios.
- `GET /api/vehiculos` sin filtro devuelve sólo vehículos activos (`estadoVehi: true`),
  suficiente para comparar patentes vigentes.

## Goals / Non-Goals

**Goals:**

- Alta de un vehículo para el cliente seleccionado desde `ClienteInfoPage`, reutilizando
  el servicio y los validadores existentes.
- Volver a la información del cliente tras registrar o cancelar, con la lista
  actualizada.

**Non-Goals:**

- Cambios al backend, al esquema o al modelo de dominio.
- Editar/eliminar vehículos y el botón `LAVAR`.

## Decisions

- **Página nueva** `src/frontend/src/pages/NuevoVehiculoPage.jsx` en la ruta
  `/clientes/:id/vehiculos/nuevo`; el cliente se toma de `useParams` y se envía como
  `cliente` al crear el vehículo. Se prefiere una ruta anidada a pasar el cliente por
  estado porque el enlace queda compartible y la página verifica la sesión igual que las
  demás.
- **Reutilizar el panel de vehículo de `NuevoClientePage`**: comboboxes en cascada con
  `listCategorias`/`listMarcas`/`listModelos`, `formatPatente`/`isValidPatente` y
  advertencia en página. Se evita extraer un componente nuevo porque sólo hay un segundo
  uso y el panel es específico del formulario.
- **Reutilizar `services/vehicleService.js` y `components/Popup.jsx`**: se agrega
  `listVehiculos` (`GET /api/vehiculos`) y se reutiliza `createVehiculo`, en lugar de
  duplicar llamadas `fetch` o el modal.
- **Verificación de patente duplicada**: antes de `createVehiculo`, `listVehiculos()`
  (`GET /api/vehiculos`) obtiene los vehículos activos y se compara la patente
  normalizada (mayúsculas y sin espacios); si coincide, se muestra el `Popup`
  `Ese vehículo ya está registrado.` y su botón `Aceptar` limpia el formulario, siguiendo
  el patrón del dni duplicado de `NuevoClientePage`.
- **Botones del prototipo**: verde `Registrar` y rojo `Cancelar`; el botón verde es el
  «Aceptar» al que se refiere el pedido. Se prioriza el prototipo como referencia visual.
- **Éxito**: `POST /api/vehiculos` con `estadoVehi: true`; se muestra el popup
  `Vehiculo agregado satisfactoriamente` y, al cerrarlo, se navega a
  `/clientes/:id/info`. Al remontarse, `ClienteInfoPage` vuelve a pedir los vehículos y
  muestra la lista actualizada.
- **Cancelar**: navega directamente a `/clientes/:id/info` sin llamar a la API.
- **`+ VEHICULO`** de `ClienteInfoPage` navega a `/clientes/:id/vehiculos/nuevo`.

## Risks / Trade-offs

- [El pedido nombra «Aceptar» y el prototipo «Registrar»] → se usa el texto del
  prototipo; queda registrado como decisión para ajustar si se prefiere otro rótulo.
- [`GET /api/vehiculos` sólo devuelve vehículos activos] → la verificación cubre las
  patentes vigentes; las de vehículos dados de baja no se consideran. Ampliar el backend
  queda fuera de alcance.
- [Cliente o modelo inválido] → el backend responde `400` y la página muestra una
  advertencia sin navegar.
