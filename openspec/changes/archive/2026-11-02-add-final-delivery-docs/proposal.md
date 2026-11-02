# Proposal

## Why

La cátedra exige para el cierre de la primera etapa dos archivos: un informe con ocho
secciones y el código fuente completo en un TXT con rutas. El proyecto ya está implementado y
probado, pero no cuenta con esa documentación de entrega. El informe se entrega en Word
editable y se exporta a PDF para subirlo al aula virtual.

## What Changes

- Crear en `src/documentacion/Documentacion final Lavadero/` los dos archivos de entrega,
  derivados del sistema implementado y de la guía de la cátedra:
  - `EquipoXX_Informe.docx`: informe editable en Word, A4, 11 pt y páginas numeradas, con las
    ocho secciones en orden (identificación, problema y alcance, requerimientos, análisis,
    diseño, implementación, pruebas y trazabilidad, cierre). Se exporta a PDF antes de la
    entrega.
  - `EquipoXX_Codigo.txt`: código fuente propio en UTF-8, separado por
    `===== INICIO ARCHIVO: <ruta> =====` / `===== FIN ARCHIVO: <ruta> =====`, con README,
    dependencias con versiones, configuración de ejemplo, script SQL y pruebas.
- El informe incluye RF y RNF identificados, historias de usuario con criterios de
  aceptación, backlog y tareas con estado, reglas de negocio, riesgos, maquetas, arquitectura,
  modelo de datos, tecnologías y versiones, árbol de carpetas, tabla de funcionalidades,
  instrucciones de instalación y ejecución, cuenta de demostración ficticia, casos de prueba
  con resultados reales y matriz de trazabilidad.
- Identificación con marcadores `[EquipoXX]`, `[Integrante N]` y `[Comisión]` para completar
  antes de la entrega; sin enlaces de GitHub.
- Las capturas de los recorridos principales las aporta el usuario; el informe deja las
  figuras referenciadas y una lista de capturas a insertar.
- **Fuera de alcance**: cambios al código de la aplicación, funcionalidades nuevas, despliegue,
  presentación/defensa oral y la corrección del warning preexistente de `database-schema`.

## Capabilities

### New Capabilities

- (ninguna: el cambio es documentación y empaquetado, sin cambios de comportamiento)

### Modified Capabilities

- (ninguna)

El cambio declara `skip_specs: true` en su `.openspec.yaml`.

## Impact

- Documentación: `src/documentacion/Documentacion final Lavadero/` (informe Word y código TXT).
- Sin cambios en `src/backend`, `src/frontend`, la base de datos ni las pruebas.
