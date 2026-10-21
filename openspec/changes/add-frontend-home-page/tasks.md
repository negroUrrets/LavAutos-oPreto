# Tasks

## 1. Ruteo y base

- [x] 1.1 Agregar `react-router-dom` a `src/frontend/package.json` y ejecutar `npm install`. Verificar que la instalación completa sin errores.
- [x] 1.2 Configurar el ruteo en `App.jsx` con las rutas `/login` y `/home` y redirección de `/` a `/login`. Verificar con una prueba que cada ruta renderiza la página correspondiente.

## 2. Pantalla home

- [x] 2.1 Implementar `HomePage` con el diseño del prototipo (encabezado con el ícono del auto y `LavAutos oPreto`, panel, tarjeta rosa con los 4 botones, panel azul de fecha/hora y el ícono de usuario `src/documentacion/iconos/usuario.png` con la etiqueta `ADMIN`). Verificar con una prueba de render que se muestran los 4 botones y la etiqueta `ADMIN`.
- [x] 2.2 Aplicar el hover verde `#5ea014` a los 4 botones. Verificar con una prueba que cada botón incluye la clase de hover verde.
- [x] 2.3 Mostrar la fecha y la hora reales en UTC-03:00 (`America/Argentina/Buenos_Aires`) con el formato del prototipo (`Lunes 06/09/2026` y `10 : 20 pm`, hora mayor que minutos). Verificar con una prueba que, con una fecha fija, el formato de día/fecha y de hora es el esperado.

## 3. Cierre de sesión y verificación de sesión

- [x] 3.1 Implementar el botón de usuario y el popup de cierre con la opción `CERRAR SESION` y una `X`. Verificar con una prueba que al hacer clic en el ícono de usuario se abre el popup con ambas opciones.
- [x] 3.2 Implementar `logout()` (POST `/api/auth/logout`) y el comportamiento: `CERRAR SESION` cierra la sesión y navega a `/login`; la `X` cierra el popup sin acción. Verificar con pruebas ambas rutas.
- [x] 3.3 Implementar la verificación de sesión con `GET /api/auth/session` al montar el home, redirigiendo a `/login` cuando no hay sesión válida. Verificar con pruebas: sin sesión redirige; con sesión muestra el home.

## 4. Navegación del login al home

- [x] 4.1 Actualizar la página de login: popup de éxito con el texto `!Bienvenid@!` y navegación a `/home` al cerrarlo. Verificar con pruebas: el popup muestra el texto y al cerrarlo navega al home.

## 5. Verificación final

- [x] 5.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y registrar los resultados.
- [x] 5.2 Ejecutar `openspec validate add-frontend-home-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
