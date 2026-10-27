# Spec Delta

## MODIFIED Requirements

### Requirement: Eliminar cliente

`DELETE /api/clientes/:id` SHALL procesar la baja de un cliente existente: si el cliente
tiene algún lavado asociado, SHALL aplicar una baja lógica (`estadoCliente = 0` y
`estadoVehi = 0` de todos sus vehículos) sin eliminarlo; si no tiene lavados, SHALL
eliminarlo permanentemente junto con sus vehículos. En ambos casos responde `204`, y
`404` si el cliente no existe.

#### Scenario: Eliminación exitosa con vehículos

- **WHEN** se elimina un cliente que tiene vehículos asociados sin lavados
- **THEN** se eliminan también sus vehículos y la respuesta es `204`

#### Scenario: Cliente inexistente

- **WHEN** se intenta eliminar un cliente inexistente
- **THEN** la respuesta es `404`

#### Scenario: Cliente con vehículos con lavados

- **WHEN** se intenta eliminar un cliente cuyos vehículos tienen lavados asociados
- **THEN** no se elimina permanentemente: se marca `estadoCliente = 0` y `estadoVehi = 0` de todos sus vehículos, y la respuesta es `204`
