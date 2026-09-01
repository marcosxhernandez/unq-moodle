# Guía de Informática - UNQ 2026

Guía Visual imprimible + fragmentos Moodle para todas las clases del cuatrimestre.

Materiales de **Informática (UNQ, 2026)** publicados para usar en Qoodle (Moodle UVQ). Este repo es el que se sube a GitHub y se sirve con **GitHub Pages** — así las Guías Visuales quedan hosteadas en una URL estable y actualizable con un simple `git push`, en vez de tener que volver a subir un archivo a mano cada vez que se corrige algo.

🔗 Sitio publicado: **https://marcosxhernandez.github.io/unq-moodle/**

## Estado de avance (2026-08-27)

| Clase | Título | Guía Visual | Fragment Moodle | Estado |
|-------|--------|-------------|-----------------|--------|
| 00 | Bienvenida | — | ✅ | Completo |
| 01 | Herramientas Digitales | ✅ | ✅ | Completo |
| 02 | Arquitectura del documento profesional | ✅ | ✅ | Completo |
| 03 | IA como asistente académico | ✅ | ✅ | Completo |
| 04 | Arquitectura avanzada del documento | ✅ | ✅ | 🔄 En progreso |
| 05 | Maquetación de alta precisión | ✅ | ✅ | 🔄 En progreso |
| 06 | Presentaciones con IA | ✅ | ✅ | 🔄 En progreso |
| 07 | 1° Parcial | — | ✅ | Fragmento Moodle completo (sin Guía Visual — carpeta de exámenes en `clases/` no se publica) |
| 08 | Lógica de celdas y funciones esenciales | ✅ | ✅ | Completo |
| 09 | Funciones lógicas y validación de datos | ✅ | ✅ | Completo |
| 10 | Búsqueda entre hojas y visualización | ✅ | ✅ | Completo |
| 11 | Análisis de datos con Tablas Dinámicas e IA | ✅ | ✅ | Completo |
| 12 | 2° Parcial | ✅ | ✅ | Completo |
| 13 | Cómo piensan las bases de datos | ✅ | ✅ | Completo |
| 14 | Del formulario a la base de datos | ✅ | ✅ | Completo |
| 15 | Consultar para descubrir | ✅ | ✅ | Completo |
| 16 | Cuando una tabla no alcanza | ✅ | ✅ | Completo |
| 17 | Del dato a la decisión | ✅ | ✅ | Completo |
| 18 | Feriado — Inmaculada Concepción | — | ✅ | Fragmento Moodle agregado (sin Guía Visual — no hace falta, es aviso de "sin clase") |
| 19 | 3.° Parcial Integrador | ✅ | ✅ | Completo |
| 20 | Recuperatorio | ✅ | ✅ | Completo |

**Total: 16 clases completadas + 3 en progreso (04-06, ajustes finales) — 18 con Guía Visual + 1 Bienvenida sin guía. Clases 07 y 18 tienen fragmento Moodle pero no Guía Visual (07: exámenes en carpeta no publicada; 18: feriado, no hace falta).**

## Estructura

```
unq-moodle/
├── css/
│   └── guia-estilo.css          ← Estilos únicos, compartido por todas las guías
├── js/
│   └── guia-print.js            ← Botón "Guardar PDF" (solo en clases/)
├── img/
│   ├── marcos-hernandez.png     ← Foto del docente
│   ├── apps/                    ← Íconos de herramientas
│   └── ...                      ← Imágenes de clase
├── archivos/                    ← Datasets para descargar
├── pdf/                         ← Guías exportadas (opcional)
├── clases/
│   ├── Clase 01 - Herramientas Digitales.html
│   ├── Clase 02 - Arquitectura del documento...
│   └── ... (19 archivos: 01-06, 08-17, 19-20)
├── moodle/
│   ├── Clase 00 - Bienvenida.html
│   ├── Clase 01 - Herramientas Digitales.html
│   └── ... (20 archivos: 00-06, 08-17, 19-20)
├── index.html                   ← Vista previa con todos los bloques Moodle
├── README.md                    ← Este archivo
├── CLAUDE.md                    ← Manual técnico integral
├── CLAUDE-clases.md             ← Especificación de Guía Visual
└── CLAUDE-moodle.md             ← Especificación de fragmento Moodle
```

## Cómo se usa cada pieza en Qoodle

| Archivo | Recurso en Qoodle | Cómo |
|---|---|---|
| `clases/Clase NN - Título.html` | **URL** (o el botón "Abrir la guía" ya embebido en el bloque) | Apunta directo a `https://marcosxhernandez.github.io/unq-moodle/clases/Clase%20NN%20-%20...html`. Se abre en pestaña nueva, imprime igual que abrir el archivo local. |
| `moodle/Clase NN - Título.html` | **Página** o **Etiqueta** | Se pega el contenido en el editor Atto usando la vista de código fuente `<>`. Ya trae el botón "Abrir la guía" apuntando a GitHub Pages. |
| `moodle/Clase NN - Título.html` (vía loader, sep. 2026 en adelante) | **Página** o **Etiqueta** | Se pega **una sola vez** un loader fijo y chico (`<div>` + `<script>` con `fetch()`, ver `CLAUDE-moodle.md` 4.2quinquies) — de ahí en más, editar el `.html` + `git push` alcanza, sin volver a tocar Atto. Migración en curso clase por clase; no asumir que todas ya lo usan sin confirmarlo en Qoodle real. |
| `pdf/Clase NN - Título.pdf` | **Archivo** (opcional) | Backup para quien prefiera bajar el PDF en vez de abrir el link. |

**Importante:** los links "Abrir la guía de la clase" dentro de cada `moodle/*.html` ya apuntan a GitHub Pages. Si se activa Pages con otra URL, hay que actualizar esos links a mano — están en los archivos `moodle/`, buscando `github.io`.

## Cómo usar esto

### Estudiantes
1. Ingresá a Qoodle (campus.uvq.edu.ar) y buscá el aula de Informática
2. En cada clase, hay dos enlaces:
   - **Guía Visual imprimible**: Link a GitHub Pages (se abre en ventana nueva)
   - **Caja de herramientas**: Acceso a apps e íconos directamente en Moodle
3. Descargá el PDF con Ctrl+P y el botón "Guardar PDF" de cada guía

### Docentes / Mantenedores
1. Editar contenido de clase: modificá el .md fuente en `Guia/Clase NN - <Título>.md` (en el Drive, no acá)
2. Generar HTML: seguí los pasos en CLAUDE.md y CLAUDE-clases.md
3. Publicar cambios: `git push` sube automáticamente a GitHub Pages — para clases ya migradas al loader (ver Historial 2026-09-01 y `CLAUDE-moodle.md` 4.2quinquies), esto alcanza para actualizar Qoodle sin volver a pegar en Atto; para las que todavía no fueron migradas, sigue haciendo falta el paso manual de re-pegar

## Activar GitHub Pages (una sola vez)

1. En el repo, ir a **Settings → Pages**.
2. **Source**: Deploy from a branch.
3. **Branch**: `main`, carpeta `/ (root)`.
4. Guardar. Tarda ~1 minuto en publicarse la primera vez; los pushes siguientes se reflejan solos.

## Importante: index.html y sincronización

**⚠️ `index.html` embebe una copia pegada de cada `moodle/Clase NN.html`, no un include.** Sirve para previsualizar los bloques tal como se ven pegados en Qoodle, pero no se actualiza sola: después de editar un fragmento en `moodle/`, hay que volver a pegar ese mismo contenido dentro de `index.html`, en el bloque `<div id="mNNroot">` correspondiente (identificado por el `id`, único por clase). Si no, `index.html` queda desincronizado en silencio.

**Posible salida a este mismo problema (sep. 2026, anotado — no implementado):** el patrón de carga dinámica de `CLAUDE-moodle.md` 4.2quinquies podría aplicarse también acá — que `index.html` haga `fetch()` de cada `moodle/Clase NN.html` en vez de llevar una copia pegada. Como `index.html` se sirve desde el mismo repo de GitHub Pages, el fetch sería same-origin (sin la duda de CORS que sí aplica al pegar en Qoodle, origen distinto). Pendiente de evaluar.

## Convenciones de construcción

Este repo solo aloja el resultado final. Los parámetros de diseño, paginación, tipografía e identidad visual de cada Guía Visual están en `CLAUDE.md` (en la raíz del proyecto de Drive). Ese archivo es la **única fuente de verdad** para construcción de clases nuevas — no se duplica acá para no perder sincronía. Ante cualquier duda de formato, consultá `CLAUDE.md`, `CLAUDE-clases.md` y `CLAUDE-moodle.md`.

## Historial de cambios

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
- Crear fuente .md para Clase 07 (1° Parcial)
