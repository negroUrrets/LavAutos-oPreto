# Design

## Context

Ver `proposal.md - Why`. El único insumo de diseño es el esquema y el modelo de
datos documentados en `src/documentacion/Esquema Base Datos/` y
`src/documentacion/Modelo Datos/`. Todavía no existen scripts SQL ni
`src/database/`; el destino acordado con el usuario es
`src/databaseLavadero/script db/`. La verificación se realiza contra la instancia
`SQLEXPRESS01` (servicio `MSSQL$SQLEXPRESS01`), accesible en este entorno; el
script es agnóstico del servidor y se ejecuta de forma manual.

El cambio se limita a la capa de persistencia: agrega un script SQL y no modifica
frontend, API, rutas, controllers ni services.

## Goals / Non-Goals

**Goals:**

- Traducir fielmente el esquema documentado a T-SQL para SQL Server.
- Modelar la herencia `Cliente` es `Persona` con una estrategia compatible con
  `Lavado -> Vehiculo -> Cliente`.
- Dejar el script listo para ejecutarse manualmente en SQL Server Management
  Studio o `sqlcmd`.

**Non-Goals:**

- Datos iniciales o semilla (cuenta administrador incluida).
- Modelos Sequelize, migraciones, endpoints o lógica de aplicación.
- Restricciones `UNIQUE` adicionales no documentadas.
- Procedimientos almacenados a partir de los métodos del diagrama
  (`registrarX`, `editarX`).

## Decisions

### Herencia: tabla por tipo (TPT)

`Persona` contiene los datos comunes y su clave primaria `codigoPersona` es
`bigint IDENTITY`. `Cliente` comparte esa clave: `codigoPersona` es a la vez su
clave primaria y clave foránea hacia `Persona`. `Cliente` agrega `estadoCliente`.

- Alternativa descartada (tabla por clase concreta): duplicaría los datos de
  persona y no refleja el diagrama, que muestra ambas tablas.
- Alternativa descartada (tabla única con discriminador): una `Persona` puede no
  ser `Cliente`, y el diagrama separa ambas entidades.

Consecuencia: para crear un cliente se inserta primero en `Persona` y luego en
`Cliente` con el mismo `codigoPersona`.

### Claves foráneas y relación de vehículos

`Vehiculo.cliente` referencia `Cliente.codigoPersona` (no `Persona`) para
garantizar que un vehículo pertenece a un cliente y no a cualquier persona.

- Alternativa descartada: referenciar `Persona.codigoPersona`, que permitiría
  vehículos asociados a personas que no son clientes.

`Lavado` referencia `Vehiculo`, `CategoriaLavado` y `Login`; no se crea una clave
foránea directa hacia `Cliente`, respetando `Lavado -> Vehiculo -> Cliente`.

### Tipos de datos y convenciones

- Identificadores y campos indicados como `bigint` en el diagrama (`dni`,
  `celular`) usan `bigint`; las claves primarias son `IDENTITY(1,1)`.
- `boolean` del diagrama se traduce a `bit` (`estadoCliente`, `estadoVehi`).
- `fechaHoraLavado` usa `datetime2` (guarda fecha y hora, coherente con el
  nombre), en lugar de `date`.
- Texto `varchar` con longitud por columna; collation con soporte para acentos y
  caracteres españoles.
- Nombres de tablas y columnas idénticos a la documentación (singular,
  PascalCase). El identificador con ñ se delimita con corchetes (`[contraseña]`).

Mapeo previsto:

| Tabla | Columnas | Notas |
| --- | --- | --- |
| `Persona` | `codigoPersona` PK IDENTITY, `nombre`, `apellido`, `dni`, `email`, `celular` | `dni`, `celular` bigint |
| `Cliente` | `codigoPersona` PK/FK -> `Persona`, `estadoCliente` | herencia TPT |
| `CategoriaVehiculo` | `codigoCategoriaVehi` PK IDENTITY, `categoriaVehi` | |
| `MarcaVehiculo` | `codigoMarcaVehi` PK IDENTITY, `marcaVehi`, `categoriaVehi` FK -> `CategoriaVehiculo` | |
| `ModeloVehiculo` | `codigoModeloVehi` PK IDENTITY, `modeloVehi`, `marcaVehi` FK -> `MarcaVehiculo` | |
| `Vehiculo` | `codigoVehi` PK IDENTITY, `patenteVehi`, `estadoVehi`, `cliente` FK -> `Cliente`, `modeloVehi` FK -> `ModeloVehiculo` | |
| `CategoriaLavado` | `codigoCategoriaLavado` PK IDENTITY, `descripcionLavado` | |
| `Usuario` | `codigoUsuario` PK IDENTITY, `nombreUsuario`, `[contraseña]` | |
| `Login` | `codigoLogin` PK IDENTITY, `usuario` FK -> `Usuario` | |
| `Lavado` | `codigoLavado` PK IDENTITY, `fechaHoraLavado` datetime2, `estadoLavado`, `vehi` FK -> `Vehiculo`, `categoriaLavado` FK -> `CategoriaLavado`, `login` FK -> `Login` | |

Longitudes previstas (ajustables): `nombre`, `apellido`, `categoriaVehi`,
`marcaVehi`, `modeloVehi`, `nombreUsuario` 100; `email` 150; `patenteVehi` 20;
`descripcionLavado` 200; `estadoLavado` 50; `[contraseña]` 255.

### Nulabilidad

Todas las columnas son `NOT NULL` salvo `email` y `celular`, tratados como datos
de contacto opcionales. Es una suposición registrada; se ajusta si la aplicación
define otra obligatoriedad.

### Script único, idempotente y no destructivo

Un único archivo `DataBaseLavadero.sql` con `GO` como separadores, ubicado en
`src/databaseLavadero/script db/`. Crea la base solo si no existe
(`IF DB_ID(...) IS NULL`), crea cada tabla solo si no existe
(`IF OBJECT_ID(...) IS NULL`) y no elimina objetos ni datos.

- Alternativa descartada: `CREATE` sin guardas, que falla al reejecutar.
- Alternativa descartada: `DROP`/`CREATE`, destructiva.

### Sin restricciones UNIQUE ni datos iniciales

Por decisión del usuario, no se agregan `UNIQUE` fuera de las claves ni se
insertan filas. `Usuario` y `Login` se crean porque forman parte del esquema
documentado y `Lavado.login` los referencia; no implican gestión de usuarios en
la aplicación.

### Alineación con el stack y separación de responsabilidades

Se respeta el stack acordado (React y JavaScript; Node.js, Express, JavaScript y
Sequelize; Microsoft SQL Server). El script usa T-SQL de SQL Server y no introduce
otro motor de base de datos ni otro ORM.

El script cubre únicamente persistencia: la lógica de negocio permanece en los
services del backend y en los modelos Sequelize, que mapearán estas tablas en un
cambio posterior. No se agregan stored procedures ni capas o abstracciones
adicionales, evitando lógica de negocio en la base para favorecer bajo
acoplamiento y alta cohesión.

La evolución del esquema se hará con scripts versionados; no se usará
`sequelize.sync({ alter: true })` ni sincronización destructiva.

### Autenticación y tablas Usuario/Login

Este cambio no modifica el mecanismo de autenticación: sesión de servidor, cookie
`HttpOnly`, cierre de sesión y protección de rutas siguen siendo la estrategia del
backend.

`Usuario` y `[contraseña]` son el soporte de persistencia de esa autenticación; el
hash de la contraseña lo genera el backend y nunca se almacena en texto plano. No
se insertan filas ni la cuenta administrador predeterminada, y el acceso sigue
comenzando en Login sin sesión autenticada automática.

### Desviaciones respecto a la documentación

El esquema respeta el modelo documentado: mismas tablas, nombres y relaciones, sin
entidades ni relaciones nuevas. Se registran dos desviaciones acordadas con el
usuario, que forman parte de este cambio aprobado:

- Ubicación del script en `src/databaseLavadero/script db/` en lugar de
  `src/database/` indicado en la organización de alto nivel.
- `fechaHoraLavado` como `datetime2` en lugar de `date`, para conservar la hora.

## Risks / Trade-offs

- [Disponibilidad de la instancia `SQLEXPRESS01`] -> La verificación se ejecuta
  contra esa instancia; si no está disponible, el script se entrega para
  ejecución manual.
- [Identificador y texto con caracteres españoles] -> Se delimita `[contraseña]`
  y se define collation con soporte de acentos; los datos usan `varchar`.
- [`Usuario`/`Login` sin filas] -> La cuenta administrador predeterminada queda
  pendiente para un cambio futuro que defina su carga y su hash.
- [Ausencia de `UNIQUE` en campos como `dni`, `email` o `patenteVehi`] -> Puede
  requerirse un cambio posterior que agregue esas restricciones.
- [Orden de inserción en TPT] -> `Persona` antes que `Cliente`; la clave foránea
  lo hace explícito.

## Migration Plan

- No aplica migración incremental: es una base nueva, creada por un script
  versionado.
- El script es un artefacto versionado dentro de `src/databaseLavadero/script db/`
  y debe revisarse antes de ejecutarse.
- Despliegue: ejecutar el script revisado sobre la instancia `SQLEXPRESS01` y
  verificar la creación de tablas y relaciones; si la instancia no está
  disponible, registrar la limitación.
- Rollback: eliminar la base `DataBaseLavadero` de forma manual (fuera del alcance
  del script, que es no destructivo).

## Open Questions

- Si más adelante se requieren `UNIQUE` en `dni`, `email`, `patenteVehi` o
  `nombreUsuario`, y la carga de la cuenta administrador inicial: ambos quedan
  para un cambio aprobado posterior.
- Longitudes exactas de `varchar` y de `[contraseña]`, ajustables cuando el
  backend defina sus límites de validación.
