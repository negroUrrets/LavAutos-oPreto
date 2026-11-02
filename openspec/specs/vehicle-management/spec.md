# vehicle-management Specification

## Purpose

Permite gestionar vehículos y sus catálogos (categoría, marca y modelo) a través
de la API REST, con cada vehículo asociado a un cliente.

## Requirements

### Requirement: Crear vehículo

`POST /api/vehiculos` SHALL crear un vehículo con `patenteVehi`, `estadoVehi`,
`cliente` y `modeloVehi`, y responder `201` con el vehículo creado.

#### Scenario: Creación exitosa

- **WHEN** se envía una solicitud válida con un cliente y un modelo existentes
- **THEN** se crea el vehículo y la respuesta es `201` con los datos creados

#### Scenario: Cliente inexistente

- **WHEN** se envía un vehículo con un `cliente` inexistente
- **THEN** la respuesta es `400` indicando que el cliente no existe

#### Scenario: Modelo inexistente

- **WHEN** se envía un vehículo con un `modeloVehi` inexistente
- **THEN** la respuesta es `400` indicando que el modelo no existe

### Requirement: Listar vehículos

`GET /api/vehiculos` SHALL devolver solo los vehículos con `estadoVehi = 1`, con `200`.

#### Scenario: Listado con resultados

- **WHEN** existen vehículos con `estadoVehi = 1`
- **THEN** la respuesta es `200` con la lista de vehículos activos

#### Scenario: Vehículos inactivos excluidos

- **WHEN** existen vehículos con `estadoVehi = 0`
- **THEN** no aparecen en la lista

#### Scenario: Listado vacío

- **WHEN** no existen vehículos con `estadoVehi = 1`
- **THEN** la respuesta es `200` con una lista vacía

### Requirement: Obtener vehículo

`GET /api/vehiculos/:id` SHALL devolver un vehículo por su identificador, con `200`
si existe y `404` si no.

#### Scenario: Vehículo existente

- **WHEN** se solicita un vehículo con un identificador existente
- **THEN** la respuesta es `200` con los datos del vehículo

#### Scenario: Vehículo inexistente

- **WHEN** se solicita un vehículo con un identificador inexistente
- **THEN** la respuesta es `404`

### Requirement: Actualizar vehículo

`PUT /api/vehiculos/:id` SHALL actualizar `patenteVehi`, `estadoVehi`, `cliente` y
`modeloVehi`, con `200` si existe y `404` si no. Si el vehículo tiene un lavado en estado
`En Espera`, `Lavando` o `Terminado`, SHALL responder `409` y no modificarlo.

#### Scenario: Actualización exitosa

- **WHEN** se envía una solicitud válida para un vehículo existente
- **THEN** los datos se actualizan y la respuesta es `200`

#### Scenario: Vehículo inexistente

- **WHEN** se intenta actualizar un vehículo inexistente
- **THEN** la respuesta es `404`

#### Scenario: Vehículo en lavado

- **WHEN** se intenta actualizar un vehículo que tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `409` y el vehículo no se modifica

### Requirement: Eliminar vehículo

`DELETE /api/vehiculos/:id` SHALL eliminar un vehículo existente con `204` y responder `404`
si no existe. Si el vehículo tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`,
SHALL responder `409` y no darlo de baja. Si tiene lavados solo en otros estados, SHALL
aplicar baja lógica (`estadoVehi = 0`) en lugar de eliminarlo.

#### Scenario: Eliminación exitosa

- **WHEN** se elimina un vehículo existente sin lavados asociados
- **THEN** la respuesta es `204` sin contenido y el vehículo se elimina permanentemente

#### Scenario: Vehículo inexistente

- **WHEN** se intenta eliminar un vehículo inexistente
- **THEN** la respuesta es `404`

#### Scenario: Vehículo con lavados asociados

- **WHEN** se intenta eliminar un vehículo que tiene un lavado en estado `En Espera`, `Lavando` o `Terminado`
- **THEN** la respuesta es `409` y el vehículo permanece sin cambios

#### Scenario: Vehículo con lavados entregados

- **WHEN** se intenta eliminar un vehículo que tiene solo lavados en estado `Entregado`
- **THEN** la respuesta es `204` y el vehículo queda con `estadoVehi = 0` (baja lógica) sin eliminarse

### Requirement: CRUD de categoría de vehículo

El backend SHALL exponer operaciones CRUD para `CategoriaVehiculo` en
`/api/categorias-vehiculo`.

#### Scenario: Crear categoría de vehículo

- **WHEN** se envía una solicitud válida con `categoriaVehi`
- **THEN** se crea la categoría y la respuesta es `201`

#### Scenario: Eliminar categoría inexistente

- **WHEN** se intenta eliminar una categoría de vehículo inexistente
- **THEN** la respuesta es `404`

#### Scenario: Categoría con marcas asociadas

- **WHEN** se intenta eliminar una categoría de vehículo que tiene marcas asociadas
- **THEN** la respuesta es `409` indicando que no puede eliminarse por tener dependencias

### Requirement: CRUD de marca de vehículo

El backend SHALL exponer operaciones CRUD para `MarcaVehiculo` en
`/api/marcas-vehiculo`, requiriendo una `categoriaVehi` existente.

#### Scenario: Crear marca de vehículo

- **WHEN** se envía una solicitud válida con `marcaVehi` y una categoría existente
- **THEN** se crea la marca y la respuesta es `201`

#### Scenario: Categoría inexistente

- **WHEN** se envía una marca con una `categoriaVehi` inexistente
- **THEN** la respuesta es `400` indicando que la categoría no existe

#### Scenario: Marca con modelos asociados

- **WHEN** se intenta eliminar una marca de vehículo que tiene modelos asociados
- **THEN** la respuesta es `409` indicando que no puede eliminarse por tener dependencias

### Requirement: CRUD de modelo de vehículo

El backend SHALL exponer operaciones CRUD para `ModeloVehiculo` en
`/api/modelos-vehiculo`, requiriendo una `marcaVehi` existente.

#### Scenario: Crear modelo de vehículo

- **WHEN** se envía una solicitud válida con `modeloVehi` y una marca existente
- **THEN** se crea el modelo y la respuesta es `201`

#### Scenario: Marca inexistente

- **WHEN** se envía un modelo con una `marcaVehi` inexistente
- **THEN** la respuesta es `400` indicando que la marca no existe

#### Scenario: Modelo con vehículos asociados

- **WHEN** se intenta eliminar un modelo de vehículo que tiene vehículos asociados
- **THEN** la respuesta es `409` indicando que no puede eliminarse por tener dependencias

### Requirement: Vehículos con su marca y categoría

`GET /api/vehiculos` SHALL incluir, junto con cada vehículo, su modelo, la marca del
modelo y la categoría de la marca, de modo que la respuesta permita conocer la
categoría, la marca, el modelo y la patente de cada vehículo.

#### Scenario: Listado con marca y categoría

- **WHEN** se solicita `GET /api/vehiculos`
- **THEN** cada vehículo incluye su modelo, la marca del modelo y la categoría de la marca

### Requirement: Filtro de vehículos por cliente

`GET /api/vehiculos` SHALL aceptar un filtro opcional por cliente y, cuando se envía,
devolver solo los vehículos de ese cliente.

#### Scenario: Vehículos de un cliente

- **WHEN** se solicita `GET /api/vehiculos` filtrando por un cliente
- **THEN** la respuesta incluye solo los vehículos de ese cliente

#### Scenario: Sin filtro

- **WHEN** se solicita `GET /api/vehiculos` sin filtro
- **THEN** la respuesta incluye todos los vehículos activos registrados

### Requirement: Normalización de patente

El backend SHALL normalizar la patente a mayúsculas y sin espacios antes de comparar y guardar.
Si la patente normalizada tiene el formato `AA123AA`, SHALL guardarla con guiones (`AA-123-AA`).

#### Scenario: Mayúsculas y guiones

- **WHEN** se registra una patente `ab123cd`
- **THEN** se guarda como `AB-123-CD`

#### Scenario: Sin espacios

- **WHEN** se registra una patente con espacios
- **THEN** se comparan y guardan los caracteres sin espacios

### Requirement: Unicidad de patente

El backend SHALL rechazar con `409` un alta cuya patente normalizada pertenezca a un vehículo
activo, y una edición cuya patente pertenezca a cualquier otro vehículo, activo o dado de baja,
con el mensaje `La patente ya esta registrada.` La misma patente del propio vehículo NO SHALL
considerarse duplicada.

#### Scenario: Alta con patente activa

- **WHEN** se registra un vehículo con la patente de un vehículo activo
- **THEN** la respuesta es `409` con el mensaje `La patente ya esta registrada.` y no se crea el vehículo

#### Scenario: Edición con patente de otro vehículo

- **WHEN** se edita un vehículo con la patente de otro vehículo, activo o dado de baja
- **THEN** la respuesta es `409` y el vehículo no se modifica

#### Scenario: Misma patente

- **WHEN** se actualiza un vehículo conservando su propia patente
- **THEN** la respuesta es `200` y no se considera duplicada

### Requirement: Reutilización de patente de un vehículo dado de baja

Al registrar un vehículo con una patente que pertenece a un vehículo con `estadoVehi = 0`, el
backend SHALL reutilizar ese vehículo, actualizar su `cliente`, `modeloVehi` y patente
normalizada, reactivarlo (`estadoVehi = 1`) y responder `201` con el mismo `codigoVehi`, sin
crear otro vehículo.

#### Scenario: Alta con patente de un vehículo dado de baja

- **WHEN** se registra un vehículo con la patente de un vehículo dado de baja
- **THEN** la respuesta es `201` con el mismo `codigoVehi` y el vehículo queda activo

#### Scenario: Mismo cliente o cliente distinto

- **WHEN** la patente se asigna al mismo cliente o a un cliente distinto
- **THEN** el vehículo reactivado queda asociado al cliente enviado

#### Scenario: Sin duplicar el vehículo

- **WHEN** se reutiliza la patente de un vehículo dado de baja
- **THEN** existe una sola fila en `Vehiculo` con esa `patenteClave`
