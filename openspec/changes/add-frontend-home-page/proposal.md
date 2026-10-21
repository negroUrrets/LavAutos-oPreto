# Proposal

## Why

La etapa de login está concluida: el frontend autentica contra el backend, pero
después de un login exitoso no existe ninguna pantalla a la que ir. Este cambio
agrega la pantalla home —idéntica al prototipo— y la navegación desde el login,
además del cierre de sesión desde el home.

## What Changes

- Incorporar React Router con las rutas `/login` y `/home`.
- Implementar la pantalla home con el diseño del prototipo
  (`Prototipado/home/home.jpg`): encabezado con el ícono del auto y `LavAutos oPreto`,
  panel con la tarjeta rosa de 4 botones (`CLIENTES`, `LAVADOS`, `VEHICULOS`,
  `DASHBOARD`), panel azul oscuro con fecha y hora, y el ícono de usuario con la
  etiqueta `ADMIN` arriba a la derecha.
- Convertir el ícono de usuario en un botón que abre una ventana emergente pequeña
  (`Prototipado/usuario/cerrar sesion usuario.jpg`) con la opción `CERRAR SESION` y
  una `X` para cancelar. `CERRAR SESION` cierra la sesión en el backend y redirige a
  la landing de login; la `X` cierra el popup sin acción.
- Mostrar la fecha y la hora reales de la zona horaria UTC-03:00 (Ciudad de Buenos
  Aires), con el formato del prototipo (`Lunes 06/09/2026` y `10 : 20 pm`, con la
  hora en tamaño mayor que los minutos).
- Cambiar a verde `#5ea014` los 4 botones del panel al pasar el mouse.
- En el home, verificar la sesión con `GET /api/auth/session` y redirigir al login si
  no hay una sesión válida.
- En la página de login: alinear el texto del popup de éxito al real del código
  (`!Bienvenid@!`) y, al cerrar ese popup, navegar al home.
- **Fuera de alcance**: la navegación de los 4 botones (Clientes, Lavados, Vehículos,
  Dashboard); otras pantallas; cambios al backend o al esquema; y cualquier ajuste
  fuera de lo descrito.

## Capabilities

### New Capabilities

- `home-page`: pantalla home posterior al login que replica el prototipo, con la
  fecha y hora reales, el panel de accesos con hover verde, el popup de cierre de
  sesión y la verificación de sesión.

### Modified Capabilities

- `login-page`: el texto del popup de éxito pasa a `!Bienvenid@!` y, al cerrarlo, la
  aplicación navega al home.

## Impact

- Archivos nuevos y modificados bajo `src/frontend/` (ruteo, página home,
  componentes de fecha/hora y popup de cierre, servicio de sesión/cierre) y ajustes
  en `App.jsx` y en la página de login.
- Dependencia nueva del frontend: `react-router-dom`.
- Consume `GET /api/auth/session` y `POST /api/auth/logout` del backend existente.
- No modifica el backend ni la base de datos.
- El ícono de usuario se toma de `src/documentacion/iconos/`.
