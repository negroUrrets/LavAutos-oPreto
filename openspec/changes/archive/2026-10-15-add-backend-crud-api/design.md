# Design

## Context

Ver `proposal.md - Why`. `src/backend/` está vacío; la base `DataBaseLavadero` ya
existe en SQL Server (instancia `SQLEXPRESS01`) con las 10 tablas y sus relaciones
(cambio `add-database-lavadero-schema`). Este cambio inicia el backend y es la
primera vez que se introduce Node/Express/Sequelize en el repositorio, por lo que
también define la estructura y la configuración base.

## Goals / Non-Goals

**Goals:**

- Establecer la estructura y la configuración del backend (app, conexión,
  errores, variables de entorno).
- Mapear el esquema existente con Sequelize y exponer CRUD REST bajo `/api`.
- Cubrir el dominio de la primera etapa: clientes, vehículos (con catálogos) y
  lavados (con categoría).
- Dejar pruebas automatizadas que verifiquen endpoints y persistencia.

**Non-Goals:**

- Autenticación, sesión, cookie HttpOnly, protección de rutas (cambio posterior).
- Endpoints de gestión de usuarios (`Usuario`/`Login` solo como modelos).
- Cambios al esquema de base de datos o migraciones.
- Datos iniciales o semilla.
- Frontend.

## Decisions

### Estructura y separación de responsabilidades

Se usa la organización acordada: `config/` (conexión y variables), `models/`
(Sequelize y asociaciones), `routes/` (rutas), `controllers/` (adaptación HTTP),
`services/` (reglas de negocio), `middlewares/` (errores y validaciones
transversales), `utils/` (utilidades) y `tests/`.

- Las rutas solo asocian endpoints con controllers; no contienen lógica.
- Los controllers adaptan HTTP y delegan en services; los services concentran la
  lógica y usan los models.
- Alternativa descartada: lógica en rutas o controllers, que rompe la cohesión y
  dificulta las pruebas.

### Configuración por variables de entorno

La conexión se configura con variables de entorno (`DB_SERVER`, `DB_INSTANCE`,
`DB_NAME=DataBaseLavadero`, `DB_USER`, `DB_PASSWORD`, `DB_PORT`, `DB_DIALECT=mssql`,
`PORT`). Se incluye un `.env.example` sin credenciales reales y `.env` fuera del
control de versiones.

- Alternativa descartada: credenciales en el código, prohibido por AGENTS §11/§12.

### Modelos Sequelize y mapeo explícito

Cada modelo declara `tableName` exacto (PascalCase singular documentado),
`timestamps: false` y su clave primaria (`codigoPersona`, `codigoVehi`, etc.). La
columna `[contraseña]` se mapea con su nombre delimitado.

- Alternativa descartada: confiar en convenciones (pluralización, `id`,
  timestamps), que no coinciden con el esquema y generarían columnas inexistentes.

### Herencia Cliente/Persona

`Cliente` se modela como una asociación uno a uno con `Persona` sobre
`codigoPersona` (`Persona.hasOne(Cliente)`, `Cliente.belongsTo(Persona)` con clave
foránea compartida), no como herencia de clases.

- Alternativa descartada: herencia nativa de Sequelize (no soporta bien la
  estrategia tabla por tipo y complica consultas/escrituras).
- Consecuencia: crear un cliente escribe `Persona` y `Cliente` en una transacción;
  actualizar/eliminar coordina ambos registros.

### Asociaciones

Se declaran las relaciones documentadas: `Cliente 1:N Vehiculo`,
`ModeloVehiculo 1:N Vehiculo`, `MarcaVehiculo 1:N ModeloVehiculo`,
`CategoriaVehiculo 1:N MarcaVehiculo`, `Vehiculo 1:N Lavado`,
`CategoriaLavado 1:N Lavado`, `Usuario 1:N Login`, `Login 1:N Lavado`. No se declara
`Lavado -> Cliente`; el cliente se obtiene vía `Lavado -> Vehiculo -> Cliente`.

### Endpoints REST

Recursos en plural bajo `/api`, con métodos HTTP según su propósito:

| Recurso | Ruta |
| --- | --- |
| Salud | `GET /api/health` |
| Clientes | `POST/GET/GET:id/PUT/DELETE /api/clientes` |
| Vehículos | `POST/GET/GET:id/PUT/DELETE /api/vehiculos` |
| Categorías de vehículo | `... /api/categorias-vehiculo` |
| Marcas de vehículo | `... /api/marcas-vehiculo` |
| Modelos de vehículo | `... /api/modelos-vehiculo` |
| Lavados | `POST/GET/GET:id/PUT /api/lavados` (`GET` acepta `?estadoLavado=`; sin `DELETE`) |
| Categorías de lavado | `... /api/categorias-lavado` |

### Validación y errores

La validación se hace en el backend antes de persistir (sin librerías extra, para
no sumar dependencias): datos faltantes o mal formados → `400`; referencias a
filas inexistentes → `400`; violación de clave foránea al eliminar → `409`. Los
errores se procesan en un middleware central que distingue esperables de
inesperados y no expone trazas. El formato de respuesta es
`{ success: true, data }` o `{ success: false, error: { message } }`.

### Eliminación de clientes y lavados

Eliminar un cliente elimina también sus vehículos asociados dentro de una
transacción. Si alguno de esos vehículos tiene lavados, la operación se rechaza
con `409`, porque los lavados no se eliminan. Los lavados no se pueden eliminar:
`DELETE /api/lavados/:id` responde `405` y el registro permanece almacenado.

- Alternativa descartada: rechazar con `409` la eliminación de un cliente con
  vehículos, que impedía la baja de clientes con vehículos sin historial.

### Usuario/Login y autenticación

`Usuario` y `Login` se definen como modelos para las asociaciones de `Lavado`, pero
no se exponen endpoints de gestión (AGENTS §3/§8/§11). La autenticación (sesión de
servidor, cookie HttpOnly, cierre de sesión y protección de rutas) queda para un
cambio posterior; los endpoints de este cambio no quedan protegidos todavía.

### Sin cambios de esquema ni sincronización destructiva

El esquema ya existe; no se crean migraciones ni se usa
`sequelize.sync({ alter: true })`. La conexión solo se valida al arrancar.

### Pruebas

Jest + Supertest para pruebas de endpoints e integración con Sequelize. Para no
contaminar datos, cada prueba de escritura se ejecuta dentro de una transacción que
se revierte al final. Las pruebas requieren una instancia de SQL Server accesible
(`SQLEXPRESS01`) y la base `DataBaseLavadero`; si no está disponible, se documenta
la limitación y no se afirma que pasaron.

## Risks / Trade-offs

- [Endpoints sin autenticación hasta el cambio siguiente] -> Se limita el alcance a
  desarrollo local; el cambio de autenticación debe llegar antes de exponer el
  backend.
- [Pruebas dependientes de SQL Server] -> Si no hay instancia accesible, se registra
  la limitación; las pruebas no se declaran exitosas sin ejecutarse.
- [TPT sin herencia nativa] -> Escrituras de cliente coordinadas con transacción y
  joins explícitos; se documenta para no duplicar persona.
- [Sin restricciones `UNIQUE` en `dni`/`patenteVehi`] -> Pueden generarse duplicados;
  agregarlas es un cambio futuro.
- [Nombre de columna `[contraseña]`] -> Requiere delimitación consistente en el mapeo.

## Migration Plan

- No hay migración de esquema: la base `DataBaseLavadero` ya existe.
- Despliegue: instalar dependencias del backend, copiar `.env.example` a `.env` y
  completar credenciales, e iniciar el servidor.
- Verificación: ejecutar `npm test` con SQL Server accesible.
- Rollback: revertir los archivos agregados bajo `src/backend/`; no afecta datos.

## Open Questions

- Valor literal del estado que representa "lavado activo" para el filtro de
  `estadoLavado` (el diagrama solo dice "activos").
- Nombres finales de los recursos de catálogos (se proponen
  `categorias-vehiculo`, `marcas-vehiculo`, `modelos-vehiculo`, `categorias-lavado`).
- Estrategia de aislamiento de pruebas: transacción revertida sobre la base real vs.
  una base de prueba dedicada.
- Si `Persona` necesita endpoints propios o solo se gestiona a través de `Cliente`.
