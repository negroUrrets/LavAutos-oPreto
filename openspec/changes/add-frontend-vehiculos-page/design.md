# Design

## Context

- `HomePage` ya tiene `ACCESS_BUTTONS` con `CLIENTES`, `LAVADOS`, `VEHICULOS` y
  `DASHBOARD`; sólo `CLIENTES` navega.
- `ClientesPage` ya implementa el patrón de la página de búsqueda: `AppHeader`, pill,
  contenedor de búsqueda gris, panel azul con tabla, filas alternadas, `+ info` y el
  botón `←` de volver. Se reutiliza ese patrón.
- `listVehiculos()` (`GET /api/vehiculos`) devuelve los vehículos activos con
  `modelo → marca → categoria`.
- `AppHeader` ya ofrece el avatar con cierre de sesión.

## Goals / Non-Goals

**Goals:**

- Consultar y buscar vehículos por modelo o patente desde una página dedicada, enlazada
  desde la página de inicio.
- Reutilizar el layout y el encabezado existentes.

**Non-Goals:**

- Cambios al backend, al esquema o al modelo de dominio.
- Funcionalidad de `+ info`, barra lateral con los cuatro accesos y el alta/edición/baja
  de vehículos.

## Decisions

- **Página nueva** `src/frontend/src/pages/VehiculosPage.jsx` en `/vehiculos`; se replica
  el layout de `ClientesPage` (`AppHeader`, pill `VEHICULOS`, búsqueda y panel azul) para
  mantener coherencia visual y de código.
- **Datos**: `listVehiculos()` una vez al montar; el filtro se hace en memoria por
  `patenteVehi` o `modelo.modeloVehi`, con comparación en mayúsculas por `includes`. Se
  prefiere el filtrado en el frontend (sin cambios de backend) porque el listado trae los
  vehículos activos y el usuario escribe en vivo.
- **Búsqueda**: sin longitud mínima ni debounce (el filtrado es local); con el término
  vacío no se muestran filas; sin coincidencias se muestra `Busqueda sin resultados ...`
  sin avisos de error.
- **Tabla**: columnas `TIPO` (categoría), `MARCA`, `MODELO` y `PATENTE`; filas alternadas
  `#f4e6e6`/`#b4b2b2`; botón verde `+ info` sin `onClick`.
- **Colores**: contenedor de búsqueda `#8f8a8a`, input `#f4e6e6`, panel `#2637a2`, pill
  `#2637a2`, `+ info` verde.
- **Volver**: botón verde `← Volver` con la flecha más grande; navega a `/home`.
- **Sin sidebar**: se sigue el prototipo nuevo; el pill `VEHICULOS` reemplaza el panel
  izquierdo de cuatro botones.
- **`HomePage`**: `VEHICULOS` navega a `/vehiculos`.

## Risks / Trade-offs

- [`GET /api/vehiculos` sólo devuelve vehículos activos] → la búsqueda cubre los vehículos
  vigentes; los dados de baja no aparecen.
- [Sin paginación] → se traen todos los vehículos; aceptable para la primera etapa.
- [`+ info` sin acción] → queda preparado para un cambio posterior que lo enlace.
