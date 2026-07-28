# unq-moodle

Materiales de **Informática (UNQ, 2026)** publicados para usar en Qoodle (Moodle UVQ). Este repo es el que se sube a GitHub y se sirve con **GitHub Pages** — así las Guías Visuales quedan hosteadas en una URL estable y actualizable con un simple `git push`, en vez de tener que volver a subir un archivo a mano cada vez que se corrige algo.

🔗 Sitio publicado: **https://marcosxhernandez.github.io/unq-moodle/**

## Estructura

```
unq-moodle/
  index.html              ← portada tipo "aula", con el estado de cada clase (ver abajo)
  clases/                 ← Guía Visual completa de cada clase (para leer/imprimir)
  bloques/                ← fragmento Moodle de cada clase (para pegar en Qoodle vía Atto)
  bloque derecho.html     ← bloque lateral de cronograma/countdown (para el Block HTML del curso)
  css/guia-estilo.css     ← estilo único compartido por todas las Guías Visuales
  img/                    ← imágenes usadas por las Guías Visuales (íconos, capturas)
  pdf/                    ← Guía Visual ya exportada a PDF, por si hace falta adjuntarla directo
```

## Cómo se usa cada pieza en Qoodle

| Archivo | Recurso en Qoodle | Cómo |
|---|---|---|
| `clases/Clase NN - Título.html` | **URL** (o el botón "Abrir la guía" ya embebido en el bloque) | Apunta directo a `https://marcosxhernandez.github.io/unq-moodle/clases/Clase%20NN%20-%20...html`. Se abre en pestaña nueva, imprime igual que abrir el archivo local (ver CLAUDE.md, sección 4.7). |
| `bloques/Moodle - Clase NN - Título.html` | **Página** o **Etiqueta** | Se pega el contenido en el editor Atto usando la vista de código fuente `<>`. Ya trae el botón "Abrir la guía" apuntando a GitHub Pages. |
| `bloque derecho.html` | **Bloque HTML** (sidebar del curso) | Se pega una sola vez, no es por clase — el countdown funciona con `Date` de JS, no depende de imágenes ni de este repo. |
| `pdf/Clase NN - Título.pdf` | **Archivo** (opcional) | Backup para quien prefiera bajar el PDF en vez de abrir el link. |

**Importante:** los links "Abrir la guía de la clase" dentro de cada `bloques/*.html` ya apuntan a GitHub Pages (no a un recurso viejo de Qoodle). Si se activa Pages con otra URL (usuario u organización distintos, o un dominio propio), hay que actualizar esos 5 links a mano — están en `bloques/Moodle - Clase 01...05...html`, buscando `github.io`.

## Activar GitHub Pages (una sola vez)

1. En el repo, ir a **Settings → Pages**.
2. **Source**: Deploy from a branch.
3. **Branch**: `main`, carpeta `/ (root)`.
4. Guardar. Tarda ~1 minuto en publicarse la primera vez; los pushes siguientes se reflejan solos.

## Estado del contenido (jul. 2026)

| Clase | Guía Visual (`clases/`) | Fragmento (`bloques/`) | PDF | Notas |
|---|---|---|---|---|
| 00 · Bienvenida | — | ✅ | — | No lleva Guía Visual propia. |
| 01 · Herramientas Digitales | ✅ | ✅ | ✅ | Completa. |
| 02 · Arquitectura del documento profesional | ✅ | ✅ | ✅ | Completa. |
| 03 · IA como asistente académico | ✅ | ✅ | ✅ | Completa. |
| 04 · El documento como nodo de información | ✅ | ✅ | ✅ | Completa. |
| 05 · Maquetación de alta precisión | ✅ | ✅ | ✅ | Completa. |
| 07 · Taller integrador | ⚠️ parcial | — | — | Dos consignas de actividad ("Científico/a de Argentina" y "Síndrome Urémico Hemolítico"), sin Guía Visual ni fragmento propios todavía. |
| 12 · Análisis de datos con Excel e IA | — | ⚠️ borrador | — | Fragmento experimental con estilo propio (no sigue `guia-estilo.css`), a revisar antes de publicar. |
| Resto (06, 08-11, 13-17) | — | — | — | Sin construir. |

`index.html` refleja esta misma tabla en formato de aula — abrilo para navegar todo con un click.

## Convenciones de construcción

Este repo solo aloja el resultado final. Los parámetros de diseño, paginación, tipografía e identidad visual de cada Guía Visual están en `CLAUDE.md`, en la raíz del proyecto de Drive (no se duplica acá para no perder sincronía). Ante cualquier duda de formato al construir una clase nueva, esa es la fuente de verdad.
