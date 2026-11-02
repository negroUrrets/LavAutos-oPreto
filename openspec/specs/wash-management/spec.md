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
Si el vehículo ya tiene un lavado activo, SHALL responder `409` sin crear el lavado.

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

#### Scenario: Vehículo con lavado activo

- **WHEN** se envía un lavado con un `vehi` que ya tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `409` y no se crea un segundo lavado activo para ese vehículo

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

### Requirement: Estado inicial del lavado

Al crear un lavado, el backend SHALL aceptar solo los estados `En Espera`, `Lavando` o
`Terminado`; con `Entregado` u otro estado SHALL responder `400` sin crear el lavado.

#### Scenario: Alta en un estado permitido

- **WHEN** se crea un lavado con estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `201` y el lavado queda creado con ese estado

#### Scenario: Alta en Entregado

- **WHEN** se crea un lavado con estado `Entregado`
- **THEN** la respuesta es `400` y no se crea el lavado

### Requirement: Login del lavado desde la sesión

`POST /api/lavados` SHALL asignar `login` con el `codigoLogin` de la sesión autenticada y SHALL
ignorar cualquier `login` enviado en el cuerpo.

#### Scenario: Login de la propia sesión

- **WHEN** se crea un lavado sin `login` en el cuerpo
- **THEN** el lavado queda asociado al `codigoLogin` de la sesión autenticada

#### Scenario: Login de otra sesión

- **WHEN** se crea un lavado enviando en el cuerpo el `login` de otra sesión
- **THEN** ese valor se ignora y el lavado queda asociado al `codigoLogin` de la sesión autenticada

### Requirement: Transiciones de estado permitidas

El backend SHALL permitir solo las transiciones `En Espera → Lavando`, `Lavando → En Espera`,
`Lavando → Terminado`, `Terminado → Lavando` y `Terminado → Entregado`; `Entregado` es
terminal y el mismo estado no es una transición. Cualquier otra transición SHALL responder
`409` sin modificar el lavado.

#### Scenario: Avance permitido

- **WHEN** se actualiza un lavado de `En Espera` a `Lavando`, de `Lavando` a `Terminado` o de `Terminado` a `Entregado`
- **THEN** la respuesta es `200` y el estado se actualiza

#### Scenario: Retroceso de un paso

- **WHEN** se actualiza un lavado de `Lavando` a `En Espera` o de `Terminado` a `Lavando`
- **THEN** la respuesta es `200` y el estado se actualiza

#### Scenario: Transición no permitida

- **WHEN** se intenta una transición distinta de las permitidas, como `En Espera` a `Terminado`, `En Espera` a `Entregado` o `Entregado` a `Terminado`
- **THEN** la respuesta es `409` y el lavado no se modifica

#### Scenario: Mismo estado

- **WHEN** se actualiza un lavado enviando su mismo estado
- **THEN** la respuesta es `200` y no se considera una transición

#### Scenario: Entregado es terminal

- **WHEN** se intenta actualizar un lavado en estado `Entregado` hacia `Terminado` o cualquier otro estado
- **THEN** la respuesta es `409` y el lavado no se modifica

### Requirement: Login no modificable al actualizar

`PUT /api/lavados/:id` SHALL ignorar el campo `login` del cuerpo y conservar el login original
del lavado.

#### Scenario: Login ignorado al actualizar

- **WHEN** se actualiza un lavado enviando un `login` distinto en el cuerpo
- **THEN** la respuesta es `200` y el lavado conserva su login original

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
