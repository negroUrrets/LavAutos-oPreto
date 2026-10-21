# Design

## Context

Ver `proposal.md - Why`. `src/frontend/` está vacío: este cambio introduce React por
primera vez. El backend de autenticación ya está implementado (`add-backend-login`)
con `POST /api/auth/login` (cuerpo `{ usuario, contrasena }`), `POST /api/auth/logout`
y `GET /api/auth/session`, y responde `{ success, data }` o
`{ success: false, error: { message } }`. El diseño visual proviene del prototipo
`Prototipado/usuario/iniciar sesion.jpg`.

## Goals / Non-Goals

**Goals:**

- Crear la base del frontend con Vite + React + Tailwind.
- Reproducir la landing de login del prototipo.
- Conectar el formulario con el backend y mostrar el popup de resultado.

**Non-Goals:**

- Home u otras pantallas posteriores al login.
- Navegación entre páginas (router).
- Cierre de sesión desde la UI.
- Cambios al backend o CORS de producción.

## Decisions

### Stack y estructura

Vite + React (JavaScript) + Tailwind CSS. Estructura por responsabilidad:
`src/pages/` (página de login), `src/components/` (formulario y popup),
`src/services/` (llamadas a la API) y `src/utils/`. Sin TypeScript, según AGENTS.

- Alternativa descartada: Create React App (en desuso).
- Tailwind CSS v4 con el plugin oficial de Vite (`@tailwindcss/vite`); alternativa
  v3.4 con PostCSS descartada por configuración extra.

### Diseño visual y paleta

La página replica el prototipo: fondo índigo a pantalla completa, tarjeta rosa
centrada con esquinas redondeadas, ícono del auto con burbujas, título
`LavAutos oPreto`, etiquetas `Usuario` y `Contraseña` con inputs grises tipo píldora
y botón verde `Iniciar Sesion`. Paleta aproximada desde la imagen (ajustable):

| Uso | Color aprox. |
| --- | --- |
| Fondo | `#7B80E8` (índigo) |
| Tarjeta | `#F6DADA` (rosa) |
| Título | `#5A6FD8` (índigo oscuro) |
| Etiquetas | `#1F2A66` (azul oscuro) |
| Inputs | `#9C9C9C` (gris) |
| Botón | `#5CB85C` (verde) |

El ícono se toma de `src/documentacion/iconos/` (`auto.png` y `burbujas.png`).

### Llamada al backend

El formulario llama a `POST /api/auth/login` con `{ usuario, contrasena }` usando
`fetch` nativo con `credentials: 'include'` (para que la cookie de sesión `HttpOnly`
se guarde). No se agrega una librería HTTP.

- Alternativa descartada: `axios` (dependencia innecesaria para una sola llamada).

### Proxy de desarrollo

`vite.config.js` proxya `/api` hacia `http://localhost:3000` (backend), de modo que
el navegador trata frontend y API como mismo origen y no se necesita CORS.

- Alternativa descartada: agregar CORS al backend (cambio de backend y credenciales
  entre orígenes).
- En producción se requerirá mismo origen o CORS; queda como pregunta abierta.

### Popup de resultado

Un componente de ventana emergente (overlay + tarjeta) reutiliza la paleta de la
página y muestra `Inicio de sesion ok!!!` (login `200`) o
`Error al iniciar sesion!!!` (`401`/error), con un botón para cerrarlo.

### Sin router ni estado global

Es una única página; se usa estado local de React (`useState`) y no se incorpora
React Router ni un gestor de estado.

### Validación de campos y estado de sesión

La validación de campos vacíos se muestra como mensaje en la propia página (no usa el
popup de login), para distinguirla de la respuesta del backend. Este cambio no
consulta `GET /api/auth/session` ni redirige: al ser una única página, la aplicación
siempre muestra el login, satisfaciendo el arranque en el login; el comportamiento
con una sesión válida (redirección) queda para un cambio posterior.

### Pruebas

Vitest + React Testing Library. Se prueban: render de los campos y el botón,
validación de campos vacíos (no llama al backend), popup de éxito con `fetch`
simulado (`200`) y popup de error con `fetch` simulado (`401`).

## Risks / Trade-offs

- [Colores aproximados desde la imagen] -> Ajustables si el usuario aporta valores
  exactos; se centralizan en la paleta de Tailwind.
- [Backend requerido para login real] -> El proxy depende de que el backend esté en
  ejecución; las pruebas simulan `fetch` y no dependen de la red.
- [Sin CORS] -> El proxy resuelve el desarrollo; producción necesitará mismo origen
  o CORS.
- [Sin router] -> Si se agregan más pantallas, habrá que introducir navegación.

## Migration Plan

- Instalar dependencias del frontend (`npm install` en `src/frontend`).
- Ejecutar `npm run dev` (frontend) con el backend en `http://localhost:3000`.
- Verificación: `npm test` (Vitest) y revisión visual contra el prototipo.
- Rollback: revertir los archivos agregados bajo `src/frontend/`.

## Open Questions

- Valores de color exactos del prototipo (hoy aproximados).
- Navegación posterior al login y pantalla home (otro cambio).
- Base de API y CORS para producción.
- Si se incorporará React Router cuando existan más pantallas.
