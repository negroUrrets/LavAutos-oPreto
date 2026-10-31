# Design

## Context

- `HomePage` ya tiene el botón `LAVADOS` sin acción.
- `GET /api/lavados` devuelve cada lavado con `vehiculo` (y `datosCliente.persona`),
  `categoria`, `datosEstado` y `datosUtileria`.
- `PUT /api/lavados/:id` actualiza `estado`.
- El seed ya garantiza `En Espera`, `Lavando` y `Terminado`; falta `Entregado`.
- `Popup` (un botón `Aceptar`) y `ConfirmPopup` ya existen; hay estilos globales en
  `src/frontend/src/index.css`.

## Goals / Non-Goals

**Goals:**

- Seguir los lavados por estado y avanzarlos con confirmación.
- Mostrar el detalle del vehículo y del cliente en una ventana.

**Non-Goals:**

- Edición de lavados, `+info` como página con ruta propia, cambios de esquema.

## Decisions

- **Ruta** `/lavados` con `LavadosPage.jsx`; `HomePage` enlaza `LAVADOS`.
- **Datos**: `listLavados()` (`GET /api/lavados`) y `listEstadosLavado()`; el estado se
  resuelve por `descripcionEstado` (sin distinguir mayúsculas). Para avanzar se usa
  `updateLavado(id, { estado })` con el `codigoEstado` del catálogo.
- **Secciones**: `En espera` agrupa `En Espera`; `Lavando` agrupa `Lavando`; `Terminado`
  agrupa `Terminado` (así el lavado aparece en «Terminado» al completarse). `Entregado` no
  se muestra.
- **Animaciones**: dos `@keyframes` en `index.css`; el botón `Nuevo Lavado` usa una
  animación horizontal repetida que se pausa con `hover:[animation-play-state:paused]`; el
  ícono de burbuja usa una animación vertical de tres pasos con `iteration-count: 3` y
  `animation-iteration-count` reiniciada por ciclo.
- **Ventana `+info`**: componente modal propio que recibe el lavado y muestra patente,
  categoría, modelo, marca, cliente (`DNI`, `NOMBRE`, `APELLIDO`, `TELEFONO`, `e-m@il`) con
  un botón `Aceptar` que la cierra. Se evita reutilizar `ClienteInfoPage`, que es una página
  con ruta.
- **Avance**: cada botón abre `Popup` con el mensaje pedido; al cerrar, se ejecuta
  `updateLavado` y se recarga la lista. `Completado` pasa el lavado a `Terminado`; `Entregar`
  pasa de `Terminado` a `Entregado`.
- **Seed**: agregar `Entregado` a `ESTADOS` en `catalogSeedService.js`.

## Risks / Trade-offs

- [`+info` no navega a `ClienteInfoPage`] → se implementa como ventana en la página de
  Lavados, tal como describe el pedido; queda registrado.
- [Catálogos vacíos] → sin el seed no hay estados; la tarea del seed lo cubre.
- [Sin paginación] → se traen todos los lavados; aceptable para la primera etapa.
