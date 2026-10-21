# backend-foundation Specification

## Purpose

Provee la base del servidor REST del backend: arranque de la aplicación Express,
configuración por entorno, conexión a la base SQL Server `DataBaseLavadero`,
formato de respuesta JSON y manejo centralizado de errores.

## Requirements

### Requirement: Arranque del servidor y prefijo /api

El backend SHALL iniciar un servidor HTTP que exponga sus rutas bajo el prefijo
`/api` y ofrezca un endpoint de salud.

#### Scenario: Servidor en ejecución

- **WHEN** se inicia el backend con una configuración válida
- **THEN** el servidor queda escuchando y responde en las rutas bajo `/api`

#### Scenario: Endpoint de salud

- **WHEN** se consulta el endpoint de salud
- **THEN** responde `200` con un JSON que indica que el servicio está operativo

### Requirement: Conexión a SQL Server

El backend SHALL conectarse a la base `DataBaseLavadero` en Microsoft SQL Server
mediante Sequelize, usando la configuración provista por variables de entorno.

#### Scenario: Conexión establecida

- **WHEN** el backend arranca con parámetros de conexión válidos
- **THEN** la conexión con `DataBaseLavadero` se establece correctamente

#### Scenario: Conexión fallida

- **WHEN** la conexión a SQL Server no puede establecerse
- **THEN** el arranque falla con un error claro que no expone credenciales

### Requirement: Configuración por variables de entorno

La configuración de conexión (servidor, instancia, base, credenciales y puerto)
SHALL leerse de variables de entorno, sin secretos almacenados en el repositorio.

#### Scenario: Variables presentes

- **WHEN** las variables de entorno requeridas están definidas
- **THEN** el backend las usa para configurar la conexión

#### Scenario: Variables faltantes

- **WHEN** falta una variable de entorno requerida
- **THEN** el backend falla al iniciar con un mensaje que indica la variable faltante

### Requirement: Formato de respuesta JSON consistente

Las respuestas exitosas SHALL usar `success: true` con los datos en `data`; las de
error SHALL usar `success: false` con un objeto `error` que contenga un mensaje
seguro.

#### Scenario: Respuesta exitosa

- **WHEN** una operación finaliza correctamente con contenido
- **THEN** la respuesta incluye `success: true` y el objeto `data`

#### Scenario: Respuesta de error

- **WHEN** una operación falla
- **THEN** la respuesta incluye `success: false` y un objeto `error` con un mensaje seguro

### Requirement: Códigos de estado HTTP

El backend SHALL usar códigos de estado coherentes: `200` operación correcta,
`201` recurso creado, `204` sin contenido, `400` solicitud inválida, `404` recurso
no encontrado, `409` conflicto y `500` error interno.

#### Scenario: Recurso creado

- **WHEN** se crea un recurso correctamente
- **THEN** la respuesta usa el código `201`

#### Scenario: Recurso no encontrado

- **WHEN** se solicita un recurso inexistente
- **THEN** la respuesta usa el código `404`

### Requirement: Manejo centralizado de errores

Los errores SHALL procesarse en un middleware central que distinga errores
esperables de inesperados y no exponga trazas, secretos ni detalles internos.

#### Scenario: Error inesperado

- **WHEN** ocurre un error no controlado
- **THEN** el backend responde `500` con un mensaje seguro, sin trazas ni detalles internos

#### Scenario: Error esperable

- **WHEN** ocurre un error de validación o recurso inexistente
- **THEN** el backend responde con el código correspondiente y un mensaje claro

### Requirement: Evolución no destructiva del esquema

El backend SHALL NOT usar sincronización automática destructiva ni eliminar datos
como mecanismo de actualización del esquema.

#### Scenario: Arranque sin alterar el esquema

- **WHEN** el backend se inicia
- **THEN** no altera ni elimina tablas o datos existentes de `DataBaseLavadero`
