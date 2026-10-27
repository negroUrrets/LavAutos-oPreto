# Proposal

## Why

La página de Clientes ya existe, pero su botón `+ CLIENTE` no hace nada y no hay
ninguna pantalla para registrar un cliente nuevo. Este cambio agrega la página
«Nuevo Cliente» —idéntica al prototipo— que registra al cliente y su vehículo usando
el backend ya desarrollado, valida los datos, evita duplicar el dni y comunica el
resultado con popups; además enlaza el botón `+ CLIENTE`.

## What Changes

- Crear la página «Nuevo Cliente» en `/clientes/nuevo` con el diseño del prototipo
  (`Prototipado/cliente/registrar_cliente_nuevo.jpg`): tarjeta rosa titulada
  `Nuevo Cliente` con un panel de datos de la persona (inputs `DNI`, `Nombre`,
  `Apellido`, `Celular`, `e-mail`) y un panel del vehículo (comboboxes `Tipo Vehiculo`,
  `Marca Vehiculo`, `Modelo Vehiculo` y un input `Patente`), y los botones verde
  `Registrar` y rojo `Cancelar`.
- Exigir todos los campos: si alguno queda vacío, advertir de la misma forma que la
  página de login (mensaje en la página), sin registrar.
- Cargar los comboboxes en cascada desde el backend: `Tipo Vehiculo` desde
  `CategoriaVehiculo.categoriaVehi`, `Marca Vehiculo` desde `MarcaVehiculo.marcaVehi`
  filtrado por el tipo, y `Modelo Vehiculo` desde `ModeloVehiculo.modeloVehi` filtrado
  por la marca.
- Al presionar `Registrar`: comparar previamente el `dni` ingresado con los clientes
  registrados (usando la búsqueda por dni); si ya existe, mostrar un popup indicando
  que el cliente ya se encuentra registrado, con un botón verde `Aceptar`, y al
  aceptarlo limpiar el formulario. Si no existe, registrar el cliente
  (`POST /api/clientes`) y su vehículo (`POST /api/vehiculos`) y mostrar un popup
  `Bienvenido <nombre>`.
- Al aceptar el popup de bienvenida, navegar a la página de Clientes.
- Al presionar `Cancelar`, volver a la página de Clientes.
- En la página de Clientes: el botón `+ CLIENTE` navega a la página «Nuevo Cliente».
- Verificar la sesión con `GET /api/auth/session` y redirigir al login si no hay una
  sesión válida.
- **Fuera de alcance**: editar o eliminar clientes; otros vehículos; los demás accesos;
  cambios al backend o al esquema; y cualquier ajuste fuera de lo descrito.

## Capabilities

### New Capabilities

- `client-registration-page`: página «Nuevo Cliente» del frontend que replica el
  prototipo, valida los datos, evita duplicar el dni y registra el cliente y su
  vehículo usando el backend.

### Modified Capabilities

- `clients-page`: el botón `+ CLIENTE` navega a la página «Nuevo Cliente».

## Impact

- Archivos nuevos y modificados bajo `src/frontend/` (página «Nuevo Cliente»,
  componentes de formulario/comboboxes, servicio de vehículos/catálogos y la ruta
  `/clientes/nuevo`), y ajuste de `ClientesPage` para enlazar `+ CLIENTE`.
- Usa endpoints existentes: `POST /api/clientes`, `POST /api/vehiculos`,
  `GET /api/clientes?buscar=`, `GET /api/categorias-vehiculo`,
  `GET /api/marcas-vehiculo`, `GET /api/modelos-vehiculo` y `GET /api/auth/session`.
- No modifica el backend ni la base de datos.
