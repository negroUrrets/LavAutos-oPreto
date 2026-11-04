# Spec Delta

## MODIFIED Requirements

### Requirement: Crear lavado

`POST /api/lavados` SHALL crear un lavado con `vehi`, `categoriaLavado`, `estado` (código
de `EstadoLavado`), `utilerias` (códigos de `Utileria`) y `login`, con `detallesLavado`
opcional, y responder `201` con el lavado creado. El backend SHALL establecer
`fechaHoraLavado` y `fechaHoraLavadoTerminado` con la hora local, sin tomarlas del cuerpo.
Si el vehículo ya tiene un lavado activo, SHALL responder `409` sin crear el lavado.

#### Scenario: Creación exitosa

- **WHEN** se envía una solicitud válida con vehículo, categoría, login, estado y utilerías existentes
- **THEN** se crea el lavado y la respuesta es `201` con los datos creados y sus `utilerias`

#### Scenario: Vehículo inexistente

- **WHEN** se envía un lavado con un `vehi` inexistente
- **THEN** la respuesta es `400` indicando que el vehículo no existe

#### Scenario: Categoría inexistente

- **WHEN** se envía un lavado con una `categoriaLavado` inexistente
- **THEN** la respuesta es `400` indicando que la categoría no existe

#### Scenario: Estado inexistente

- **WHEN** se envía un lavado con un `estado` inexistente
- **THEN** la respuesta es `400` indicando que el estado no existe

#### Scenario: Utilería inexistente

- **WHEN** se envía un lavado con un código de `utilerias` inexistente
- **THEN** la respuesta es `400` indicando que la utilería no existe y no se crea el lavado

#### Scenario: Sin utilerías

- **WHEN** se envía un lavado sin `utilerias` o con el arreglo vacío
- **THEN** la respuesta es `400` y no se crea el lavado

#### Scenario: Varias utilerías

- **WHEN** se envía un lavado con dos o más utilerías existentes
- **THEN** se crea el lavado y la respuesta incluye todas las utilerías enviadas

#### Scenario: Marcas generadas por el backend

- **WHEN** se crea un lavado
- **THEN** `fechaHoraLavado` y `fechaHoraLavadoTerminado` quedan con la hora local del servidor y no se toman de la solicitud

#### Scenario: Vehículo con lavado activo

- **WHEN** se envía un lavado con un `vehi` que ya tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `409` y no se crea un segundo lavado activo para ese vehículo

### Requirement: Actualizar lavado

`PUT /api/lavados/:id` SHALL actualizar `vehi`, `categoriaLavado`, `estado`, `utilerias` y
`detallesLavado`, con `200` si existe y `404` si no. Si el `estado` cambia, SHALL
actualizar `fechaHoraLavadoTerminado` con la hora local. `fechaHoraLavado` NO SHALL
modificarse y ninguna de las dos marcas SHALL aceptarse del cuerpo. Si la actualización deja el
lavado activo (`En Espera`, `Lavando` o `Terminado`) sobre un vehículo con otro lavado activo,
SHALL responder `409` sin modificar.

#### Scenario: Actualización exitosa

- **WHEN** se envía una solicitud válida para un lavado existente
- **THEN** los datos y el estado se actualizan y la respuesta es `200`

#### Scenario: Lavado inexistente

- **WHEN** se intenta actualizar un lavado inexistente
- **THEN** la respuesta es `404`

#### Scenario: Estado inexistente al actualizar

- **WHEN** se intenta actualizar un lavado con un `estado` inexistente
- **THEN** la respuesta es `400` indicando que el estado no existe

#### Scenario: Cambio de estado actualiza la marca

- **WHEN** se actualiza un lavado con un `estado` distinto del actual
- **THEN** `fechaHoraLavadoTerminado` se actualiza con la hora local y `fechaHoraLavado` no cambia

#### Scenario: Sin cambio de estado

- **WHEN** se actualiza un lavado sin cambiar el `estado`
- **THEN** `fechaHoraLavadoTerminado` conserva su valor anterior

#### Scenario: Conflicto de lavado activo al actualizar

- **WHEN** se actualiza un lavado para que quede en estado `En Espera`, `Lavando` o `Terminado` sobre un vehículo que ya tiene otro lavado activo
- **THEN** la respuesta es `409` y el lavado no se modifica

#### Scenario: Actualización sobre el mismo vehículo

- **WHEN** se cambia el estado de un lavado activo sin cambiar de vehículo y no existe otro lavado activo en ese vehículo
- **THEN** la respuesta es `200` y no se considera un conflicto consigo mismo

#### Scenario: Reemplazo del conjunto de utilerías

- **WHEN** se actualiza un lavado con un arreglo `utilerias` distinto
- **THEN** la respuesta es `200` y el lavado queda asociado exactamente a las utilerías enviadas

#### Scenario: Utilería inexistente al actualizar

- **WHEN** se envía un código de `utilerias` inexistente al actualizar
- **THEN** la respuesta es `400` y el lavado no se modifica

## ADDED Requirements

### Requirement: Utilerías asociadas por lavado

Cada lavado SHALL tener su propio conjunto de utilerías, persistido en `DetalleUtileria`; el
catálogo `Utileria` SHALL ser compartido y su `estadoUtileria` NO SHALL cambiar al asignar o
quitar utilerías de un lavado. Las respuestas de crear, listar, obtener y actualizar lavados
SHALL incluir `utilerias`.

#### Scenario: Selecciones distintas

- **WHEN** existen dos lavados con conjuntos de utilerías diferentes
- **THEN** cada lavado devuelve únicamente las utilerías que tiene asociadas

#### Scenario: Catálogo sin cambios

- **WHEN** se asignan o quitan utilerías de un lavado
- **THEN** `Utileria.estadoUtileria` de esas filas permanece igual

#### Scenario: Representación del conjunto

- **WHEN** se crea, lista, obtiene o actualiza un lavado
- **THEN** la respuesta incluye su arreglo `utilerias` con las filas asociadas
