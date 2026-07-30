# CLAUDE-clases.md — Manual técnico de la Guía Visual imprimible

Detalle técnico de `unq-moodle/clases/Clase NN - <Título>.html` — la Guía Visual completa, pensada para leer en pantalla y para imprimir con Ctrl+P desde Chrome.

Para estructura de carpetas, identidad visual/colores por clase y el registro general de errores, ver el `CLAUDE.md` de la raíz — este archivo no repite esa parte, solo la referencia (p. ej. "ver 2.5" o "ver 2.7" apunta al `CLAUDE.md` raíz).

---

### 3.1 `<head>` — bloque que cada clase nueva debe incluir

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,340;0,9..144,400;0,9..144,440;0,9..144,520;0,9..144,540;0,9..144,560;0,9..144,650;1,9..144,420;1,9..144,460;1,9..144,480;1,9..144,500;1,9..144,560&family=Inter:wght@400;500;600;700;800&family=Noto+Emoji&display=swap">
<link rel="stylesheet" href="../css/guia-estilo.css">
<style>
  :root{
    --acento:var(--celeste);        /* familia de la clase, ver 2.5 */
    --acento-deep:var(--celeste-deep);
    --acento-tint:var(--celeste-tint);
    --acento-soft:var(--celeste-soft);
  }
  @page{
    @top-right{
      content:"Clase 02 · Procesador de texto";
      color:#2b569f;   /* --acento-deep en literal — ver 3.3, por qué no var() */
    }
  }
</style>
```

**`href="../css/guia-estilo.css"`, con `../css/`, en todas las clases por igual.** El archivo vive en `unq-moodle/css/` (ver 1 del `CLAUDE.md` raíz) — desde `unq-moodle/clases/Clase NN - <Título>.html`, subir un nivel a `unq-moodle/` y bajar a `css/`. Ruta idéntica para todas las clases, no cambia con el número. No usar `../guia-estilo.css` a secas — esa ruta ya no existe.

Si la familia de color todavía no existe en `guia-estilo.css` (ver 2.6 del `CLAUDE.md` raíz), agregarla ahí primero — no declararla solo en el `<head>` de la clase. Como el archivo es único y compartido, esa edición queda disponible automáticamente para el resto de las clases.

**Los 3 `<link>` de Google Fonts van primero, antes de `guia-estilo.css`, en todas las clases por igual** (la URL con las instancias de Fraunces es la misma para todas, ver 3.9). No usar `@import` para esto dentro de `guia-estilo.css`: encadena la carga (el navegador tiene que parsear el CSS primero para recién ahí descubrir la fuente) y puede llegar tarde al snapshot que Chrome toma al exportar PDF. Con `<link>` en el `<head>`, la fuente se descubre desde el primer parseo del HTML.

**`<title>` = nombre de archivo, sin más:** Chrome usa el contenido de `<title>` como nombre por defecto al hacer "Guardar como PDF" — no el nombre del `.html`. Poner ahí exactamente `Clase NN - <Título>` (igual a la convención de nombre de archivo de la sección 1 del `CLAUDE.md` raíz), sin subtítulo ni bajada larga. Un `<title>` largo se traduce directo en un nombre de PDF largo.

### 3.2 `@page` — parámetros fijos (no tocar sin motivo nuevo)

```css
@page{
  size:A4;
  margin:16mm 13mm 18mm;   /* arriba/laterales/abajo */
}
```

- **Laterales 13mm:** piso razonable — impresoras hogareñas no imprimen más allá de ~10mm del borde.
- **Arriba 16mm / abajo 18mm:** más generosos que los laterales a propósito, para que encabezado y pie tengan aire antes del filete (ver 3.3). No bajarlos de 14mm sin volver a probar el corte en una impresora real.
- **`--measure` (ancho de columna de lectura) se pisa a `164mm` dentro de `@media print`**, no depende de los márgenes de página — son ejes independientes. 164mm ≈ 91 caracteres por línea a 9,8pt, ya en el techo de lo cómodo (convención: 45–90). No ensanchar más sin bajar el cuerpo de 9,8pt.
- **Eje de texto: `(210 − measure) / 2` = 23mm.** La banda de portada y el índice usan `padding` lateral de 23mm para compartir el mismo eje izquierdo que el cuerpo. Si `--measure` cambia, recalcular este valor en los tres lugares que lo usan (`.cover-page`, `.toc`).

### 3.3 Encabezado y pie de página

Reparto: arriba a la izquierda "Informática · UNQ" (fijo, en `guia-estilo.css`); arriba a la derecha "Clase NN · unidad temática" (por clase, ver 3.1); abajo al centro folio "N / total" en texto plano, sin pastilla.

```css
/* En guia-estilo.css — no repetir esto por clase, ya está */
@page{
  @top-left{
    content:"Informática · UNQ";
    margin-bottom:5mm;
    padding-top:5mm; padding-bottom:5pt;
    border-bottom:.75pt solid #e6e4ec;
    vertical-align:bottom;
    /* + tipografía: 7.6pt, 600, uppercase, color #a3a1b0 */
  }
  @top-center{ content:""; margin-bottom:5mm;
    padding-top:5mm; padding-bottom:5pt;
    border-bottom:.75pt solid #e6e4ec; vertical-align:bottom; }
  @top-right{ margin-bottom:5mm;
    padding-top:5mm; padding-bottom:5pt;
    border-bottom:.75pt solid #e6e4ec; vertical-align:bottom;
    /* contenido y color: override por clase, ver 3.1 */ }

  @bottom-left{ content:""; height:9mm; margin-top:5mm;
    padding-top:5pt; border-top:.75pt solid #e6e4ec; vertical-align:top; }
  @bottom-center{
    content:counter(page) " / " counter(pages);
    height:9mm; margin-top:5mm;
    padding-top:5pt; border-top:.75pt solid #e6e4ec; vertical-align:top;
    /* + tipografía: 8pt, color #a3a1b0 */ }
  @bottom-right{ content:""; height:9mm; margin-top:5mm;
    padding-top:5pt; border-top:.75pt solid #e6e4ec; vertical-align:top; }
}
@page:first{ margin:0; /* + content:none y border:none en las 6 cajas */ }
```

Parámetros no evidentes:

- **Filete continuo:** una caja de margen no puede pedir "una línea de margen a margen". Se logra poniendo el mismo `border-bottom`/`border-top` a las **tres** cajas de cada lado (izquierda, centro vacía, derecha) — al compartir estilo y estar contiguas, se ven como una sola línea.
- **Dos gaps distintos, dos mecanismos distintos:**
  1. *Gap entre el borde físico de la hoja y el texto*: `padding-top:5mm` en `@top-left/center/right`.
  2. *Gap entre el filete (`border-bottom`/`border-top`) y el cuerpo del documento*: `margin-bottom:5mm` en las cajas de arriba y `margin-top:5mm` en las de abajo.
  - `height`+`vertical-align` no alcanzan solos para este gap — no hay garantía de que Chrome los respete igual que WeasyPrint. Quedan como refuerzo sin costo, pero el gap real en Chrome lo dan `padding`/`margin`.
  - Si `padding-top` crece, revisar que el total (`padding-top` + texto + `padding-bottom` + `margin-bottom`) siga entrando dentro del margen de página (16mm arriba / 18mm abajo) — si no, el encabezado empieza a comerse el cuerpo.
- **Texto y color literales, nunca `var()` ni `string()`/`target-counter()`** — ver tabla de compatibilidad en 3.5.
- **Cada clase solo pisa `@top-right`** (contenido + color). El resto ya está en `guia-estilo.css` y no se repite.
- **No usar breadcrumb tipo "UNQ › Informática › Clase NN".** `content` en una caja de margen es texto plano de una sola cadena — no admite mezclar pesos ni tags dentro del valor. Formato vigente: izquierda fija "Informática · UNQ", derecha por clase.

### 3.4 Portada + índice (hoja 1)

No es una tapa de libro — es una clase de una serie de 20. Es una banda de color a sangre en el tercio superior de la hoja 1 (título, bajada, firma institucional, numeral gigante), con el índice debajo en la misma carilla. El contenido arranca en la hoja 2.

- `@page:first{ margin:0 }` — la banda llega al borde físico del papel; por eso ella y el índice ponen su propio padding lateral de 23mm (ver eje, 3.2).
- Índice **sin folios reales** (ver 3.5 — `target-counter()` no anda en Chrome). El peso editorial lo dan el numeral en serif y los filetes horizontales entre ítems, no el número de página.
- No usar infografías/imágenes decorativas grandes dentro del cuerpo si no aportan información nueva — si la metáfora ya está en un callout de "Idea clave", no repetirla en imagen.
- **Burbuja del docente en `.cover-footer` (todas las clases):** al lado de la firma institucional, un pill `.cover-teacher` con foto + nombre + mail — sin etiqueta "Docente" ni "Prof.", solo "Marcos Hernández" y el mail — mismo patrón que la firma del fragmento Moodle (ver `CLAUDE-bloques.md` 4.2bis), adaptado a fondo de color (blanco translúcido en vez de sólido). Clases: `.cover-footer` (flex, firma a la izquierda envuelta en `.cover-footer-text`, burbuja a la derecha), `.cover-teacher`, `.cover-teacher-photo`, `.cover-teacher-text`, `.cover-teacher-name`, `.cover-teacher-mail` — ya en `guia-estilo.css`, no repetir por clase. Foto: `unq-moodle/img/marcos-hernandez.jpg` (88×88, ~2x el tamaño máximo de despliegue de 44px), referenciada como `../img/marcos-hernandez.jpg` desde `clases/` — nunca una URL externa de `googleusercontent.com` (ver `CLAUDE.md` raíz, sección 5). Mail mostrado: `marcos.hernandez@unq.edu.ar` (institucional, el mismo del fragmento Moodle). Solo el nombre sin tratamiento y el mail, dos líneas dentro de `.cover-teacher-text`.

### 3.4ter "Resumen de la clase" — sección única de cierre (reemplaza a Cierre/Referencia rápida/Glosario/Fuentes como 4 secciones separadas)

**Decisión jul. 2026, reemplaza el criterio anterior** (que ponía Cierre, Resumen, Glosario y Fuentes como 4 `section.block` independientes, cada una con su propio numeral y su propia hoja al imprimir). Motivo del cambio: cuatro numerales de nivel 1 seguidos (antes 05-08) para lo que en realidad es "todo el material de cierre" generaba ruido — el estudiante los leía como si fueran unidades de contenido más, al mismo nivel que 01-04, cuando son de otro orden (una es acción/entrega, las otras tres son consulta).

**Estructura correcta, una sola `section.block id="resumen"`, numerada como la última sección de contenido (05 en una clase de 4 unidades, ajustar el número según cuántas unidades tenga la clase):**

```html
<section class="block" id="resumen">
  <div class="block-head">
    <span class="block-num">05</span>
    <h2 class="block-title">Resumen de la clase</h2>
  </div>
  <div class="prose">

    <h3 id="actividades">Actividades</h3>
    <!-- checklist + entregables por unidad, contenido de la vieja "Cierre de la clase" -->

    <h3 id="referencia-rapida">Referencia rápida</h3>
    <!-- .qr-row por tema, ver 3.4quater -->

    <h3 id="glosario">Glosario</h3>
    <div class="glossary">...</div>

    <h3 id="fuentes">Fuentes</h3>
    <ul class="sources">...</ul>

  </div>
</section>
```

**Orden fijo de los 4 `<h3>`, no alfabético ni arbitrario:** Actividades → Referencia rápida → Glosario → Fuentes. Va de lo accionable (qué tengo que entregar hoy) a lo puramente formal (bibliografía), pasando por dos niveles de consulta (dato duro amplio, después término a término). Fuentes va último por convención académica estándar (la bibliografía nunca compite por atención con el contenido) y porque es lo que menos necesita un estudiante de primer año en el día a día — se busca solo cuando hace falta citar algo puntual.

**"Actividades" reemplaza al título "Cierre de la clase" y al `<h3>Entrega de la clase</h3>` que tenía adentro** — un solo `<h3 id="actividades">`, sin anidar dos títulos para lo mismo. El contenido (intro + checklist por unidad + callouts de entregable) no cambia, solo el nivel de encabezado.

**Consecuencia de imprimir: ya no hay salto de página forzado entre Actividades/Referencia rápida/Glosario/Fuentes.** Antes, cada una era su propio `section.block` y por regla general (3.6) abría hoja nueva. Ahora que las 4 son `<h3>` dentro de una sola sección, fluyen juntas y solo el inicio de "05 Resumen de la clase" fuerza salto de página — Referencia rápida ya no arranca garantizada en hoja propia. Si en el futuro se necesita que alguna sí abra hoja aparte (ej. para que funcione como machete desprendible), se resuelve con `break-before:page` puntual en ese `<h3>`, no reintroduciendo un `section.block` extra.

**TOC (tanto `.md` como `.cover-page`/`.toc` del HTML): una sola entrada, no 4.** Los `<h3>` internos no llevan entrada propia en el índice — mismo criterio que cualquier otro `<h3>` dentro de las secciones 01-04, que tampoco aparecen en el TOC.

### 3.4quater Encabezado de sección — caja de dos tonos, y "Referencia rápida" (`.qr-*`)

**Encabezado de sección (`.block-head`/`.block-num`/`h2.block-title`), ya en `guia-estilo.css`:** caja de dos tonos calcada del header del fragmento Moodle (ver `CLAUDE-bloques.md` 4.1ter) — numeral en serif blanco sobre fondo sólido `--acento` a la izquierda, título sobre fondo `--acento-tint` a la derecha, `border-radius:16px`, sin subtítulo (a diferencia del header de Moodle, acá no hace falta bajada). `min-height:92px` en pantalla para que el numeral no cambie de tamaño según el título tenga 1 o 2 líneas; en impresión ese valor de pantalla se pisa a `min-height:14mm` (nunca dejarlo en `0`: un título de una sola línea queda pegado al numeral sin aire; nunca dejar el valor de pantalla sin pisar: se imprime como ~24mm físicos, la caja ocupa el equivalente a 3 líneas).

**"Referencia rápida" (componente `.qr-*`), ya en `guia-estilo.css`, reemplaza gradualmente a `.summary`/`.summary-group`:** fila por tema (`.qr-row`), pestaña vertical a la izquierda con el nombre del TEMA — nunca "Clase NN", el número ya está en el título de la sección — (`.qr-row-label`, fondo `--acento-tint`/texto `--acento`, `writing-mode:vertical-rl`), celdas a la derecha (`.qr-cell`) con título sin ícono en badge (el emoji va en línea dentro de `.qr-cell-title`, igual que en `.callout-label` — un emoji a color entero sobre un cuadrado sólido del acento queda sucio, sus propios colores pelean con el acento) y contenido en una de dos formas: `.qr-items`/`.qr-item`/`.qr-dot` (lista con punto, para datos sueltos tipo URL) o `.qr-formula`/`.qr-frow`/`.qr-fletter`/`.qr-fdesc` (letra + descripción corta, para siglas tipo CRAAP/RTCFL). **Solo dato duro difícil de recordar de memoria** (URL exacta, orden de letras de una fórmula, sintaxis de operador, código de licencia) — nada de convención de proceso (ej. cómo nombrar carpetas) ni distinción conceptual ya cubierta en el glosario (ej. alucinación vs. sesgo): si el estudiante no puede reconstruirlo razonando, va acá; si ya lo tiene que saber de memoria conceptual, no. `.summary`/`.summary-group` siguen en el CSS para las clases que todavía no migraron — no sacarlos hasta que las 19 restantes adopten `.qr-*`.

**Checkbox real e interactivo (`.checkbox`), ya en `guia-estilo.css`:** en la Guía Visual (a diferencia del fragmento Moodle, que ya usaba `<input type="checkbox">` real — ver `CLAUDE-bloques.md` 4.2bis) el checkbox de "Actividades" pasó de un `<span class="checkbox"></span>` decorativo a un `<input type="checkbox" class="checkbox" aria-label="Marcar como hecho">` real. Tildarlo tacha la fila entera (`table.check-table tr:has(.checkbox:checked) td:not(.check-cell)`), sin JS — solo `:checked` + `:has()`. Sin backend, no persiste entre visitas (igual criterio que el fragmento Moodle): es ayuda de lectura de la sesión, no registro de progreso.

**Fila accionable desde cualquier parte del texto (decidido jul. 2026, CLAUDE.md 2.8 #5):** el `<input>` lleva un `id` único por clase y por fila (`chk-NN-1`, `chk-NN-2`...) y el texto de la celda de al lado va envuelto en `<label for="chk-NN-1">`, no suelto:

```html
<tr>
  <td class="check-cell"><input type="checkbox" class="checkbox" id="chk-02-1" aria-label="Marcar como hecho"></td>
  <td><label for="chk-02-1">Está en la subcarpeta "Clase 02", dentro de "Informática - UNQ".</label></td>
</tr>
```

`table.check-table td:not(.check-cell) label{ display:block; cursor:pointer; }` ya está en `guia-estilo.css` — no repetir el estilo por clase, solo envolver el texto en el `<label>` con el `for` correcto.

### 3.4quinquies Pregunta disparadora: callout sin título (decidido jul. 2026, CLAUDE.md 2.8 #1)

El callout `data-type="question"` que abre una sección (no el de "Antes de seguir" a mitad de sección, ver 3.4quater) va **sin** `<p class="callout-label">`. En el `.md` fuente se sigue viendo `**🤔 PREGUNTA DISPARADORA**` como marcador de autor, pero eso no se traduce a un label visible en el HTML:

```html
<div class="callout" data-type="question">
  <p>Pensá en el último trabajo que entregaste. ¿Cómo lo hiciste? ...</p>
</div>
```

Sin el `<p class="callout-label">🤔 Pregunta disparadora</p>` que llevaban las clases anteriores a jul. 2026 — al revisar una clase vieja, sacarlo si aparece.

### 3.4sexies Ícono de LinkedIn en el callout de nueva habilidad (decidido jul. 2026, CLAUDE.md 2.8 #4)

Todo callout `data-type="linkedin"` suma el ícono de LinkedIn dentro del `.callout-label`, antes del texto:

```html
<div class="callout" data-type="linkedin">
  <p class="callout-label"><img src="../img/apps/icono-linkedin.png" alt="">🔗 Nueva habilidad para LinkedIn</p>
  <p>...</p>
</div>
```

Ruta relativa `../img/apps/icono-linkedin.png` (igual criterio que cualquier ícono de `img/apps/` desde `clases/`, ver `CLAUDE-bloques.md` 4.3 para el equivalente en base64 del fragmento Moodle). Tamaño ya resuelto en `guia-estilo.css` (`.callout[data-type="linkedin"] .callout-label img`), no fijar `width`/`height` inline.

### 3.4bis Colofón — crédito de autoría del texto

`guia-estilo.css` ya trae `footer.colophon` (centrado, uppercase, 11.5px, color `--muted`, `border-top` separador — se saca ese borde en impresión igual que en 3.6). Convención: cada Guía Visual cierra, después de `</main>` y antes de cerrar `.page`, con:

```html
<footer class="colophon">
  <p>Marcos Hernández</p>
</footer>
```

Es crédito de curaduría/edición de **texto**, distinto del crédito de imágenes (que se maneja aparte, por imagen, no acá). No es necesaria más leyenda (cargo, cátedra, año) salvo que se pida — se mantiene deliberadamente discreto. Nota informativa, no asesoramiento legal: la autoría de un texto original es automática (no depende de registrarla), poner el nombre es una cuestión de reconocimiento editorial más que un requisito legal.

### 3.5 Qué funciona en Chrome (motor real de impresión) y qué no

El docente imprime con Ctrl+P desde Chrome — no un conversor de PDF dedicado. Antes de usar cualquier función de CSS Paged Media, confirmar acá:

| Función | ¿Chrome? | Qué hacer |
|---|---|---|
| Cajas de margen (`@top-left`, etc.) | Sí | Usar libremente. |
| `border`/`background` en cajas de margen | Sí | Usar libremente. |
| `counter(page)` / `counter(pages)` | Sí | Base del folio "N / total". |
| `string-set` + `string()` | **No** | No usar — caja vacía en el papel. Texto literal por clase (3.1). |
| `target-counter()` | **No** | No usar — deja la guía de puntos del índice sin número, parece un error. Índice sin folios (3.4). |
| `var(--x)` dentro de una caja de margen | Sin confirmar | Usar hexadecimal literal. |
| `color-mix()` | No (en varios motores de impresión) | Usar `--acento-soft` precalculado (2.7 del `CLAUDE.md` raíz), nunca `color-mix()`. |
| `clamp()` en propiedades críticas de layout de impresión | Riesgoso en algunos motores | Los valores de impresión ya están fijados en pt/mm dentro de `@media print` (3.6) — no depender de `clamp()` ahí. |

Regla general: no agregues una función porque la especificación la define — confirmá que Chrome la pinta. No la saques por sospecha tampoco — confirmá que falla antes de sacar algo que ya funciona.

### 3.6 Reglas de paginación

- **Indivisible** (`break-inside:avoid-page`): `.callout`, `.app-install`, `.compare-panel`, `.summary-group`, `.qr-row`, `.gloss-item`, `.tool-cards`, `.screenshot`, `.diagram`, `.screenshot-caption`, `.activity-head`, `.activity-criteria`.
- **Fluye** (`break-inside:auto`): `.table-wrap`, `.activity`, `.summary`, `.glossary`, `section.block`. Se cortan prolijo por `tr{break-inside:avoid-page}` + `thead{display:table-header-group}` (repite encabezado de columnas) + `orphans:3`/`widows:3`. `.qr-row` no necesita un contenedor "que fluye" propio (a diferencia de `.summary`) — cada fila va suelta dentro de `.prose`, una detrás de la otra.
- **Nunca marques como indivisible un bloque largo** (sección entera, tabla de varias filas, actividad completa): el motor lo empuja entero a la página siguiente y deja media hoja en blanco.
- Imagen + leyenda: `break-after:avoid-page` en `.screenshot`/`.diagram`, `break-before:avoid-page` en `.screenshot-caption` — nunca se separan entre dos hojas.
- Cada `section.block` abre hoja nueva (`break-before:page`).
- **`section.block` no lleva `border-top` en impresión** (`border-top:none` en el override de `@media print`), aunque en pantalla sí lo tiene. Como cada sección ya abre en hoja nueva, ese borde caería pegado al filete del encabezado — el salto de página ya es la separación entre secciones.

### 3.7 Escala tipográfica y compresión de impresión (valores fijos)

```css
html{ font-size:9.8pt; }
body{ font-size:9.8pt; line-height:1.4; }
.cover-title{ font-size:42pt; }
.cover-subtitle{ font-size:13pt; }
h2.block-title{ font-size:17pt; }
h3{ font-size:11.6pt; }
.block-num{ font-size:24pt; }
```

Padding/margen comprimidos respecto de pantalla (no volver a los valores de pantalla en `@media print`): `.callout` 11pt/13pt, `.table-wrap` celdas 5.5–6pt, `.activity` 13pt/15pt, `.screenshot` max-width 118mm, `.diagram` max-width 62mm. Valores confirmados (bajan una guía típica de ~38 a ~21 carillas sin tocar jerarquía visual ni tamaño de lectura) — reutilizarlos tal cual, no reinventar por clase.

Trampas de layout ya resueltas (no reintroducirlas):

- **`.page` (contenedor de pantalla) estrangula el texto en impresión** si no se neutraliza: su `max-width` se suma a los márgenes de página. En `@media print`: `.page{ max-width:none; margin:0; padding:0; }`.
- **Contenedores flex con grupos de tamaño desigual** (ej. paneles comparativos con 4 tarjetas de un lado y 3 del otro) se estiran con `flex-grow` y dejan un zócalo vacío. Usar `display:block` apilado + `grid` de columnas fijas, no `flex` lado a lado.
- **Emojis en motores sin fuente de emoji propia** (WeasyPrint) salen como recuadros vacíos. `'Noto Emoji'` va al final de la pila de `--sans` como fallback — no afecta a Chrome, que resuelve el emoji con su propia fuente antes de llegar ahí.

### 3.9 Fraunces es variable: cada `font-weight` usado necesita su instancia declarada, cargada por `<link>`

Fraunces se pide como listado cerrado de instancias estáticas `{ital,opsz,wght}` (ver 3.1). Si el CSS usa un `font-weight` que no está en ese listado, Chrome no tiene un glyph compacto para incrustar y dibuja ese texto como paths vectoriales en vez de texto con fuente incrustada — el efecto no queda acotado al elemento puntual: **toda la página pierde texto seleccionable**, y el PDF exportado pesa un orden de magnitud más de lo que debería (~15-18MB en vez de ~2-3MB).

**Regla:** agregar una instancia explícita por cada combinación `{ital,opsz,wght}` que el CSS realmente usa — el valor exacto, no el más cercano ya declarado — y verificar **los dos ejes** (un peso cubierto en redonda no cubre automáticamente su itálica). Cargar siempre por `<link>` en el `<head>`, nunca por `@import` dentro de `guia-estilo.css` (3.1). Google Fonts genera un archivo estático por cada instancia pedida en el listado `wght@v1;v2;...`, no hace falta que sea un peso "redondo". Esto aplica solo a Fraunces (variable); Inter se pide en pesos fijos estándar (400/500/600/700/800) y no tiene este problema.

Instancias necesarias hoy — verificar contra el `<link>` real antes de agregar una clase nueva:

| Estilo | Pesos usados | Dónde |
|---|---|---|
| Normal (`ital=0`) | 340, 400, 440, 520, 540, 560 | numeral fantasma portada, comilla decorativa del callout "closing" (peso heredado, sin declarar), toc-text, cover-title/h2.block-title, h3, toc-num/block-num |
| Itálica (`ital=1`) | 420, 460, 480, 560 | cover-subtitle, callout "closing", callout "question", término de glosario (`.gloss-term`) |

**Regla:** si una clase nueva agrega un peso de Fraunces que no está en esta tabla — o reutiliza un peso ya listado pero en el estilo contrario (redonda↔itálica) — agregar la instancia a la URL del `<link>` en el mismo cambio, nunca asumir que el navegador va a interpolar sin costo. Al auditar, recorrer **todas** las reglas que usan `var(--serif-display)`, no solo las más visibles (títulos) — el glosario y las comillas decorativas también cuentan.

**Diagnóstico si el PDF pesa de más:** abrir el PDF y buscar (Ctrl+F/Cmd+F) una palabra de un título de sección. Si el buscador **no la encuentra**, el texto se está dibujando como paths — revisar instancias/carga de fuente. Si la encuentra pero el archivo sigue pesando de más, el problema es de imágenes fuera de escala, no de fuentes: confirmar que cada imagen en `img/` esté redimensionada a ~2x su tamaño máximo de despliegue, no a la resolución nativa en la que se capturó/exportó.

### 3.8 Checklist antes de dar por terminada una Guía Visual

1. `<head>` tiene los 4 tokens de acento (2.5 del `CLAUDE.md` raíz), el override de `@top-right` (3.1), y el `<link>` de `guia-estilo.css` apunta a `../css/guia-estilo.css`.
2. `<title>` es exactamente `Clase NN - <Título>`, sin subtítulo (3.1).
3. Si la familia de color es nueva, está agregada en `guia-estilo.css` (2.7 del `CLAUDE.md` raíz), no solo en el `<head>` de la clase.
4. Ninguna sección/tabla/actividad completa quedó marcada `break-inside:avoid-page` (3.6).
5. `footer.colophon` con el crédito de autoría presente al final de `<main>` (3.4bis).
6. Si se usó un `font-weight` de Fraunces nuevo (en redonda o en itálica), está agregado al `<link>` de Google Fonts en el `<head>` (3.9), nunca como `@import`.
7. Toda imagen nueva en `img/` está redimensionada a ~2x su tamaño máximo de despliegue.
8. Ctrl+P → Destino: Guardar como PDF · Papel: A4 · Márgenes: **Predeterminado** (no "Ninguno"/"Mínimo") · Escala: 100% (no "Ajustar al ancho") · Gráficos de fondo: **activado** · Encabezados y pies de Chrome: **desactivado**.
9. Revisar página por página que no queden huecos de más de media carilla en blanco, y que ninguna sección abra con un borde superior pegado al filete del encabezado (3.6).
10. Confirmar que el PDF exportado pesa un orden de magnitud acorde al contenido (una guía de ~20 carillas con pocos íconos debería rondar 1-3MB, no 15MB+) — si se dispara, diagnosticar con 3.9.
