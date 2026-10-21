# Proposal

## Why

La primera etapa exige que la aplicación comience en el login cuando no hay sesión
válida. El backend de autenticación ya existe (`add-backend-login`), pero el
frontend está vacío: no hay ninguna pantalla desde la cual el usuario ingrese sus
credenciales. Este cambio crea la landing page de inicio de sesión —idéntica al
prototipo— y la conecta con el backend para autenticar.

## What Changes

- Crear la base del frontend en `src/frontend/` con Vite, React (JavaScript) y
  Tailwind CSS.
- Implementar la página de inicio de sesión con el diseño del prototipo
  (`Prototipado/usuario/iniciar sesion.jpg`): fondo índigo, tarjeta rosa con
  esquinas redondeadas, ícono de auto con burbujas, título `LavAutos oPreto`, campos
  `Usuario` y `Contraseña` y botón verde `Iniciar Sesion`.
- Conectar el formulario con `POST /api/auth/login` del backend.
- Mostrar una ventana emergente (popup) con el mismo estilo y colores:
  `Inicio de sesion ok!!!` cuando el login es correcto y `Error al iniciar
  sesion!!!` cuando falla.
- Configurar el proxy de desarrollo de Vite para enviar `/api` al backend, sin
  modificar el backend ni agregar CORS.
- Agregar pruebas de frontend con Vitest y React Testing Library.
- **Fuera de alcance**: pantalla posterior al login (home), navegación entre
  páginas, cierre de sesión desde la UI, otras pantallas (clientes, vehículos,
  lavados), cambios al backend y configuración de despliegue/CORS de producción.

## Capabilities

### New Capabilities

- `login-page`: página de inicio de sesión del frontend que replica el prototipo,
  envía las credenciales al backend y comunica el resultado mediante un popup.

### Modified Capabilities

- Ninguna. No hay especificaciones durables registradas todavía.

## Impact

- Archivos nuevos bajo `src/frontend/` (configuración de Vite/Tailwind, `src/`
  con la página de login, componentes y estilos, y pruebas).
- Dependencias nuevas del frontend: React, Vite, Tailwind CSS, Vitest y React
  Testing Library.
- El frontend consume `POST /api/auth/login`; requiere el backend en ejecución con
  la cuenta administrador creada por el seed para un login real.
- No modifica el backend ni la base de datos.
- El ícono del auto con burbujas se toma de `src/documentacion/iconos/`.
