# Guía de Informática - UNQ 2026

Guía Visual imprimible + fragmentos Moodle para todas las clases del cuatrimestre.

Materiales de **Informática (UNQ, 2026)** publicados para usar en Qoodle (Moodle UVQ). Este repo es el que se sube a GitHub y se sirve con **GitHub Pages** — así las Guías Visuales quedan hosteadas en una URL estable y actualizable con un simple `git push`, en vez de tener que volver a subir un archivo a mano cada vez que se corrige algo.

🔗 Sitio publicado: **https://marcosxhernandez.github.io/unq-moodle/**

## Estado de avance (2026-09-10)

| Clase | Título | Guía Visual | Fragmento Moodle | Estado |
|-------|--------|-------------|-----------------|--------|
| 00 | Bienvenida | — | ✅ | Completo |
| 01 | Herramientas Digitales | ✅ | ✅ | Completo (confirmado) |
| 02 | Arquitectura del documento profesional | ✅ | ✅ | Completo (confirmado) |
| 03 | IA como asistente académico | ✅ | ✅ | Completo (confirmado) |
| 04 | Arquitectura avanzada del documento | ✅ | ✅ | Completo (confirmado) |
| 05 | Maquetación de alta precisión | ✅ | ✅ | Completo (confirmado) |
| 06 | Presentaciones con IA | ✅ | ✅ | 🔄 En progreso (contenido armado, todavía sin confirmar) |
| 07 | 1° Parcial | — | ✅ | Fragmento Moodle completo (sin Guía Visual — `clases/Clase 07 - Examen...` es carpeta de material/consignas, no se publica) |
| 08 | Lógica de celdas y funciones esenciales | ✅ | ✅ | Completo |
| 09 | Funciones lógicas y validación de datos | ✅ | ✅ | Completo |
| 10 | Búsqueda entre hojas y visualización | ✅ | ✅ | Completo |
| 11 | Análisis de datos con Tablas Dinámicas e IA | ✅ | ✅ | Completo |
| 12 | 2° Parcial | — | ✅ | Fragmento Moodle completo (sin Guía Visual — `clases/Clase 12 - Examen...` es carpeta vacía; corregido acá, la versión anterior de esta tabla decía ✅ por error) |
| 13 | Cómo piensan las bases de datos | ✅ | ✅ | Completo |
| 14 | Del formulario a la base de datos | ✅ | ✅ | Completo |
| 15 | Del dato a la decisión | ✅ | ✅ | Completo |
| 16 | 3° Parcial | — | ✅ | Fragmento Moodle completo (sin Guía Visual — carpeta de examen en `clases/` está vacía) |
| 17 | Recuperatorio | — | ✅ | Fragmento Moodle completo (sin Guía Visual — carpeta de examen en `clases/` está vacía) |

**Feriado y Paro docente son bloques "comodín" reutilizables (`moodle/Comodín - Feriado.html`, `Comodín - Paro docente.html`), sin número de clase fijo — no ocupan un slot propio en esta tabla.**

**Total: 18 clases numeradas (00-17) — 13 con Guía Visual + fragmento Moodle (01-06, 08-11, 13-15), Bienvenida (00) y los cuatro exámenes (07, 12, 16, 17) solo con fragmento Moodle. Confirmadas de punta a punta: 01-05. Entregas ("Subir link") pendientes de id real de Tarea en Qoodle para los cuatro exámenes — ver `moodle/entregas.csv`.**

## Estructura

```
unq-moodle/
├── css/
│   └── guia-estilo.css          ← Estilos únicos, compartido por todas las guías
├── js/
│   ├── guia-print.js            ← Botón "Guardar PDF" (solo en clases/)
│   └── index-loader.js          ← Carga dinámica de index.html (ver más abajo)
├── img/
│   ├── marcos-hernandez.png     ← Foto del docente
│   ├── apps/                    ← Íconos de herramientas
│   └── ...                      ← Imágenes de clase
├── archivos/                    ← Datasets para descargar
├── scripts/                     ← Generadores de datasets + build_entregas_json.py
├── clases/
│   ├── Clase 01 - Herramientas Digitales.html
│   ├── Clase 02 - Arquitectura del documento...
│   ├── Clase 00 - Programa Regulares - Informática 2025-2026.html  ← documento de materia, no de clase (CLAUDE.md §1)
│   ├── Docente - Guia de Contenidos - Clases 01-06.html            ← Guía Docente, uso interno, propio CSS (CLAUDE.md §1)
│   ├── Docente - Guia de actividades - Clases 01-06.html           ← ídem
│   └── ... (carpetas `Clase NN - Examen...` para 07/12/16/17: material/consignas, no una Guía Visual publicada)
├── moodle/
│   ├── Clase 00 - Bienvenida.html
│   ├── Clase 01 - Herramientas Digitales.html
│   ├── Comodín - Feriado.html
│   ├── Comodín - Paro docente.html
│   ├── entregas.csv             ← ids reales de Tarea por clase y aula (39500/39501), fuente única
│   ├── entregas.json            ← generado de entregas.csv por scripts/build_entregas_json.py
│   └── ... (18 archivos numerados 00-17 + 2 comodines sin número fijo)
├── loaders.html                 ← loaders de 4.2quinquies listos para pegar en Qoodle, uno por clase
├── herramientas.html            ← catálogo de herramientas citadas en el curso
├── Cronograma.html              ← cronograma/countdown del curso (antes "bloque derecho.html")
├── index.html                   ← Vista previa: carga cada moodle/*.html por fetch() (ver más abajo)
├── README.md                    ← Este archivo
├── CLAUDE.md                    ← Manual técnico integral (vive en la raíz del Drive, no acá)
├── CLAUDE-clases.md             ← Especificación de Guía Visual
└── CLAUDE-moodle.md             ← Especificación de fragmento Moodle
```

**Los PDF ya exportados NO están en este árbol.** Viven en `PDF/`, en la raíz del proyecto de Drive, fuera del repo — no se publican por GitHub Pages, es backup para bajar a mano (ver `CLAUDE-moodle.md` 4.7).

## Cómo se usa cada pieza en Qoodle

| Archivo | Recurso en Qoodle | Cómo |
|---|---|---|
| `clases/Clase NN - Título.html` | **URL** (o el botón "Abrir la guía" ya embebido en el bloque) | Apunta directo a `https://marcosxhernandez.github.io/unq-moodle/clases/Clase%20NN%20-%20...html`. Se abre en pestaña nueva, imprime igual que abrir el archivo local. |
| `moodle/Clase NN - Título.html` | **Página** o **Etiqueta** | Se pega el contenido en el editor Atto usando la vista de código fuente `<>`. Ya trae el botón "Abrir la guía" apuntando a GitHub Pages. |
| `moodle/Clase NN - Título.html` (vía loader, sep. 2026 en adelante) | **Página** o **Etiqueta** | Se pega **una sola vez** un loader fijo y chico (`<div>` + `<script>` con `fetch()`, ver `CLAUDE-moodle.md` 4.2quinquies) — de ahí en más, editar el `.html` + `git push` alcanza, sin volver a tocar Atto. Migración en curso clase por clase; no asumir que todas ya lo usan sin confirmarlo en Qoodle real. |
| `PDF/Clase NN - Título.pdf` (raíz del Drive, no en este repo) | **Archivo** (opcional) | Backup para quien prefiera bajar el PDF en vez de abrir el link. |

**Importante:** los links "Abrir la guía de la clase" dentro de cada `moodle/*.html` ya apuntan a GitHub Pages. Si se activa Pages con otra URL, hay que actualizar esos links a mano — están en los archivos `moodle/`, buscando `github.io`.

## Cómo usar esto

### Estudiantes
1. Ingresá a Qoodle (campus.uvq.edu.ar) y buscá el aula de Informática
2. En cada clase, hay dos enlaces:
   - **Guía Visual imprimible**: Link a GitHub Pages (se abre en ventana nueva)
   - **Caja de herramientas**: Acceso a apps e íconos directamente en Moodle
3. Descargá el PDF con Ctrl+P y el botón "Guardar PDF" de cada guía

### Docentes / Mantenedores
1. Editar contenido de clase: directo en HTML, en `unq-moodle/clases/Clase NN - <Título>.html` (Guía Visual) y `unq-moodle/moodle/Clase NN - <Título>.html` (fragmento Moodle) — la carpeta `Guia/` con archivos `.md` ya no se usa (retirada, ver `CLAUDE.md` §1).
2. Seguir los parámetros de `CLAUDE.md`, `CLAUDE-clases.md` y `CLAUDE-moodle.md` al escribir o ajustar una clase.
3. Publicar cambios: `git push` sube automáticamente a GitHub Pages — para clases ya migradas al loader (ver Historial 2026-09-01 y `CLAUDE-moodle.md` 4.2quinquies), esto alcanza para actualizar Qoodle sin volver a pegar en Atto; para las que todavía no fueron migradas, sigue haciendo falta el paso manual de re-pegar

## Activar GitHub Pages (una sola vez)

1. En el repo, ir a **Settings → Pages**.
2. **Source**: Deploy from a branch.
3. **Branch**: `main`, carpeta `/ (root)`.
4. Guardar. Tarda ~1 minuto en publicarse la primera vez; los pushes siguientes se reflejan solos.

## Importante: index.html y sincronización

**`index.html` ya NO lleva una copia pegada de cada `moodle/Clase NN.html`.** Cada bloque es un `<div data-mdl-src="moodle/Clase NN - Título.html">` vacío; `js/index-loader.js` recorre esos atributos al cargar la página y hace `fetch()` de cada fragmento publicado en GitHub Pages (mismo patrón que el loader de `CLAUDE-moodle.md` 4.2quinquies, pero código propio — detalle técnico completo en `CLAUDE-moodle.md` 4.2sexies), resolviendo también los placeholders `{{ENTREGA:NN:orden}}` contra `moodle/entregas.json` para el aula de vista previa (39500). Para sumar una clase nueva a `index.html` alcanza con agregar el `<div data-mdl-src="...">` correspondiente — no hace falta pegar contenido a mano ni tocar el loader.

**Contrapartida:** como el fetch apunta al sitio YA PUBLICADO (no al archivo en disco), un cambio recién editado en `moodle/*.html` no se ve en `index.html` hasta hacer `git push` (y GitHub Pages puede tardar unos minutos, cache `max-age=600`). Para previsualizar un cambio todavía sin publicar, conviene abrir ese `.html` suelto directamente.

## Convenciones de construcción

Este repo solo aloja el resultado final. Los parámetros de diseño, paginación, tipografía e identidad visual de cada Guía Visual están en `CLAUDE.md` (en la raíz del proyecto de Drive). Ese archivo es la **única fuente de verdad** para construcción de clases nuevas — no se duplica acá para no perder sincronía. Ante cualquier duda de formato, consultá `CLAUDE.md`, `CLAUDE-clases.md` y `CLAUDE-moodle.md`.

## Historial de cambios

**2026-09-10:**
- Auditoría completa de los 4 archivos de documentación (`CLAUDE.md`, `CLAUDE-clases.md`, `CLAUDE-moodle.md`, este README) contra el estado real del repo: `CLAUDE.md` §2.5 todavía tenía el esquema de 20 clases de antes de la reversión del 2 de sep. (commit `15c502e`), la estructura de carpetas todavía decía `bloque derecho.html` en vez de `Cronograma.html`, y `CLAUDE-moodle.md` §4.7/4.8 describía el flujo viejo de entregas por aula (CyT/DCS, `render_entregas.py`, `moodle/_build/`) como si fuera el vigente en vez del loader dinámico de 4.2quinquies. Los tres quedaron corregidos. De paso: documentada formalmente la Guía Docente (`clases/Docente - Guia de Contenidos/actividades - Clases NN-NN.html`, sin sección propia hasta ahora), corregida la ubicación real de los PDF exportados (`PDF/` en la raíz del Drive, no `unq-moodle/pdf/`), confirmado que "Clase 00 - Programa..." vive a propósito dentro de `clases/`, y borrado `unq-moodle/_dashfix_incoming.tar.gz` (archivo suelto sin uso).
- `loaders.html` movido de `loaders/loaders.html` a la raíz de `unq-moodle/` (commit `b02a774`), junto con actualizaciones a `Cronograma.html` y Clases 08-11.

**2026-09-08:**
- Clases 02-06 y `guia-estilo.css` actualizados; sumadas capturas de exportación a PDF de Word (Clase 05) y archivadas capturas viejas de Gamma en `img/_reserva/`.
- Sumado el dataset de contactos comerciales y las capturas de combinación de correspondencia de Clase 05 (fuente real para la Actividad de Correspondencia, ver `CLAUDE-clases.md` 3.8quater).
- `entregas.csv`/`entregas.json` actualizados con los ids reales del curso 39501 para Clases 05-09.

**2026-09-05:**
- Revertida la unidad de Bases de Datos a 3 clases de contenido (13, 14, 15) + examen (16) + recuperatorio (17), para que `moodle/` vuelva a calzar con `clases/` (la Guía Visual, que nunca se expandió a la estructura de 5 clases que había quedado en `moodle/`).
- Eliminados de `moodle/`: "Clase 15 - Consultar para descubrir.html" y "Clase 16 - Cuando una tabla no alcanza.html" (clases que no existen en `clases/`), y el archivo huérfano "Clase 15 - Del dato a la decisión.html" que pisaba el número 15 duplicado — se conservó como el único Clase 15 vigente.
- Descartada la versión expandida de "Clase 17 - Del dato a la decisión.html" (pensada para la estructura de 5 clases); el contenido original que estaba mal numerado en 15 pasa a ser el definitivo.
- Renumerados "Clase 19 - 3.° Parcial Integrador" → **Clase 16 - 3° Parcial** y "Clase 20 - Recuperatorio" → **Clase 17 - Recuperatorio** (título y texto interno ajustados: "Clases 13–17" → "Clases 13–15").
- **Cambio de política:** las clases de examen (07, 12, 16, 17) ahora SÍ tienen bloque de entrega ("✅/📤 Cómo entregás..." + botón "Subir link"), integrado al mismo sistema de `entregas.csv` + `{{ENTREGA:NN:orden}}` que las clases normales — revierte la decisión anterior (documentada en `CLAUDE-moodle.md` 4.2quinquies) de gestionarlas aparte. Faltan los ids reales de Tarea en Qoodle (quedaron en `TODO` en `entregas.csv`) — completar y correr `python3 scripts/build_entregas_json.py` antes de dar por cerrado el punto.
- `index.html` y `loaders/loaders.html` actualizados para reflejar la nueva numeración (15/16/17 renombrados, 19/20 eliminados).
- Documentada la carga dinámica de `index.html` (ya implementada, ver sección de arriba) — estaba descripta como "pendiente de evaluar" y hacía tiempo que no era así.

**2026-09-01:**
- Clase 04 migrada en Qoodle a carga dinámica por `fetch()` (loader chico pegado una vez + `<script>` que trae `moodle/Clase 04....html` en tiempo real) en vez del pegado estático de siempre — primer caso real confirmado de que un `<script>` en bloque sobrevive al guardado de Atto y se ejecuta en Qoodle real (antes documentado como "sin confirmar" en `CLAUDE-moodle.md` 4.2). Patrón nuevo documentado en `CLAUDE-moodle.md` 4.2quinquies, con la lista de puntos a resolver antes de migrar el resto (timeout del fetch, mensaje de error con link de respaldo, loader centralizado, decisión pendiente sobre las clases de examen 07/12/19/20).
- Decisión de alcance: Marcos definió migrar todas las clases a este patrón — no queda como piloto acotado a Clase 04.
- **Bug real encontrado y corregido el mismo día:** la primera versión del loader traía `moodle/Clase NN.html` crudo, con el placeholder `{{ENTREGA:NN:orden}}` sin resolver — el botón "Subir link" de Clase 04 quedó roto en vivo, en las dos aulas (39500 y 39501, mismo loader pegado en ambas). Se corrigió sumando `moodle/entregas.json` (generado por `scripts/build_entregas_json.py` a partir de `moodle/entregas.csv`, nunca a mano) + resolución del placeholder del lado del cliente + detección automática de aula por la URL de la página — detalle completo en `CLAUDE-moodle.md` 4.2quinquies.
- `moodle/entregas.csv` corregido: las columnas eran `cyt_id`/`dcs_id`, sin relación con los cursos reales — ahora `39500_id`/`39501_id`, los dos cursos reales de este cuatrimestre (mismo contenido, comisiones G9-5 y G9-6). Ids confirmados para Clases 01-04 en las dos aulas.
- **Confirmado funcionando en Qoodle real, las dos aulas:** Clase 04 con el loader corregido, botón "Subir link" con el id correcto en 39500 y en 39501, mismo bloque pegado sin ninguna diferencia entre las dos. (De paso: si el loader tira "Error al sincronizar la clase." justo después de un `git push`, es el cache de GitHub Pages — `max-age=600` — probar de nuevo en un par de minutos antes de asumir que algo está roto.)

**2026-08-31:**
- Clases 10 y 11 renombradas (archivo + H1 + índice) para calzar con el cronograma vigente: "Búsqueda entre hojas y visualización" y "Análisis de datos con Tablas Dinámicas e IA" (antes "Búsqueda y conexión entre hojas" / "Análisis de datos con Excel e IA") — CLAUDE.md 2.5 actualizado en el mismo sentido
- Subtítulo de portada de Clases 08-11 sincronizado textualmente con la columna "Subtítulo" del cronograma (antes era una lista de herramientas, no el subtítulo pedagógico)
- Referencia rápida de Clases 08-11 reconstruida como machete acumulativo (regla de ago. 2026, CLAUDE-clases.md 3.4quater): las 5 filas por programa ya vistas (Búsqueda y validación, IA generativa, Google Docs, Word, Presentaciones) más una fila nueva "Planilla de cálculo" que suma celdas clase a clase — antes cada clase tenía filas sueltas por tema, sin acumular
- Clase 08 reconstruida de punta a punta: era la única sin el formato "Resumen de la clase" (Actividades en tabla + Referencia rápida + Glosario + Fuentes), sin colofón, y con una sección "Próxima clase" que violaba la regla de no autorreferenciarse hacia adelante (2.8 #7)
- Colofón con el párrafo de licencia CC BY-NC-SA restituido en Clases 09, 10 y 11 (faltaba, mismo error ya documentado con la Clase 06)
- Íconos de ChatGPT/Gemini/Copilot agregados a la caja de herramientas de Moodle de Clase 11 (ya estaban en el cuerpo de la Guía Visual)

**2026-08-01:**
- Agregadas 12 nuevas clases a index.html (Clases 08-17, 19-20)
- Actualizado aula-pendiente con nota sobre Clase 07
- Documentación completa en README.md
- Estado: 19/20 clases completas (Clase 07 pendiente de .md)

**Pendiente:**
- Confirmar contenido de Clase 06 (hoy en progreso, no confirmada).
- Completar los ids reales de Tarea en Qoodle para los cuatro exámenes (07, 12, 16, 17) en `entregas.csv` — hoy en `TODO` — y correr `python3 scripts/build_entregas_json.py` antes de dar el punto por cerrado.
- Validar si "Archivo → Exportar → Crear PDF/XPS" (ya corregido en Clase 05, ver `CLAUDE-clases.md` 3.8bis) también cambió en Clase 06 (PowerPoint), 08-11 (Excel) y 13-15 (bases de datos/Access) — no tocado todavía porque cada programa puede haber migrado la interfaz en un momento distinto.
