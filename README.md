# Guía de Informática - UNQ 2026

Guía Visual imprimible + fragmentos Moodle para todas las clases del cuatrimestre de **Informática (UNQ, 2026)**, publicados para usar en Qoodle (Moodle UVQ).

Este repo se sube a GitHub y se sirve con **GitHub Pages**: las Guías Visuales quedan en una URL estable, y un `git push` alcanza para actualizar todo, sin subir nada a mano.

🔗 Sitio publicado: **https://marcosxhernandez.github.io/unq-moodle/**

## Estado de avance

| Clase | Título | Guía Visual | Fragmento Moodle | Estado |
|-------|--------|-------------|-----------------|--------|
| 00 | Bienvenida | — | ✅ | Completo |
| 01 | Herramientas Digitales | ✅ | ✅ | Confirmado (dictada) |
| 02 | Arquitectura del documento profesional | ✅ | ✅ | Confirmado (dictada) |
| 03 | IA como asistente académico | ✅ | ✅ | Confirmado (dictada) |
| 04 | Arquitectura avanzada del documento | ✅ | ✅ | Confirmado (dictada) |
| 05 | Maquetación de alta precisión | ✅ | ✅ | Confirmado (dictada) — recuperatorio el 22/09, después de la Clase 06 |
| 06 | Presentaciones con IA | ✅ | ✅ | Confirmado (dictada el 15/09) |
| 07 | 1° Parcial | — | ✅ | Fragmento Moodle completo (sin Guía Visual — `clases/Clase 07 - Examen...` es carpeta de material/consignas, no se publica) |
| 08 | Lógica de celdas y funciones esenciales | ✅ | ✅ | A confirmar |
| 09 | Funciones lógicas y validación de datos | ✅ | ✅ | A confirmar |
| 10 | Búsqueda entre hojas y visualización | ✅ | ✅ | A confirmar |
| 11 | Análisis de datos con Tablas Dinámicas e IA | ✅ | ✅ | A confirmar |
| 12 | 2° Parcial | — | ✅ | A confirmar (sin Guía Visual — `clases/Clase 12 - Examen...` es carpeta vacía) |
| 13 | Cómo piensan las bases de datos | ✅ | ✅ | A confirmar |
| 14 | Del formulario a la base de datos | ✅ | ✅ | A confirmar |
| 15 | Del dato a la decisión | ✅ | ✅ | A confirmar |
| 16 | 3° Parcial | — | ✅ | A confirmar (sin Guía Visual — carpeta de examen en `clases/` está vacía) |
| 17 | Recuperatorio | — | ✅ | A confirmar (sin Guía Visual — carpeta de examen en `clases/` está vacía) |

Feriado y Paro docente son comodines reutilizables (`moodle/Comodín - Feriado.html`, `Comodín - Paro docente.html`), sin número de clase fijo — no ocupan un slot propio en esta tabla.

Ids de Tarea para el botón "Subir link": `moodle/entregas.csv`, columnas `39500_id`/`39501_id` — las que dicen `TODO` todavía no tienen id real.

## Estructura

```
unq-moodle/
├── css/guia-estilo.css          ← único CSS, compartido por todas las guías
├── js/
│   ├── guia-print.js            ← botón "Guardar PDF" (solo en clases/)
│   └── index-loader.js          ← carga dinámica de index.html
├── img/
│   ├── marcos-hernandez.png     ← foto del docente
│   ├── apps/                    ← íconos de herramientas
│   └── ...                      ← imágenes de clase
├── archivos/                    ← datasets para descargar
├── scripts/
│   ├── build_entregas_json.py   ← entregas.csv → entregas.json
│   ├── build_cronograma_json.py ← genera moodle/cronograma.json
│   ├── gen_dataset.py           ← genera los datasets de archivos/, semilla fija
│   └── verificar_dataset.py     ← chequea un dataset contra sus cifras de control
├── clases/
│   ├── Clase NN - Título.html                                      ← Guía Visual, una por clase
│   ├── Clase 00 - Programa Regulares - Informática 2025-2026.html  ← documento de materia, no de clase
│   ├── Docente - Guia de Contenidos - Clases 01-06.html            ← Guía Docente, uso interno
│   ├── Docente - Guia de actividades - Clases 01-06.html           ← ídem
│   └── Clase NN - Examen.../                                       ← material/consignas de examen, no se publica
├── moodle/
│   ├── Clase NN - Título.html   ← fragmento por clase (18 + 2 comodines)
│   ├── entregas.csv             ← ids de Tarea por clase y aula (39500/39501), fuente única
│   ├── entregas.json            ← generado de entregas.csv
│   └── cronograma.json          ← generado por build_cronograma_json.py
├── loaders.html                 ← loader listo para pegar en Qoodle, uno por clase + Cronograma
├── herramientas.html            ← catálogo de herramientas citadas en el curso
├── Cronograma.html              ← cronograma/countdown del curso
├── index.html                   ← vista previa del sitio completo
├── CLAUDE.md                    ← manual técnico integral (vive en la raíz del Drive)
├── CLAUDE-clases.md             ← especificación de la Guía Visual
└── CLAUDE-moodle.md             ← especificación del fragmento Moodle
```

Los PDF exportados no están en este repo: viven en `PDF/`, en la raíz del proyecto de Drive, backup para bajar a mano.

## Cómo se usa cada pieza en Qoodle

| Archivo | Recurso en Qoodle | Cómo |
|---|---|---|
| `clases/Clase NN - Título.html` | **URL** (o el botón "Abrir la guía" del bloque) | Apunta directo a `https://marcosxhernandez.github.io/unq-moodle/clases/Clase%20NN%20-%20...html`. Se abre en pestaña nueva, imprime igual que el archivo local. |
| `moodle/Clase NN - Título.html` | **Página** o **Etiqueta**, vía loader | Se pega **una sola vez** el loader correspondiente de `loaders.html` (`<div>` + `<script>` con `fetch()`). De ahí en más, editar el `.html` + `git push` alcanza, sin volver a tocar Atto. El mecanismo de abrir/cerrar sección en Qoodle (clase CSS `current`, al "Destacar" una sección) está en `CLAUDE-moodle.md` 4.2quinquies. |
| `PDF/Clase NN - Título.pdf` | **Archivo** (opcional) | Backup para quien prefiera bajar el PDF en vez de abrir el link. |

Los links "Abrir la guía de la clase" dentro de cada `moodle/*.html` apuntan a GitHub Pages. Si Pages se activa con otra URL, esos links se actualizan a mano — están en los archivos `moodle/`, buscando `github.io`.

## Cómo usar esto

### Estudiantes
1. Ingresá a Qoodle (campus.uvq.edu.ar) y buscá el aula de Informática.
2. En cada clase hay dos enlaces: **Guía Visual imprimible** (GitHub Pages, ventana nueva) y **Caja de herramientas** (apps e íconos, directo en Moodle).
3. Descargá el PDF con Ctrl+P y el botón "Guardar PDF" de cada guía.

### Docentes / Mantenedores
1. El contenido de cada clase se edita directo en HTML: `unq-moodle/clases/Clase NN - <Título>.html` (Guía Visual) y `unq-moodle/moodle/Clase NN - <Título>.html` (fragmento Moodle).
2. Los parámetros de diseño y contenido de cada clase están en `CLAUDE.md`, `CLAUDE-clases.md` y `CLAUDE-moodle.md`.
3. `git push` sube automáticamente a GitHub Pages. Con el loader ya pegado en Qoodle, esto alcanza para actualizar el aula sin volver a tocar Atto.

## Activar GitHub Pages (una sola vez)

1. En el repo, ir a **Settings → Pages**.
2. **Source**: Deploy from a branch.
3. **Branch**: `main`, carpeta `/ (root)`.
4. Guardar. Tarda ~1 minuto en publicarse la primera vez; los pushes siguientes se reflejan solos.

## Cómo funciona index.html

Cada bloque es un `<div data-mdl-src="moodle/Clase NN - Título.html">` vacío. `js/index-loader.js` busca esos atributos y trae cada fragmento por `fetch()` desde GitHub Pages, resolviendo los placeholders `{{ENTREGA:NN:orden}}` contra `moodle/entregas.json` (aula de vista previa 39500). Para sumar una clase nueva alcanza con agregar el `<div data-mdl-src="...">` correspondiente.

Todos los bloques arrancan siempre cerrados en index.html, sin depender de fechas ni de "clase actual". En Qoodle real es distinto: cada loader abre solo la sección marcada con la clase CSS `current` (al "Destacar" una sección en Moodle) y colapsa el resto — son dos mecanismos separados a propósito.

Como el `fetch` apunta al sitio ya publicado, un cambio recién editado en `moodle/*.html` no se ve en `index.html` hasta hacer `git push` (GitHub Pages puede tardar unos minutos, cache `max-age=600`). Para previsualizar algo sin publicar, conviene abrir ese `.html` suelto directamente.

## Convenciones de construcción

Este repo solo aloja el resultado final. Los parámetros de diseño, paginación, tipografía e identidad visual de cada Guía Visual están en `CLAUDE.md` (en la raíz del proyecto de Drive) — única fuente de verdad para construir una clase nueva. Ante cualquier duda de formato, consultá `CLAUDE.md`, `CLAUDE-clases.md` y `CLAUDE-moodle.md`.
