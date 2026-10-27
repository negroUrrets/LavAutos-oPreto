# Spec Delta

## ADDED Requirements

### Requirement: Contenido de la card del cliente

La página SHALL mostrar una card con los datos del cliente: avatar y los valores de
`DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO` y `e-m@il`, con los botones `+VEHICULO`,
`Editar` y `Eliminar`. Las acciones de esos botones se detallan en los requisitos de
navegación y de eliminación.

#### Scenario: Datos del cliente visibles

- **WHEN** se muestra la página
- **THEN** la card del cliente muestra `DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO` y `e-m@il`

#### Scenario: Botones de la card del cliente

- **WHEN** se muestra la card del cliente
- **THEN** se ven los botones `+VEHICULO`, `Editar` y `Eliminar`

### Requirement: Contenido de la card del vehículo

La página SHALL mostrar una card por cada vehículo del cliente con `Vehiculo`
(categoría), `Marca`, `Modelo` y `PATENTE`, con los botones `Editar`, `Eliminar` y
`LAVAR`. Las acciones de esos botones se detallan en los requisitos de navegación y de
eliminación.

#### Scenario: Vehículos del cliente

- **WHEN** el cliente tiene vehículos registrados
- **THEN** se muestra una card por vehículo con su categoría, marca, modelo y patente

#### Scenario: Solo vehículos activos

- **WHEN** el cliente tiene vehículos activos e inactivos
- **THEN** solo se muestran las cards de los vehículos activos

#### Scenario: Botones de la card del vehículo

- **WHEN** se muestra la card de un vehículo
- **THEN** se ven los botones `Editar`, `Eliminar` y `LAVAR`

## REMOVED Requirements

### Requirement: Card del cliente

**Reason**: Incluía el escenario «Botones sin acción», que dejó de ser cierto cuando los
botones pasaron a navegar y a abrir popups.

**Migration**: Usar «Contenido de la card del cliente» para los datos y los botones, y
los requisitos de navegación y de eliminación para sus acciones.

### Requirement: Card por vehículo

**Reason**: Incluía el escenario «Botones sin acción», que dejó de ser cierto cuando los
botones pasaron a navegar y a abrir popups.

**Migration**: Usar «Contenido de la card del vehículo» para los datos y los botones, y
los requisitos de navegación y de eliminación para sus acciones.
