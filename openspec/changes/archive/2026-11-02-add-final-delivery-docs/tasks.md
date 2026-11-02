# Tasks

## 1. Recolección y trazabilidad

- [x] 1.1 Ejecutar `npm test` en `src/frontend` y `src/backend` y registrar los resultados reales (archivos, suites y pruebas) para el informe; verificar que los números transcriptos coincidan con la salida de las suites.
- [x] 1.2 Construir la tabla de RF con criterio de aceptación, historia de usuario, ruta/función que lo implementa y CP, usando rutas reales del proyecto; verificar que cada RF tenga al menos un CP y que cada ruta exista en el repositorio.

## 2. Informe

- [x] 2.1 Redactar `src/documentacion/Documentacion final Lavadero/informe_fuente.html` con las ocho secciones, RF/RNF, historias, backlog, reglas, riesgos, maquetas, arquitectura, modelo de datos, versiones, árbol, funcionalidades, instalación, cuenta de demostración, CP, matriz de trazabilidad y cierre; verificar que las ocho secciones estén en orden y que la identificación use `[EquipoXX]`, `[Integrante N]` y `[Comisión]`.
- [x] 2.2 Convertir el HTML a `EquipoXX_Informe.docx` con Word en A4, cuerpo de 11 pt y numeración de páginas; verificar que el DOCX abre en Word, es editable y que las páginas están numeradas.
- [x] 2.3 Referenciar las maquetas de `src/documentacion/Prototipado/`, aclarar sus diferencias con la versión final y dejar la lista de capturas a insertar; verificar que cada figura indique acción, resultado y RF.

## 3. Código TXT

- [x] 3.1 Generar `EquipoXX_Codigo.txt` con la lista explícita de archivos propios (README, dependencias, configuración de ejemplo, código de frontend y backend, script SQL y pruebas) y los separadores `===== INICIO/FIN ARCHIVO =====`; verificar que cada ruta incluida exista y que los separadores estén balanceados.
- [x] 3.2 Verificar exclusiones y ausencia de secretos: sin `node_modules`, `dist`, `coverage`, `.git`, `.env`, imágenes, PDFs ni DOCX; buscar `DB_PASSWORD`, `SESSION_SECRET` y la contraseña real, y confirmar que `.env.example` solo tenga valores ficticios.

## 4. Verificación final

- [x] 4.1 Revisar la lista de control de la guía: ocho secciones en orden, integrantes identificados, cada RF con criterio/estado/ruta/prueba, pruebas con esperado y obtenido, diagramas y capturas explicados, DOCX editable exportado a PDF para la entrega, TXT con rutas reales, instrucciones con versiones y configuración, limitaciones/fuentes/aportes declarados y ausencia de secretos.
- [x] 4.2 Ejecutar `openspec validate add-final-delivery-docs --strict` y verificar que pasa con `skip_specs: true`.

## Workflow follow-up

- Reemplazar `[EquipoXX]`, `[Integrante N]` y `[Comisión]` cuando el usuario aporte los datos y renombrar los archivos de entrega.
- Insertar las capturas de los recorridos principales cuando el usuario las aporte y completar sus referencias.
- Exportar `EquipoXX_Informe.docx` a PDF antes de subirlo al aula virtual.
- Archivar este cambio con `/opsx-archive` tras la revisión.
