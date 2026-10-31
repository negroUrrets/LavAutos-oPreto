# Proposal

## Why

El botón `LAVADOS` del home no hace nada y no existe una pantalla para seguir los lavados en
curso. Este cambio agrega la página «Lavados» (prototipo
`Prototipado/lavado/listar_lavados_activos.jpg`), agrupa los lavados por estado, permite
avanzar su estado y muestra los datos del vehículo y de su cliente.

## What Changes

- En `HomePage`, el botón `LAVADOS` navega a `/lavados`.
- Página «Lavados»:
  - Botón verde `Nuevo Lavado` con ícono de mano que navega a Clientes, con una animación
    horizontal que se repite y se detiene al pasar el mouse.
  - Tres secciones (`En espera` con borde rojo, `Lavando` con borde amarillo oscuro y
    `Terminado` con borde verde), colapsables, cada una con su etiqueta de color y un ícono
    de burbuja con movimiento vertical de 3 pasos.
  - Cada lavado muestra `N° Lavado`, hora de creación y patente (solo lectura), con `+info`
    (ventana con los datos del vehículo y del cliente; `Aceptar` la cierra) y `Editar` sin
    acción.
  - Botón de avance por sección: `Lavar` (En espera → `Lavando`), `Completado`
    (Lavando → `Terminado`) y `Entregar` (Terminado → `Entregado`). Cada uno muestra un popup
    (`Lavando Vehiculo`, `Lavado Terminado`, `Vehiculo Entregado`) y, al aceptar, recarga la
    lista.
  - Botón `←` al final que vuelve al home.
- Backend: el seed agrega el estado `Entregado` si falta.
- **Fuera de alcance**: edición de lavados, `+info` como página con ruta propia, otras
  pantallas y cambios al esquema de la base.

## Capabilities

### New Capabilities

- `lavados-page`: página de seguimiento de lavados por estado, con avance de estado y detalle
  en ventana.

### Modified Capabilities

- `home-page`: el botón `LAVADOS` navega a la página de Lavados.
- `wash-management`: el seed garantiza los estados de lavado necesarios para el flujo.

## Impact

- Frontend: `LavadosPage.jsx` y su ruta `/lavados`, estilos de animación, servicios de
  lavados y pruebas.
- Backend: `services/catalogSeedService.js` (estado `Entregado`) y pruebas.
- No cambia el esquema ni la base de datos.
