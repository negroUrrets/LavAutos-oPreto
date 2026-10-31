# Proposal

## Why

El botón `DASHBOARD` del home no tiene acción y el sistema no ofrece una pantalla de consulta
para ver los lavados entregados en un período ni los clientes que dejaron de traer vehículos.

## What Changes

- En `HomePage`, el botón `DASHBOARD` navega a `/dashboard`.
- Nueva página «Dashboard» (prototipo `Prototipado/varios/dashboard nuevo.jpg`):
  - Encabezado con el panel de usuario `ADMIN` ya existente (abre el popup de cierre de sesión).
  - Etiqueta `DASHBOARD` (no interactiva) que indica la pantalla actual.
  - Panel izquierdo `#eed8d8` con dos botones: `REGISTRO LAVADOS` y `REGISTRO CLIENTES`; el
    color pasa a `#7eb93c` al pasar el mouse y queda así en el botón seleccionado.
  - Dos registros deshabilitados en `#8f8a8a` al entrar. Al seleccionar un botón se habilita
    su registro y se deshabilita el otro.
  - Registro de lavados: filtros `Desde...` y `Hasta...` (máximo hoy; `Hasta` no anterior a
    `Desde`); al elegir ambos trae los lavados `Entregado` entregados en el rango, con `N°
    Lavado`, `Categoria` y `Patente`, y un botón `+info` que abre una ventana con los datos del
    lavado, el vehículo y el cliente.
  - Registro de clientes: filtro `Seleccione...` (máximo hoy); al elegirlo trae los clientes
    activos sin lavados posteriores a esa fecha, con `Nombre`, `Apellido` y `Celular`, y un
    botón `+info` que abre la página de información del cliente; al volver, el Dashboard
    conserva la búsqueda y sus resultados.
  - Botón `← Volver` que navega al home.
- Backend: filtros de consulta para lavados por rango de entrega y para clientes sin lavados
  posteriores a una fecha.
- **Fuera de alcance**: cambios al esquema o a la base, exportaciones, gráficos y gestión de
  usuarios o auditoría.

## Capabilities

### New Capabilities

- `dashboard-page`: pantalla de consulta con registros de lavados entregados y de clientes que
  no vuelven, con filtros por fecha y detalle en ventana o página.

### Modified Capabilities

- `home-page`: el botón `DASHBOARD` navega a la página Dashboard.
- `wash-management`: el listado de lavados acepta un rango de fechas de entrega.
- `client-management`: el listado de clientes acepta el filtro de clientes sin lavados
  posteriores a una fecha.
- `cliente-info-page`: el botón `Volver` regresa a la pantalla de origen cuando la página se
  abrió desde otra pantalla.

## Impact

- Frontend: nueva `DashboardPage.jsx` y ruta `/dashboard`, enlace en `HomePage`, servicios de
  lavados y clientes, componente de ventana `+info` compartido, ajuste del `Volver` en
  `ClienteInfoPage` y pruebas.
- Backend: `services/lavadoService.js` y `services/clienteService.js` con los nuevos filtros,
  y pruebas de integración.
- Sin cambios al esquema ni a la base de datos.
