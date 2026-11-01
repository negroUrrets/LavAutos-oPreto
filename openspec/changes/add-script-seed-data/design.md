# Design

## Context

- Ver `proposal.md - Why`.
- El script `src/databaseLavadero/script db/DataBaseLavadero.sql` crea la base y las tablas
  con guardas `IF OBJECT_ID(...) IS NULL`; todas las claves primarias son `BIGINT IDENTITY`.
- El script declara en su encabezado que no inserta datos iniciales; esa frase debe cambiar.
- `CategoriaVehiculo`, `MarcaVehiculo` y `ModeloVehiculo` tienen códigos explícitos pedidos
  (`43`-`45`, `38`-`46`, `43`-`51`), mientras que `Utileria`, `CategoriaLavado` y
  `EstadoLavado` no llevan código explícito.
- `MarcaVehiculo.categoriaVehi` referencia `CategoriaVehiculo` y
  `ModeloVehiculo.marcaVehi` referencia `MarcaVehiculo`.
- El backend ya tiene un seed idempotente (`catalogSeedService`) que verifica por descripción,
  por lo que no colisiona con estas filas.

## Goals / Non-Goals

**Goals:**

- Que una base recién creada quede con los catálogos listos para usar.
- Mantener el script idempotente y no destructivo.

**Non-Goals:**

- Cambios de esquema, modelos, API, seeds del backend ni datos de clientes, vehículos,
  usuarios o lavados.

## Decisions

- **Ubicación**: agregar una sección `5. Datos iniciales` al final del script, después de la
  creación de `Lavado`, para que todas las tablas y claves foráneas ya existan.
- **Orden de inserción**: `CategoriaVehiculo` → `MarcaVehiculo` → `ModeloVehiculo`, y luego
  `Utileria`, `CategoriaLavado` y `EstadoLavado`, respetando las claves foráneas.
- **Idempotencia**: cada inserción va dentro de `IF NOT EXISTS (SELECT 1 FROM ... WHERE ...)`,
  usando la descripción o el código como clave natural; así ejecutar el script dos veces no
  duplica filas ni sobrescribe datos.
- **Códigos explícitos**: para `CategoriaVehiculo`, `MarcaVehiculo` y `ModeloVehiculo` se usa
  `SET IDENTITY_INSERT dbo.<tabla> ON` antes de los `INSERT` y `OFF` después, porque las
  columnas son `IDENTITY`. La guarda usa el código; si el código ya existe no se inserta.
- **Códigos automáticos**: `Utileria`, `CategoriaLavado` y `EstadoLavado` se insertan sin
  código, dejando que `IDENTITY` asigne el valor.
- **Comentario de alcance**: actualizar el encabezado del script para describir el esquema y
  los datos iniciales, y retirar la frase «Solo esquema. No inserta datos iniciales ni
  semilla.».
- **Sin operaciones destructivas**: no se agregan `DELETE`, `TRUNCATE` ni `ALTER`.

## Risks / Trade-offs

- [Códigos 43-45 / 38-46 / 43-51 ya usados por otros datos] → la guarda por código evita
  sobrescribir; si el código existe con otra descripción, la fila inicial no se inserta y queda
  visible en la verificación.
- [`IDENTITY_INSERT` por sesión] → se activa y desactiva alrededor de cada tabla; si otra sesión
  lo tiene activo sobre la misma tabla, el `INSERT` falla y el script debe reportarlo.
- [El seed del backend también inserta estos catálogos] → ambos verifican por descripción, así
  que no se duplican filas.
- [Bases ya existentes] → el script no elimina ni migra datos; solo agrega las filas que falten.

## Migration Plan

- El usuario eliminará y recreará `DataBaseLavadero` después de modificar el script.
- No hay migración de datos ni cambios de esquema; el script sigue siendo seguro de reejecutar.
