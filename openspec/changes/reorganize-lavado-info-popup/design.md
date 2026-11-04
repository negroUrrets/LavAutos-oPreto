# Design

## Context

Ver `proposal.md` - Why. La ventana `+info` ya cuenta con la línea divisoria, el título verde y
la fila `Detalles` (incorporados por `add-lavado-utilerias`), pero `Detalles` está al final de
la sección del cliente. `GET /api/lavados` ya devuelve el arreglo `utilerias` de cada lavado,
por lo que no hace falta tocar el backend.

## Goals / Non-Goals

**Goals:**

- Ubicar `Detalles` como última fila de la sección del vehículo.
- Mostrar debajo de `Detalles` las descripciones de las utilerías del lavado, separadas por
  ` - `.
- Mantener el separador, los datos del cliente y el título verde.

**Non-Goals:**

- Cambiar la API, los modelos, la base de datos o la lógica de selección de utilerías.
- Reordenar las utilerías por nombre; se respeta el orden devuelto por el backend.
- Agregar nuevas filas o secciones a la ventana.

## Decisions

### 1. Estructura de la ventana

La sección del vehículo queda así, dentro de un `<dl>`:

1. `PATENTE`
2. `CATEGORIA`
3. `MODELO`
4. `MARCA`
5. `DETALLES`
6. `UTILERIAS`

Después se mantiene el `<hr>` divisorio y, en un segundo `<dl>`, los datos del cliente (`DNI`,
`NOMBRE`, `APELLIDO`, `TELEFONO`, `e-m@il`). Se elimina `DETALLES` del segundo `<dl>`.

### 2. Texto de utilerías

Se calcula en el componente:

```js
const utilerias = (lavado.utilerias ?? [])
  .map((utileria) => utileria.descripcionUtileria)
  .filter(Boolean)
  .join(' - ');
```

y se muestra en una fila `UTILERIAS` con ese valor. Si el arreglo está vacío o sus
descripciones no existen, el valor es `''` y la fila se muestra igualmente, coherente con
`Detalles`.

### 3. Sin cambios de backend

`LavadosPage` pasa a `LavadoInfoPopup` el objeto `lavado` tal como llega de
`GET /api/lavados`; ese objeto ya incluye `utilerias` desde el cambio anterior. No se modifica
`lavadoService` ni el backend.

### 4. Pruebas

En `LavadosPage.test.jsx` se agrega `utilerias` al fixture del lavado y se verifica:

- `DETALLES` aparece dentro de la sección del vehículo, antes del `separator`, y su valor es
  el `detallesLavado`.
- `UTILERIAS` aparece debajo de `DETALLES` con el valor `Balizas - Matafuegos` (o el conjunto
  del fixture).
- Sin utilerías, la fila existe con valor vacío.
- Se conservan las verificaciones del separador, el título verde y los datos del cliente.

## Risks / Trade-offs

- La lista depende de que el lavado tenga `utilerias`; el cambio anterior ya lo garantiza en
  la respuesta. Si faltara, se muestra vacía sin lanzar error.
- El separador ` - ` es una decisión de presentación; no altera los datos ni el orden.

## Migration Plan

Sin migraciones ni cambios de datos. Solo se despliega el frontend.

## Open Questions

Ninguna.
