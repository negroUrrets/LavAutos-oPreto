# Design

## Context

Ver `proposal.md - Why`. El frontend tiene login, home y React Router
(`/login`, `/home`). El backend expone `GET /api/clientes` (lista completa) y
`GET /api/clientes/:id`; no hay búsqueda. El diseño visual proviene de
`Prototipado/cliente/clientes nuevo.jpg` y
`Prototipado/cliente/clientes sin registros encontrados.jpg`. La spec durable
`client-management` existe, por lo que este cambio la modifica; también modifica
`home-page`.

## Goals / Non-Goals

**Goals:**

- Buscar clientes por nombre, apellido o dni desde el backend.
- Crear la página de Clientes del prototipo con búsqueda en vivo, estado sin
  resultados y botón `Volver`.
- Enlazar el botón `Clientes` del home.

**Non-Goals:**

- Funcionalidad de `+ CLIENTE` y `+ info`.
- Navegación de los demás accesos del home (Vehículos, Lavados, Dashboard).
- Otras pantallas; cambios al esquema.

## Decisions

### Búsqueda en el backend

`GET /api/clientes` acepta el parámetro opcional `buscar`. Cuando llega, el service
filtra por `nombre` o `apellido` (parcial, sin distinguir mayúsculas) o `dni`
(parcial, comparando el texto del número) usando `Op.or`/`Op.like` sobre la
asociación `Persona`; sin el parámetro, mantiene el listado completo actual (la
página no lo usa sin búsqueda).

- Alternativa descartada: filtrar en el frontend, que no consulta la base con esos
  datos como pide el requerimiento.

### Ruteo, verificación de sesión y cierre

Se agrega la ruta `/clientes`. Al montar, la página verifica la sesión con
`GET /api/auth/session` y redirige a `/login` si no es válida (mismo patrón que el
home). El ícono de usuario abre el mismo popup de cierre de sesión del home:
`CERRAR SESION` llama a `POST /api/auth/logout` y navega a `/login`; la `X` cierra el
popup sin acción.

### Componentes compartidos

Se extrae `AppHeader` (ícono del auto, `LavAutos oPreto` y el botón de usuario con el
popup de cierre), reutilizado por el home y la página de Clientes. El home conserva
su panel de accesos (tarjeta rosa con los 4 botones); la página de Clientes **no**
tiene panel de navegación y muestra en su lugar una etiqueta `CLIENTES`.

- Alternativa descartada: duplicar el encabezado en cada página.

### Etiqueta de sección y botón Volver

La página muestra `CLIENTES` como una etiqueta (píldora azul oscura, no un botón) y,
al final, un botón verde `#7eb93c` `← Volver` con la flecha del tamaño de las letras
que navega a `/home`.

### Búsqueda en vivo y sin registros

El input guarda el texto; cuando su longitud es `>= 4` se dispara la consulta (con un
pequeño debounce) a `GET /api/clientes?buscar=<texto>`. Con menos de 4 caracteres no
se consulta y **no se muestran registros**; en su lugar se muestra el estado sin
resultados (la imagen de «sin registros encontrados»).

### Estado sin resultados

Cuando no hay búsqueda activa o la búsqueda no encuentra coincidencias, el panel de
resultados muestra los encabezados (`DNI`, `NOMBRE`, `APELLIDO`, `CELULAR`) y el texto
centrado `Busqueda sin resultados ...`, sin mensaje de error.

### Panel de resultados

Tabla con columnas `DNI`, `NOMBRE`, `APELLIDO` y `CELULAR` dentro del panel azul
`#2637a2`; el color de fondo de cada fila alterna entre `#f4e6e6` y `#b4b2b2` según
el índice. Cada fila incluye un botón verde `#7eb93c` `+ info` sin acción.

### Botones sin funcionalidad

`+ CLIENTE` y `+ info` se renderizan con el color y el texto del prototipo (`+` del
mismo tamaño que las letras) pero sin manejador de evento.

### Paleta

Se agregan a la paleta de Tailwind: panel de búsqueda `#8f8a8a`, input/fila
`#f4e6e6`, fila alterna `#b4b2b2`, verde de acción `#7eb93c`, panel de resultados
`#2637a2` y la etiqueta de sección.

### Servicio de clientes

Se agrega `searchClientes(texto)` que llama a `GET /api/clientes?buscar=<texto>` con
`credentials: 'include'` y devuelve la lista.

## Risks / Trade-offs

- [Consulta parcial sobre `dni` numérico] -> Se compara como texto; aceptable para la
  primera etapa.
- [Debounce de la búsqueda] -> Debe limpiarse al desmontar para no dejar timers.
- [Refactor del home a `AppHeader`] -> Cambia su estructura interna; se cubre con las
  pruebas del home y las nuevas.
- [Colores aproximados] -> Ajustables; centralizados en la paleta.

## Migration Plan

- Backend: ajustar `clienteService.list` y el controller para aceptar `buscar`;
  ejecutar las pruebas.
- Frontend: agregar la ruta `/clientes`, la página y los componentes; ejecutar
  `npm run lint` y `npm test`.
- Verificación: `openspec validate add-frontend-clientes-page --strict`.
- Rollback: revertir los archivos modificados/agregados.

## Open Questions

- Valores de color exactos del prototipo (hoy aproximados).
- Cuándo tendrán funcionalidad `+ CLIENTE` y `+ info`.
- Si la búsqueda debe permitir separar los términos por campo (hoy es un único texto
  que matchea nombre, apellido o dni).
