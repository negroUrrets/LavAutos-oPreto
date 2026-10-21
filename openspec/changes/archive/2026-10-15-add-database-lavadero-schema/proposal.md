# Proposal

## Why

El proyecto todavía no dispone de una base de datos física: el diseño existe
solo como documentación (imágenes de modelo de datos y esquema de base de
datos). Sin un esquema SQL Server creado, el backend con Sequelize no puede
persistir clientes, vehículos ni lavados, ni verificarse de forma reproducible.
Esta etapa materializa el esquema documentado en un script versionado y
ejecutable antes de construir la lógica de aplicación.

## What Changes

- Crear la base de datos `DataBaseLavadero` en Microsoft SQL Server mediante un
  script T-SQL versionado.
- Definir las tablas documentadas: `Persona`, `Cliente`, `Vehiculo`,
  `ModeloVehiculo`, `MarcaVehiculo`, `CategoriaVehiculo`, `CategoriaLavado`,
  `Lavado`, `Login` y `Usuario`.
- Implementar la herencia `Cliente` es `Persona` con la estrategia tabla por tipo
  (TPT): `Cliente` comparte la clave primaria de `Persona` mediante una clave
  foránea `codigoPersona`.
- Establecer claves primarias, claves foráneas y las relaciones documentadas,
  preservando `Lavado -> Vehiculo -> Cliente` (sin una relación directa
  `Lavado -> Cliente`).
- Guardar el script en el directorio indicado por el usuario:
  `src/databaseLavadero/script db/`.
- **Fuera de alcance**: datos iniciales o semilla, gestión de usuarios como
  funcionalidad de aplicación, auditoría funcional, modelos Sequelize, endpoints,
  procedimientos almacenados y cualquier pantalla o flujo de frontend.

## Capabilities

### New Capabilities

- `database-schema`: esquema físico de la base de datos `DataBaseLavadero` en
  SQL Server, con las tablas del dominio del lavadero, sus claves y relaciones,
  incluida la herencia `Cliente`/`Persona`.

### Modified Capabilities

- Ninguna. El proyecto aún no tiene especificaciones durables registradas.

## Impact

- Archivos nuevos bajo `src/databaseLavadero/script db/` (script `.sql`); no se
  modifica código existente.
- No se agregan dependencias ni endpoints.
- Sienta la referencia para los modelos Sequelize del backend.
- Requiere SQL Server accesible para ejecutar y verificar el script; su
  disponibilidad no se asume.
- El destino `src/databaseLavadero/` se aparta de `src/database/` mencionado en la
  documentación; se sigue la indicación explícita del usuario.
