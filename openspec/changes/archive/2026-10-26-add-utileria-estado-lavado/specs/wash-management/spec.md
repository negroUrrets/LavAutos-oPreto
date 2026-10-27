# Spec Delta

## MODIFIED Requirements

### Requirement: Crear lavado

`POST /api/lavados` SHALL crear un lavado con `fechaHoraLavado`, `vehi`,
`categoriaLavado`, `estado` (código de `EstadoLavado`), `utileria` (código de `Utileria`)
y `login`, con `detallesLavado` opcional, y responder `201` con el lavado creado.

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

### Requirement: Listar lavados

`GET /api/lavados` SHALL devolver la lista de lavados con `200` y permitir filtrar por
estado mediante el parámetro de consulta `estado`, que indica el código de `EstadoLavado`.

#### Scenario: Listado con resultados

- **WHEN** existen lavados registrados
- **THEN** la respuesta es `200` con la lista de lavados

#### Scenario: Filtrar lavados activos

- **WHEN** se consulta el listado con `estado` igual al código del estado activo
- **THEN** la respuesta incluye únicamente los lavados cuyo `estado` coincide con ese código

### Requirement: Actualizar lavado

`PUT /api/lavados/:id` SHALL actualizar los datos del lavado, incluidos `estado`,
`utileria` y `detallesLavado`, con `200` si existe y `404` si no.

#### Scenario: Actualización exitosa

- **WHEN** se envía una solicitud válida para un lavado existente
- **THEN** los datos y el estado se actualizan y la respuesta es `200`

#### Scenario: Lavado inexistente

- **WHEN** se intenta actualizar un lavado inexistente
- **THEN** la respuesta es `404`

#### Scenario: Estado inexistente al actualizar

- **WHEN** se intenta actualizar un lavado con un `estado` inexistente
- **THEN** la respuesta es `400` indicando que el estado no existe

## ADDED Requirements

### Requirement: Baja con lavados asociados

Un vehículo o un cliente con uno o más lavados asociados, sin importar el `estado` de esos
lavados, NO SHALL eliminarse físicamente. La baja SHALL aplicarse como baja lógica:
`Vehiculo.estadoVehi = 0`, y en el caso de un cliente, además `Cliente.estadoCliente = 0`
y `estadoVehi = 0` de todos sus vehículos. Los lavados NO SHALL eliminarse.

#### Scenario: Vehículo con lavados

- **WHEN** se solicita la baja de un vehículo que tiene uno o más lavados asociados
- **THEN** la respuesta es `204`, el vehículo permanece almacenado con `estadoVehi = 0` y sus lavados no se eliminan

#### Scenario: Cliente cuyos vehículos tienen lavados

- **WHEN** se solicita la baja de un cliente y alguno de sus vehículos tiene uno o más lavados asociados
- **THEN** la respuesta es `204`, el cliente queda con `estadoCliente = 0`, todos sus vehículos quedan con `estadoVehi = 0` y ningún registro se elimina

#### Scenario: Lavado en estado distinto al activo

- **WHEN** el único lavado del vehículo tiene un `estado` distinto del activo
- **THEN** la baja se aplica como baja lógica igual que si el lavado estuviera activo

#### Scenario: Sin lavados

- **WHEN** se solicita la baja de un vehículo o de un cliente sin lavados asociados
- **THEN** el registro se elimina permanentemente y la respuesta es `204`
