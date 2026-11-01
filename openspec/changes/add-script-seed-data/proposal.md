# Proposal

## Why

El script de creación de `DataBaseLavadero` solo crea el esquema. Al recrear la base, los
catálogos de vehículos, utilerías, categorías y estados de lavado quedan vacíos y hay que
cargarlos a mano antes de poder usar la aplicación.

## What Changes

- Se agrega al script SQL una sección final de datos iniciales, sin modificar tablas, claves ni
  relaciones existentes:
  - `Utileria`: `Auxilio` con `estadoUtileria = 1`, `Balizas` con `0` y `Matafuegos` con `0`.
  - `CategoriaLavado`: `Basico`, `Completo` y `Premium`.
  - `EstadoLavado`: `En Espera`, `Lavando`, `Terminado` y `Entregado`, todas con
    `estadoLavado = 1`.
  - `CategoriaVehiculo`: `43 Camion`, `44 Automovil` y `45 Utilitario`.
  - `MarcaVehiculo`: `38 Iveco`, `39 Mercedes Benz`, `40 VolksWagen` (categoría 43);
    `41 Renault`, `42 Ford`, `43 Nissan` (categoría 44); `44 Toyota`, `45 Peugeot` y
    `46 Citroen` (categoría 45).
  - `ModeloVehiculo`: `43 Daily` (marca 38), `44 Atego` (39), `45 Worker` (40), `46 Duster`
    (41), `47 Fiesta` (42), `48 Versa` (43), `49 Hilux` (44), `50 Partner` (45) y
    `51 Berlingo` (46).
- Las inserciones son idempotentes y no destructivas: cada fila se inserta solo si no existe,
  y los códigos explícitos se cargan con `IDENTITY_INSERT` sin borrar ni sobrescribir datos.
- Se actualiza el comentario de alcance del script, que hoy declara que no inserta datos.
- **Fuera de alcance**: cambios al esquema, a los modelos Sequelize, a la API o a los seeds que
  ejecuta el backend; datos de clientes, vehículos, usuarios o lavados.

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `database-schema`: el script deja de crear solo el esquema y pasa a insertar los datos
  iniciales de los catálogos documentados.

## Impact

- Base de datos: `src/databaseLavadero/script db/DataBaseLavadero.sql` con una sección de datos
  iniciales idempotente.
- Sin cambios en `src/backend`, `src/frontend`, modelos, endpoints ni pruebas de aplicación.
- El script se ejecutará al recrear la base; no requiere migraciones.
