# Tasks

## 1. Estructura del script y base de datos

- [x] 1.1 Crear `src/databaseLavadero/script db/DataBaseLavadero.sql` con un encabezado descriptivo y la guarda `IF DB_ID('DataBaseLavadero') IS NULL CREATE DATABASE [DataBaseLavadero]`. Verificar que el archivo existe en ese directorio.
- [x] 1.2 Agregar `USE [DataBaseLavadero]` y separadores `GO` entre bloques, y comprobar que el script no contiene `DROP` ni `DELETE`. Verificar leyendo el archivo.

## 2. Personas y clientes (herencia TPT)

- [x] 2.1 Crear la tabla `Persona` con `codigoPersona bigint IDENTITY` como PK y las columnas `nombre`, `apellido`, `dni bigint`, `email`, `celular bigint`, usando `IF OBJECT_ID(N'dbo.Persona', N'U') IS NULL`. Verificar columnas y tipos contra `specs/database-schema/spec.md`.
- [x] 2.2 Crear la tabla `Cliente` con `codigoPersona` como PK y FK hacia `Persona.codigoPersona`, más `estadoCliente bit`. Verificar que la clave foránea existe y que la PK es compartida con `Persona`.

## 3. Catálogo de vehículos

- [x] 3.1 Crear `CategoriaVehiculo` con `codigoCategoriaVehi bigint IDENTITY` PK y `categoriaVehi varchar(100)`. Verificar columnas y tipos.
- [x] 3.2 Crear `MarcaVehiculo` con `codigoMarcaVehi bigint IDENTITY` PK, `marcaVehi varchar(100)` y FK `categoriaVehi` hacia `CategoriaVehiculo`. Verificar la clave foránea.
- [x] 3.3 Crear `ModeloVehiculo` con `codigoModeloVehi bigint IDENTITY` PK, `modeloVehi varchar(100)` y FK `marcaVehi` hacia `MarcaVehiculo`. Verificar la clave foránea.
- [x] 3.4 Crear `Vehiculo` con `codigoVehi bigint IDENTITY` PK, `patenteVehi varchar(20)`, `estadoVehi bit`, FK `cliente` hacia `Cliente.codigoPersona` y FK `modeloVehi` hacia `ModeloVehiculo`. Verificar ambas claves foráneas y que `cliente` referencia `Cliente` (no `Persona`).

## 4. Usuarios, login, categorías y lavados

- [x] 4.1 Crear `Usuario` con `codigoUsuario bigint IDENTITY` PK, `nombreUsuario varchar(100)` y `[contraseña] varchar(255)`. Verificar columnas y delimitación del identificador con ñ.
- [x] 4.2 Crear `Login` con `codigoLogin bigint IDENTITY` PK y FK `usuario` hacia `Usuario.codigoUsuario`. Verificar la clave foránea.
- [x] 4.3 Crear `CategoriaLavado` con `codigoCategoriaLavado bigint IDENTITY` PK y `descripcionLavado varchar(200)`. Verificar columnas y tipos.
- [x] 4.4 Crear `Lavado` con `codigoLavado bigint IDENTITY` PK, `fechaHoraLavado datetime2`, `estadoLavado varchar(50)`, FK `vehi` hacia `Vehiculo.codigoVehi`, FK `categoriaLavado` hacia `CategoriaLavado.codigoCategoriaLavado` y FK `login` hacia `Login.codigoLogin`. Verificar que no existe una FK directa hacia `Cliente`.

## 5. Verificación del script

- [x] 5.1 Buscar `INSERT`, `DROP` y `DELETE` en `DataBaseLavadero.sql` y confirmar que no hay ninguno; verificar que el script crea solo esquema y es reejecutable por sus guardas.
- [x] 5.2 Ejecutar el script contra la instancia `SQLEXPRESS01` (servicio `MSSQL$SQLEXPRESS01`) y verificar que se crean las 10 tablas con sus claves primarias y foráneas. Si la instancia no está disponible, registrar la limitación y no afirmar que se ejecutó.
- [x] 5.3 Ejecutar `openspec validate add-database-lavadero-schema --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
