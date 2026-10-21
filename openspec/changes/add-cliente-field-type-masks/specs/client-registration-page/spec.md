# Spec Delta

## ADDED Requirements

### Requirement: Campos numéricos (DNI y Celular)

Los campos `DNI` y `Celular` SHALL aceptar solo dígitos; al tipear un carácter que no
sea número (letra, símbolo o espacio), ese carácter SHALL descartarse y no ingresar al
formulario.

#### Scenario: Letra en DNI

- **WHEN** se tipea una letra en el campo `DNI`
- **THEN** esa letra no se ingresa y el campo conserva solo los números

#### Scenario: Letra en Celular

- **WHEN** se tipea una letra en el campo `Celular`
- **THEN** esa letra no se ingresa y el campo conserva solo los números

#### Scenario: Números válidos

- **WHEN** se tipean números en `DNI` o `Celular`
- **THEN** los números se ingresan normalmente

### Requirement: Campos alfabéticos (Nombre y Apellido)

Los campos `Nombre` y `Apellido` SHALL aceptar solo letras, incluidos acentos y `ñ`;
al tipear un carácter que no sea letra (número, símbolo o espacio), ese carácter SHALL
descartarse y no ingresar al formulario.

#### Scenario: Número en Nombre

- **WHEN** se tipea un número en el campo `Nombre`
- **THEN** ese número no se ingresa y el campo conserva solo las letras

#### Scenario: Número en Apellido

- **WHEN** se tipea un número en el campo `Apellido`
- **THEN** ese número no se ingresa y el campo conserva solo las letras

#### Scenario: Letras con acentos y ñ

- **WHEN** se tipean letras con acentos o `ñ` (por ejemplo `Muñoz` o `Ángel`) en `Nombre` o `Apellido`
- **THEN** las letras se ingresan normalmente

#### Scenario: Espacio descartado

- **WHEN** se tipea un espacio en `Nombre` o `Apellido`
- **THEN** el espacio no se ingresa
