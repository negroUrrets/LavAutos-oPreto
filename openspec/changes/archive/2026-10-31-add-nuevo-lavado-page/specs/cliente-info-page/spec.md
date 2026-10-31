# Spec Delta

## ADDED Requirements

### Requirement: Botón LAVAR del vehículo

El botón `LAVAR` de la card de vehículo SHALL consultar los lavados del vehículo
(`GET /api/lavados?vehi=:id`). Si alguno está en estado «En Espera», «Lavando» o «Terminado»,
SHALL mostrar un popup de aviso y, al aceptarlo, permanecer en la información del cliente. Si
no hay ninguno en esos estados, SHALL navegar a la página «Nuevo Lavado» del vehículo.

#### Scenario: Vehículo con lavado en curso

- **WHEN** se presiona `LAVAR` y el vehículo tiene un lavado en «En Espera», «Lavando» o «Terminado»
- **THEN** se muestra un popup de aviso y, al aceptarlo, se permanece en la información del cliente sin navegar

#### Scenario: Vehículo sin lavado en curso

- **WHEN** se presiona `LAVAR` y el vehículo no tiene lavados en esos estados
- **THEN** la aplicación navega a `/clientes/:id/vehiculos/:vehiculoId/lavar`
