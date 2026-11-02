# Spec Delta

## ADDED Requirements

### Requirement: Restricciones de unicidad de DNI y patente

El esquema SHALL incluir un índice único en `Persona.dni` y una columna persistida
`Vehiculo.patenteClave` (mayúsculas, sin guiones ni espacios) con índice único. El script SHALL
crear las restricciones de forma idempotente y una migración SHALL aplicarlas a una base
existente.

#### Scenario: DNI duplicado rechazado por la base

- **WHEN** se intenta insertar una `Persona` con un `dni` ya existente
- **THEN** la base rechaza la inserción

#### Scenario: Patente duplicada rechazada por la base

- **WHEN** se intenta insertar un `Vehiculo` cuya `patenteClave` ya existe
- **THEN** la base rechaza la inserción

#### Scenario: Restricciones idempotentes

- **WHEN** el script se ejecuta dos veces sobre la misma base
- **THEN** las restricciones existen una sola vez y la ejecución no falla
