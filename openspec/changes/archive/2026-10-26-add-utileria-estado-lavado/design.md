# Design

## Context

- `DataBaseLavadero.sql` crea cada tabla con `IF OBJECT_ID(N'dbo.<tabla>', N'U') IS NULL`.
  Por eso una tabla ya existente no se modifica al volver a ejecutar el script: los cambios
  de este cambio sólo aplican a una base nueva.
- `Lavado` hoy tiene `estadoLavado VARCHAR(50) NOT NULL`. Los diagramas la reemplazan por
  la FK `estado` hacia `EstadoLavado` y agregan la FK `utileria` hacia `Utileria` y el
  atributo `detallesLavado`.
- Backend: `models/Lavado.js` declara `estadoLavado`; `services/lavadoService.js` lo
  acepta como campo, lo exige al crear y lo usa como filtro; las pruebas de `lavados`,
  `clientes`, `vehiculos` y `models` insertan lavados con `estadoLavado: 'activo'`.
- No hay consumidores de la API de lavados en el frontend.
- Las pruebas de backend usan la base indicada en `src/backend/.env`
  (`DataBaseLavadero`).

## Goals / Non-Goals

**Goals:**

- Que el script refleje el modelo documentado para `Lavado`, `Utileria` y `EstadoLavado`,
  sin tocar las demás tablas.
- Que el backend de lavados use `estado` y `utileria` de forma coherente con el esquema.
- Que la imagen del esquema coincida con el script final.

**Non-Goals:**

- Modificar, migrar o eliminar datos de la base ya creada.
- Transformar los valores existentes de `estadoLavado`.
- Insertar filas en `EstadoLavado` o `Utileria`.
- Endpoints CRUD para catálogos de lavado.

## Decisions

- **Orden de creación**: `EstadoLavado` y `Utileria` se crean antes de `Lavado`, dentro de
  la sección de usuarios y lavados, con el mismo patrón de guardas `IF OBJECT_ID`.
- **Tipos y claves**: códigos BIGINT IDENTITY(1,1) con PK `PK_EstadoLavado` y
  `PK_Utileria`; atributos de descripción VARCHAR(200) NOT NULL, igual que
  `CategoriaLavado.descripcionLavado`; flags `estadoLavado` y `estadoUtileria` BIT NOT NULL.
- **Lavado**: se quita `estadoLavado`; se agregan `estado BIGINT NOT NULL` con
  `FK_Lavado_EstadoLavado` y `utileria BIGINT NOT NULL` con `FK_Lavado_Utileria`; se agrega
  `detallesLavado VARCHAR(255) NULL`. `fechaHoraLavado` queda como DATETIME2.
- **Ambigüedades de los diagramas resueltas así**:
  - Las etiquetas FK `estadoLavado` y `estadoUtileria` no coinciden con las claves primarias
    `codigoEstado` y `codigoUtileria`; las FK apuntan a las claves primarias.
  - El nombre de la tabla es `EstadoLavado` (sin espacio), como `CategoriaLavado`.
  - `detallesLavado` es opcional y de 255 caracteres, porque los diagramas no lo definen.
- **Sin datos iniciales**: el script no inserta filas en los catálogos (requisito vigente
  de `database-schema`). Por eso, en una base nueva, los lavados sólo pueden registrarse
  después de cargar los catálogos.
- **Backend**:
  - Nuevos modelos `models/EstadoLavado.js` y `models/Utileria.js` con `timestamps: false`.
  - `Lavado.js`: se reemplaza `estadoLavado` por `estado` y `utileria` (BIGINT,
    `allowNull: false`) y se agrega `detallesLavado` (STRING(255), opcional).
  - `models/index.js`: `EstadoLavado.hasMany(Lavado, { foreignKey: 'estado', as: 'lavados' })`
    y `Lavado.belongsTo(EstadoLavado, { foreignKey: 'estado', as: 'datosEstado' })`; análogo
    para `Utileria` con `as: 'datosUtileria'`.
  - `lavadoService.js`: `fields` pasa a `fechaHoraLavado`, `estado`, `vehi`,
    `categoriaLavado`, `login`, `utileria` y `detallesLavado`; `validateCreate` exige
    `estado` y `utileria` y usa `assertExists` para ambos; `validateUpdate` valida `estado`
    y `utileria` cuando vienen; `include` agrega `datosEstado` y `datosUtileria`; el filtro
    de listado pasa a `estado`.
- **Contrato de API**: `estadoLavado` deja de existir en `POST`/`PUT /api/lavados` y el
  filtro cambia a `?estado=<codigoEstado>`. Es un cambio incompatible, sin consumidores en
  el frontend.
- **Pruebas**: `tests/helpers/fixtures.js` crea una fila de `EstadoLavado` y una de
  `Utileria` y las expone en `ids`; `removeBaseFixtures` las elimina después de
  `Login`/`Usuario`. Las pruebas que crean lavados pasan `estado` y `utileria`. Se agregan
  escenarios de 400 para estado o utilería inexistentes.

- **Secuencia en dos fases**: la Fase 1 modifica sólo el script. El usuario recrea la base
  `DataBaseLavadero` con ese script y confirma el punto de control. Recién entonces se
  ejecuta la Fase 2 (backend). Así las pruebas de backend corren contra la base que
  corresponde al esquema nuevo, y la base existente no se modifica.
- **Base de pruebas**: se usa la misma base `DataBaseLavadero` que el usuario recrea; no se
  configura una base de pruebas separada. Esto cierra la decisión que quedaba abierta.
- **Regla de baja con lavados (se preserva)**: la baja de cliente y de vehículo sigue
  contando lavados por `Lavado.vehi`, sin filtrar por `estado`. Con uno o más lavados se
  aplica baja lógica (`estadoVehi = 0`; en el cliente, también `estadoCliente = 0` y
  `estadoVehi = 0` de sus vehículos). Sin lavados se elimina físicamente. La regla no depende
  del catálogo `EstadoLavado`, así que el cambio de `estado` no la modifica. La Fase 2 no
  cambia `clienteService` ni `vehiculoService`; agrega pruebas que la fijan, incluido un
  lavado con `estado` distinto del activo.
- **Integridad en la base de datos**: las FK `FK_Lavado_Vehiculo` y `FK_Vehiculo_Cliente`
  impiden eliminar físicamente un vehículo con lavados o un cliente con vehículos. La baja
  lógica es lo que mantiene la regla; la FK es una defensa adicional.

## Risks / Trade-offs

- **[Base existente desalineada]**: una base creada con el script anterior conserva `Lavado`
  con `estadoLavado`; el backend (Fase 1 sin Fase 2) no funcionará contra ella. Es el estado
  esperado hasta el punto de control; no se afirma que el backend pasa antes de la Fase 2.
- **[Recreación manual]**: depende de que el usuario ejecute el script sobre una instancia
  vacía. Si la base recreada conserva datos, no se borran; el agente no ejecuta el script
  contra `DataBaseLavadero` existente.
- **[Imagen]**: el entorno no puede renderizar PNG. La tarea genera la fuente del diagrama
  con el modelo final; si no hay herramienta de exportación, el PNG lo exporta el usuario y
  no se declara actualizado sin verificarlo.
- **[Eliminación de columna]**: `estadoLavado` sólo se quita de la definición de
  instalaciones nuevas, según el pedido explícito del usuario. No hay migración ni borrado de
  datos en la base existente.
- **Rollback**: revertir el script y los archivos del backend; no hay cambios en datos
  existentes que deshacer.
- **[Especificaciones durables desactualizadas]**: `client-management` y `vehicle-management`
  todavía describen la baja con lavados como `409`. Las modifican los cambios sin archivar
  `add-eliminar-cliente-popup` y `add-eliminar-vehiculo-popup`, que cambian la baja a lógica.
  Esos cambios deben archivarse antes que éste, o la regla quedará inconsistente entre
  especificaciones. Este cambio no modifica esas dos especificaciones.
