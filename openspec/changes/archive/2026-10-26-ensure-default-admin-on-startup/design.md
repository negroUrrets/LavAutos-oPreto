# Design

## Context

- La base actual tiene `Usuario` con 0 filas; `admin` no existe. El login responde `401`
  porque `authService.login` no encuentra el usuario.
- `scripts/seed.js` crea `admin` / `123456` con `hashPassword`, pero solo se ejecuta con
  `npm run seed`; nada lo llama al arrancar.
- `server.js` hace `sequelize.authenticate()` y `app.listen`; no hay bootstrap de datos.
- La especificación `user-auth` ya exige que el seed cree la cuenta si falta, sin
  sobrescribirla si existe.

## Goals / Non-Goals

**Goals:**

- Que una base recién recreada permita iniciar sesión con `admin` / `123456` sin pasos
  manuales.
- Mantener el alta idempotente y con contraseña hasheada.
- Reutilizar la misma lógica en el seed y en el arranque.

**Non-Goals:**

- Cambiar el esquema, la API o el frontend.
- Mover las credenciales iniciales a variables de entorno.
- Agregar un índice único a `nombreUsuario`.

## Decisions

- **Nuevo `src/backend/services/adminService.js`** con
  `ensureDefaultAdmin({ nombreUsuario = 'admin', contrasena = '123456' } = {})`:
  busca por `nombreUsuario`; si no existe, crea con `hashPassword`; si existe, no la
  modifica. Devuelve `{ created, codigoUsuario }`. La función es parametrizable para que las
  pruebas usen un usuario propio y no toquen la fila real de `admin`.
- **`scripts/seed.js`** pasa a ser una CLI fina que llama a `ensureDefaultAdmin()`, informa
  si creó o ya existía y cierra la conexión.
- **`server.js`** llama a `ensureDefaultAdmin()` después de `sequelize.authenticate()` y
  antes de `app.listen`. Si falla, registra un mensaje claro y termina con código distinto de
  cero, igual que cuando no puede conectar.
- **Pruebas**: se crea un usuario de prueba (`admin-test-<sufijo>`) con la función, se
  verifica que el hash valide la contraseña, que el login por API responda `200` y que una
  segunda ejecución no duplique ni sobrescriba la contraseña. Se elimina al final.
- **Credenciales**: se mantienen `admin` / `123456` como valores por defecto porque la
  especificación los fija. Configurarlas por entorno queda para un cambio de hardening.
- **Operación**: el arreglo surte efecto al reiniciar el backend; para la base actual,
  `npm run seed` crea la cuenta de inmediato.

## Risks / Trade-offs

- [`nombreUsuario` no tiene índice único] → dos procesos que arranquen a la vez podrían
  crear duplicados. Se asume una sola instancia; la restricción queda fuera de alcance.
- [Escritura en la base al arrancar] → es una consulta y, a lo sumo, un `INSERT`; el costo es
  despreciable.
- [Contraseña del admin ya cambiada] → no se sobrescribe, que es el comportamiento buscado.
- [El servidor en ejecución no se reinicia solo] → hay que reiniciarlo o correr el seed para
  que el login funcione en la sesión actual.
