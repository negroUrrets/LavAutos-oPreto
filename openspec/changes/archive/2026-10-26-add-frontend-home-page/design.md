# Design

## Context

Ver `proposal.md - Why`. El frontend ya tiene la página de login (React + Vite +
Tailwind, sin router) que autentica contra `POST /api/auth/login`. El backend expone
`GET /api/auth/session` y `POST /api/auth/logout`. El diseño visual proviene de los
prototipos `Prototipado/home/home.jpg` y
`Prototipado/usuario/cerrar sesion usuario.jpg`. La spec durable `login-page` existe,
por lo que este cambio la modifica.

## Goals / Non-Goals

**Goals:**

- Navegar del login al home con React Router.
- Reproducir la pantalla home del prototipo.
- Implementar el popup de cierre de sesión y la verificación de sesión.

**Non-Goals:**

- Navegación de los 4 botones (Clientes, Lavados, Vehículos, Dashboard).
- Otras pantallas.
- Cambios al backend o al esquema.

## Decisions

### Ruteo

Se usa `react-router-dom` (nueva dependencia) con las rutas `/login` y `/home`; `/`
redirige a `/login`. `App.jsx` monta el router.

- Alternativa descartada: alternar vistas por estado, sin URLs.

### Flujo de login

La página de login mantiene el popup de éxito, ahora con el texto `!Bienvenid@!`
(alineado al código actual), y al cerrarlo navega a `/home`. El popup de error se
mantiene igual.

- Esto modifica la spec `login-page` (texto del popup) y agrega la navegación.

### Diseño del home y paleta

El home replica el prototipo: fondo índigo (`#7B80E8`), encabezado con el ícono del
auto y `LavAutos oPreto`, panel con borde, tarjeta rosa (`#F6DADA`) con los 4 botones
grises, panel azul oscuro (aprox. `#1F3A93`) con fecha y hora, y el ícono de usuario
(`src/documentacion/iconos/usuario.png`) con la etiqueta `ADMIN` arriba a la derecha.

- Los 4 botones cambian a verde `#5ea014` al pasar el mouse (clase `hover`).

### Fecha y hora

Se calculan con `Intl.DateTimeFormat` usando `timeZone: 'America/Argentina/Buenos_Aires'`
(UTC-03:00): día de la semana y fecha (`Lunes 06/09/2026`) y hora de 12 horas con
`am`/`pm` (`10 : 20 pm`). La hora se muestra con un tamaño mayor que los minutos
(dos `span`). Un `setInterval` actualiza el reloj cada minuto.

El día de la semana se muestra con inicial mayúscula (`Lunes`) y el período se
normaliza a `am`/`pm` en minúsculas y sin puntos, porque `Intl` en `es-AR` devuelve
`p. m.`; la hora y los minutos se renderizan por separado con el separador ` : `
(hora en tamaño mayor).

- Alternativa descartada: usar la hora local del navegador, que no garantiza UTC-03:00.

### Popup de cierre de sesión

El ícono de usuario es un botón que abre una ventana emergente pequeña con el estilo
del prototipo: tarjeta gris con borde azul, una `X` arriba a la derecha, el avatar y
un botón rojo `CERRAR SESION`.

- `CERRAR SESION`: llama a `POST /api/auth/logout` y navega a `/login`.
- `X`: cierra el popup sin acción.
- Alternativa descartada: reutilizar el popup genérico de la página de login, que no
  reproduce el diseño pequeño del prototipo.

### Verificación de sesión

Al montar el home se consulta `GET /api/auth/session`; si no hay sesión válida, se
redirige a `/login`. Mientras se verifica, no se muestra el home.

### Servicio de sesión y cierre

Se agregan funciones al servicio de autenticación: `fetchSession()` (GET) y
`logout()` (POST), con `credentials: 'include'`.

## Risks / Trade-offs

- [Colores aproximados desde la imagen] -> Ajustables; centralizados en la paleta de
  Tailwind (se agrega el azul del panel y el verde de hover `#5ea014`).
- [Verificación de sesión asíncrona] -> Puede parpadear antes de resolver; se evita
  mostrando el home solo tras confirmar la sesión.
- [Reloj con `setInterval`] -> Debe limpiarse al desmontar para no dejar timers.
- [Texto `!Bienvenid@!`] -> Se alinea la spec al código actual, por decisión del usuario.

## Migration Plan

- Instalar `react-router-dom` (`npm install` en `src/frontend`).
- Ejecutar `npm run dev` con el backend en `http://localhost:3000`.
- Verificación: `npm test` (Vitest) y revisión visual contra los prototipos.
- Rollback: revertir los archivos agregados/modificados bajo `src/frontend/`.

## Open Questions

- Valores de color exactos del prototipo (hoy aproximados).
- Navegación de los 4 botones a sus pantallas (otro cambio).
- Frecuencia de actualización del reloj (hoy cada minuto).
