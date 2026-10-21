# Tasks

## 1. Configuración e infraestructura del backend

- [x] 1.1 Crear `src/backend/package.json` con dependencias (Express, Sequelize, `mssql`, `dotenv`, Jest, Supertest) y scripts `start`, `dev`, `test` y `lint`. Verificar que `npm install` completa sin errores.
- [x] 1.2 Crear la estructura de carpetas `config/`, `models/`, `routes/`, `controllers/`, `services/`, `middlewares/`, `utils/` y `tests/`. Verificar que todas existen.
- [x] 1.3 Configurar ESLint y Prettier del backend. Verificar que `npm run lint` se ejecuta.
- [x] 1.4 Implementar la lectura de configuración por variables de entorno y un `.env.example` sin credenciales reales. Verificar que la ausencia de una variable requerida produce un error claro al iniciar.
- [x] 1.5 Implementar la conexión Sequelize a `DataBaseLavadero` sin sincronización destructiva. Verificar que conecta contra la instancia `SQLEXPRESS01`.
- [x] 1.6 Crear la app Express con prefijo `/api`, endpoint `GET /api/health`, formato de respuesta JSON y middleware central de errores. Verificar con pruebas Supertest: health `200` y error inesperado `500` con mensaje seguro.

## 2. Modelos Sequelize y asociaciones

- [x] 2.1 Definir los 10 modelos (`Persona`, `Cliente`, `Vehiculo`, `ModeloVehiculo`, `MarcaVehiculo`, `CategoriaVehiculo`, `CategoriaLavado`, `Lavado`, `Login`, `Usuario`) con `tableName` exacto, `timestamps: false` y clave primaria documentada. Verificar con una prueba que consulta una tabla y mapea sus columnas (incluida `[contraseña]`).
- [x] 2.2 Declarar las asociaciones documentadas (vehículos, lavados, `Usuario`/`Login` y la herencia `Cliente`/`Persona` como 1:1). Verificar con pruebas que navegan `Lavado -> Vehiculo -> Cliente` y `Cliente -> Persona`.
- [x] 2.3 Verificar que el modelo `Lavado` no declara asociación directa hacia `Cliente`. Comprobar con una prueba/aserción sobre las asociaciones.

## 3. CRUD de clientes

- [x] 3.1 Implementar service, controller y rutas de clientes; `POST /api/clientes` crea `Persona` y `Cliente` en una transacción. Verificar con pruebas: `201` en creación válida y `400` con datos faltantes.
- [x] 3.2 Implementar listar, obtener, actualizar y eliminar clientes; eliminar un cliente elimina también sus vehículos. Verificar con pruebas: `200`/`204`, `404` inexistente, eliminación en cascada de vehículos y `409` cuando un vehículo del cliente tiene lavados.

## 4. CRUD de vehículos y catálogos

- [x] 4.1 Implementar el CRUD de vehículos validando `cliente` y `modeloVehi` existentes. Verificar con pruebas: `201`, `400` por referencia inexistente, `404` y `409` al eliminar con lavados asociados.
- [x] 4.2 Implementar el CRUD de `CategoriaVehiculo`, `MarcaVehiculo` y `ModeloVehiculo` con validación de sus referencias. Verificar con pruebas: creación `201`, `400` por referencia inexistente y `409` por dependencias.

## 5. CRUD de lavados y categoría de lavado

- [x] 5.1 Implementar crear/listar/obtener/actualizar lavados validando `vehi`, `categoriaLavado` y `login`, con filtro `?estadoLavado=`; no se permite eliminar lavados. Verificar con pruebas: `201`, `400` por referencia inexistente, `404`, `405` al intentar `DELETE`, y que la respuesta no expone un cliente directo.
- [x] 5.2 Implementar el CRUD de `CategoriaLavado`. Verificar con pruebas: creación `201`, `404` inexistente y `409` al eliminar con lavados asociados.

## 6. Verificación final

- [x] 6.1 Ejecutar `npm run lint` y `npm test` en `src/backend` y registrar los resultados. Si no hay SQL Server accesible, registrar la limitación y no afirmar que las pruebas pasaron.
- [x] 6.2 Revisar que no se usa `sequelize.sync({ alter: true })` ni operaciones destructivas. Verificar por búsqueda en el código.
- [x] 6.3 Ejecutar `openspec validate add-backend-crud-api --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
