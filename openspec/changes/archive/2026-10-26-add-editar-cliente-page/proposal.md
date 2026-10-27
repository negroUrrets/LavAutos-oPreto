# Proposal

## Why

La página de información del cliente muestra sus datos, pero el botón `Editar` de la
card del cliente no hace nada y no existe una pantalla para editar al cliente. Este
cambio agrega la página «Editar Cliente» —idéntica al prototipo— que carga los datos
del cliente, los valida como en la página de registro y guarda los cambios con el
backend (`update`), volviendo a la página de información; además enlaza el botón
`Editar`.

## What Changes

- Crear la página «Editar Cliente» en `/clientes/:id/editar` con el diseño del
  prototipo (`Prototipado/cliente/editar_cliente_ultimo.jpg`): tarjeta rosa titulada
  `Editar Cliente` con un panel (avatar e inputs `DNI`, `Nombre`, `Apellido`,
  `Celular` y `e-m@il`) y los botones verde `Registrar` y rojo `Cancelar`. Sin
  encabezado.
- Cargar los datos del cliente seleccionado (`GET /api/clientes/:id`) en el formulario
  de manera editable.
- Mantener y validar los tipos de datos como en la página de registro: `DNI` y
  `Celular` solo números; `Nombre` y `Apellido` solo letras (con acentos y `ñ`); y el
  `e-mail` con formato de correo válido antes de guardar.
- Al presionar `Registrar`: guardar la edición (`PUT /api/clientes/:id`) y mostrar un
  popup informando que la edición se efectuó satisfactoriamente.
- Al presionar `Cancelar`: abortar la edición sin modificar el cliente.
- Tras cualquiera de los dos botones, volver a la página de información del cliente.
- En la página de información: el botón `Editar` de la card del cliente navega a la
  página «Editar Cliente».
- Verificar la sesión con `GET /api/auth/session` y redirigir al login si no hay una
  sesión válida.
- **Fuera de alcance**: editar el vehículo; los demás botones de las cards; la
  verificación de dni duplicado al editar; cambios al backend o al esquema; y
  cualquier ajuste fuera de lo descrito.

## Capabilities

### New Capabilities

- `cliente-edit-page`: página «Editar Cliente» del frontend que carga y edita los
  datos de un cliente, con las mismas validaciones de tipo que el registro.

### Modified Capabilities

- `cliente-info-page`: el botón `Editar` de la card del cliente navega a la página de
  edición.

## Impact

- Archivos nuevos y modificados bajo `src/frontend/` (página «Editar Cliente»,
  reutilización de las utilidades de validación y del popup, servicio `updateCliente`
  y la ruta `/clientes/:id/editar`), y ajuste de `ClienteInfoPage` para enlazar
  `Editar`.
- Usa endpoints existentes: `GET /api/clientes/:id`, `PUT /api/clientes/:id` y
  `GET /api/auth/session`.
- No modifica el backend ni la base de datos.
