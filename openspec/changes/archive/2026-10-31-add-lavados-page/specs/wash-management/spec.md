# Spec Delta

## ADDED Requirements

### Requirement: Estados de lavado base

El seed SHALL garantizar los estados de lavado `En Espera`, `Lavando`, `Terminado` y
`Entregado`, sin duplicar los existentes ni sobrescribirlos.

#### Scenario: Estados creados

- **WHEN** se ejecuta el seed y falta alguno de esos estados
- **THEN** se crea el estado faltante en `EstadoLavado`

#### Scenario: Estados ya existentes

- **WHEN** se ejecuta el seed y los estados ya existen
- **THEN** no se duplican ni se modifican
