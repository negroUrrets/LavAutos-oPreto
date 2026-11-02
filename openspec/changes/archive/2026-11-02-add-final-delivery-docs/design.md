# Design

## Context

- Ver `proposal.md - Why`.
- Guía de entrega: dos archivos (`EquipoXX_Informe` y `EquipoXX_Codigo.txt`), informe con ocho
  secciones en orden, A4, cuerpo de 11-12 pt y páginas numeradas; código en UTF-8 separado por
  rutas, sin secretos, binarios ni dependencias instaladas. La guía pide PDF; el entregable se
  produce en Word editable y se exporta a PDF como paso manual antes de subirlo.
- Sistema implementado: React 19 + Vite 6 + Tailwind 4 + React Router 6 (frontend); Express 4 +
  Sequelize 6 + tedious 16 + SQL Server (backend); sesión con cookie `HttpOnly`.
- Pruebas reales: Vitest 2 (21 archivos, 194 pruebas) y Jest 29 (10 suites, 77 pruebas).
- Ya existen `README.md`, `src/backend/.env.example`, el script
  `src/databaseLavadero/script db/DataBaseLavadero.sql`, prototipos en
  `src/documentacion/Prototipado/`, diagramas, esquema y modelo de datos.
- Microsoft Word está disponible en el equipo y permite convertir HTML a DOCX editable y
  agregar numeración de páginas.
- Identificación pendiente (`[EquipoXX]`, `[Integrante N]`, `[Comisión]`); el usuario aportará
  las capturas y no se incluye GitHub.

## Goals / Non-Goals

**Goals:**

- Producir un informe verificable, trazable al código y a las pruebas reales.
- Producir un TXT con el código propio completo y rutas reales.

**Non-Goals:**

- Modificar la aplicación, agregar funcionalidades, desplegar o preparar la defensa oral.

## Decisions

- **Fuente del informe**: redactar `informe_fuente.html` (UTF-8) en el directorio de entrega,
  con CSS para A4, cuerpo de 11 pt, tablas y saltos de página. El DOCX se genera desde ese HTML
  con Word (`SaveAs2(..., 16)`), fijando `PageSetup.PaperSize = 7` (A4) y agregando numeración
  en el pie con `Sections.Item(1).Footers.Item(1).PageNumbers.Add()`. El DOCX es el entregable
  editable y el HTML queda como fuente de regeneración; la exportación a PDF para el aula
  virtual la realiza el usuario.
- **Contenido de las secciones**: derivar RF de las capacidades implementadas (sesión,
  clientes, vehículos, lavados, dashboard) y numerarlos `RF-01...`; RNF de seguridad de sesión,
  integridad referencial, reproducibilidad, usabilidad y manejo de errores. Cada RF lleva
  criterio de aceptación, historia asociada, ruta/función que lo implementa y CP.
- **Casos de prueba**: usar las suites reales como evidencia (Vitest/Jest) y documentar
  CP-01... con precondiciones, pasos, esperado, obtenido y estado `Aprobada`. Los recorridos de
  interfaz sin captura quedan referenciados a las figuras que aportará el usuario.
- **Maquetas**: referenciar las imágenes de `src/documentacion/Prototipado/` y aclarar las
  diferencias con la versión final (utilería única por lavado, `+info` como ventana, filtros del
  Dashboard, etiqueta `DASHBOARD` no interactiva).
- **Modelo de datos**: describir tablas, claves y relaciones a partir de
  `openspec/specs/database-schema` y del script SQL, preservando
  `Lavado -> Vehiculo -> Cliente`.
- **Identificación**: usar marcadores `[EquipoXX]`, `[Integrante N]` y `[Comisión]` en la
  portada y en los nombres de archivo; una tarea final los reemplaza cuando el usuario los
  aporte.
- **Código TXT**: generar `EquipoXX_Codigo.txt` con un script que recorre una lista explícita:
  `README.md`, `src/frontend/package.json`, `src/backend/package.json`,
  `src/backend/.env.example`, configuración (`vite.config.js`, `eslint.config.js`,
  `jest.config.js`, `.prettierrc`), `src/frontend/index.html`, todo `src/frontend/src/**`
  (js/jsx/css) y `src/backend/**` (js), el script SQL y las pruebas. Excluir `node_modules`,
  `dist`, `coverage`, `.git`, `.env`, imágenes, PDFs, DOCX, `package-lock.json`, `openspec/`,
  `.opencode/` y `.cursor/`; declarar esas exclusiones en el informe.
- **Tamaño**: si el TXT supera 1 MB o 5000 líneas, dividirlo en `EquipoXX_Codigo_01.txt`,
  `_02`, etc., sin cortar archivos, y listar las partes en el informe.
- **Secretos**: el TXT solo incluye `.env.example` con valores ficticios; se verifica que no
  aparezcan `DB_PASSWORD`, `SESSION_SECRET` ni la contraseña real.
- **Verificación**: ejecutar las suites antes de transcribir resultados; comprobar que el DOCX
  abre en Word, es editable, está en A4 y tiene las ocho secciones y páginas numeradas; validar
  separadores y rutas del TXT; revisar la lista de control de la guía.

## Risks / Trade-offs

- [Capturas pendientes] → el informe deja figuras y una lista; se declara la limitación de
  evidencia visual y se respalda con pruebas y código.
- [Identificación con marcadores] → la entrega no es válida hasta reemplazarlos; queda como
  tarea final y en la lista de control.
- [Conversión HTML→DOCX con Word] → puede cambiar el paginado; se revisa el DOCX generado y se
  ajustan márgenes o saltos.
- [Entrega en PDF] → la cátedra pide PDF; el usuario exporta el DOCX a PDF antes de subirlo y
  la lista de control lo verifica.
- [Lockfiles excluidos] → se incluyen `package.json` con versiones y se declara la exclusión
  para no inflar el TXT.
- [Deriva entre informe y código] → las rutas se toman de archivos existentes y los resultados
  de pruebas se ejecutan antes de escribirlos.
- [Fuga de secretos en el TXT] → verificación por búsqueda de claves y revisión manual del
  `.env.example`.

## Migration Plan

- Sin cambios de esquema, datos ni código; solo se agregan archivos de documentación.
