# Design

## Context

Ver `proposal.md` - Why. Hoy `Lavado` tiene la columna escalar `utileria` y las pantallas
`NuevoLavadoPage`/`EditarLavadoPage` tildan checkboxes llamando a `PUT /api/utilerias/:id`,
lo que cambia `estadoUtileria` del catálogo compartido y envía solo `seleccion[0]`. El modelo
y el esquema documentados ya muestran la tabla de detalle `DetalleUtileria`.

## Goals / Non-Goals

**Goals:**

- Persistir una o varias utilerías por lavado en `DetalleUtileria`.
- Mantener el catálogo `Utileria` independiente de la selección de cada lavado.
- Exponer y consumir `utilerias` como arreglo en la API.
- Migrar los lavados existentes sin perder la utilería ya guardada.
- Mejorar la ventana `+info` (Detalles, separador, título verde).

**Non-Goals:**

- Cambiar el CRUD del catálogo `Utileria` ni su endpoint `PUT /api/utilerias/:id`.
- Implementar las columnas adicionales de `CategoriaLavado` que aparecen en el diagrama de
  esquema (`precioCategoria`, `detalleCategoria`).
- Cambiar la relación `Lavado -> Vehiculo -> Cliente` ni el alcance de usuarios/auditoría.

## Decisions

### 1. Tabla de detalle y asociación Sequelize

Se agrega `DetalleUtileria` con clave primaria compuesta (`codigoLavado`, `codigoUtileria`) y
claves foráneas a `Lavado` y `Utileria`. La FK del lavado usa `ON DELETE CASCADE`; la de
utilería queda restrictiva para no borrar historial al eliminar una utilería del catálogo.

En Sequelize se modela la tabla y se declara:

```js
Lavado.belongsToMany(Utileria, {
  through: DetalleUtileria,
  foreignKey: 'codigoLavado',
  otherKey: 'codigoUtileria',
  as: 'utilerias',
});
Utileria.belongsToMany(Lavado, {
  through: DetalleUtileria,
  foreignKey: 'codigoUtileria',
  otherKey: 'codigoLavado',
  as: 'lavados',
});
```

Se elimina la asociación `Utileria.hasMany(Lavado)` / `Lavado.belongsTo(Utileria)` y la
columna `utileria` del modelo `Lavado`.

### 2. Contrato de la API

`POST /api/lavados` y `PUT /api/lavados/:id` reciben:

```json
{
  "vehi": 1,
  "categoriaLavado": 2,
  "estado": 3,
  "utilerias": [1, 2],
  "detallesLavado": "..."
}
```

- En el alta, `utilerias` es obligatorio y debe tener al menos un código.
- En la edición, si se envía, reemplaza el conjunto completo; si se omite, conserva el actual.
- Se deduplican los códigos y se valida que todos existan en `Utileria`; si alguno falta, la
  respuesta es `400` y no se modifica nada.
- Las respuestas de crear, listar, obtener y actualizar incluyen `utilerias` con las filas
  asociadas (a través de `include`).
- `utileria` (escalar) deja de aceptarse y de devolverse. Es un cambio incompatible para
  `POST/PUT /api/lavados`; el único consumidor es el frontend de este repositorio.

### 3. Servicio transaccional

`CREATE_FIELDS`/`UPDATE_FIELDS` ya no incluyen `utileria` ni `utilerias`. El servicio toma
`payload.utilerias`, lo normaliza a códigos únicos y, dentro de la misma transacción que crea
o actualiza el lavado, ejecuta `lavado.setUtilerias(ids, { transaction })`. Después vuelve a
leer el lavado con el `include` de `utilerias` para devolver la representación completa.

La validación de existencia se hace con una sola consulta
`Utileria.findAll({ where: { codigoUtileria: { [Op.in]: ids } }, transaction })`; si la
cantidad no coincide con los códigos únicos, se lanza `400` `La utileria no existe.`.

### 4. Migración de la base existente

`Migracion_LavadoUtileria.sql`:

1. Crea `DetalleUtileria` si no existe.
2. Copia `Lavado.utileria` a `DetalleUtileria` solo para pares que aún no existan.
3. Verifica que no queden lavados con `utileria` sin fila de detalle.
4. Elimina la FK `FK_Lavado_Utileria` y la columna `Lavado.utileria`.
5. Si la columna ya no existe, no hace nada (reejecución segura).

Se ejecuta con respaldo previo de la base y se valida el conteo antes de eliminar la columna.
El script principal `DataBaseLavadero.sql` se actualiza para crear `DetalleUtileria` y ya no
crear `Lavado.utileria` en bases nuevas.

### 5. Pantallas de alta y edición

- La selección vive solo en el estado de la página (`seleccion`), no en el catálogo.
- `NuevoLavadoPage` inicia sin utilerías tildadas y envía `utilerias` con todas las
  seleccionadas.
- `EditarLavadoPage` inicializa `seleccion` desde `lavado.utilerias` y envía el conjunto
  completo.
- Se eliminan las llamadas a `updateUtileria` y se muestran todas las filas del catálogo con
  su checkbox, sin que `estadoUtileria` condicione la selección.
- Se conserva la validación de al menos una utilería.

### 6. Ventana `+info`

`LavadoInfoPopup` agrega una fila `Detalles` con `lavado.detallesLavado ?? ''`, inserta un
separador (`<hr>`) entre los datos del vehículo (patente, categoría, modelo, marca) y los del
cliente (DNI, nombre, apellido, teléfono, e-mail), y cambia el título
`Informacion del Lavado` a color verde (`text-green-600`).

## Risks / Trade-offs

- La migración elimina `Lavado.utileria` → mitigación: respaldo previo, copia idempotente y
  verificación de conteos antes del `DROP`; la tarea de ejecución debe revisarse y autorizarse.
- Cambio incompatible de la API (`utileria` → `utilerias`) → el frontend se actualiza en el
  mismo cambio; no hay otros consumidores en el repositorio.
- El esquema permite cero detalles por lavado, pero la API exige al menos uno en el alta y en
  la edición cuando se envía el conjunto → se documenta como regla de aplicación.
- Las pruebas que crean `Lavado` directamente deben crear también `DetalleUtileria`; se
  actualizan `lavados`, `clientes`, `vehiculos` y `models`.
- La selección deja de depender de `estadoUtileria`; el catálogo puede mostrar filas inactivas
  seleccionables para un lavado. Es el comportamiento buscado (estado del catálogo ≠ uso en
  el lavado).

## Migration Plan

1. Respaldo de `DataBaseLavadero`.
2. Ejecutar `Migracion_LavadoUtileria.sql` y verificar que el número de filas copiadas coincide
   con los lavados existentes.
3. Desplegar backend y frontend juntos (contrato `utilerias`).
4. Rollback: restaurar el respaldo; no se propone una migración inversa automática.

## Open Questions

Ninguna.
