# Tasks

## 1. Configuración y dependencias

- [x] 1.1 Agregar `express-session` a `src/backend/package.json` y ejecutar `npm install`. Verificar que la instalación completa sin errores.
- [x] 1.2 Incorporar `SESSION_SECRET` (y `SESSION_COOKIE_SECURE`) a la configuración por entorno y a `.env.example`. Verificar que la ausencia de `SESSION_SECRET` produce un error claro al iniciar.

## 2. Hash de contraseñas y seed del administrador

- [x] 2.1 Implementar la utilidad de hash con `crypto.scrypt` (generar y verificar) en `src/backend/utils/`. Verificar con pruebas unitarias que el hash verifica la contraseña correcta y rechaza la incorrecta.
- [x] 2.2 Crear `src/backend/scripts/seed.js` y el script `npm run seed` que registra la cuenta `admin` con la contraseña `123456` hasheada si no existe. Verificar ejecutando el seed dos veces: crea el usuario la primera vez y no duplica la segunda.

## 3. Inicio y cierre de sesión

- [x] 3.1 Implementar servicio, controlador y rutas de autenticación: `POST /api/auth/login` (valida contra `Usuario`, crea la fila `Login` con `usuario = codigoUsuario` y guarda el `codigoLogin` en la sesión), `POST /api/auth/logout` y `GET /api/auth/session`. Verificar con pruebas: login válido `200` con cookie `HttpOnly`, `401` genérico por usuario inexistente y por contraseña incorrecta, logout `204`, y session `200`/`401`.
- [x] 3.2 Verificar con pruebas que la respuesta de login y de session no incluyen la contraseña y que no se crea sesión ante credenciales inválidas.

## 4. Protección de endpoints

- [x] 4.1 Implementar el middleware `requireAuth` y aplicarlo a los recursos CRUD; dejar `auth` y `health` públicos. Verificar con pruebas: un endpoint CRUD sin sesión responde `401`, y con sesión responde normalmente.
- [x] 4.2 Actualizar las pruebas de CRUD existentes para iniciar sesión antes de operar. Verificar que toda la batería de pruebas pasa.

## 5. Verificación final

- [x] 5.1 Ejecutar `npm run lint` y `npm test` en `src/backend` y registrar los resultados. Si no hay SQL Server accesible, registrar la limitación y no afirmar que las pruebas pasaron.
- [x] 5.2 Revisar que no se usa `sequelize.sync({ alter: true })` ni operaciones destructivas. Verificar por búsqueda en el código.
- [x] 5.3 Ejecutar `openspec validate add-backend-login --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
