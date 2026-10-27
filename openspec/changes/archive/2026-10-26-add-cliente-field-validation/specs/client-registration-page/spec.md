# Spec Delta

## ADDED Requirements

### Requirement: Validación del formato de e-mail

Antes de registrar, la página SHALL validar que el `e-mail` cumpla un formato de
correo válido; si no lo cumple, NO SHALL registrar y SHALL advertir en la página.

#### Scenario: E-mail inválido

- **WHEN** se presiona `Registrar` con un `e-mail` que no tiene formato de correo válido
- **THEN** no se registra y se muestra un mensaje de advertencia en la página

#### Scenario: E-mail válido

- **WHEN** se presiona `Registrar` con un `e-mail` de formato válido
- **THEN** la validación de e-mail se considera superada

### Requirement: Formato de patente

Al registrar, la página SHALL exigir que `Patente` cumpla el formato de 2 letras, 3
números y 2 letras separados por guiones (por ejemplo `AB-254-MC`); si no lo cumple,
NO SHALL registrar y SHALL advertir en la página.

#### Scenario: Patente inválida

- **WHEN** se presiona `Registrar` con una `Patente` que no cumple el formato `AA-123-AA`
- **THEN** no se registra y se muestra un mensaje de advertencia en la página

#### Scenario: Patente válida

- **WHEN** se presiona `Registrar` con una `Patente` que cumple el formato `AA-123-AA`
- **THEN** la validación de patente se considera superada

### Requirement: Máscara del campo Patente

Mientras se tipea, el campo `Patente` SHALL agregar automáticamente los guiones,
convertir el texto a mayúsculas y descartar los caracteres del tipo incorrecto (letra
donde corresponde un número o número donde corresponde una letra).

#### Scenario: Formato automático

- **WHEN** se tipea `ab254mc` en el campo `Patente`
- **THEN** el campo muestra `AB-254-MC`

#### Scenario: Carácter del tipo incorrecto

- **WHEN** se tipea un número en una posición de letra (o una letra en una posición de número)
- **THEN** ese carácter se descarta

### Requirement: Patente almacenada con guiones

La `Patente` registrada SHALL almacenarse con los guiones del formato (por ejemplo
`AB-254-MC`).

#### Scenario: Patente almacenada

- **WHEN** se registra un cliente con la patente `AB-254-MC`
- **THEN** el vehículo se crea con esa patente, incluyendo los guiones
