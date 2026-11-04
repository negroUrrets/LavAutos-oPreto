# Proposal

## Why

En la ventana `+info` de Lavados, la fila `Detalles` quedó al final de la sección de datos del
cliente, cuando la información del lavado corresponde a la sección del vehículo. Además, la
ventana no muestra las utilerías que se seleccionaron al crear o editar el lavado, por lo que
no se puede consultar ese dato desde el detalle.

## What Changes

- Mover la fila `DETALLES` a la sección de datos del vehículo, como última fila de esa sección
  (después de `MARCA` y antes de la línea divisoria).
- Agregar debajo de `DETALLES` una fila `UTILERIAS` con las descripciones de las utilerías
  asociadas al lavado, unidas por ` - ` (por ejemplo `Auxilio - Balizas`). Si el lavado no
  tiene utilerías, la fila se muestra con el valor vacío.
- Mantener la línea divisoria entre vehículo y cliente, los datos del cliente en su propia
  sección y el título `Informacion del Lavado` en verde.
- Sin cambios de backend: `GET /api/lavados` ya devuelve el arreglo `utilerias` de cada lavado.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `lavados-page`: la ventana `+info` ubica `Detalles` en la sección del vehículo y agrega la
  lista de utilerías del lavado debajo de ese campo.

## Impact

- Frontend: `src/frontend/src/components/LavadoInfoPopup.jsx` y
  `src/frontend/src/pages/LavadosPage.test.jsx`.
- Sin cambios de API, modelos, base de datos ni otros servicios.
- Dependencia de planificación: el cambio `add-lavado-utilerias` ya está implementado (10/10)
  pero todavía no está archivado; su delta de `lavados-page` introdujo `Detalles`, el
  separador y el título verde. Este cambio conserva esos escenarios y agrega la ubicación y
  la lista de utilerías. Conviene archivar `add-lavado-utilerias` antes de sincronizar o
  archivar este cambio.

## Risks and Open Decisions

- La lista de utilerías depende de que el lavado incluya el arreglo `utilerias`; ya lo hace
  desde el cambio anterior. Si un lavado no tuviera utilerías, se muestra vacío sin romper la
  ventana.
- El formato de la lista se fija con guiones (`Auxilio - Balizas`) para coincidir con el
  ejemplo solicitado; no se ordena alfabéticamente, se respeta el orden devuelto por el
  backend.
