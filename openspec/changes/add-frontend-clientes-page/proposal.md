# Proposal

## Why

El frontend ya tiene login y home, pero el botón `Clientes` del home no lleva a
ninguna pantalla y no existe la página de clientes. Este cambio agrega la página de
Clientes —idéntica al prototipo— con búsqueda de clientes por nombre, apellido o dni,
y enlaza el botón `Clientes` del home con ella. La búsqueda se resuelve en el backend
para consultar la tabla de clientes con esos datos.

## What Changes

- Backend: `GET /api/clientes` SHALL aceptar un parámetro de búsqueda opcional que
  filtra por `nombre`, `apellido` o `dni` (coincidencia parcial, sin distinguir
  mayúsculas); sin el parámetro, devuelve todos los clientes como hoy.
- Frontend: nueva página de Clientes en `/clientes` con el diseño del prototipo
  (`Prototipado/cliente/clientes nuevo.jpg`):
  - Encabezado con el ícono del auto, `LavAutos oPreto` y el ícono de usuario (con el
    cierre de sesión del home).
  - Etiqueta `CLIENTES` (no es un botón).
  - Panel de búsqueda gris `#8f8a8a` con un input `#f4e6e6` (sin botón de búsqueda) y
    un botón verde `#7eb93c` `+ CLIENTE` (sin funcionalidad por ahora).
  - Panel de resultados azul `#2637a2` con una tabla (`DNI`, `NOMBRE`, `APELLIDO`,
    `CELULAR`), filas con color de fondo alternado `#f4e6e6`/`#b4b2b2` y un botón
    verde `#7eb93c` `+ info` por fila (sin funcionalidad por ahora).
  - Botón verde `#7eb93c` `← Volver` que navega a la página Home.
- Búsqueda en vivo: a partir del cuarto carácter tipeado se consulta y se muestran los
  resultados; sin búsqueda no se muestran registros; cuando no hay coincidencias el
  panel muestra `Busqueda sin resultados ...` (sin mensaje de error).
- Verificar la sesión con `GET /api/auth/session` y redirigir al login si no hay una
  sesión válida; permitir cerrar sesión desde el ícono de usuario (igual que el home).
- En el home: el botón `Clientes` navega a `/clientes`.
- **Fuera de alcance**: la funcionalidad de los botones `+ CLIENTE` y `+ info`; la
  navegación de los demás accesos del home (Vehículos, Lavados, Dashboard); otras
  pantallas; y cualquier cambio fuera de lo descrito.

## Capabilities

### New Capabilities

- `clients-page`: página de Clientes del frontend que replica el prototipo, busca
  clientes en vivo por nombre, apellido o dni y verifica la sesión.

### Modified Capabilities

- `client-management`: `GET /api/clientes` agrega el filtro de búsqueda por nombre,
  apellido o dni.
- `home-page`: el acceso `Clientes` navega a la página de Clientes.

## Impact

- Backend: `services/clienteService.js`, `controllers/` y `routes/clientes.js` para
  aceptar el parámetro de búsqueda; pruebas de la búsqueda.
- Frontend: nueva página `ClientesPage`, componentes de navegación/búsqueda/tabla,
  servicio de clientes y la ruta `/clientes`; ajuste del home para enlazar el botón.
- No modifica el esquema de base de datos.
- Reutiliza `GET /api/clientes` y `GET /api/auth/session` existentes.
