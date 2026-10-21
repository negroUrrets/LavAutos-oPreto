# Tasks

## 1. Backend: búsqueda de clientes

- [x] 1.1 Ajustar `clienteService.list` y el controller para aceptar el parámetro opcional `buscar`, filtrando por `nombre`, `apellido` o `dni` (parcial, sin distinguir mayúsculas); sin el parámetro, devolver todos. Verificar con pruebas: búsqueda con coincidencias `200`, sin coincidencias `200` lista vacía y sin parámetro devuelve todos.

## 2. Frontend: base de la página de Clientes

- [x] 2.1 Agregar la ruta `/clientes` en `App.jsx`. Verificar con una prueba que `/clientes` renderiza la página de Clientes.
- [x] 2.2 Extraer el componente compartido `AppHeader` (ícono del auto, `LavAutos oPreto` y botón de usuario con el popup de cierre) y usarlo en `HomePage`. Verificar con pruebas que el home sigue mostrando el encabezado y que el ícono de usuario abre el popup de cierre.
- [x] 2.3 Implementar `ClientesPage` con el diseño del prototipo (encabezado, etiqueta `CLIENTES` no interactiva, panel de búsqueda, panel de resultados y botón `Volver`) y la verificación de sesión. Verificar con pruebas: render de los elementos y redirección al login sin sesión válida.

## 3. Frontend: búsqueda y resultados

- [x] 3.1 Implementar `searchClientes` y la búsqueda en vivo (a partir del cuarto carácter). Verificar con pruebas: con menos de 4 caracteres no se consulta; con 4 o más se consulta y se muestran resultados.
- [x] 3.2 Implementar que sin búsqueda no se muestren registros y el estado `Busqueda sin resultados ...` cuando no hay búsqueda activa o no hay coincidencias (sin mensaje de error). Verificar con pruebas ambos casos.
- [x] 3.3 Implementar la tabla de resultados (columnas `DNI`, `NOMBRE`, `APELLIDO`, `CELULAR`, filas con color alternado `#f4e6e6`/`#b4b2b2`) y el botón `+ info` sin acción. Verificar con pruebas: filas alternadas y `+ info` no ejecuta acción.
- [x] 3.4 Implementar el botón `+ CLIENTE` (verde `#7eb93c`, sin acción). Verificar con una prueba que se muestra y no ejecuta acción.

## 4. Navegación y cierre de sesión

- [x] 4.1 Implementar el botón `Volver` (verde `#7eb93c`, texto `← Volver` con la flecha del tamaño de las letras) que navega a `/home`. Verificar con una prueba que navega al home.
- [x] 4.2 Implementar el cierre de sesión desde el ícono de usuario de la página de Clientes (popup con `CERRAR SESION` y `X`; confirmar cierra la sesión y navega a `/login`; `X` cierra sin acción). Verificar con pruebas ambas rutas.
- [x] 4.3 Hacer que el botón `CLIENTES` del home navegue a `/clientes`. Verificar con una prueba que al hacer clic navega a la página de Clientes.

## 5. Verificación final

- [x] 5.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y `npm test` en `src/backend`; registrar los resultados. Si no hay SQL Server accesible, registrar la limitación y no afirmar que las pruebas de backend pasaron.
- [x] 5.2 Ejecutar `openspec validate add-frontend-clientes-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
