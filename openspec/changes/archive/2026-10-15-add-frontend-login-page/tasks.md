# Tasks

## 1. Base del frontend

- [x] 1.1 Crear `src/frontend/package.json` con React, Vite, Tailwind CSS, Vitest, React Testing Library y ESLint, y ejecutar `npm install`. Verificar que la instalación completa sin errores.
- [x] 1.2 Configurar Vite, Tailwind y el proxy de desarrollo `/api` hacia `http://localhost:3000`. Verificar que `npm run dev` levanta el frontend.
- [x] 1.3 Crear la estructura `src/frontend/src/` con `pages/`, `components/`, `services/` y `utils/`, más el entrypoint de React. Verificar que todas existen.
- [x] 1.4 Configurar ESLint, Prettier y Vitest con React Testing Library. Verificar que `npm run lint` y `npm test` se ejecutan.

## 2. Página de inicio de sesión

- [x] 2.1 Implementar la página de login con el diseño del prototipo (fondo índigo, tarjeta rosa, ícono del auto, título `LavAutos oPreto`, campos `Usuario` y `Contraseña`, botón verde `Iniciar Sesion`) usando el ícono de `src/documentacion/iconos/`. Verificar con una prueba de render que se muestran título, campos y botón.
- [x] 2.2 Implementar la validación de campos obligatorios (no envía si están vacíos) mostrando un mensaje inline en la página. Verificar con una prueba que no se llama al backend y se muestra el mensaje.

## 3. Conexión con el backend y popup

- [x] 3.1 Implementar el servicio de autenticación que llama a `POST /api/auth/login` con `credentials: 'include'`. Verificar con una prueba (con `fetch` simulado) que se envían las credenciales.
- [x] 3.2 Implementar el popup con el estilo de la página y el manejo del submit. Verificar con pruebas: login `200` muestra `Inicio de sesion ok!!!` y login `401` muestra `Error al iniciar sesion!!!`.

## 4. Verificación final

- [x] 4.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y registrar los resultados.
- [x] 4.2 Ejecutar `openspec validate add-frontend-login-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
