# Spec Delta

## MODIFIED Requirements

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
