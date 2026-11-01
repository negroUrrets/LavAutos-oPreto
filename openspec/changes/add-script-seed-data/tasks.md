# Tasks

## 1. Script de base de datos

- [x] 1.1 Actualizar el comentario de alcance de `src/databaseLavadero/script db/DataBaseLavadero.sql` y agregar la sección de datos iniciales para `Utileria` (`Auxilio` = 1, `Balizas` = 0, `Matafuegos` = 0), `CategoriaLavado` (`Basico`, `Completo`, `Premium`) y `EstadoLavado` (`En Espera`, `Lavando`, `Terminado`, `Entregado` con `estadoLavado = 1`), con guardas `IF NOT EXISTS`; verificar con `sqlcmd` que las filas existen y que una segunda ejecución no las duplica.
- [x] 1.2 Agregar las filas de `CategoriaVehiculo` (`43` `Camion`, `44` `Automovil`, `45` `Utilitario`) con `SET IDENTITY_INSERT dbo.CategoriaVehiculo ON/OFF` y guardas por código; verificar con `sqlcmd` que existen las tres y que no se duplican al reejecutar.
- [x] 1.3 Agregar las filas de `MarcaVehiculo` (`38` `Iveco`, `39` `Mercedes Benz`, `40` `VolksWagen` en categoría `43`; `41` `Renault`, `42` `Ford`, `43` `Nissan` en `44`; `44` `Toyota`, `45` `Peugeot`, `46` `Citroen` en `45`) con `IDENTITY_INSERT` y guardas por código; verificar con `sqlcmd` las nueve filas y sus categorías.
- [x] 1.4 Agregar las filas de `ModeloVehiculo` (`43` `Daily`/`38`, `44` `Atego`/`39`, `45` `Worker`/`40`, `46` `Duster`/`41`, `47` `Fiesta`/`42`, `48` `Versa`/`43`, `49` `Hilux`/`44`, `50` `Partner`/`45`, `51` `Berlingo`/`46`) con `IDENTITY_INSERT` y guardas por código; verificar con `sqlcmd` las nueve filas y sus marcas.

## 2. Verificación final

- [x] 2.1 Ejecutar el script completo dos veces con `sqlcmd` sobre la instancia disponible y verificar el contenido de las seis tablas y la idempotencia; si la instancia o `sqlcmd` no están disponibles, registrar la limitación sin afirmar que pasó.
- [x] 2.2 Ejecutar `openspec validate add-script-seed-data --strict` y verificar que pasa.

## Workflow follow-up

- Archivar este cambio con `/opsx-archive` tras la revisión.
