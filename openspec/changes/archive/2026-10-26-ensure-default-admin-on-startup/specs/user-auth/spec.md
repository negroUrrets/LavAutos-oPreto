# Spec Delta

## MODIFIED Requirements

### Requirement: Cuenta administrador predeterminada

El backend SHALL garantizar la cuenta administrador (`nombreUsuario = admin`, contraseña
predeterminada `123456`) tanto al iniciar como en el seed: si no existe, SHALL crearla
almacenando la contraseña con un algoritmo de hash y nunca en texto plano; si existe, NO
SHALL duplicarla ni sobrescribir su contraseña.

#### Scenario: Cuenta creada

- **WHEN** el backend inicia o se ejecuta el seed y no existe la cuenta administrador
- **THEN** se crea el usuario `admin` con la contraseña almacenada como hash

#### Scenario: Cuenta ya existente

- **WHEN** el backend inicia o se ejecuta el seed y la cuenta administrador ya existe
- **THEN** no se crea un duplicado ni se sobrescribe la contraseña existente

#### Scenario: Login tras recrear la base

- **WHEN** se recrea `DataBaseLavadero` con el script y luego se inicia el backend
- **THEN** la cuenta `admin` existe y `admin` / `123456` inicia sesión correctamente
