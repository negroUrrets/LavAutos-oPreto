# Design

## Context

Ver `proposal.md - Why`. El frontend tiene la página de información del cliente
(`ClienteInfoPage`) con una card que incluye un botón `Editar` sin acción. El backend
expone `GET /api/clientes/:id` y `PUT /api/clientes/:id` (actualiza los datos
personales y el estado). Ya existen las utilidades de validación
(`onlyDigits`, `onlyLetters`, `isValidEmail`) y el componente `Popup`. El diseño visual
proviene de `Prototipado/cliente/editar_cliente_ultimo.jpg`.

## Goals / Non-Goals

**Goals:**

- Cargar y editar los datos de un cliente con las mismas validaciones del registro.
- Guardar con el backend y volver a la página de información.
- Enlazar el botón `Editar`.

**Non-Goals:**

- Editar el vehículo.
- Verificar dni duplicado al editar.
- Cambios al backend o al esquema.

## Decisions

### Ruteo, encabezado y sesión

Se agrega la ruta `/clientes/:id/editar`. Según el prototipo, la página **no** muestra
el encabezado. Al montar, verifica la sesión con `GET /api/auth/session` y redirige a
`/login` si no es válida.

### Carga de datos

Al montar, la página obtiene el cliente (`GET /api/clientes/:id`) y precarga el
formulario con `DNI`, `Nombre`, `Apellido`, `Celular` y `e-m@il`, editables.

### Tipos de datos y validación

Se reutilizan las utilidades existentes: los `onChange` de `DNI` y `Celular` aplican
`onlyDigits`, y los de `Nombre` y `Apellido` aplican `onlyLetters`. Al presionar
`Registrar` se exige que todos los campos estén completos y que el `e-mail` tenga
formato válido (con `isValidEmail`); si no, se advierte en la página y no se guarda.

### Guardar y cancelar

`Registrar` guarda con `PUT /api/clientes/:id` (`nombre`, `apellido`, `dni`, `email`,
`celular`) y, si sale bien, muestra el popup `La edición de datos se efectuó
satisfactoriamente.`; al aceptarlo, vuelve a `/clientes/:id/info`. `Cancelar` vuelve a
`/clientes/:id/info` sin guardar.

### Popup y servicios

Se reutiliza el componente `Popup` (mensaje + botón verde `Aceptar`). Se agrega
`updateCliente(id, datos)` a `clientService` (con `credentials: 'include'`).

### Enlace desde la información del cliente

En `ClienteInfoPage`, el botón `Editar` de la card del cliente navega a
`/clientes/:id/editar`.

### Actualización al volver de la edición

La página de información obtiene el cliente al montarse (`GET /api/clientes/:id`); como
se monta de nuevo al volver desde la edición, muestra los datos actualizados del
cliente junto con sus vehículos. No se guarda estado en caché entre navegaciones.

### Verificación de dni duplicado al editar

Al presionar `Registrar`, se consulta `GET /api/clientes?buscar=<dni>` y se compara el
`dni` exacto; si coincide con otro cliente (distinto `codigoPersona`), se muestra el
popup `Ese cliente ya se encuentra registrado.` y no se guarda. Al aceptarlo, el
formulario se restablece con los datos originales del cliente (los cargados al abrir la
página).

## Risks / Trade-offs

- [Verificación de dni duplicado solo en el frontend] -> No hay restricción de unicidad
  en la base; se resuelve con la búsqueda por dni (queda para el backend en un cambio
  posterior).
- [Reutilización de validadores] -> Las mismas reglas que el registro; coherente.
- [Errores del backend] -> Si el `PUT` falla, se advierte en la página y no se vuelve.

## Migration Plan

- Frontend: agregar la ruta, la página y `updateCliente`; ajustar `ClienteInfoPage`;
  ejecutar `npm run lint` y `npm test`.
- Verificación: `openspec validate add-editar-cliente-page --strict`.
- Rollback: revertir los archivos modificados/agregados.

## Open Questions

- Enforzar la unicidad de `dni` también en el backend.
- Editar el vehículo desde la card del vehículo.
