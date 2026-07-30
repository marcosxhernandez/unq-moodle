# CLAUDE-bloques.md — Manual técnico del fragmento Moodle

Detalle técnico de `unq-moodle/bloques/Moodle - <Título>.html` — el fragmento que se pega en Qoodle vía el editor Atto.

Para estructura de carpetas, identidad visual/colores por clase y el registro general de errores, ver el `CLAUDE.md` de la raíz — este archivo no repite esa parte, solo la referencia (p. ej. "ver 2.5" o "ver 2.7" apunta al `CLAUDE.md` raíz).

---

### 4.1 Anatomía

```html
<div id="mNNroot" style="...">
  <!-- Header: número (o ícono, ver 4.1ter) + título (visible siempre, sin <details>) -->
  <!-- Intro: firma del docente flotante (ver 4.2bis) + mensaje + botón "Abrir la guía de la clase" -->
  <!-- Un <details>/<summary> colapsable por unidad de la clase, con checklist
       de "para hacer" y botón de entrega si corresponde -->
  <!-- "Caja de herramientas de hoy": grilla de íconos con link directo,
       dentro de un <details>/<summary> -->
  <!-- "Así se registra tu presente": tarjetas con los links de entrega -->
</div>
```

`id="mNNroot"` único por clase — usarlo como prefijo/scope de cualquier selector nuevo, porque Moodle puede insertar varios fragmentos en la misma página.

**La firma del docente va en el bloque de Intro, flotante (`float:right`) arriba del párrafo de mensaje — nunca en el header.** El header lleva solo numeral/ícono + título. Ver snippet en 4.2bis.

### 4.1bis Tono del mensaje de intro: Marcos le habla al alumno, no un resumen de contenidos

El párrafo de "Intro" (justo debajo del header, antes del botón "Abrir la guía de la clase") es un **mensaje**, no una bajada de programa: primera persona ("Soy Marcos", "voy a acompañarte", "para eso estoy"), arranca con un saludo tipo "¡Hola!", cierra con aliento y algo de emoji, habla directo al alumno de igual a igual. Referencia de calibración: `Clase 00 - Bienvenida.html`. Ese tono tiene que sostenerse clase a clase, no solo en la de bienvenida.

Ejemplo (Clase 01): *"¡Hola! Usás Drive, un buscador y alguna IA todos los días, pero pocas veces te preguntás qué hay detrás de todo eso. Hoy te lo muestro: ordenamos tu espacio de trabajo en la nube y damos el primer paso de tu identidad profesional en LinkedIn. Al final de la clase tenés dos entregas cortitas — el link de tu carpeta de Drive y la URL de tu perfil de LinkedIn — que no llevan nota, solo certifican que hiciste la clase. ¡Empecemos! 🚀"*

**Síntoma de que se cayó en modo automático:** el párrafo describe el temario en tercera persona funcional ("Hoy vas a entender eso, organizar tu espacio...") sin ninguna voz de Marcos hablando — lee como una bajada de contenidos, no como alguien dirigiéndose al estudiante.

**Regla:** al escribir el intro de una clase nueva, no partir de "esta clase cubre X, Y, Z" — partir de cómo Marcos se lo diría al alumno en persona (arrancando con un saludo tipo "¡Hola!"), y después verificar que la información esté completa.

### 4.1ter Variante de header para Clase 0 (Bienvenida): ícono en vez de numeral

`Moodle - Clase 00 - Bienvenida.html` no tiene un número de clase real — su header sigue la misma estructura de dos columnas que las clases numeradas (caja de color a la izquierda + título a la derecha, ver 4.5), pero con dos diferencias fijas, solo para este archivo:

- **Columna izquierda:** en vez del numeral (`01`, `02`...) va un ícono chico (ver 4.3 — nunca un emoji nativo grande, salvo la excepción del 👋 en este mismo archivo) + la etiqueta `BIENVENIDA` en vez de `CLASE`.
- **Columna derecha:** título `Informática` + una bajada en itálica inventada para orientar (no describe un tema de clase, porque no lo es) — ej. "El punto de partida del cuatrimestre: cómo vamos a trabajar juntos, clase a clase".

Fuera de esas dos diferencias, el resto del archivo (Intro con firma flotante, secciones `<details>` numeradas con datos generales/objetivos/programa/etc.) sigue las mismas reglas que cualquier fragmento Moodle. Solo existen estas dos variantes de header: la numerada (01-17) y la de Bienvenida (00).

### 4.1quater Alineación dentro de los teasers de sección: dos límites, no uno

Cada bloque numerado (`01 Campus virtual...`, `02 La nube...`) tiene dos bordes izquierdos de alineación distintos, a propósito:

- **Límite de la caja de color** (numeral del header, título+numeral de cada `<summary>`, checkboxes de cada unidad): ≈ 8-12px desde el borde de `#mNNroot` (`margin` del contenedor 4px + `padding` propio 4-8px).
- **Límite del texto del saludo** (párrafo de Intro, botón "Abrir la guía de la clase"): 30px desde el borde de `#mNNroot`, con `margin:0 4px 22px;padding:0 18px 0 26px;` (padding-left asimétrico, 26px izquierda / 18px derecha — ver 4.5).

**Regla:** el párrafo explicativo de cada bloque numerado (el texto suelto antes de los checkboxes) arranca alineado con el límite del saludo (30px), no con el de la caja de color. Los checkboxes y el título con numeral de cada `<summary>` se quedan en el límite de la caja de color (8-12px) — no se tocan. Para lograrlo sin mover nada más, el margen extra va **en el propio `<p>`**, no en el contenedor que lo envuelve (que también contiene los checkboxes, y los correría a ellos también):

```html
<!-- contenedor sigue en el límite de la caja de color -->
<div style="padding:0 8px 24px;">
  <!-- el <p> se corre 18px más (8+18=26, +4 del margin:4px del contenedor padre = 30, igual al eje del saludo) -->
  <p style="margin:0 0 12px 18px;font-size:13px;line-height:1.7;color:#4b4959;">Texto del bloque…</p>
  <!-- los checkboxes NO llevan ese margen extra: se quedan en el límite de la caja de color -->
  <div style="margin:12px 0 0;">
    <label>…</label>
  </div>
</div>
```

Aplicado a las 6 clases con fragmento Moodle (00-05), todas migradas al patrón unificado de teaser de 4.2bis (numeral chico monospace) y con este margen en el `<p>`. Clase 12 queda afuera: usa una estructura de fragmento totalmente distinta (con `<style>` propio, ver nota en 4.2), no el patrón de este manual.

No "arreglar" esto subiendo el `padding-left` del contenedor entero — eso mueve el párrafo **y** los checkboxes juntos, y rompe la alineación que sí tiene que quedar pegada a la caja de color.

### 4.2 Tags: qué se puede usar y qué no

| Elemento | ¿Permitido en Moodle? | Motivo / alternativa |
|---|---|---|
| `<details>`/`<summary>` | **Sí — confirmado real** | Usar para toda sección colapsable. No sacarlo "por las dudas": ya se probó pegado y funcionando. |
| Cualquier tag de contenido (`div`,`span`,`p`,`a`,`img`,`strong`,`code`,`ul`/`ol`/`li`,`table`) con `style=""` | Sí | Todo el estilo va inline, elemento por elemento. |
| `clamp()`, `flex`, `flex-wrap`, `gap`, `linear-gradient()`, `calc()`, `border-radius` dentro de `style=""` | Sí | No requieren `<style>`/`@media`. |
| `target="_blank" rel="noopener"` | Sí | — |
| `<input type="checkbox">` + `<label>` | **Sí — confirmado real** | Sobrevive al editor Atto y se tilda de verdad, nativo del navegador — no hace falta simularlo con `<span>`. El limpiador de Moodle **no** lo saca. Sin backend el estado no persiste entre visitas (se resetea al recargar), lo cual está bien para un checklist de "voy tildando mientras leo" — ver patrón en 4.2bis. |
| Atributos `on*` (`onclick`, etc.) con JS simple inline (una o dos instrucciones, sin dependencias externas) | **Sí — confirmado real** | Probado con un botón "copiar mail" (`onclick="navigator.clipboard.writeText(...)"`) — sobrevive al guardado y funciona en Qoodle. Distinto de un `<script>` en bloque (ver abajo, sigue sin confirmar). No abusar: es para micro-interacciones (copiar, mostrar/ocultar), no para lógica compleja — eso va a H5P (4.7). |
| `<form>`, `<button>`, `<select>`, `<textarea>` | **No** | Se siguen sacando — el copy de "copiar" y los checklist se resuelven con `<input type="checkbox">`/`<span onclick>`, no con estos tags de formulario. |
| `<style>` con `@media` | **No confirmado — evitar** | Sin prueba real de que sobreviva al guardado; además, si Moodle inserta 2+ fragmentos en la misma página, múltiples `<style>` compiten. Responsive se resuelve 100% con `clamp()` + `flex-wrap` inline (4.4). |
| Variables CSS (`var(--x)`) | **No** | Dependen de un `:root{}` que solo vive en `<style>` (no confirmado). Usar siempre el hex final en cada `style=""`. |
| `<!DOCTYPE>`, `<html>`, `<head>`, `<link>` externo | **No** | Es un fragmento, no una página — Moodle los descarta igual. |
| `<script>` en bloque (`<script>...</script>`) | **Sin confirmar — evitar** | Distinto de un atributo `onclick` suelto (sí confirmado, ver arriba). No hay prueba de que un bloque `<script>` sobreviva al guardado de Atto; y aunque sobreviva, no es necesario — toda la interactividad lograda hasta ahora (checkbox, copiar) se resuelve con atributos inline. |

### 4.2bis Patrones interactivos confirmados en Qoodle real

Probados pegando el fragmento en el campus real (no solo abriendo el `.html`) — sobreviven al editor Atto y funcionan tal cual:

**Checklist tildable** — cada ítem de "para hacer" de un `<details>` de unidad es un `<label>` que envuelve un `<input type="checkbox">` real + el texto, así el click en cualquier parte de la fila tilda:

```html
<label style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;cursor:pointer;">
  <input type="checkbox" style="width:16px;height:16px;margin:2px 0 0;accent-color:#5b4b9e;flex-shrink:0;cursor:pointer;">
  <span style="font-size:13px;color:#4b4959;line-height:1.5;">Texto del ítem.</span>
</label>
```

`accent-color` sigue el acento de la clase (2.5 del `CLAUDE.md` raíz), no un valor fijo. Sin backend, no se guarda entre visitas — es una ayuda de lectura dentro de la misma sesión, no un registro de progreso (para eso existe H5P, 4.7).

**Botón "copiar"** — para cualquier dato que el alumno tenga que pegar en otro lado (un mail, un código), en vez de solo mostrarlo en `<code>` se agrega al lado un `<span>` clickeable que lo copia al portapapeles:

```html
<span role="button" tabindex="0" title="Copiar el mail"
  onclick="navigator.clipboard.writeText('unqarchivos@gmail.com');this.innerText='✅ Copiado';var el=this;setTimeout(function(){el.innerText='📋 Copiar'},1600)"
  style="cursor:pointer;display:inline-flex;align-items:center;font-size:11px;font-weight:700;color:#5b4b9e;background:#f3f1fb;border:1px solid #ddd5f2;padding:2px 8px;border-radius:999px;">📋 Copiar</span>
```

**Regla de ubicación:** el botón de copiar va pegado al dato que el alumno realmente necesita pegar en un formulario/campo (ej. el mail `unqarchivos@gmail.com` que hay que escribir al compartir la carpeta de Drive, en la unidad "La nube y Google Drive" de Clase 01) — no en la firma del docente ni en datos decorativos. Antes de agregarlo a una clase nueva, confirmar cuál es el dato que el alumno copia y pega de verdad.

**Firma del docente, flotante dentro de la Intro** — foto 30-44px según el peso visual que se quiera (Clase 01 usa 30px por convivir con un párrafo más largo; Clase 00 usa 44px), sin la etiqueta "Prof." delante del nombre — **en ningún archivo va "Prof. Marcos Hernández", solo "Marcos Hernández"**:

```html
<div style="margin:0 4px 22px;padding:0 18px 0 26px;overflow:hidden;">
  <a href="mailto:marcos.hernandez@unq.edu.ar" title="Marcos Hernández — Docente de Informática, UNQ" style="float:right;display:inline-flex;align-items:center;gap:11px;text-decoration:none;background:#f3f1fb;padding:6px 18px 6px 6px;border-radius:999px;margin:0 0 10px 14px;">
    <img src="…" alt="Marcos Hernández" style="width:30px;height:30px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid #fff;">
    <span style="display:flex;flex-direction:column;line-height:1.3;">
      <span style="font-size:12px;font-weight:700;color:#3b3167;">Marcos Hernández</span>
      <span style="font-size:10px;font-weight:500;color:#5b4b9e;">marcos.hernandez@unq.edu.ar</span>
    </span>
  </a>
  <p style="margin:0 0 14px;font-size:14px;line-height:1.72;color:#4b4959;">¡Hola! …</p>
</div>
```

`background` de la burbuja sigue el `-tint` del acento de la clase (2.5/2.7 del `CLAUDE.md` raíz), no un valor fijo — acá `#f3f1fb` porque es violeta (Clase 01). El contenedor de la Intro necesita `overflow:hidden` para contener el `float:right` de la burbuja, si no el siguiente elemento (el botón "Abrir la guía") puede quedar mal posicionado.

**Título con numeral de cada teaser de sección — mismo estilo en toda clase, numerada o no:**

```html
<summary style="cursor:pointer;padding:12px 4px;display:flex;align-items:baseline;gap:8px;">
  <span style="font-family:'Courier New',monospace;font-size:12px;color:#888780;">01</span>
  <span style="font-size:15px;font-weight:700;color:#2c2c2a;letter-spacing:-0.01em;">Título de la sección</span>
</summary>
```

Patrón unificado: todas las secciones (numeradas o administrativas, como en Clase 00) usan este mismo estilo de numeral chico monospace + título. Las 6 clases con fragmento Moodle (00-05) ya lo usan. Ver alineación exacta de lo que va debajo de este título en 4.1quater.

### 4.3 Imágenes: siempre base64, nunca ruta relativa

Una ruta como `img/apps/icono-chatgpt.png` solo resuelve si existe una carpeta `img/` al lado del `.html` — cierto al abrir el archivo desde el Drive, **falso en Moodle**, que guarda el fragmento como HTML suelto en su base de datos. El `<img>` rompe en silencio, sin error visible.

**Regla:** toda imagen local va embebida en base64 (`data:image/png;base64,...`), generada siempre por script (nunca tipeada/copiada a mano) y validada después con un script que confirme que cada blob decodifica. Buscar el archivo fuente en este orden: `img/` → `img huerfanos/` → `Formatos/Iconografia/`.

Excepción: si otra clase **ya subió** el mismo ícono a Moodle (vía el botón "Insertar imagen" del editor Atto — genera una URL propia tipo `pluginfile.php`/`draftfile.php`), se puede reutilizar esa URL si ya está confirmada como estable (evitar URLs `draftfile.php/.../user/draft/<id>/...`, que son de borrador y pueden vencer).

**Foto de perfil del docente — self-hosted en `unq-moodle/img/marcos-hernandez.jpg`, nunca `googleusercontent.com`** (ver `CLAUDE.md` raíz, sección 5: esa URL es la foto de perfil de la cuenta de Google, no un archivo estable — puede romperse o cambiar sola en todas las referencias a la vez).

- Archivo: `unq-moodle/img/marcos-hernandez.jpg` — 88×88px (recorte cuadrado, ~2x el tamaño máximo de despliegue real, 44px en la burbuja de Moodle Clase 00).
- Desde `unq-moodle/clases/*.html` (servido por GitHub Pages, mismo repo): ruta relativa `../img/marcos-hernandez.jpg`, igual que cualquier otro ícono de la tabla de abajo.
- Desde `unq-moodle/bloques/*.html` (pasa por Atto, no puede resolver rutas relativas del repo) y desde las copias pegadas en `index.html`: URL absoluta `https://marcosxhernandez.github.io/unq-moodle/img/marcos-hernandez.jpg` — sigue siendo "URL externa real" en el sentido de 4.2 (no es base64), pero es un archivo que el propio proyecto controla vía `git push`.

Si Marcos actualiza la foto en el futuro, reemplazar `unq-moodle/img/marcos-hernandez.jpg` (mismo nombre de archivo) y hacer `git push` — no volver a apuntar a una URL de `googleusercontent.com`.

**No usar un emoji nativo como ícono grande y solo — regla general, con una excepción deliberada en Clase 00.** Un carácter emoji suelto en un `font-size` alto se renderiza con la fuente de emoji del sistema/navegador, con mucho relleno interno propio — el resultado visual queda notablemente más grande que el `font-size` declarado, y varía de tamaño según plataforma. Para un ícono decorativo grande y aislado (no un emoji suelto dentro de una oración, esos sí van como texto, ver 4.5), la opción por defecto es un ícono chico embebido en base64 igual que cualquier otro de la tabla de abajo — generado por script a partir de formas vectoriales simples (`ImageMagick`/`convert` rasteriza SVG a PNG sin depender de red), a ~2x el tamaño de despliegue.

**Excepción — header de Clase 00:** por pedido explícito de Marcos, usa un emoji nativo simple, `<span style="font-size:34px;line-height:1;display:block;">👋</span>`, aceptando la variación de tamaño entre plataformas a cambio de simplicidad. **No "corregir" esto de vuelta a base64 sin confirmar primero: es una decisión tomada a propósito, no una regresión.**

Mapeo de ícono → archivo fuente:

| Servicio | Archivo a embeber |
|---|---|
| Campus UNQ / Qoodle | `img huerfanos/campusuvq.png` |
| Google Drive | `img/apps/icono-google-drive.png` |
| LinkedIn | `img/apps/icono-linkedin.png` |
| Google (buscador) | `img/apps/icono-google.png` |
| ChatGPT | `img/apps/icono-chatgpt.png` |
| Gemini | `img/apps/icono-gemini.png` |
| Claude | `img/apps/icono-claude.png` |
| Copilot | `img/apps/icono-copilot.png` |
| Perplexity | `img huerfanos/icono-perplexity.png` — **solo desde la clase donde se introduce**, no antes |
| DeepSeek | `img/apps/icono-deepseek.png` |
| Qwen | `img/apps/icono-qwen.png` |
| Kimi | `img/apps/icono-kimi.png` |
| QR app Moodle | `img/01-qr-moodle-app.png` |

Antes de agregar o sacar un ícono del toolbox de una clase, confirmar en qué clase se introduce esa herramienta — no incluir algo que se presenta recién más adelante.

### 4.4 Responsive: cero `<style>`, cero media queries

- `flex-wrap:wrap` en toda fila que pueda apilarse (header, íconos del toolbox, tarjetas de "Presente"), con `min-width:0` en los hijos de texto largo.
- `width`/`font-size` en `clamp(mínimo, preferido-vw, máximo)` en vez de valor fijo: número del header (`clamp(30px,9vw,52px)`), caja lateral del número (`clamp(72px,22vw,104px)`), título (`clamp(17px,4.3vw,22px)`), íconos del toolbox (`clamp(64px,20vw,78px)`). El numeral de cada teaser de sección **no** usa `clamp()` — es tamaño fijo (12px monospace, ver 4.2bis), no necesita escalar con el viewport.
- Sacar `white-space:nowrap` de textos largos que puedan pasar a una segunda línea (ej. firma del docente).

### 4.5 Convenciones fijas

- Botones de entrega ("Subir link") siempre verde `#0F7A5C` — no siguen el acento de clase (2.1 del `CLAUDE.md` raíz).
- Firma del docente: flotante dentro de la Intro, `float:right`, y siempre **"Marcos Hernández" a secas, sin "Prof." delante**.
- Emojis y UTF-8 (📖, ✅, 🧰, →, —): sin problema de compatibilidad, Moodle sirve todo en UTF-8 — esto aplica a emoji **dentro de una oración o al lado de texto corto** (un botón, un ítem de checklist). Para un ícono grande y aislado, no usar emoji nativo (ver 4.3).
- **Bloque de Intro (mensaje personal de Marcos, ver 4.1bis): siempre lleva `padding:0 18px 0 26px` además del `margin:0 4px 22px`.** Sin el padding, el texto y el botón "Abrir la guía de la clase" quedan pegados al borde del contenedor.
- **El padding-left es 26px, no 18px parejo.** El párrafo del saludo, sin marcador, queda visualmente más pegado al borde que el resto del contenido con viñeta/checkbox (que arranca 16px de caja + 10px de gap = 26px después de su propio margen). El padding-left del bloque de Intro es 18px→26px (el padding-right se mantiene en 18px) para que el saludo "pese" en pantalla como si tuviera un marcador, sin agregar uno real. Es un ajuste puntual del bloque de Intro — no mueve el eje de 22px que usan los párrafos de los teasers de sección (4.1quater), que siguen alineados entre sí por su cuenta.

### 4.6 Checklist antes de dar por terminado un fragmento Moodle

Verificar con un script corto, no a ojo:

1. Balance de tags: `<div>`/`</div>`, `<a>`/`</a>`, `<span>`/`</span>`, `<p>`/`</p>` en igual cantidad.
2. Cero `src="img/..."` o `src="img huerfanos/..."` en el HTML final — solo `data:image/png;base64,...` o URLs absolutas ya confirmadas. Cada blob decodifica sin error.
3. Cero `<style`, `<form`, `<button`, `<select`, `<textarea`, `<script` en bloque. `<details`/`<summary` sí deben estar presentes en header, teasers y caja de herramientas — si aparecen como `<div>` planos, es una regresión. `<input type="checkbox">`/`<label>` sí están permitidos y esperados en los checklist de cada unidad (4.2bis) — no sacarlos "por las dudas".
4. Firma del docente está flotante dentro de la Intro (no en el header), dice "Marcos Hernández" sin "Prof." delante, y el contenedor de la Intro tiene `overflow:hidden` para contener el `float` (4.1, 4.2bis).
5. Todo tamaño que pueda desbordar en mobile usa `clamp()`, no un valor fijo ni un bloque `<style>` con `@media`.
6. El párrafo de intro suena a Marcos hablándole al alumno (primera persona, cierre con aliento), no a una bajada de temario en tercera persona — ver 4.1bis.
7. Ningún ícono grande y aislado usa un emoji nativo suelto — va como base64 chico (4.3).
8. En los teasers de sección, el párrafo de texto arranca alineado con el saludo (30px); el título con numeral y los checkboxes se quedan en el límite de la caja de color (4.1quater).

### 4.7 Catálogo de recursos/actividades de Qoodle y arquitectura de entrega

Qoodle (Moodle UVQ) ofrece, al agregar una actividad o recurso: Actividad de H5P, Archivo, Base de datos, BigBlueButton, Carpeta, Chat, Consulta, Contenido interactivo, Cuestionario, Elección de grupo, Encuesta, Encuestas predefinidas, Etiqueta, Foro, GeoGebra, Glosario, Herramienta externa, HotPot, Jitsi, Lección, Libro, Paquete SCORM, Paquete de contenido IMS, Página, Taller, Tarea, URL, Wiki. La mayoría no aplica a la Guía Visual ni al fragmento Moodle — son para otras piezas del curso (Tarea para entregas, Foro para debate, H5P/Cuestionario para evaluación interactiva con seguimiento). Los que sí importan para este proyecto:

| Recurso | Rol en este proyecto |
|---|---|
| **URL** | **Mecanismo en uso** para el botón "Abrir la guía de la clase": apunta a `https://marcosxhernandez.github.io/unq-moodle/clases/Clase%20NN%20-%20....html` (GitHub Pages, ver 1), no a un recurso subido a Qoodle. |
| **Archivo** (`mod/resource`) | Rol reducido a backup opcional: subir el PDF ya exportado (`unq-moodle/pdf/Clase NN - <Título>.pdf`) como Archivo, para quien prefiera bajarlo en vez de abrir el link. No es el vehículo principal de la Guía Visual. |
| **Página** / **Etiqueta** | Vehículo del fragmento Moodle (checklist, toolbox, entregas). El contenido pasa por Atto → valen todas las restricciones de 4.2 (sin `<style>`, sin `var()`, todo inline). |
| **H5P / Cuestionario** | Única vía correcta para interactividad que necesite **recordar** el progreso del estudiante (quiz, drag-and-drop con nota). La Guía Visual y el fragmento Moodle son HTML estático sin backend — cualquier checkbox o interacción ahí es decorativa y no persiste (4.2). Si se quiere un ejercicio autoevaluable de verdad, va como actividad H5P aparte, enlazada desde la guía o el fragmento — no simulado con JS suelto. |

**Por qué URL (GitHub Pages) y no "Insertar" (iframe) ni "Página":**

- **Imprimir tiene que dar exactamente lo mismo que la Guía Visual.** Un recurso URL abierto en pestaña/ventana nueva (`target="_blank"`) es el documento real: Ctrl+P imprime esa página y nada más. Si se sirve "insertado" (iframe dentro de una página de Moodle), Ctrl+P por defecto imprime la página contenedora completa (con menú y navegación de Moodle alrededor), y conseguir solo el contenido del iframe requiere clic derecho → "Imprimir marco" — una interacción que la mayoría de estudiantes de primer año no va a descubrir sola.
- **GitHub Pages en vez de Archivo en Qoodle:** con Archivo, cada corrección a una Guía Visual exige volver a subir el `.html` a mano en Qoodle, clase por clase. Con URL apuntando a GitHub Pages, corregir es editar el archivo en `unq-moodle/clases/` y hacer `git push` — el link ya pegado en Qoodle no cambia y sirve la versión actualizada sola.
- **El HTML se sirve tal cual desde GitHub Pages y no pasa por Atto** — no aplican las restricciones de 4.2. Eso abre la puerta a que la versión en pantalla (no impresa) tenga más recursos que el fragmento Moodle: video/audio embebido, anclas de navegación (`#campus`, etc.), un botón "Imprimir esta guía" con `onclick="window.print()"`. Todo eso se agrega en la propia Guía Visual, nunca en el fragmento Moodle.
- **Para agregar contenido "solo pantalla" sin romper la impresión:** envolver el elemento en una clase, por ejemplo `.solo-pantalla`, y en el bloque `@media print` ya existente sumar `.solo-pantalla{ display:none; }`. El inverso (algo que solo debe verse impreso) sería `.solo-impresion` con `display:none` fuera de `@media print`. Ninguna de las dos existe todavía — agregar la clase recién cuando haya un contenido real que la necesite.
- **El fragmento Moodle sigue siendo la puerta de entrada dentro del curso** (checklist, toolbox, botón "Abrir la guía") — la Guía Visual (servida por GitHub Pages) es el material de lectura/impresión en sí. No fusionar ambos: cada uno vive donde sus restricciones técnicas lo permiten mejor.
- **Si se activa GitHub Pages en otra URL** (usuario/organización distintos, o dominio propio), actualizar a mano los links "Abrir la guía" en cada `bloques/Moodle - Clase NN.html` que ya los tenga — buscar `github.io` (ver `unq-moodle/README.md`).
