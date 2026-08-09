# Guía de Informática - UNQ 2026

Guía Visual imprimible + fragmentos Moodle para todas las clases del cuatrimestre.

Materiales de **Informática (UNQ, 2026)** publicados para usar en Qoodle (Moodle UVQ). Este repo es el que se sube a GitHub y se sirve con **GitHub Pages** — así las Guías Visuales quedan hosteadas en una URL estable y actualizable con un simple `git push`, en vez de tener que volver a subir un archivo a mano cada vez que se corrige algo.

🔗 Sitio publicado: **https://marcosxhernandez.github.io/unq-moodle/**

## Estado de avance (2026-08-01)

| Clase | Título | Guía Visual | Fragment Moodle | Estado |
|-------|--------|-------------|-----------------|--------|
| 00 | Bienvenida | — | ✅ | Completo |
| 01 | Herramientas Digitales | ✅ | ✅ | Completo |
| 02 | Arquitectura del documento profesional | ✅ | ✅ | Completo |
| 03 | IA como asistente académico | ✅ | ✅ | Completo |
| 04 | Arquitectura avanzada del documento | ✅ | ✅ | Completo |
| 05 | Maquetación de alta precisión | ✅ | ✅ | Completo |
| 06 | Presentaciones con IA | ✅ | ✅ | Completo |
| 07 | 1° Parcial | — | ⏳ | No tiene fuente .md |
| 08 | Lógica de celdas y funciones esenciales | ✅ | ✅ | Completo |
| 09 | Funciones lógicas y validación de datos | ✅ | ✅ | Completo |
| 10 | Búsqueda y conexión entre hojas | ✅ | ✅ | Completo |
| 11 | Análisis de datos con Excel e IA | ✅ | ✅ | Completo |
| 12 | 2° Parcial | ✅ | ✅ | Completo |
| 13 | Cómo piensan las bases de datos | ✅ | ✅ | Completo |
| 14 | Del formulario a la base de datos | ✅ | ✅ | Completo |
| 15 | Consultar para descubrir | ✅ | ✅ | Completo |
| 16 | Cuando una tabla no alcanza | ✅ | ✅ | Completo |
| 17 | Del dato a la decisión | ✅ | ✅ | Completo |
| 18 | Feriado — Inmaculada Concepción | — | — | N/A (feriado) |
| 19 | 3.° Parcial Integrador | ✅ | ✅ | Completo |
| 20 | Recuperatorio | ✅ | ✅ | Completo |

**Total: 19 clases completadas (18 con Guía Visual + 1 Bienvenida sin guía). Clase 07 pendiente de fuente .md.**

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
3. Publicar cambios: `git push` sube automáticamente a GitHub Pages

## Activar GitHub Pages (una sola vez)

1. En el repo, ir a **Settings → Pages**.
2. **Source**: Deploy from a branch.
3. **Branch**: `main`, carpeta `/ (root)`.
4. Guardar. Tarda ~1 minuto en publicarse la primera vez; los pushes siguientes se reflejan solos.

## Importante: index.html y sincronización

**⚠️ `index.html` embebe una copia pegada de cada `moodle/Clase NN.html`, no un include.** Sirve para previsualizar los bloques tal como se ven pegados en Qoodle, pero no se actualiza sola: después de editar un fragmento en `moodle/`, hay que volver a pegar ese mismo contenido dentro de `index.html`, en el bloque `<div id="mNNroot">` correspondiente (identificado por el `id`, único por clase). Si no, `index.html` queda desincronizado en silencio.

## Convenciones de construcción

Este repo solo aloja el resultado final. Los parámetros de diseño, paginación, tipografía e identidad visual de cada Guía Visual están en `CLAUDE.md` (en la raíz del proyecto de Drive). Ese archivo es la **única fuente de verdad** para construcción de clases nuevas — no se duplica acá para no perder sincronía. Ante cualquier duda de formato, consultá `CLAUDE.md`, `CLAUDE-clases.md` y `CLAUDE-moodle.md`.

## Historial de cambios

**2026-08-01:**
- Agregadas 12 nuevas clases a index.html (Clases 08-17, 19-20)
- Actualizado aula-pendiente con nota sobre Clase 07
- Documentación completa en README.md
- Estado: 19/20 clases completas (Clase 07 pendiente de .md)

**Pendiente:**
- Crear fuente .md para Clase 07 (1° Parcial)
