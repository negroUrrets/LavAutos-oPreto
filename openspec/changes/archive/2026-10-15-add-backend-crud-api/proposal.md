# Proposal

## Why

El backend está vacío (`src/backend/`) y la base `DataBaseLavadero` ya existe en
SQL Server, pero todavía no hay forma de acceder a esos datos desde la
aplicación. Sin una capa de persistencia (Sequelize) ni una API REST, el
frontend no puede gestionar clientes, vehículos ni lavados. Este cambio inicia el
backend: conecta la aplicación a la base definida, modela las tablas y expone los
CRUD de la primera etapa.

## What Changes

- Incorporar la base del backend en `src/backend/`: aplicación Express,
  configuración por variables de entorno, conexión a SQL Server con Sequelize,
  manejo centralizado de errores y respuestas JSON consistentes.
- Definir modelos Sequelize y asociaciones para las 10 tablas del esquema
  documentado: `Persona`, `Cliente`, `Vehiculo`, `ModeloVehiculo`,
  `MarcaVehiculo`, `CategoriaVehiculo`, `CategoriaLavado`, `Lavado`, `Login` y
  `Usuario`.
- Modelar la herencia `Cliente`/`Persona` como asociación (tabla por tipo) y
  preservar `Lavado -> Vehiculo -> Cliente` sin relación directa `Lavado ->
  Cliente`.
- Exponer endpoints CRUD bajo `/api` para `Cliente`, `Vehiculo` (con sus
  catálogos `CategoriaVehiculo`, `MarcaVehiculo` y `ModeloVehiculo`) y `Lavado`
  (con `CategoriaLavado`).
- Crear los modelos `Usuario` y `Login` para uso interno, **sin** endpoints de
  gestión de usuarios.
- Agregar pruebas automatizadas del backend con Jest y Supertest.
- **Fuera de alcance**: login/logout y autenticación (sesión, cookie HttpOnly,
  protección de rutas) — se planifican en un cambio posterior; gestión de
  usuarios y auditoría funcional; frontend; migraciones de esquema; semilla de
  datos.

## Capabilities

### New Capabilities

- `backend-foundation`: base del servidor REST — arranque de la aplicación,
  configuración por entorno, conexión a SQL Server, formato de respuesta JSON y
  manejo centralizado de errores.
- `data-persistence`: modelos Sequelize y asociaciones que mapean el esquema
  `DataBaseLavadero`, incluida la herencia `Cliente`/`Persona`.
- `client-management`: operaciones CRUD de clientes sobre `/api`.
- `vehicle-management`: operaciones CRUD de vehículos y de sus catálogos
  (categoría, marca y modelo) sobre `/api`.
- `wash-management`: operaciones CRUD de lavados y de la categoría de lavado
  sobre `/api`.

### Modified Capabilities

- Ninguna. No hay especificaciones durables registradas todavía.

## Impact

- Archivos nuevos bajo `src/backend/` (app, configuración, `models/`, `routes/`,
  `controllers/`, `services/`, `middlewares/`, `utils/` y pruebas); no se
  modifica código existente.
- Dependencias nuevas del backend: Express, Sequelize y el driver de SQL Server
  (`mssql`/`tedious`), `dotenv`, y para pruebas Jest y Supertest. Se justifican
  por el stack acordado y la verificación requerida.
- Se conecta a la base `DataBaseLavadero` ya creada (instancia `SQLEXPRESS01`);
  las credenciales y parámetros se configuran por variables de entorno, sin
  secretos en el repositorio.
- Habilita el consumo desde el frontend en cambios posteriores.
- La autenticación queda pendiente: los endpoints de este cambio no quedan
  protegidos hasta el cambio de autenticación.
