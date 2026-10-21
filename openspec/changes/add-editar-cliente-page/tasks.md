# Tasks

## 1. Frontend: base

- [x] 1.1 Agregar la ruta `/clientes/:id/editar` en `App.jsx`. Verificar con una prueba que la ruta renderiza la página «Editar Cliente».
- [x] 1.2 Agregar `updateCliente` a `clientService` (PUT `/api/clientes/:id`). Verificar con una prueba (con `fetch` simulado) que llama al endpoint correcto con `credentials: 'include'`.

## 2. Página Editar Cliente

- [x] 2.1 Implementar `EditarClientePage` con el diseño del prototipo (título `Editar Cliente`, panel con avatar e inputs `DNI`, `Nombre`, `Apellido`, `Celular` y `e-m@il`, botones `Registrar` y `Cancelar`), precargando los datos del cliente (`GET /api/clientes/:id`) y con verificación de sesión. Verificar con pruebas: los campos se muestran precargados y editables, y sin sesión válida redirige al login.
- [x] 2.2 Mantener los tipos de datos (máscaras de `DNI`/`Celular` numéricos y `Nombre`/`Apellido` alfabéticos) y validar el formato de `e-mail` antes de guardar. Verificar con pruebas: un carácter del tipo incorrecto no se ingresa y un `e-mail` inválido advierte sin guardar.
- [x] 2.3 Implementar `Registrar` (guardar con `PUT /api/clientes/:id`, mostrar el popup de edición satisfactoria y volver a la información del cliente) y `Cancelar` (volver sin guardar). Verificar con pruebas: `Registrar` guarda y muestra el popup, al aceptarlo vuelve a la información; `Cancelar` no guarda y vuelve a la información.
- [x] 2.4 Implementar la verificación de dni duplicado al editar (con `GET /api/clientes?buscar=<dni>` y comparación con otro cliente): si coincide, mostrar el popup de cliente ya registrado y, al aceptarlo, restablecer el formulario con los datos originales; no guardar. Verificar con pruebas.

## 3. Enlace desde la información del cliente

- [x] 3.1 Hacer que el botón `Editar` de la card del cliente en `ClienteInfoPage` navegue a `/clientes/:id/editar`. Verificar con una prueba que al hacer clic navega a la página «Editar Cliente».
- [x] 3.2 Verificar que al volver a la información tras editar y guardar, se muestran los datos actualizados del cliente y sus vehículos (la página obtiene el cliente al montarse). Verificar con una prueba que tras editar y volver, la card del cliente muestra los datos nuevos.

## 4. Verificación final

- [x] 4.1 Ejecutar `npm run lint` y `npm test` en `src/frontend` y registrar los resultados.
- [x] 4.2 Ejecutar `openspec validate add-editar-cliente-page --strict` y verificar que pasa.

## Workflow follow-up

- Archivar el cambio tras cumplir los requisitos de revisión del proyecto.
