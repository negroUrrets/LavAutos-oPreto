# wash-management Specification

## Purpose

Permite gestionar lavados y la categoría de lavado a través de la API REST,
preservando la relación `Lavado -> Vehiculo -> Cliente`.

## Requirements

### Requirement: Crear lavado

`POST /api/lavados` SHALL crear un lavado con `vehi`, `categoriaLavado`, `estado` (código
de `EstadoLavado`), `utileria` (código de `Utileria`) y `login`, con `detallesLavado`
opcional, y responder `201` con el lavado creado. El backend SHALL establecer
`fechaHoraLavado` y `fechaHoraLavadoTerminado` con la hora local, sin tomarlas del cuerpo.

#### Scenario: Creación exitosa

- **WHEN** se envía una solicitud válida con vehículo, categoría, login, estado y utilería existentes
- **THEN** se crea el lavado y la respuesta es `201` con los datos creados

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

- **WHEN** se envía un lavado con una `utileria` inexistente
- **THEN** la respuesta es `400` indicando que la utilería no existe

#### Scenario: Marcas generadas por el backend

- **WHEN** se crea un lavado
- **THEN** `fechaHoraLavado` y `fechaHoraLavadoTerminado` quedan con la hora local del servidor y no se toman de la solicitud

### Requirement: Listar lavados

`GET /api/lavados` SHALL devolver la lista de lavados con `200` y permitir filtrar por estado
(`estado`), por vehículo (`vehi`) y por rango de fecha de entrega (`desde` y `hasta`,
inclusive, sobre `fechaHoraLavadoTerminado`).

#### Scenario: Listado con resultados

- **WHEN** existen lavados registrados
- **THEN** la respuesta es `200` con la lista de lavados

#### Scenario: Filtrar lavados activos

- **WHEN** se consulta el listado con `estado` igual al código del estado activo
- **THEN** la respuesta incluye únicamente los lavados cuyo `estado` coincide con ese código

#### Scenario: Filtrar por vehículo

- **WHEN** se consulta el listado con `vehi` igual al código de un vehículo
- **THEN** la respuesta incluye únicamente los lavados de ese vehículo

#### Scenario: Filtrar por rango de entrega

- **WHEN** se consulta el listado con `desde` y `hasta`
- **THEN** la respuesta incluye únicamente los lavados cuya `fechaHoraLavadoTerminado` está dentro del rango, inclusive

### Requirement: Obtener lavado

`GET /api/lavados/:id` SHALL devolver un lavado por su identificador, con `200` si
existe y `404` si no.

#### Scenario: Lavado existente

- **WHEN** se solicita un lavado con un identificador existente
- **THEN** la respuesta es `200` con los datos del lavado

#### Scenario: Lavado inexistente

- **WHEN** se solicita un lavado con un identificador inexistente
- **THEN** la respuesta es `404`

### Requirement: Actualizar lavado

`PUT /api/lavados/:id` SHALL actualizar `vehi`, `categoriaLavado`, `estado`, `utileria` y
`detallesLavado`, con `200` si existe y `404` si no. Si el `estado` cambia, SHALL
actualizar `fechaHoraLavadoTerminado` con la hora local. `fechaHoraLavado` NO SHALL
modificarse y ninguna de las dos marcas SHALL aceptarse del cuerpo.

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

### Requirement: Eliminar lavado no permitido

El backend NO SHALL permitir eliminar lavados. Una solicitud `DELETE /api/lavados/:id`
SHALL ser rechazada y el lavado SHALL permanecer almacenado.

#### Scenario: Eliminación rechazada

- **WHEN** se envía una solicitud `DELETE` sobre un lavado
- **THEN** la respuesta es `405` y el lavado permanece almacenado

### Requirement: Cliente del lavado por el vehículo

La representación de un lavado NO SHALL incluir una referencia directa a
`Cliente`; el cliente SHALL obtenerse mediante `Lavado -> Vehiculo -> Cliente`.

#### Scenario: Cliente derivado

- **WHEN** se consulta un lavado
- **THEN** el cliente se obtiene navegando por su vehículo, sin un campo directo de cliente en el lavado

### Requirement: CRUD de categoría de lavado

El backend SHALL exponer operaciones CRUD para `CategoriaLavado` en
`/api/categorias-lavado`.

#### Scenario: Crear categoría de lavado

- **WHEN** se envía una solicitud válida con `descripcionLavado`
- **THEN** se crea la categoría y la respuesta es `201`

#### Scenario: Eliminar categoría inexistente

- **WHEN** se intenta eliminar una categoría de lavado inexistente
- **THEN** la respuesta es `404`

#### Scenario: Categoría con lavados asociados

- **WHEN** se intenta eliminar una categoría de lavado que tiene lavados asociados
- **THEN** la respuesta es `409` indicando que no puede eliminarse por tener dependencias

### Requirement: Baja con lavados asociados

Un vehículo o un cliente con lavados en `En Espera`, `Lavando` o `Terminado` NO SHALL darse de
baja: la respuesta SHALL ser `409` y los registros SHALL quedar sin cambios. Con lavados solo
en otros estados, la baja SHALL ser lógica (`estadoVehi = 0`, y en un cliente además
`estadoCliente = 0` y sus vehículos con `estadoVehi = 0`). Los lavados NO SHALL eliminarse.

#### Scenario: Vehículo con lavados

- **WHEN** se solicita la baja de un vehículo que tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `409` y el vehículo y sus lavados quedan sin cambios

#### Scenario: Cliente cuyos vehículos tienen lavados

- **WHEN** se solicita la baja de un cliente y alguno de sus vehículos tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `409` y el cliente, sus vehículos y sus lavados quedan sin cambios

#### Scenario: Lavado en estado distinto al activo

- **WHEN** el único lavado del vehículo tiene un `estado` distinto del activo
- **THEN** la baja se aplica como baja lógica igual que si el lavado estuviera activo

#### Scenario: Sin lavados

- **WHEN** se solicita la baja de un vehículo o de un cliente sin lavados asociados
- **THEN** el registro se elimina permanentemente y la respuesta es `204`

### Requirement: Estados de lavado base

El seed SHALL garantizar los estados de lavado `En Espera`, `Lavando`, `Terminado` y
`Entregado`, sin duplicar los existentes ni sobrescribirlos.

#### Scenario: Estados creados

- **WHEN** se ejecuta el seed y falta alguno de esos estados
- **THEN** se crea el estado faltante en `EstadoLavado`

#### Scenario: Estados ya existentes

- **WHEN** se ejecuta el seed y los estados ya existen
- **THEN** no se duplican ni se modifican

### Requirement: Listar estados de lavado

`GET /api/estados-lavado` SHALL devolver la lista de estados de lavado con `200`.

#### Scenario: Listado de estados

- **WHEN** se solicita la lista de estados de lavado
- **THEN** la respuesta es `200` con los estados y su `descripcionEstado`
