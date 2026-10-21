# AGENTS.md

## 1. Propósito del proyecto

Aplicación web para la gestión de un lavadero de vehículos. Implementar
el sistema respetando el diseño funcional y de datos documentado, sin
reinventar ni ampliar el alcance por iniciativa propia.

## 2. Fuente de verdad y documentación

La documentación de diseño se encuentra en `src/documentacion/` e
incluye prototipos de interfaz, diagramas de flujo de datos, diagramas
de secuencia, modelo de datos y esquema de base de datos.

Antes de implementar una funcionalidad, consultar la documentación
relevante y las especificaciones aprobadas de OpenSpec. La documentación
existente es la referencia para el diseño actual. No modificarla ni
contradecirla silenciosamente. Si un requerimiento nuevo exige cambiar
el modelo de dominio, las relaciones, el esquema de datos o los flujos
funcionales, proponer y aprobar el cambio mediante OpenSpec antes de
implementarlo.

## 3. Alcance de la primera etapa

Incluye: - Inicio y cierre de sesión. - Autenticación mediante una
cuenta de administrador predeterminada. - Gestión de clientes. - Gestión
de vehículos. - Gestión de lavados.

La aplicación debe mostrar el login cuando se abre sin una sesión
válida. No iniciar sesión automáticamente ni tratar la existencia de una
cuenta administradora como una sesión ya autenticada.

Quedan fuera del alcance actual y se consideran posibles requerimientos
futuros: - Gestión de usuarios. - Auditoría funcional de operaciones y
una interfaz para consultar esos registros.

No incorporar estas funcionalidades salvo que un cambio aprobado en
OpenSpec las agregue explícitamente. El registro técnico mínimo de
errores no debe convertirse en un módulo de auditoría funcional.

## 4. Modelo de dominio y reglas de negocio

Respetar el modelo de datos y el esquema documentados. - Cada `Lavado`
tiene asignado un `Vehículo`. - Cada `Vehículo` tiene asignado un
`Cliente`. - El cliente asociado a un lavado se obtiene mediante
`Lavado → Vehículo → Cliente`. - No crear una relación directa
`Lavado → Cliente` salvo que una especificación aprobada modifique
expresamente el modelo. - No inventar entidades, atributos, relaciones
ni restricciones que contradigan la documentación. - Antes de modificar
una entidad o relación, explicar el motivo y reflejar el cambio en una
especificación aprobada.

## 5. Stack tecnológico

-   Frontend: React, JavaScript, CSS y Tailwind CSS.
-   Backend: Node.js, Express, JavaScript y Sequelize.
-   Base de datos: Microsoft SQL Server.

No introducir TypeScript, otro ORM, otro framework principal ni otra
base de datos sin aprobación explícita mediante OpenSpec.

## 6. Organización del proyecto

La organización de alto nivel es:

``` text
src/
├── frontend/
├── backend/
├── database/
└── documentacion/
```

Respetar la estructura existente y sus convenciones. No mover carpetas
ni reorganizar el proyecto de forma amplia sin una razón concreta.

### Frontend

Usar una organización por responsabilidad cuando resulte útil y sea
coherente con la estructura existente: - `pages/`: pantallas
completas. - `components/`: componentes reutilizables. - `layouts/`:
estructuras compartidas de páginas. - `hooks/`: hooks personalizados. -
`services/`: comunicación con la API. - `utils/`: funciones auxiliares
generales.

No crear archivos, capas o abstracciones sin una responsabilidad clara.

### Backend

Separar responsabilidades de forma pragmática: - `routes/`: definición y
asociación de rutas HTTP. - `controllers/`: adaptación entre HTTP y la
lógica de aplicación. - `services/`: reglas de negocio y coordinación de
operaciones. - `models/`: modelos Sequelize y relaciones de
persistencia. - `middlewares/`: autenticación, validaciones
transversales y manejo de errores. - `utils/`: utilidades compartidas
cuando sean necesarias.

Las rutas no deben contener lógica de negocio. Los controllers gestionan
HTTP; los services concentran la lógica de negocio; los models
representan la persistencia mediante Sequelize.

Aplicar bajo acoplamiento y alta cohesión sin sobrearquitectura. No
crear capas o patrones adicionales si no aportan una responsabilidad
concreta.

## 7. Convenciones de código

-   Usar JavaScript en frontend y backend.
-   Componentes React y clases/modelos: `PascalCase`.
-   Variables y funciones: `camelCase`.
-   Archivos de componentes React: extensión `.jsx`.
-   Archivos JavaScript de servicios y módulos: extensión `.js`.
-   Usar nombres descriptivos y consistentes para los conceptos del
    dominio, respetando los nombres establecidos en la documentación y
    el código existente.
-   Mantener el estilo del repositorio cuando no contradiga estas
    instrucciones.
-   Evitar duplicación innecesaria y funciones excesivamente grandes.
-   No introducir dependencias nuevas sin justificar su necesidad.

## 8. API y comunicación frontend-backend

La comunicación se realiza mediante una API REST sobre HTTP/HTTPS, con
intercambio JSON y prefijo `/api`.

El frontend consume la API y no accede directamente a SQL Server. La
lógica de negocio y la persistencia corresponden al backend.

Usar métodos HTTP según su propósito y códigos de estado adecuados: -
`200`: operación correcta con contenido. - `201`: recurso creado. -
`204`: operación correcta sin contenido. - `400`: solicitud inválida. -
`401`: sesión no autenticada o inválida. - `403`: acceso denegado. -
`404`: recurso no encontrado. - `409`: conflicto. - `500`: error interno
inesperado.

Mantener un formato JSON consistente. Para respuestas exitosas, usar la
convención basada en `success` y `data`; para errores, usar
`success: false` y un objeto `error` con un mensaje seguro y, cuando
corresponda, detalles de validación. No exponer trazas, secretos ni
detalles internos al cliente.

Los endpoints concretos deben derivarse del alcance y las
especificaciones aprobadas. No agregar rutas de gestión de usuarios ni
auditoría en la primera etapa.

## 9. Asincronía y manejo de errores

-   Preferir `async/await` para operaciones asíncronas.
-   Evitar `try/catch` redundantes que solo vuelvan a lanzar el mismo
    error.
-   Usar manejo centralizado de errores en Express.
-   Capturar localmente un error cuando sea necesario recuperarse,
    traducirlo a un error de dominio o agregar contexto útil.
-   No ignorar errores ni devolver éxito cuando una operación haya
    fallado.
-   Diferenciar errores esperables (validación, recurso inexistente,
    conflicto) de errores inesperados.
-   Responder con códigos HTTP y JSON consistentes.

## 10. Validación e integridad

-   Las validaciones del frontend mejoran la experiencia de usuario,
    pero no sustituyen la validación del backend.
-   Validar en el backend toda información recibida por la API antes de
    ejecutar reglas de negocio o persistirla.
-   Mantener en SQL Server las restricciones de integridad
    correspondientes: claves primarias, claves foráneas, obligatoriedad,
    tipos y demás restricciones definidas por el esquema.
-   No confiar en datos enviados por el cliente ni en validaciones
    exclusivamente visuales.
-   No modificar reglas de validación o integridad definidas en la
    documentación sin un cambio aprobado.

## 11. Autenticación y seguridad

La primera etapa utiliza una cuenta de administrador predeterminada y
autenticación mediante sesión de servidor con cookie `HttpOnly`. - La
aplicación inicia en el login cuando no hay una sesión válida. - Validar
las credenciales en el backend. - No almacenar contraseñas ni
identificadores de sesión en `localStorage` o `sessionStorage`. - No
incluir contraseñas, claves de sesión ni secretos en el código fuente o
en el repositorio. - Configurar credenciales iniciales y secretos
mediante variables de entorno o un mecanismo seguro equivalente. -
Guardar las contraseñas con un algoritmo de hash apropiado; nunca en
texto plano. - Configurar correctamente los atributos de cookie,
incluidos `HttpOnly`, `SameSite` y `Secure` en entornos HTTPS. -
Considerar protección CSRF adecuada para la estrategia de cookies. -
Proteger los endpoints de la aplicación con middleware de autenticación,
excepto los que deban ser públicos, como el login. - Destruir la sesión
al cerrar sesión. - No inventar una gestión de usuarios para administrar
la cuenta predeterminada. - No afirmar que la autenticación es segura
sin verificar la configuración implementada.

## 12. SQL Server, Sequelize y cambios de esquema

SQL Server debe estar instalado y accesible en el entorno de ejecución.
OpenCode puede preparar scripts SQL, modelos Sequelize y migraciones,
pero no debe asumir que el servidor está disponible ni ejecutar cambios
destructivos sin autorización.

-   Usar la documentación de `src/documentacion/` como fuente para el
    esquema.
-   Mantener scripts y migraciones versionados dentro de la estructura
    acordada.
-   Revisar cualquier migración antes de ejecutarla y explicar su
    efecto.
-   No eliminar tablas, columnas ni datos existentes como parte de una
    tarea ordinaria.
-   No utilizar sincronización automática destructiva ni depender de
    `sequelize.sync({ alter: true })` como mecanismo normal de evolución
    del esquema.
-   No inventar tablas o relaciones para resolver una dificultad sin
    actualizar primero la especificación aprobada.
-   Mantener los secretos de conexión fuera del control de versiones,
    mediante variables de entorno y un archivo de ejemplo sin
    credenciales reales cuando corresponda.

## 13. Calidad de código y herramientas

Usar ESLint para detectar problemas de código y Prettier para mantener
un formato consistente, respetando la configuración existente. Si
todavía no están configurados, incorporarlos de forma sencilla cuando
corresponda a las tareas iniciales.

No asumir que un script existe: revisar los `package.json` antes de
ejecutar comandos. Mantener documentados los comandos disponibles para
desarrollo, build, lint y pruebas. La organización acordada permite
scripts separados para frontend y backend.

## 14. Pruebas y definición de terminado

Cada tarea de implementación debe incluir las pruebas pertinentes al
cambio y ejecutar las verificaciones disponibles.

Elegir las pruebas según el impacto de la tarea, que pueden incluir: -
Unitarias para reglas de negocio y validaciones. - De integración para
endpoints, persistencia y comunicación con SQL Server. - De frontend
para formularios, estados e interacciones relevantes. - De autenticación
y autorización para rutas protegidas.

No todas las tareas requieren todos los tipos de prueba. Priorizar
pruebas útiles y verificables.

Una tarea se considera terminada cuando: 1. Cumple los requisitos
aprobados. 2. Respeta el modelo de dominio, el esquema y la
arquitectura. 3. Incluye o actualiza las pruebas pertinentes. 4. Se
ejecutaron las pruebas y verificaciones disponibles. 5. Se corrigieron
los fallos encontrados o se documentan claramente los pendientes. 6. Se
informa qué comandos se ejecutaron y sus resultados.

Si una prueba no puede ejecutarse por falta de SQL Server, dependencias,
configuración u otro requisito del entorno, indicar la causa y no
afirmar que pasó. No declarar que una tarea fue verificada si solo se
revisó el código.

## 15. Flujo de trabajo con OpenSpec

-   Para una funcionalidad o cambio relevante, seguir el flujo de
    OpenSpec antes de implementar.
-   Revisar las especificaciones aprobadas y las tareas antes de
    modificar el código.
-   Mantener la implementación alineada con los requisitos aprobados.
-   Si durante la implementación se descubre una contradicción,
    ambigüedad o necesidad de cambiar el diseño, proponer una
    actualización de especificación.
-   No ampliar el alcance por iniciativa propia.
-   Mantener las tareas pequeñas, enfocadas y verificables.
-   Al finalizar, resumir los cambios, pruebas ejecutadas, resultados y
    limitaciones.

## 16. Regla general

Priorizar corrección, claridad, seguridad, mantenibilidad y fidelidad al
diseño documentado. Ante una duda que afecte al dominio, al alcance, a
la estructura de datos o a una decisión de arquitectura, consultar las
especificaciones y la documentación y, si sigue sin resolverse, pedir
aclaración antes de implementar.
