# Proposal

## Why

El informe afirma que se rechazan los DNI y las patentes duplicados, pero ni los servicios ni
el esquema SQL tienen controles de unicidad. La búsqueda previa del formulario consulta solo
clientes activos y no reemplaza la validación del backend, así que una llamada directa a la API
puede duplicar datos.

## What Changes

- **DNI**: el backend rechaza con `409` un alta o edición cuyo `dni` pertenezca a otro cliente
  activo, con el mensaje `El DNI ya esta registrado.` Una edición también rechaza el DNI de un
  cliente dado de baja (no se reactiva a otro cliente desde una edición).
- **Reutilización de DNI**: si el DNI pertenece a un cliente con `estadoCliente = 0`, el alta
  reutiliza esa persona y ese cliente, actualiza sus datos, lo reactiva y responde `201` sin
  crear otra persona.
- **Patente**: el backend normaliza la patente a mayúsculas y sin espacios; si queda con el
  formato `AA123AA` la guarda con guiones (`AA-123-AA`). Rechaza con `409` una patente ya
  registrada en un vehículo activo, y una edición rechaza la de cualquier otro vehículo (activo
  o dado de baja), con el mensaje `La patente ya esta registrada.`
- **Reutilización de patente**: si la patente pertenece a un vehículo con `estadoVehi = 0`, el
  alta reutiliza ese vehículo, actualiza su cliente, modelo y patente, lo reactiva
  (`estadoVehi = 1`) y responde `201` con el mismo `codigoVehi`, para el mismo cliente o para
  otro cliente.
- **Base de datos**: índice único en `Persona.dni` y clave normalizada persistida
  `Vehiculo.patenteClave` (mayúsculas, sin guiones ni espacios) con índice único. Los scripts
  son idempotentes y una migración aplica las restricciones a una base existente.
- **Mensajes**: los servicios del frontend propagan el mensaje del backend y las páginas de
  alta y edición lo muestran.
- **Pruebas**: dos altas con el mismo DNI, dos vehículos con la misma patente normalizada, una
  edición con un dato ya registrado, la reactivación de un cliente y de un vehículo dados de
  baja (mismo cliente y cliente distinto) y la verificación de los índices en una base temporal.
- **Fuera de alcance**: cambiar la búsqueda previa del formulario y otras modificaciones de
  esquema.

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `client-management`: unicidad de DNI y reutilización de un cliente dado de baja.
- `vehicle-management`: normalización y unicidad de patente.
- `database-schema`: índices únicos de DNI y patente normalizada.

## Impact

- Backend: `services/clienteService.js`, `services/vehiculoService.js`,
  `utils/normalizers.js` (nuevo) y pruebas de integración.
- Base de datos: `src/databaseLavadero/script db/DataBaseLavadero.sql` y un script de migración.
- Frontend: servicios de clientes y vehículos, páginas de alta/edición y sus pruebas.
- Pruebas: `tests/helpers/fixtures.js` pasa a usar un DNI único por fixture.
