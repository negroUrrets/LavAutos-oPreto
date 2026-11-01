# Spec Delta

## MODIFIED Requirements

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
