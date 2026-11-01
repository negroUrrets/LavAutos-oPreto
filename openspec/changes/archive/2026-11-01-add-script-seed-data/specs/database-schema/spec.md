# Spec Delta

## REMOVED Requirements

### Requirement: Script sin datos iniciales

**Reason**: El script ahora inserta los datos iniciales de los catálogos al crear la base.

**Migration**: Los datos iniciales quedan documentados en los requisitos «Datos iniciales de
...»; no se requiere acción sobre bases existentes.

## ADDED Requirements

### Requirement: Script con datos iniciales

El script SHALL crear el esquema y, al finalizar, SHALL insertar los datos iniciales de los
catálogos documentados, sin modificar tablas, claves ni relaciones y sin eliminar ni
sobrescribir filas existentes.

#### Scenario: Esquema con datos iniciales

- **WHEN** el script termina de ejecutarse sobre una base vacía
- **THEN** existen las tablas con el esquema documentado y las filas iniciales de los catálogos

#### Scenario: Idempotencia

- **WHEN** el script se ejecuta dos veces
- **THEN** no se duplican las filas iniciales ni se modifican las existentes

### Requirement: Datos iniciales de Utileria

El script SHALL insertar en `Utileria` las filas `Auxilio` con `estadoUtileria = 1`, `Balizas`
con `estadoUtileria = 0` y `Matafuegos` con `estadoUtileria = 0`.

#### Scenario: Filas de utilería

- **WHEN** el script termina de ejecutarse
- **THEN** `Utileria` contiene `Auxilio` con estado `1`, `Balizas` con estado `0` y `Matafuegos` con estado `0`

### Requirement: Datos iniciales de CategoriaLavado

El script SHALL insertar en `CategoriaLavado` las filas `Basico`, `Completo` y `Premium`.

#### Scenario: Filas de categoría de lavado

- **WHEN** el script termina de ejecutarse
- **THEN** `CategoriaLavado` contiene `Basico`, `Completo` y `Premium`

### Requirement: Datos iniciales de EstadoLavado

El script SHALL insertar en `EstadoLavado` las filas `En Espera`, `Lavando`, `Terminado` y
`Entregado`, todas con `estadoLavado = 1`.

#### Scenario: Filas de estado de lavado

- **WHEN** el script termina de ejecutarse
- **THEN** `EstadoLavado` contiene `En Espera`, `Lavando`, `Terminado` y `Entregado`, todas con estado `1`

### Requirement: Datos iniciales de CategoriaVehiculo

El script SHALL insertar en `CategoriaVehiculo` los códigos `43` `Camion`, `44` `Automovil` y
`45` `Utilitario`.

#### Scenario: Filas de categoría de vehículo

- **WHEN** el script termina de ejecutarse
- **THEN** `CategoriaVehiculo` contiene el código `43` `Camion`, el `44` `Automovil` y el `45` `Utilitario`

### Requirement: Datos iniciales de MarcaVehiculo

El script SHALL insertar en `MarcaVehiculo` los códigos `38` `Iveco`, `39` `Mercedes Benz` y
`40` `VolksWagen` con categoría `43`; `41` `Renault`, `42` `Ford` y `43` `Nissan` con
categoría `44`; y `44` `Toyota`, `45` `Peugeot` y `46` `Citroen` con categoría `45`.

#### Scenario: Filas de marca de vehículo

- **WHEN** el script termina de ejecutarse
- **THEN** `MarcaVehiculo` contiene las nueve marcas con sus códigos y categorías documentados

### Requirement: Datos iniciales de ModeloVehiculo

El script SHALL insertar en `ModeloVehiculo` los códigos `43` `Daily` (marca `38`), `44`
`Atego` (`39`), `45` `Worker` (`40`), `46` `Duster` (`41`), `47` `Fiesta` (`42`), `48` `Versa`
(`43`), `49` `Hilux` (`44`), `50` `Partner` (`45`) y `51` `Berlingo` (`46`).

#### Scenario: Filas de modelo de vehículo

- **WHEN** el script termina de ejecutarse
- **THEN** `ModeloVehiculo` contiene los nueve modelos con sus códigos y marcas documentados
