# Spec Delta

## MODIFIED Requirements

### Requirement: Navegación del botón + info

Cada fila de resultados de la página de Clientes SHALL mostrar un botón verde `#7eb93c`
con el texto `+ info` que navega a la página de información del cliente correspondiente.

#### Scenario: Acceso a la información del cliente

- **WHEN** se hace clic en el botón `+ info` de una fila de clientes
- **THEN** la aplicación navega a la página de información de ese cliente

### Requirement: Navegación del botón + CLIENTE

La página SHALL mostrar un botón verde `#7eb93c` con el texto `+ CLIENTE` que navega a la
página «Nuevo Cliente» (`/clientes/nuevo`).

#### Scenario: Acceso a Nuevo Cliente

- **WHEN** se hace clic en el botón `+ CLIENTE` de la página de Clientes
- **THEN** la aplicación navega a la página «Nuevo Cliente»

## REMOVED Requirements

### Requirement: Botón de alta de cliente

**Reason**: Describía el botón `+ CLIENTE` como sin acción, pero el botón ya navega al
alta de cliente.

**Migration**: Usar «Navegación del botón + CLIENTE», que describe el botón y su
navegación.

### Requirement: Botón de información por fila

**Reason**: Describía el botón `+ info` como sin acción, pero el botón ya navega a la
información del cliente.

**Migration**: Usar «Navegación del botón + info», que describe el botón y su navegación.
