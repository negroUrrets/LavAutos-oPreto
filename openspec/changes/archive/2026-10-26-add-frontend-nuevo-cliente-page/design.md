# Design

## Context

Ver `proposal.md - Why`. El frontend tiene login, home, clientes y React Router
(`/login`, `/home`, `/clientes`). El backend expone `POST /api/clientes` (crea
`Persona` + `Cliente`), `POST /api/vehiculos` (crea `Vehiculo`), la búsqueda
`GET /api/clientes?buscar=` y los catálogos `GET /api/categorias-vehiculo`,
`GET /api/marcas-vehiculo` y `GET /api/modelos-vehiculo`. El diseño visual proviene de
`Prototipado/cliente/registrar_cliente_nuevo.jpg`. La spec durable `clients-page`
existe, por lo que este cambio la modifica.

## Goals / Non-Goals

**Goals:**

- Crear la página «Nuevo Cliente» del prototipo.
- Registrar el cliente y su vehículo con el backend existente.
- Evitar duplicar el dni y comunicar el resultado con popups.

**Non-Goals:**

- Editar o eliminar clientes.
- Otros vehículos por cliente.
- Cambios al backend o al esquema.

## Decisions

### Ruteo, encabezado y sesión

Se agrega la ruta `/clientes/nuevo`. Según el prototipo, la página **no** muestra el
encabezado (`AppHeader`); solo la tarjeta «Nuevo Cliente». Al montar, verifica la
sesión con `GET /api/auth/session` y redirige a `/login` si no es válida.

### Formulario y validación

La tarjeta rosa contiene un panel de datos de la persona (`DNI`, `Nombre`, `Apellido`,
`Celular`, `e-mail`, todos inputs) y un panel del vehículo (comboboxes `Tipo Vehiculo`,
`Marca Vehiculo`, `Modelo Vehiculo` y el input `Patente`), con los botones verde
`Registrar` y rojo `Cancelar`. Todos los campos son obligatorios: si alguno queda
vacío, se muestra un mensaje en la página (mismo estilo que la página de login) y no
se registra.

### Comboboxes en cascada

Al montar se cargan las categorías (`GET /api/categorias-vehiculo`). Al elegir un
`Tipo Vehiculo` se cargan las marcas (`GET /api/marcas-vehiculo`) y se filtran por la
categoría elegida; al elegir una `Marca Vehiculo` se cargan los modelos
(`GET /api/modelos-vehiculo`) y se filtran por la marca. El vehículo se crea con el
`modeloVehi` elegido; el tipo y la marca solo acotan la selección.

### Registro del cliente y del vehículo

Al presionar `Registrar`: primero se compara el `dni` con los clientes registrados
usando `GET /api/clientes?buscar=<dni>` y se verifica que exista una coincidencia
exacta de `dni`. Si existe, se muestra el popup de cliente ya registrado. Si no, se
crea el cliente (`POST /api/clientes`) y, con el `codigoPersona` devuelto, el vehículo
(`POST /api/vehiculos` con `estadoVehi: true`).

- Alternativa descartada: endpoint backend combinado (transacción); se optó por
  orquestar con los endpoints existentes.
- Trade-off: no hay transacción entre cliente y vehículo; si falla el vehículo, el
  cliente ya quedó creado (se documenta).

### Popups

Se reutiliza el componente `Popup` de la página de login (mensaje + botón verde
`Aceptar`) para dos casos: `Ese cliente ya se encuentra registrado.` y
`Bienvenido <nombre>`. Al aceptar el primero se limpia el formulario; al aceptar el
segundo se navega a `/clientes`.

### Cancelar y enlace desde Clientes

`Cancelar` navega a `/clientes` sin registrar. En `ClientesPage`, el botón
`+ CLIENTE` navega a `/clientes/nuevo`.

### Servicios

Se agrega `createCliente` a `clientService`; y a un nuevo `vehicleService`:
`createVehiculo`, `listCategorias`, `listMarcas`, `listModelos` (con
`credentials: 'include'`).

## Risks / Trade-offs

- [Sin transacción cliente/vehículo] -> Si el vehículo falla, el cliente queda creado;
  se documenta y se puede resolver en un cambio posterior.
- [Verificación de dni solo en el frontend] -> No hay restricción de unicidad en la
  base; una carrera podría crear duplicados. Endurecerlo en el backend queda como
  cambio posterior.
- [Filtrado de catálogos en el frontend] -> Los endpoints de catálogos devuelven todo;
  el filtrado por categoría/marca se hace en el cliente.
- [Colores aproximados] -> Ajustables; se reutiliza la paleta existente.

## Migration Plan

- Frontend: agregar la ruta, la página y los servicios; ajustar `ClientesPage`;
  ejecutar `npm run lint` y `npm test`.
- Verificación: `openspec validate add-frontend-nuevo-cliente-page --strict`.
- Rollback: revertir los archivos modificados/agregados.

## Open Questions

- Atomicidad del alta cliente+vehículo (transacción) y unicidad de `dni` en el backend.
- Valores de color exactos del prototipo.
- Si la página debería mostrar el encabezado con el cierre de sesión.
